/**
 * RAG and Knowledge Integration - Interactive Demo Script
 * 
 * This demo shows how RAG works, including the pipeline,
 * vector similarity search, and document chunking.
 */

// Role-based applications data
const roleApplications = {
    enterprise: {
        title: 'Enterprise',
        apps: [
            { name: 'Internal Knowledge Base', desc: 'Search company documents, policies, and procedures instantly' },
            { name: 'Employee Onboarding', desc: 'AI assistant that answers new hire questions from HR docs' },
            { name: 'Meeting Summarization', desc: 'Query past meeting notes and action items' },
            { name: 'Compliance Checking', desc: 'Verify decisions against company policies and regulations' }
        ]
    },
    legal: {
        title: 'Legal',
        apps: [
            { name: 'Case Research', desc: 'Find relevant precedents and case law instantly' },
            { name: 'Contract Analysis', desc: 'Query contract terms and identify key clauses' },
            { name: 'Due Diligence', desc: 'Search through thousands of documents for relevant information' },
            { name: 'Regulatory Compliance', desc: 'Stay updated on regulations affecting your practice' }
        ]
    },
    research: {
        title: 'Research',
        apps: [
            { name: 'Literature Review', desc: 'Search and synthesize findings from research papers' },
            { name: 'Data Discovery', desc: 'Find relevant datasets and methodologies' },
            { name: 'Citation Assistance', desc: 'Find supporting evidence for claims' },
            { name: 'Trend Analysis', desc: 'Identify emerging topics across publications' }
        ]
    },
    support: {
        title: 'Customer Support',
        apps: [
            { name: 'Ticket Resolution', desc: 'Find solutions from past tickets and documentation' },
            { name: 'Product FAQ', desc: 'Answer customer questions from product manuals' },
            { name: 'Troubleshooting Guide', desc: 'Step-by-step solutions from knowledge base' },
            { name: 'Escalation Prevention', desc: 'Provide accurate answers to reduce escalations' }
        ]
    }
};

// 3D RAG visualization state
let rag3D = {
    mini3d: null,
    rotationY: 0,
    animating: false,
    progress: 0,
    documents: []
};

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
    init3DRAG();
    initRoleApplications();
    initPipelineDemo();
    initVectorDemo();
    initChunkingDemo();
});

// ============================================================================
// 3D RAG Pipeline Visualization
// ============================================================================

function init3DRAG() {
    const canvas = document.getElementById('rag3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    rag3D.mini3d = new Mini3D(canvas);
    
    // Initialize document nodes in 3D space
    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 150 + Math.random() * 50;
        rag3D.documents.push({
            x: Math.cos(angle) * radius,
            y: (Math.random() - 0.5) * 150,
            z: Math.sin(angle) * radius,
            relevant: false,
            color: '#E67E22'
        });
    }
    
    document.getElementById('rotateLeftBtn3D')?.addEventListener('click', () => {
        rag3D.rotationY -= 0.3;
        render3DRAG();
    });
    
    document.getElementById('rotateRightBtn3D')?.addEventListener('click', () => {
        rag3D.rotationY += 0.3;
        render3DRAG();
    });
    
    document.getElementById('animateRAGBtn')?.addEventListener('click', () => {
        if (!rag3D.animating) {
            rag3D.animating = true;
            rag3D.progress = 0;
            animateRAGPipeline();
        }
    });
    
    render3DRAG();
}

function animateRAGPipeline() {
    if (!rag3D.animating) return;
    
    rag3D.progress += 0.015;
    rag3D.rotationY += 0.01;
    
    // Mark some documents as relevant during animation
    if (rag3D.progress > 0.3 && rag3D.progress < 0.35) {
        rag3D.documents.forEach((d, i) => {
            d.relevant = i % 5 === 0;
        });
    }
    
    render3DRAG();
    
    if (rag3D.progress < 1) {
        requestAnimationFrame(animateRAGPipeline);
    } else {
        rag3D.animating = false;
        rag3D.documents.forEach(d => d.relevant = false);
    }
}

function render3DRAG() {
    const mini3d = rag3D.mini3d;
    if (!mini3d) return;
    
    mini3d.clear();
    mini3d.setRotation(0, rag3D.rotationY, 0);
    
    const centerX = mini3d.canvas.width / 2;
    const centerY = mini3d.canvas.height / 2;
    
    // Draw query point at center
    const queryRotated = mini3d.rotatePoint(0, 0, 0);
    const queryProj = mini3d.project(queryRotated.x + centerX, queryRotated.y + centerY, queryRotated.z);
    
    const gradient = mini3d.ctx.createRadialGradient(queryProj.x, queryProj.y, 0, queryProj.x, queryProj.y, 40);
    gradient.addColorStop(0, '#4A90D9');
    gradient.addColorStop(0.7, '#3498DB');
    gradient.addColorStop(1, 'transparent');
    mini3d.ctx.fillStyle = gradient;
    mini3d.ctx.beginPath();
    mini3d.ctx.arc(queryProj.x, queryProj.y, 40, 0, Math.PI * 2);
    mini3d.ctx.fill();
    
    mini3d.ctx.fillStyle = '#fff';
    mini3d.ctx.font = 'bold 12px Arial';
    mini3d.ctx.textAlign = 'center';
    mini3d.ctx.fillText('Query', queryProj.x, queryProj.y + 4);
    
    // Draw documents
    rag3D.documents.forEach(doc => {
        const rotated = mini3d.rotatePoint(doc.x, doc.y, doc.z);
        const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
        
        // Draw connection line if relevant
        if (doc.relevant) {
            mini3d.ctx.strokeStyle = 'rgba(80, 200, 120, 0.5)';
            mini3d.ctx.lineWidth = 2;
            mini3d.ctx.beginPath();
            mini3d.ctx.moveTo(queryProj.x, queryProj.y);
            mini3d.ctx.lineTo(proj.x, proj.y);
            mini3d.ctx.stroke();
        }
        
        mini3d.ctx.fillStyle = doc.relevant ? '#50C878' : doc.color;
        mini3d.ctx.globalAlpha = 0.8 * proj.scale;
        mini3d.ctx.beginPath();
        mini3d.ctx.arc(proj.x, proj.y, (doc.relevant ? 12 : 8) * proj.scale, 0, Math.PI * 2);
        mini3d.ctx.fill();
    });
    
    mini3d.ctx.globalAlpha = 1;
    
    // Draw stage label
    mini3d.ctx.fillStyle = '#fff';
    mini3d.ctx.font = 'bold 14px Arial';
    mini3d.ctx.textAlign = 'center';
    let label = 'Knowledge Base';
    if (rag3D.progress > 0.2 && rag3D.progress < 0.5) label = 'Searching...';
    else if (rag3D.progress >= 0.5 && rag3D.progress < 0.8) label = 'Retrieving Documents';
    else if (rag3D.progress >= 0.8) label = 'Generating Response';
    mini3d.ctx.fillText(label, centerX, 30);
}

// ============================================================================
// Role-based Applications
// ============================================================================

function initRoleApplications() {
    const buttons = document.querySelectorAll('.role-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateApplications(btn.dataset.role);
        });
    });
    
    updateApplications('enterprise');
}

function updateApplications(role) {
    const grid = document.getElementById('applicationsGrid');
    if (!grid || !roleApplications[role]) return;
    
    const data = roleApplications[role];
    
    grid.innerHTML = data.apps.map(app => `
        <div class="app-card">
            <h4>${app.name}</h4>
            <p>${app.desc}</p>
        </div>
    `).join('');
}

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
