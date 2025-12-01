/**
 * RAG and Knowledge Integration - Interactive Demo Script
 * 
 * This demo shows how RAG works, including the pipeline,
 * vector similarity search, and document chunking.
 */

// Sample document database
const documentDatabase = [
    { id: 1, title: "Return Policy", content: "Our company offers a 30-day return policy for all products. Items must be in original condition with tags attached. Refunds are processed within 5-7 business days.", topic: "refund" },
    { id: 2, title: "Shipping Information", content: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 day delivery. Free shipping on orders over $50.", topic: "shipping" },
    { id: 3, title: "Contact Support", content: "Our support team is available 24/7. Email us at support@company.com or call 1-800-SUPPORT. Live chat is available on our website.", topic: "contact" },
    { id: 4, title: "Exchange Policy", content: "Free exchanges are available for size issues within 30 days. Simply return the item and place a new order, or visit our store for immediate exchange.", topic: "refund" },
    { id: 5, title: "International Shipping", content: "We ship to over 100 countries. International orders typically arrive in 10-14 business days. Customs fees may apply.", topic: "shipping" },
    { id: 6, title: "Warranty Information", content: "All products come with a 1-year manufacturer warranty. Extended warranties are available for purchase at checkout.", topic: "contact" }
];

// Vector positions for visualization (simulated 2D projection)
const documentVectors = {
    1: { x: 80, y: 80, label: "Return Policy" },
    2: { x: 280, y: 200, label: "Shipping Info" },
    3: { x: 320, y: 80, label: "Contact Support" },
    4: { x: 100, y: 120, label: "Exchange Policy" },
    5: { x: 300, y: 240, label: "Intl Shipping" },
    6: { x: 340, y: 120, label: "Warranty" }
};

const queryVectors = {
    refund: { x: 90, y: 100 },
    shipping: { x: 290, y: 220 },
    contact: { x: 330, y: 100 }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    initPipelineDemo();
    initVectorDemo();
    initChunkingDemo();
});

// Track Toggle
function initTrackToggle() {
    new TrackToggle({
        defaultTrack: 'non-tech',
        onToggle: (track) => {
            console.log('Track changed to:', track);
        }
    });
}

// ============================================================================
// Section 2: Pipeline Demo
// ============================================================================

function initPipelineDemo() {
    const runBtn = document.getElementById('runPipelineBtn');
    runBtn.addEventListener('click', runPipeline);
}

async function runPipeline() {
    const query = document.getElementById('ragQuery').value;
    const stages = document.querySelectorAll('.stage');
    const retrievedDocsEl = document.getElementById('retrievedDocs');
    const generatedAnswerEl = document.getElementById('generatedAnswer');
    
    // Reset
    stages.forEach(s => s.classList.remove('active'));
    retrievedDocsEl.innerHTML = '<div class="doc-placeholder">Searching...</div>';
    generatedAnswerEl.innerHTML = '<span class="placeholder">Generating...</span>';
    
    // Stage 1: Embed Query
    stages[0].classList.add('active');
    await sleep(800);
    stages[0].classList.remove('active');
    
    // Stage 2: Search
    stages[1].classList.add('active');
    await sleep(800);
    stages[1].classList.remove('active');
    
    // Stage 3: Retrieve
    stages[2].classList.add('active');
    await sleep(800);
    
    // Find relevant documents
    const relevantDocs = findRelevantDocs(query);
    displayRetrievedDocs(relevantDocs, retrievedDocsEl);
    
    stages[2].classList.remove('active');
    
    // Stage 4: Generate
    stages[3].classList.add('active');
    await sleep(500);
    
    // Generate answer
    const answer = generateAnswer(query, relevantDocs);
    await typeText(generatedAnswerEl, answer);
    
    stages[3].classList.remove('active');
}

