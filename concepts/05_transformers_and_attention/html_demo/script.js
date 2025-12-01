/**
 * Transformers & Attention - Interactive Demo Script
 * 
 * This demo shows how attention mechanisms work in transformers,
 * including self-attention, Q/K/V projections, and multi-head attention.
 */

// Role-based applications data
const roleApplications = {
    nlp: {
        title: 'NLP Applications',
        apps: [
            { name: 'ChatGPT & Conversational AI', desc: 'Power chatbots that understand context and generate human-like responses' },
            { name: 'Machine Translation', desc: 'Translate between languages while preserving meaning and nuance' },
            { name: 'Text Summarization', desc: 'Condense long documents into concise summaries' },
            { name: 'Question Answering', desc: 'Extract answers from documents based on natural language questions' }
        ]
    },
    vision: {
        title: 'Computer Vision',
        apps: [
            { name: 'Vision Transformers (ViT)', desc: 'Image classification by treating image patches as tokens' },
            { name: 'DETR Object Detection', desc: 'Detect and localize objects in images using attention' },
            { name: 'Image Generation (DALL-E)', desc: 'Generate images from text descriptions using transformer decoders' },
            { name: 'Video Understanding', desc: 'Analyze temporal relationships in video frames' }
        ]
    },
    audio: {
        title: 'Audio Processing',
        apps: [
            { name: 'Whisper Speech Recognition', desc: 'Transcribe speech to text with high accuracy across languages' },
            { name: 'Music Generation', desc: 'Compose music by predicting next notes/tokens' },
            { name: 'Voice Cloning', desc: 'Replicate voice characteristics for text-to-speech' },
            { name: 'Audio Classification', desc: 'Identify sounds, speakers, or music genres' }
        ]
    },
    multimodal: {
        title: 'Multimodal AI',
        apps: [
            { name: 'GPT-4V Vision', desc: 'Understand and reason about images alongside text' },
            { name: 'CLIP', desc: 'Connect images and text in a shared embedding space' },
            { name: 'Flamingo', desc: 'Few-shot learning across text and images' },
            { name: 'Video Captioning', desc: 'Generate descriptions of video content' }
        ]
    }
};

// 3D Attention visualization state
let attention3D = {
    mini3d: null,
    rotationY: 0,
    animating: false,
    animationProgress: 0
};

