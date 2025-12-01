/**
 * Large Language Models - Interactive Demo Script
 * 
 * This demo shows how LLMs work, their scale, autoregressive generation,
 * training pipeline, and capabilities/limitations.
 */

// Role-based applications data
const roleApplications = {
    business: {
        title: 'Business Applications',
        apps: [
            { name: 'Customer Service Automation', desc: 'Deploy AI chatbots that handle 80% of customer inquiries 24/7' },
            { name: 'Document Analysis', desc: 'Extract insights from contracts, reports, and legal documents instantly' },
            { name: 'Market Research', desc: 'Analyze competitor data, trends, and customer feedback at scale' },
            { name: 'Email & Communication', desc: 'Draft professional emails, proposals, and presentations' }
        ]
    },
    developer: {
        title: 'Developer Applications',
        apps: [
            { name: 'Code Generation', desc: 'Generate boilerplate code, functions, and entire modules from descriptions' },
            { name: 'Code Review & Debugging', desc: 'Find bugs, suggest improvements, and explain complex code' },
            { name: 'Documentation', desc: 'Auto-generate API docs, README files, and code comments' },
            { name: 'Test Generation', desc: 'Create unit tests, integration tests, and edge case scenarios' }
        ]
    },
    creative: {
        title: 'Creative Applications',
        apps: [
            { name: 'Content Writing', desc: 'Generate blog posts, articles, social media content, and ad copy' },
            { name: 'Storytelling', desc: 'Create narratives, character dialogues, and plot outlines' },
            { name: 'Brainstorming', desc: 'Generate creative ideas, concepts, and alternative approaches' },
            { name: 'Editing & Refinement', desc: 'Improve tone, style, and clarity of existing content' }
        ]
    },
    research: {
        title: 'Research Applications',
        apps: [
            { name: 'Literature Review', desc: 'Summarize papers, identify key findings, and find connections' },
            { name: 'Data Analysis', desc: 'Interpret results, suggest statistical methods, and explain findings' },
            { name: 'Hypothesis Generation', desc: 'Propose research questions and experimental designs' },
            { name: 'Grant Writing', desc: 'Draft proposals, abstracts, and research summaries' }
        ]
    }
};

// 3D LLM visualization state
let llm3D = {
    mini3d: null,
    rotationY: 0,
    animating: false,
    flowProgress: 0
};

// Model data for scale comparison
const models = [
    { name: 'GPT-2', params: '1.5B', paramsNum: 1.5, year: 2019, color: '#3498DB' },
    { name: 'GPT-3', params: '175B', paramsNum: 175, year: 2020, color: '#9B59B6' },
    { name: 'PaLM', params: '540B', paramsNum: 540, year: 2022, color: '#E67E22' },
    { name: 'GPT-4', params: '1.7T', paramsNum: 1700, year: 2023, color: '#27AE60' },
    { name: 'LLaMA 3', params: '405B', paramsNum: 405, year: 2024, color: '#E74C3C' }
];