function findRelevantDocs(query) {
    const queryLower = query.toLowerCase();
    const scores = documentDatabase.map(doc => {
        let score = 0;
        const contentLower = doc.content.toLowerCase();
        const titleLower = doc.title.toLowerCase();
        
        // Simple keyword matching for demo
        const keywords = queryLower.split(' ');
        keywords.forEach(keyword => {
            if (keyword.length > 3) {
                if (contentLower.includes(keyword)) score += 0.3;
                if (titleLower.includes(keyword)) score += 0.2;
            }
        });
        
        // Topic matching
        if (queryLower.includes('return') || queryLower.includes('refund')) {
            if (doc.topic === 'refund') score += 0.4;
        }
        if (queryLower.includes('ship') || queryLower.includes('delivery')) {
            if (doc.topic === 'shipping') score += 0.4;
        }
        if (queryLower.includes('contact') || queryLower.includes('support') || queryLower.includes('help')) {
            if (doc.topic === 'contact') score += 0.4;
        }
        
        return { ...doc, score: Math.min(score, 0.99) };
    });
    
    return scores
        .filter(d => d.score > 0.1)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

function displayRetrievedDocs(docs, container) {
    if (docs.length === 0) {
        container.innerHTML = '<div class="doc-placeholder">No relevant documents found.</div>';
        return;
    }
    
    container.innerHTML = docs.map(doc => `
        <div class="retrieved-doc">
            <div class="doc-score">Relevance: ${(doc.score * 100).toFixed(0)}%</div>
            <strong>${doc.title}</strong>
            <p>${doc.content}</p>
        </div>
    `).join('');
}

function generateAnswer(query, docs) {
    if (docs.length === 0) {
        return "I couldn't find relevant information to answer your question. Please try rephrasing or ask about our return policy, shipping, or support options.";
    }
    
    const topDoc = docs[0];
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('return') || queryLower.includes('refund')) {
        return `Based on our documentation: ${topDoc.content} ${docs.length > 1 ? `Additionally, ${docs[1].content.toLowerCase()}` : ''}`;
    }
    
    if (queryLower.includes('ship') || queryLower.includes('delivery')) {
        return `Regarding shipping: ${topDoc.content} ${docs.length > 1 ? `For international orders: ${docs[1].content.toLowerCase()}` : ''}`;
    }
    
    if (queryLower.includes('contact') || queryLower.includes('support')) {
        return `To get help: ${topDoc.content}`;
    }
    
    return `Based on our knowledge base: ${topDoc.content}`;
}

async function typeText(element, text) {
    element.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
        element.innerHTML += text[i];
        if (i % 3 === 0) await sleep(10);
    }
}

// ============================================================================
// Section 3: Vector Demo
// ============================================================================

let vectorCanvas, vectorCtx;

function initVectorDemo() {
    vectorCanvas = document.getElementById('vectorSpaceCanvas');
    vectorCtx = vectorCanvas.getContext('2d');
    
    drawVectorSpace();
    
    const searchBtn = document.getElementById('searchVectorBtn');
    searchBtn.addEventListener('click', performVectorSearch);
}

function drawVectorSpace(highlightQuery = null, highlightDocs = []) {
    vectorCtx.clearRect(0, 0, 400, 300);
    
    // Draw grid
    vectorCtx.strokeStyle = '#eee';
    vectorCtx.lineWidth = 1;
    for (let i = 0; i <= 400; i += 40) {
        vectorCtx.beginPath();
        vectorCtx.moveTo(i, 0);
        vectorCtx.lineTo(i, 300);
        vectorCtx.stroke();
    }
    for (let i = 0; i <= 300; i += 40) {
        vectorCtx.beginPath();
        vectorCtx.moveTo(0, i);
        vectorCtx.lineTo(400, i);
        vectorCtx.stroke();
    }
    
    // Draw documents
    Object.entries(documentVectors).forEach(([id, pos]) => {
        const isHighlighted = highlightDocs.includes(parseInt(id));
        
        vectorCtx.beginPath();
        vectorCtx.arc(pos.x, pos.y, isHighlighted ? 12 : 8, 0, Math.PI * 2);
        vectorCtx.fillStyle = isHighlighted ? '#50C878' : '#E67E22';
        vectorCtx.fill();
        
        // Label
        vectorCtx.fillStyle = '#333';
        vectorCtx.font = '10px sans-serif';
        vectorCtx.fillText(pos.label, pos.x - 30, pos.y + 20);
    });
    
    // Draw query point
    if (highlightQuery) {
        const qPos = queryVectors[highlightQuery];
        
        // Draw lines to highlighted docs
        highlightDocs.forEach(docId => {
            const dPos = documentVectors[docId];
            vectorCtx.beginPath();
            vectorCtx.moveTo(qPos.x, qPos.y);
            vectorCtx.lineTo(dPos.x, dPos.y);
            vectorCtx.strokeStyle = 'rgba(80, 200, 120, 0.5)';
            vectorCtx.lineWidth = 2;
            vectorCtx.stroke();
        });
        
        // Query point
        vectorCtx.beginPath();
        vectorCtx.arc(qPos.x, qPos.y, 10, 0, Math.PI * 2);
        vectorCtx.fillStyle = '#4A90D9';
        vectorCtx.fill();
        
        vectorCtx.fillStyle = '#4A90D9';
        vectorCtx.font = 'bold 11px sans-serif';
        vectorCtx.fillText('Query', qPos.x - 15, qPos.y - 15);
    }
    
    // Axis labels
    vectorCtx.fillStyle = '#666';
    vectorCtx.font = '11px sans-serif';
    vectorCtx.fillText('Semantic Dimension 1 →', 150, 290);
    vectorCtx.save();
    vectorCtx.translate(15, 150);
    vectorCtx.rotate(-Math.PI / 2);
    vectorCtx.fillText('Semantic Dimension 2 →', -50, 0);
    vectorCtx.restore();
}