// Sample sentences with pre-computed attention patterns
const sentences = [
    {
        text: "The cat sat on the mat because it was tired",
        tokens: ["The", "cat", "sat", "on", "the", "mat", "because", "it", "was", "tired"],
        attention: [
            [0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0.05, 0.02, 0.02, 0.0],
            [0.1, 0.4, 0.2, 0.05, 0.05, 0.1, 0.05, 0.02, 0.02, 0.01],
            [0.05, 0.3, 0.3, 0.1, 0.05, 0.1, 0.05, 0.02, 0.02, 0.01],
            [0.05, 0.1, 0.2, 0.3, 0.1, 0.15, 0.05, 0.02, 0.02, 0.01],
            [0.2, 0.1, 0.1, 0.1, 0.2, 0.2, 0.05, 0.02, 0.02, 0.01],
            [0.1, 0.15, 0.15, 0.15, 0.15, 0.2, 0.05, 0.02, 0.02, 0.01],
            [0.05, 0.1, 0.1, 0.05, 0.05, 0.1, 0.3, 0.1, 0.1, 0.05],
            [0.05, 0.4, 0.1, 0.05, 0.05, 0.15, 0.05, 0.05, 0.05, 0.05], // "it" attends to "cat"
            [0.05, 0.1, 0.1, 0.05, 0.05, 0.1, 0.1, 0.15, 0.2, 0.1],
            [0.05, 0.2, 0.1, 0.05, 0.05, 0.1, 0.1, 0.1, 0.1, 0.15]
        ]
    },
    {
        text: "The bank by the river had no money",
        tokens: ["The", "bank", "by", "the", "river", "had", "no", "money"],
        attention: [
            [0.3, 0.3, 0.1, 0.1, 0.1, 0.05, 0.02, 0.03],
            [0.1, 0.3, 0.1, 0.1, 0.2, 0.05, 0.05, 0.1], // "bank" attends to "river"
            [0.1, 0.2, 0.2, 0.2, 0.2, 0.05, 0.02, 0.03],
            [0.2, 0.1, 0.1, 0.3, 0.2, 0.05, 0.02, 0.03],
            [0.1, 0.2, 0.15, 0.15, 0.25, 0.05, 0.05, 0.05],
            [0.05, 0.15, 0.1, 0.1, 0.1, 0.25, 0.1, 0.15],
            [0.05, 0.1, 0.05, 0.05, 0.05, 0.2, 0.3, 0.2],
            [0.05, 0.2, 0.05, 0.05, 0.05, 0.15, 0.15, 0.3]
        ]
    },
    {
        text: "I saw the man with the telescope",
        tokens: ["I", "saw", "the", "man", "with", "the", "telescope"],
        attention: [
            [0.4, 0.3, 0.1, 0.1, 0.05, 0.02, 0.03],
            [0.2, 0.3, 0.1, 0.2, 0.1, 0.05, 0.05],
            [0.1, 0.1, 0.3, 0.3, 0.1, 0.05, 0.05],
            [0.1, 0.2, 0.15, 0.25, 0.15, 0.05, 0.1],
            [0.05, 0.15, 0.1, 0.2, 0.25, 0.1, 0.15],
            [0.05, 0.1, 0.15, 0.1, 0.15, 0.25, 0.2],
            [0.05, 0.15, 0.1, 0.15, 0.2, 0.15, 0.2]
        ]
    },
    {
        text: "The chicken is ready to eat",
        tokens: ["The", "chicken", "is", "ready", "to", "eat"],
        attention: [
            [0.35, 0.35, 0.1, 0.1, 0.05, 0.05],
            [0.15, 0.35, 0.15, 0.15, 0.1, 0.1],
            [0.1, 0.2, 0.3, 0.2, 0.1, 0.1],
            [0.1, 0.2, 0.15, 0.3, 0.1, 0.15],
            [0.05, 0.15, 0.1, 0.2, 0.3, 0.2],
            [0.05, 0.25, 0.1, 0.15, 0.15, 0.3]
        ]
    }
];

// Multi-head attention patterns (different heads focus on different things)
const headPatterns = [
    { name: "Positional", description: "This head tends to attend to nearby words, capturing local context and phrase structure.", pattern: "positional" },
    { name: "Syntactic", description: "This head focuses on grammatical relationships like subject-verb and noun-adjective pairs.", pattern: "syntactic" },
    { name: "Semantic", description: "This head attends to semantically related words regardless of position.", pattern: "semantic" },
    { name: "Coreference", description: "This head specializes in connecting pronouns to their referents (e.g., 'it' to 'cat').", pattern: "coreference" }
];

// State
let currentSentenceIndex = 0;
let selectedTokenIndex = null;
let currentHeadIndex = 0;
let archStep = 0;
let archPlaying = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    init3DAttention();
    initRoleApplications();
    initSelfAttention();
    initQKV();
    initMultiHead();
    initArchitecture();
});

// ============================================================================
// 3D Attention Visualization
// ============================================================================