// Generation vocabulary (simplified)
const generationVocab = {
    'The future of AI is': [
        { token: 'bright', prob: 0.25 },
        { token: 'uncertain', prob: 0.18 },
        { token: 'exciting', prob: 0.15 },
        { token: 'transformative', prob: 0.12 },
        { token: 'here', prob: 0.10 }
    ],
    'bright': [
        { token: ',', prob: 0.30 },
        { token: 'and', prob: 0.25 },
        { token: '.', prob: 0.20 },
        { token: 'with', prob: 0.15 },
        { token: 'but', prob: 0.10 }
    ],
    'uncertain': [
        { token: ',', prob: 0.28 },
        { token: 'but', prob: 0.22 },
        { token: '.', prob: 0.20 },
        { token: 'and', prob: 0.18 },
        { token: 'yet', prob: 0.12 }
    ],
    ',': [
        { token: 'with', prob: 0.25 },
        { token: 'and', prob: 0.22 },
        { token: 'but', prob: 0.18 },
        { token: 'as', prob: 0.15 },
        { token: 'bringing', prob: 0.12 }
    ],
    'with': [
        { token: 'new', prob: 0.28 },
        { token: 'many', prob: 0.22 },
        { token: 'endless', prob: 0.18 },
        { token: 'great', prob: 0.15 },
        { token: 'incredible', prob: 0.12 }
    ],
    'new': [
        { token: 'possibilities', prob: 0.30 },
        { token: 'opportunities', prob: 0.25 },
        { token: 'challenges', prob: 0.18 },
        { token: 'technologies', prob: 0.15 },
        { token: 'innovations', prob: 0.12 }
    ],
    'possibilities': [
        { token: '.', prob: 0.35 },
        { token: 'and', prob: 0.25 },
        { token: 'for', prob: 0.18 },
        { token: 'that', prob: 0.12 },
        { token: 'emerging', prob: 0.10 }
    ],
    'default': [
        { token: 'the', prob: 0.20 },
        { token: 'and', prob: 0.18 },
        { token: 'a', prob: 0.15 },
        { token: 'to', prob: 0.12 },
        { token: '.', prob: 0.10 }
    ]
};

// State
let selectedModelIndex = 3; // GPT-4 by default
let generatedTokens = [];
let isAutoGenerating = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    init3DLLM();
    initRoleApplications();
    initScaleComparison();
    initGeneration();
    initTrainingPipeline();
    initCapabilities();
});

// ============================================================================
// 3D LLM Architecture Visualization
// ============================================================================