function performVectorSearch() {
    const queryType = document.getElementById('vectorQuerySelect').value;
    
    // Calculate similarities
    const qPos = queryVectors[queryType];
    const similarities = Object.entries(documentVectors).map(([id, pos]) => {
        const distance = Math.sqrt(Math.pow(qPos.x - pos.x, 2) + Math.pow(qPos.y - pos.y, 2));
        const maxDist = Math.sqrt(400*400 + 300*300);
        const similarity = 1 - (distance / maxDist);
        return { id: parseInt(id), similarity, label: pos.label };
    });
    
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    // Highlight top 3
    const topDocs = similarities.slice(0, 3).map(s => s.id);
    drawVectorSpace(queryType, topDocs);
    
    // Display similarity bars
    displaySimilarityBars(similarities);
}

function displaySimilarityBars(similarities) {
    const container = document.querySelector('.similarity-bars');
    container.innerHTML = similarities.map(s => `
        <div class="sim-item">
            <span class="sim-label">${s.label}</span>
            <div class="sim-bar-track">
                <div class="sim-bar-fill" style="width: ${s.similarity * 100}%"></div>
            </div>
            <span class="sim-score">${(s.similarity * 100).toFixed(0)}%</span>
        </div>
    `).join('');
}

// ============================================================================
// Section 4: Chunking Demo
// ============================================================================

const sampleText = "Our company offers a 30-day return policy for all products. Items must be in original condition with tags attached. Refunds are processed within 5-7 business days. For damaged items, please contact support immediately. We also offer free exchanges for size issues. International returns may have different policies.";

function initChunkingDemo() {
    const strategyBtns = document.querySelectorAll('.strategy-btn');
    
    strategyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            strategyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyChunking(btn.dataset.strategy);
        });
    });
    
    // Initial chunking
    applyChunking('fixed');
}

function applyChunking(strategy) {
    let chunks = [];
    
    switch (strategy) {
        case 'fixed':
            chunks = chunkFixed(sampleText, 100);
            break;
        case 'sentence':
            chunks = chunkSentence(sampleText);
            break;
        case 'semantic':
            chunks = chunkSemantic(sampleText);
            break;
    }
    
    displayChunks(chunks);
}

function chunkFixed(text, size) {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
        chunks.push(text.slice(i, i + size));
    }
    return chunks;
}

function chunkSentence(text) {
    return text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
}

function chunkSemantic(text) {
    // Simulated semantic chunking - group related sentences
    return [
        "Our company offers a 30-day return policy for all products. Items must be in original condition with tags attached.",
        "Refunds are processed within 5-7 business days. For damaged items, please contact support immediately.",
        "We also offer free exchanges for size issues. International returns may have different policies."
    ];
}

function displayChunks(chunks) {
    const container = document.getElementById('chunksDisplay');
    const countEl = document.getElementById('chunkCount');
    const avgSizeEl = document.getElementById('avgChunkSize');
    
    container.innerHTML = chunks.map((chunk, i) => `
        <div class="chunk">
            <strong>Chunk ${i + 1}:</strong><br>
            ${chunk}
        </div>
    `).join('');
    
    countEl.textContent = chunks.length;
    avgSizeEl.textContent = Math.round(chunks.reduce((sum, c) => sum + c.length, 0) / chunks.length);
}

// Utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