function init3DAttention() {
    const canvas = document.getElementById('attention3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    attention3D.mini3d = new Mini3D(canvas);
    
    document.getElementById('rotateLeftBtn')?.addEventListener('click', () => {
        attention3D.rotationY -= 0.3;
        render3DAttention();
    });
    
    document.getElementById('rotateRightBtn')?.addEventListener('click', () => {
        attention3D.rotationY += 0.3;
        render3DAttention();
    });
    
    document.getElementById('animateAttentionBtn')?.addEventListener('click', () => {
        if (!attention3D.animating) {
            attention3D.animating = true;
            attention3D.animationProgress = 0;
            animateAttentionFlow();
        }
    });
    
    render3DAttention();
}

function animateAttentionFlow() {
    if (!attention3D.animating) return;
    
    attention3D.animationProgress += 0.02;
    render3DAttention();
    
    if (attention3D.animationProgress < 1) {
        requestAnimationFrame(animateAttentionFlow);
    } else {
        attention3D.animating = false;
        attention3D.animationProgress = 0;
    }
}

function render3DAttention() {
    const mini3d = attention3D.mini3d;
    if (!mini3d) return;
    
    mini3d.clear();
    mini3d.setRotation(0, attention3D.rotationY, 0);
    
    const centerX = mini3d.canvas.width / 2;
    const centerY = mini3d.canvas.height / 2;
    
    const tokens = ['The', 'cat', 'sat', 'on', 'mat'];
    const tokenPositions = tokens.map((t, i) => ({
        token: t,
        x: (i - 2) * 100,
        y: 0,
        z: 0
    }));
    
    // Attention weights (simplified)
    const attentionWeights = [
        [0.4, 0.2, 0.1, 0.1, 0.2],
        [0.1, 0.5, 0.2, 0.1, 0.1],
        [0.1, 0.3, 0.3, 0.2, 0.1],
        [0.1, 0.1, 0.2, 0.4, 0.2],
        [0.2, 0.1, 0.1, 0.2, 0.4]
    ];
    
    // Draw attention beams
    tokenPositions.forEach((from, i) => {
        tokenPositions.forEach((to, j) => {
            if (i !== j) {
                const weight = attentionWeights[i][j];
                
                // Animate beams
                let alpha = weight;
                if (attention3D.animating) {
                    const beamProgress = (attention3D.animationProgress * 5 - i);
                    if (beamProgress > 0 && beamProgress < 1) {
                        alpha = weight * beamProgress;
                    } else if (beamProgress <= 0) {
                        alpha = 0;
                    }
                }
                
                const fromRot = mini3d.rotatePoint(from.x, from.y - 30, from.z);
                const toRot = mini3d.rotatePoint(to.x, to.y - 30, to.z);
                
                const fromProj = mini3d.project(fromRot.x + centerX, fromRot.y + centerY, fromRot.z);
                const toProj = mini3d.project(toRot.x + centerX, toRot.y + centerY, toRot.z);
                
                // Draw curved attention beam
                mini3d.ctx.strokeStyle = `rgba(155, 89, 182, ${alpha})`;
                mini3d.ctx.lineWidth = weight * 8;
                mini3d.ctx.beginPath();
                
                const midX = (fromProj.x + toProj.x) / 2;
                const midY = Math.min(fromProj.y, toProj.y) - 50 - weight * 50;
                
                mini3d.ctx.moveTo(fromProj.x, fromProj.y);
                mini3d.ctx.quadraticCurveTo(midX, midY, toProj.x, toProj.y);
                mini3d.ctx.stroke();
            }
        });
    });
    
    // Draw token nodes
    tokenPositions.forEach((pos, i) => {
        const rotated = mini3d.rotatePoint(pos.x, pos.y, pos.z);
        const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
        
        // Draw node
        const gradient = mini3d.ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 30 * proj.scale);
        gradient.addColorStop(0, '#4A90D9');
        gradient.addColorStop(1, 'transparent');
        mini3d.ctx.fillStyle = gradient;
        mini3d.ctx.beginPath();
        mini3d.ctx.arc(proj.x, proj.y, 30 * proj.scale, 0, Math.PI * 2);
        mini3d.ctx.fill();
        
        mini3d.ctx.fillStyle = '#4A90D9';
        mini3d.ctx.beginPath();
        mini3d.ctx.arc(proj.x, proj.y, 20 * proj.scale, 0, Math.PI * 2);
        mini3d.ctx.fill();
        
        // Draw token label
        mini3d.ctx.fillStyle = '#fff';
        mini3d.ctx.font = `bold ${14 * proj.scale}px Arial`;
        mini3d.ctx.textAlign = 'center';
        mini3d.ctx.textBaseline = 'middle';
        mini3d.ctx.fillText(pos.token, proj.x, proj.y);
    });
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
    
    updateApplications('nlp');
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
// Section 1: Self-Attention
// ============================================================================

function initSelfAttention() {
    const sentenceSelect = document.getElementById('sentenceSelect');
    
    // Load initial sentence
    loadSentence(0);
    
    sentenceSelect.addEventListener('change', (e) => {
        currentSentenceIndex = parseInt(e.target.value);
        loadSentence(currentSentenceIndex);
    });
}

function loadSentence(index) {
    const sentence = sentences[index];
    const tokensContainer = document.getElementById('sentenceTokens');
    const matrixContainer = document.getElementById('attentionMatrix');
    
    // Clear previous
    tokensContainer.innerHTML = '';
    selectedTokenIndex = null;
    
    // Create tokens
    sentence.tokens.forEach((token, i) => {
        const tokenEl = document.createElement('div');
        tokenEl.className = 'sentence-token';
        tokenEl.textContent = token;
        tokenEl.dataset.index = i;
        
        // Add attention weight label (hidden by default)
        const weightLabel = document.createElement('span');
        weightLabel.className = 'attention-weight-label';
        tokenEl.appendChild(weightLabel);
        
        tokenEl.addEventListener('click', () => selectToken(i));
        tokensContainer.appendChild(tokenEl);
    });
    
    // Create attention matrix
    createAttentionMatrix(sentence);
}

function createAttentionMatrix(sentence) {
    const container = document.getElementById('attentionMatrix');
    const n = sentence.tokens.length;
    
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${n + 1}, 1fr)`;
    
    // Header row (empty corner + column labels)
    const corner = document.createElement('div');
    corner.className = 'attention-cell header';
    corner.textContent = '';
    container.appendChild(corner);
    
    sentence.tokens.forEach(token => {
        const header = document.createElement('div');
        header.className = 'attention-cell header';
        header.textContent = token.substring(0, 4);
        container.appendChild(header);
    });
    
    // Data rows
    for (let i = 0; i < n; i++) {
        // Row label
        const rowLabel = document.createElement('div');
        rowLabel.className = 'attention-cell header';
        rowLabel.textContent = sentence.tokens[i].substring(0, 4);
        container.appendChild(rowLabel);
        
        // Attention values
        for (let j = 0; j < n; j++) {
            const cell = document.createElement('div');
            cell.className = 'attention-cell value';
            
            const weight = sentence.attention[i][j];
            const intensity = Math.floor(weight * 255);
            cell.style.backgroundColor = `rgb(${155 - intensity * 0.3}, ${89 - intensity * 0.2}, ${182 - intensity * 0.1})`;
            cell.textContent = weight.toFixed(2);
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            cell.addEventListener('click', () => {
                selectToken(i);
                highlightAttention(i);
            });
            
            container.appendChild(cell);
        }
    }
}

function selectToken(index) {
    const tokens = document.querySelectorAll('.sentence-token');
    
    // Clear previous selection
    tokens.forEach(t => {
        t.classList.remove('selected', 'attended');
        t.querySelector('.attention-weight-label').textContent = '';
    });
    
    // Select new token
    selectedTokenIndex = index;
    tokens[index].classList.add('selected');
    
    // Highlight attention
    highlightAttention(index);
}

function highlightAttention(fromIndex) {
    const sentence = sentences[currentSentenceIndex];
    const tokens = document.querySelectorAll('.sentence-token');
    const attentionWeights = sentence.attention[fromIndex];
    
    tokens.forEach((token, i) => {
        if (i !== fromIndex) {
            const weight = attentionWeights[i];
            token.classList.add('attended');
            token.style.setProperty('--attention-color', `rgba(155, 89, 182, ${weight * 2})`);
            token.querySelector('.attention-weight-label').textContent = (weight * 100).toFixed(0) + '%';
        }
    });
    
    // Highlight matrix row
    const cells = document.querySelectorAll('.attention-cell.value');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        if (row === fromIndex) {
            cell.style.outline = '2px solid var(--primary)';
        } else {
            cell.style.outline = 'none';
        }
    });
}

// ============================================================================
// Section 2: Query, Key, Value
// ============================================================================

function initQKV() {
    const animateBtn = document.getElementById('animateQKVBtn');
    const resetBtn = document.getElementById('resetQKVBtn');
    
    // Initialize vector bars
    createVectorBars('inputBars', 8, 'primary');
    createVectorBars('queryBars', 6, 'query');
    createVectorBars('keyBars', 6, 'key');
    createVectorBars('valueBars', 6, 'value');
    
    animateBtn.addEventListener('click', animateQKVProjection);
    resetBtn.addEventListener('click', resetQKV);
}

function createVectorBars(containerId, count, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const bar = document.createElement('div');
        bar.className = 'vector-bar';
        bar.style.height = `${20 + Math.random() * 30}px`;
        bar.style.opacity = '0.3';
        container.appendChild(bar);
    }
}

function animateQKVProjection() {
    const inputBars = document.querySelectorAll('#inputBars .vector-bar');
    const queryBars = document.querySelectorAll('#queryBars .vector-bar');
    const keyBars = document.querySelectorAll('#keyBars .vector-bar');
    const valueBars = document.querySelectorAll('#valueBars .vector-bar');
    
    // Animate input activation
    inputBars.forEach((bar, i) => {
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'scaleY(1.2)';
            setTimeout(() => {
                bar.style.transform = 'scaleY(1)';
            }, 200);
        }, i * 100);
    });
    
    // Animate Q, K, V projections
    setTimeout(() => {
        animateVectorBars(queryBars, 0);
        animateVectorBars(keyBars, 200);
        animateVectorBars(valueBars, 400);
    }, 1000);
}

function animateVectorBars(bars, delay) {
    bars.forEach((bar, i) => {
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.height = `${20 + Math.random() * 30}px`;
            bar.style.transform = 'scaleY(1.3)';
            setTimeout(() => {
                bar.style.transform = 'scaleY(1)';
            }, 200);
        }, delay + i * 80);
    });
}

function resetQKV() {
    const allBars = document.querySelectorAll('.vector-bar');
    allBars.forEach(bar => {
        bar.style.opacity = '0.3';
        bar.style.transform = 'scaleY(1)';
    });
}

// ============================================================================
// Section 3: Multi-Head Attention
// ============================================================================

function initMultiHead() {
    const headsContainer = document.getElementById('headsContainer');
    const buttonsContainer = document.getElementById('headButtons');
    
    // Create attention head visualizations
    headPatterns.forEach((head, i) => {
        // Create mini attention grid
        const headDiv = document.createElement('div');
        headDiv.className = 'attention-head' + (i === 0 ? ' active' : '');
        headDiv.dataset.index = i;
        
        const label = document.createElement('div');
        label.className = 'head-label';
        label.textContent = `Head ${i + 1}`;
        headDiv.appendChild(label);
        
        const grid = document.createElement('div');
        grid.className = 'mini-attention-grid';
        
        // Generate pattern based on head type
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = 'mini-cell';
                
                let intensity = 0;
                switch (head.pattern) {
                    case 'positional':
                        intensity = Math.max(0, 1 - Math.abs(row - col) * 0.3);
                        break;
                    case 'syntactic':
                        intensity = (row === 0 && col === 1) || (row === 1 && col === 0) || 
                                   (row === 2 && col === 3) ? 0.9 : 0.2;
                        break;
                    case 'semantic':
                        intensity = (row === 1 && col === 4) || (row === 4 && col === 1) ||
                                   (row === 2 && col === 3) ? 0.85 : 0.15;
                        break;
                    case 'coreference':
                        intensity = (row === 3 && col === 1) || (row === 4 && col === 1) ? 0.9 : 0.1;
                        break;
                }
                
                cell.style.backgroundColor = `rgba(155, 89, 182, ${intensity})`;
                grid.appendChild(cell);
            }
        }
        
        headDiv.appendChild(grid);
        headDiv.addEventListener('click', () => selectHead(i));
        headsContainer.appendChild(headDiv);
        
        // Create button
        const btn = document.createElement('button');
        btn.className = 'head-btn' + (i === 0 ? ' active' : '');
        btn.textContent = `Head ${i + 1}: ${head.name}`;
        btn.dataset.index = i;
        btn.addEventListener('click', () => selectHead(i));
        buttonsContainer.appendChild(btn);
    });
    
    // Show initial interpretation
    updateHeadInterpretation(0);
}

function selectHead(index) {
    currentHeadIndex = index;
    
    // Update head visuals
    document.querySelectorAll('.attention-head').forEach((h, i) => {
        h.classList.toggle('active', i === index);
    });
    
    // Update buttons
    document.querySelectorAll('.head-btn').forEach((b, i) => {
        b.classList.toggle('active', i === index);
    });
    
    // Update interpretation
    updateHeadInterpretation(index);
}

function updateHeadInterpretation(index) {
    const head = headPatterns[index];
    const container = document.getElementById('headInterpretation');
    
    container.innerHTML = `
        <h4>Head ${index + 1}: ${head.name} Attention</h4>
        <p>${head.description}</p>
    `;
}

// ============================================================================
// Section 4: Transformer Architecture
// ============================================================================

function initArchitecture() {
    const playBtn = document.getElementById('archPlayBtn');
    const prevBtn = document.getElementById('archPrevBtn');
    const nextBtn = document.getElementById('archNextBtn');
    const resetBtn = document.getElementById('archResetBtn');
    
    const steps = [
        { element: 'archInput', description: 'Input Tokens' },
        { element: 'archEmbedding', description: 'Token + Position Embeddings' },
        { element: 'block-1', description: 'Transformer Block 1' },
        { element: 'block-2', description: 'Transformer Block 2' },
        { element: 'block-3', description: 'Transformer Block N' },
        { element: 'archOutput', description: 'Output Probabilities' }
    ];
    
    playBtn.addEventListener('click', () => {
        if (archPlaying) {
            archPlaying = false;
            playBtn.textContent = '▶';
            playBtn.classList.remove('pause');
        } else {
            archPlaying = true;
            playBtn.textContent = '⏸';
            playBtn.classList.add('pause');
            autoPlayArchitecture(steps);
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (archStep > 0) {
            archStep--;
            showArchStep(archStep, steps);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (archStep < steps.length - 1) {
            archStep++;
            showArchStep(archStep, steps);
        }
    });
    
    resetBtn.addEventListener('click', () => {
        archStep = 0;
        archPlaying = false;
        playBtn.textContent = '▶';
        playBtn.classList.remove('pause');
        resetArchitecture();
        updateArchStepIndicator(0, steps);
    });
    
    // Initialize
    updateArchStepIndicator(0, steps);
}

function autoPlayArchitecture(steps) {
    if (!archPlaying) return;
    
    if (archStep < steps.length - 1) {
        archStep++;
        showArchStep(archStep, steps);
        setTimeout(() => autoPlayArchitecture(steps), 1200);
    } else {
        archPlaying = false;
        document.getElementById('archPlayBtn').textContent = '▶';
        document.getElementById('archPlayBtn').classList.remove('pause');
    }
}

function showArchStep(step, steps) {
    // Reset all
    document.querySelectorAll('.arch-stage, .transformer-block').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.arch-arrow').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.component').forEach(el => {
        el.classList.remove('active');
    });
    
    // Activate current and previous elements
    for (let i = 0; i <= step; i++) {
        const stepInfo = steps[i];
        let element;
        
        if (stepInfo.element.startsWith('block-')) {
            const blockNum = stepInfo.element.split('-')[1];
            element = document.querySelector(`.transformer-block[data-block="${blockNum}"]`);
        } else {
            element = document.getElementById(stepInfo.element);
        }
        
        if (element) {
            element.classList.add('active');
        }
    }
    
    // Activate arrows up to current step
    const arrows = document.querySelectorAll('.arch-arrow');
    for (let i = 0; i < Math.min(step, arrows.length); i++) {
        arrows[i].classList.add('active');
    }
    
    // Animate components in current block
    if (steps[step].element.startsWith('block-')) {
        const blockNum = steps[step].element.split('-')[1];
        const block = document.querySelector(`.transformer-block[data-block="${blockNum}"]`);
        if (block) {
            const components = block.querySelectorAll('.component');
            components.forEach((comp, i) => {
                setTimeout(() => {
                    comp.classList.add('active');
                }, i * 300);
            });
        }
    }
    
    updateArchStepIndicator(step, steps);
}

function resetArchitecture() {
    document.querySelectorAll('.arch-stage, .transformer-block').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.arch-arrow').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.component').forEach(el => {
        el.classList.remove('active');
    });
}

function updateArchStepIndicator(step, steps) {
    const indicator = document.getElementById('archStepIndicator');
    indicator.innerHTML = `<span>Step ${step + 1} of ${steps.length}: ${steps[step].description}</span>`;
}