function init3DLLM() {
    const canvas = document.getElementById('llm3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    llm3D.mini3d = new Mini3D(canvas);
    
    document.getElementById('rotateLeftBtn')?.addEventListener('click', () => {
        llm3D.rotationY -= 0.3;
        render3DLLM();
    });
    
    document.getElementById('rotateRightBtn')?.addEventListener('click', () => {
        llm3D.rotationY += 0.3;
        render3DLLM();
    });
    
    document.getElementById('animateFlowBtn')?.addEventListener('click', () => {
        if (!llm3D.animating) {
            llm3D.animating = true;
            llm3D.flowProgress = 0;
            animateLLMFlow();
        }
    });
    
    render3DLLM();
}

function animateLLMFlow() {
    if (!llm3D.animating) return;
    
    llm3D.flowProgress += 0.015;
    render3DLLM();
    
    if (llm3D.flowProgress < 1) {
        requestAnimationFrame(animateLLMFlow);
    } else {
        llm3D.animating = false;
        llm3D.flowProgress = 0;
    }
}

function render3DLLM() {
    const mini3d = llm3D.mini3d;
    if (!mini3d) return;
    
    mini3d.clear();
    mini3d.setRotation(0, llm3D.rotationY, 0);
    
    const centerX = mini3d.canvas.width / 2;
    const centerY = mini3d.canvas.height / 2;
    
    const layers = 6;
    const layerSpacing = 80;
    const layerWidth = 60;
    const layerHeight = 200;
    
    // Draw transformer layers as 3D blocks
    for (let i = 0; i < layers; i++) {
        const z = (i - layers/2) * layerSpacing;
        const color = `hsl(${210 + i * 20}, 70%, 50%)`;
        
        // Draw layer block
        const corners = [
            { x: -layerWidth/2, y: -layerHeight/2, z: z - 20 },
            { x: layerWidth/2, y: -layerHeight/2, z: z - 20 },
            { x: layerWidth/2, y: layerHeight/2, z: z - 20 },
            { x: -layerWidth/2, y: layerHeight/2, z: z - 20 },
            { x: -layerWidth/2, y: -layerHeight/2, z: z + 20 },
            { x: layerWidth/2, y: -layerHeight/2, z: z + 20 },
            { x: layerWidth/2, y: layerHeight/2, z: z + 20 },
            { x: -layerWidth/2, y: layerHeight/2, z: z + 20 }
        ];
        
        // Project corners
        const projected = corners.map(c => {
            const rot = mini3d.rotatePoint(c.x, c.y, c.z);
            return mini3d.project(rot.x + centerX, rot.y + centerY, rot.z);
        });
        
        // Draw faces
        mini3d.ctx.fillStyle = color;
        mini3d.ctx.globalAlpha = 0.7;
        
        // Front face
        mini3d.ctx.beginPath();
        mini3d.ctx.moveTo(projected[4].x, projected[4].y);
        mini3d.ctx.lineTo(projected[5].x, projected[5].y);
        mini3d.ctx.lineTo(projected[6].x, projected[6].y);
        mini3d.ctx.lineTo(projected[7].x, projected[7].y);
        mini3d.ctx.closePath();
        mini3d.ctx.fill();
        
        // Top face
        mini3d.ctx.fillStyle = `hsl(${210 + i * 20}, 70%, 60%)`;
        mini3d.ctx.beginPath();
        mini3d.ctx.moveTo(projected[0].x, projected[0].y);
        mini3d.ctx.lineTo(projected[1].x, projected[1].y);
        mini3d.ctx.lineTo(projected[5].x, projected[5].y);
        mini3d.ctx.lineTo(projected[4].x, projected[4].y);
        mini3d.ctx.closePath();
        mini3d.ctx.fill();
        
        // Layer label
        mini3d.ctx.globalAlpha = 1;
        mini3d.ctx.fillStyle = '#fff';
        mini3d.ctx.font = '12px Arial';
        mini3d.ctx.textAlign = 'center';
        const labelPos = mini3d.project(centerX, centerY + layerHeight/2 + 20, 0);
        mini3d.ctx.fillText(`Layer ${i + 1}`, projected[6].x, projected[6].y + 15);
    }
    
    // Draw data flow particles
    if (llm3D.animating) {
        const numParticles = 5;
        for (let p = 0; p < numParticles; p++) {
            const particleProgress = (llm3D.flowProgress + p * 0.15) % 1;
            const z = (particleProgress - 0.5) * layers * layerSpacing;
            const y = Math.sin(particleProgress * Math.PI * 4) * 30;
            
            const rot = mini3d.rotatePoint(0, y, z);
            const proj = mini3d.project(rot.x + centerX, rot.y + centerY, rot.z);
            
            const gradient = mini3d.ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 15);
            gradient.addColorStop(0, '#50C878');
            gradient.addColorStop(1, 'transparent');
            mini3d.ctx.fillStyle = gradient;
            mini3d.ctx.beginPath();
            mini3d.ctx.arc(proj.x, proj.y, 15, 0, Math.PI * 2);
            mini3d.ctx.fill();
        }
    }
    
    mini3d.ctx.globalAlpha = 1;
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
    
    updateApplications('business');
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
// Section 1: Scale Comparison
// ============================================================================

function initScaleComparison() {
    const cardsContainer = document.getElementById('modelCards');
    const barsContainer = document.getElementById('scaleBars');
    
    // Create model cards
    models.forEach((model, index) => {
        const card = document.createElement('div');
        card.className = 'model-card' + (index === selectedModelIndex ? ' selected' : '');
        card.dataset.index = index;
        card.innerHTML = `
            <div class="model-name">${model.name}</div>
            <div class="model-params">${model.params}</div>
            <div class="model-year">${model.year}</div>
        `;
        card.addEventListener('click', () => selectModel(index));
        cardsContainer.appendChild(card);
    });
    
    // Create scale bars
    const maxParams = Math.max(...models.map(m => m.paramsNum));
    
    models.forEach((model, index) => {
        const barItem = document.createElement('div');
        barItem.className = 'scale-bar-item';
        barItem.innerHTML = `
            <span class="scale-bar-label">${model.name}</span>
            <div class="scale-bar-track">
                <div class="scale-bar-fill" style="width: 0%; background: ${model.color};">
                    <span class="scale-bar-value">${model.params}</span>
                </div>
            </div>
        `;
        barsContainer.appendChild(barItem);
        
        // Animate bar
        setTimeout(() => {
            const fill = barItem.querySelector('.scale-bar-fill');
            fill.style.width = `${(model.paramsNum / maxParams) * 100}%`;
        }, index * 200);
    });
}

function selectModel(index) {
    selectedModelIndex = index;
    
    // Update card selection
    document.querySelectorAll('.model-card').forEach((card, i) => {
        card.classList.toggle('selected', i === index);
    });
    
    // Update facts
    const model = models[index];
    document.getElementById('totalParams').textContent = model.params;
    
    // Estimate training tokens and cost based on model
    const tokenEstimates = {
        0: '40B', 1: '300B', 2: '780B', 3: '13T', 4: '15T'
    };
    const costEstimates = {
        0: '$50K', 1: '$4.6M', 2: '$10M', 3: '$100M+', 4: '$50M+'
    };
    
    document.getElementById('trainingTokens').textContent = tokenEstimates[index];
    document.getElementById('trainingCost').textContent = costEstimates[index];
}

// ============================================================================
// Section 2: Autoregressive Generation
// ============================================================================

function initGeneration() {
    const generateBtn = document.getElementById('generateTokenBtn');
    const autoBtn = document.getElementById('autoGenerateBtn');
    const resetBtn = document.getElementById('resetGenerationBtn');
    const promptInput = document.getElementById('llmPrompt');
    
    // Initialize
    updateGenerationDisplay();
    showPredictions();
    
    generateBtn.addEventListener('click', generateNextToken);
    
    autoBtn.addEventListener('click', () => {
        if (isAutoGenerating) {
            isAutoGenerating = false;
            autoBtn.textContent = 'Auto Generate';
        } else {
            isAutoGenerating = true;
            autoBtn.textContent = 'Stop';
            autoGenerate();
        }
    });
    
    resetBtn.addEventListener('click', () => {
        generatedTokens = [];
        isAutoGenerating = false;
        autoBtn.textContent = 'Auto Generate';
        updateGenerationDisplay();
        showPredictions();
    });
    
    promptInput.addEventListener('change', () => {
        generatedTokens = [];
        updateGenerationDisplay();
        showPredictions();
    });
}

function generateNextToken() {
    const prompt = document.getElementById('llmPrompt').value;
    const lastToken = generatedTokens.length > 0 ? generatedTokens[generatedTokens.length - 1] : prompt;
    
    // Get predictions
    const predictions = generationVocab[lastToken] || generationVocab['default'];
    
    // Sample from predictions (weighted random)
    const token = weightedSample(predictions);
    generatedTokens.push(token);
    
    // Update display
    updateGenerationDisplay();
    showPredictions();
    highlightSelectedToken(token);
    
    // Stop if we hit a period or max tokens
    if (token === '.' || generatedTokens.length >= 15) {
        isAutoGenerating = false;
        document.getElementById('autoGenerateBtn').textContent = 'Auto Generate';
    }
}

function weightedSample(predictions) {
    const total = predictions.reduce((sum, p) => sum + p.prob, 0);
    let r = Math.random() * total;
    
    for (const pred of predictions) {
        r -= pred.prob;
        if (r <= 0) return pred.token;
    }
    return predictions[0].token;
}

function updateGenerationDisplay() {
    const generatedText = document.getElementById('generatedText');
    const tokenCount = document.getElementById('tokenCount');
    const contextLength = document.getElementById('contextLength');
    const prompt = document.getElementById('llmPrompt').value;
    
    // Format generated text
    let text = '';
    generatedTokens.forEach((token, i) => {
        // Add space before token unless it's punctuation
        if (!/^[.,!?;:]$/.test(token) && i > 0) {
            text += ' ';
        }
        text += token;
    });
    
    generatedText.textContent = text;
    tokenCount.textContent = generatedTokens.length;
    contextLength.textContent = prompt.split(' ').length + generatedTokens.length;
}

function showPredictions() {
    const container = document.getElementById('predictionProbs');
    const prompt = document.getElementById('llmPrompt').value;
    const lastToken = generatedTokens.length > 0 ? generatedTokens[generatedTokens.length - 1] : prompt;
    
    const predictions = generationVocab[lastToken] || generationVocab['default'];
    
    container.innerHTML = '';
    
    predictions.forEach((pred, index) => {
        const item = document.createElement('div');
        item.className = 'pred-item';
        item.innerHTML = `
            <span class="pred-token">"${pred.token}"</span>
            <div class="pred-bar-track">
                <div class="pred-bar-fill" style="width: 0%;">
                    <span class="pred-prob">${(pred.prob * 100).toFixed(0)}%</span>
                </div>
            </div>
        `;
        container.appendChild(item);
        
        // Animate bar
        setTimeout(() => {
            const fill = item.querySelector('.pred-bar-fill');
            fill.style.width = `${pred.prob * 100 * 2}%`; // Scale for visibility
        }, index * 100);
    });
}

function highlightSelectedToken(token) {
    const items = document.querySelectorAll('.pred-item');
    items.forEach(item => {
        const tokenText = item.querySelector('.pred-token').textContent;
        if (tokenText === `"${token}"`) {
            item.querySelector('.pred-bar-fill').classList.add('selected');
        }
    });
}

async function autoGenerate() {
    while (isAutoGenerating && generatedTokens.length < 15) {
        generateNextToken();
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if we should stop
        if (generatedTokens[generatedTokens.length - 1] === '.') {
            break;
        }
    }
    isAutoGenerating = false;
    document.getElementById('autoGenerateBtn').textContent = 'Auto Generate';
}

// ============================================================================
// Section 3: Training Pipeline
// ============================================================================

function initTrainingPipeline() {
    const animateBtn = document.getElementById('animateTrainingBtn');
    
    animateBtn.addEventListener('click', animateTraining);
}

async function animateTraining() {
    const phases = document.querySelectorAll('.training-phase');
    const arrows = document.querySelectorAll('.phase-arrow');
    
    // Reset all
    phases.forEach(p => p.classList.remove('active'));
    arrows.forEach(a => a.style.opacity = '0.5');
    
    // Animate each phase
    for (let i = 0; i < phases.length; i++) {
        phases[i].classList.add('active');
        
        // Animate arrow after phase
        if (i < arrows.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
            arrows[i].style.opacity = '1';
            arrows[i].style.color = 'var(--primary)';
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
}

// ============================================================================
// Section 4: Capabilities & Limitations
// ============================================================================

function initCapabilities() {
    const capItems = document.querySelectorAll('.cap-item');
    
    capItems.forEach(item => {
        item.addEventListener('click', () => {
            // Toggle active state
            item.classList.toggle('expanded');
            
            // Show more details (could expand this)
            const cap = item.dataset.cap;
            showCapabilityDetails(cap);
        });
        
        // Add hover effect
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(5px)';
        });
    });
}

function showCapabilityDetails(cap) {
    const details = {
        generation: 'LLMs can generate coherent, contextually appropriate text across many domains and styles.',
        qa: 'By encoding knowledge during training, LLMs can answer questions without explicit retrieval.',
        reasoning: 'Chain-of-thought prompting enables step-by-step problem solving.',
        translation: 'Multilingual training enables translation between many language pairs.',
        hallucination: 'LLMs generate plausible-sounding but factually incorrect information.',
        cutoff: 'Training data has a cutoff date; models lack knowledge of recent events.',
        context: 'Limited context window means long documents must be chunked or summarized.',
        bias: 'Training data biases are reflected in model outputs.'
    };
    
    console.log(`${cap}: ${details[cap]}`);
}
