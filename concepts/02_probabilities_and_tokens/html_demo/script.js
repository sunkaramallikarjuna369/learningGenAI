/**
 * Tokens & Probabilities - Interactive 3D Demo Script
 * 
 * This demo shows how AI tokenizes text and predicts next tokens using probabilities.
 * Features: 3D token visualization, probability bars, temperature control, and generation.
 */

// Role-based applications
const roleApplications = {
    writer: {
        token: [
            "Understand token limits for long documents",
            "Optimize prompts to fit within context windows",
            "Know when words get split into subwords",
            "Estimate costs based on token count"
        ],
        probability: [
            "Use temperature to control creativity",
            "Understand why AI sometimes repeats phrases",
            "Guide AI toward specific vocabulary",
            "Predict when AI might hallucinate"
        ]
    },
    coder: {
        token: [
            "Understand code tokenization patterns",
            "Optimize code prompts for efficiency",
            "Know how special characters are tokenized",
            "Manage context for large codebases"
        ],
        probability: [
            "Use low temperature for deterministic code",
            "Understand code completion confidence",
            "Debug unexpected code suggestions",
            "Control randomness in generated tests"
        ]
    },
    analyst: {
        token: [
            "Process large datasets within token limits",
            "Chunk documents for analysis",
            "Understand tokenization of numbers/dates",
            "Optimize data extraction prompts"
        ],
        probability: [
            "Interpret confidence in AI predictions",
            "Use sampling for diverse insights",
            "Understand uncertainty in analysis",
            "Calibrate temperature for reports"
        ]
    },
    student: {
        token: [
            "Learn how AI 'reads' text differently",
            "Understand why some words cost more tokens",
            "See how languages tokenize differently",
            "Grasp the building blocks of AI"
        ],
        probability: [
            "Understand AI is 'guessing' next words",
            "See why AI can be creative or focused",
            "Learn about randomness in AI",
            "Understand AI confidence levels"
        ]
    }
};

// 3D Token visualization
let token3D = null;
let isAnimating = false;
let animationFrame = null;
let tokenFlowProgress = 0;

function init3DTokens() {
    const canvas = document.getElementById('token3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    token3D = new Mini3D(canvas, {
        focalLength: 500,
        rotationX: 0.3,
        rotationY: -0.2
    });
    
    render3DTokens();
    
    // Set up controls
    document.getElementById('rotateLeftBtn')?.addEventListener('click', () => {
        token3D.rotationY -= 0.3;
        render3DTokens();
    });
    
    document.getElementById('rotateRightBtn')?.addEventListener('click', () => {
        token3D.rotationY += 0.3;
        render3DTokens();
    });
    
    document.getElementById('animateBtn')?.addEventListener('click', (e) => {
        isAnimating = !isAnimating;
        e.target.classList.toggle('active', isAnimating);
        e.target.textContent = isAnimating ? 'Stop Animation' : 'Animate Flow';
        if (isAnimating) {
            animateTokenFlow();
        }
    });
    
    // Mouse drag rotation
    let isDragging = false;
    let lastX = 0;
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastX = e.clientX;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - lastX;
            token3D.rotationY += deltaX * 0.01;
            lastX = e.clientX;
            render3DTokens();
        }
    });
    
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);
}

function animateTokenFlow() {
    if (!isAnimating) return;
    tokenFlowProgress = (tokenFlowProgress + 0.02) % 1;
    render3DTokens();
    animationFrame = requestAnimationFrame(animateTokenFlow);
}

function render3DTokens() {
    if (!token3D) return;
    
    token3D.clear();
    const ctx = token3D.ctx;
    
    // Draw token sequence as 3D cubes
    const tokens = ['The', 'quick', 'brown', 'fox', '?'];
    const spacing = 80;
    const startX = -spacing * 2;
    
    tokens.forEach((token, i) => {
        const x = startX + i * spacing;
        const z = Math.sin(tokenFlowProgress * Math.PI * 2 + i * 0.5) * 20;
        const alpha = 0.6 + Math.sin(tokenFlowProgress * Math.PI * 2 + i * 0.5) * 0.4;
        
        // Draw cube for token
        token3D.drawCube({ x, y: -50, z }, 40, {
            color: i === tokens.length - 1 ? '#50C878' : '#4A90D9',
            lineWidth: 2,
            fillFaces: true
        });
        
        // Draw token text
        const textPos = token3D.project({ x, y: -50, z: -30 });
        ctx.fillStyle = 'white';
        ctx.font = `bold ${14 * textPos.scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(token, textPos.x, textPos.y);
    });
    
    // Draw probability distribution as 3D bars
    const probs = [
        { token: 'jumps', prob: 0.35 },
        { token: 'runs', prob: 0.25 },
        { token: 'and', prob: 0.15 },
        { token: 'quickly', prob: 0.10 },
        { token: 'the', prob: 0.08 }
    ];
    
    const barStartX = -100;
    const barSpacing = 50;
    
    // Draw "Next Token Probabilities" label
    const labelPos = token3D.project({ x: 0, y: 40, z: 0 });
    ctx.fillStyle = '#333';
    ctx.font = `bold ${12 * labelPos.scale}px Arial`;
    ctx.fillText('Next Token Probabilities', labelPos.x, labelPos.y);
    
    probs.forEach((item, i) => {
        const x = barStartX + i * barSpacing;
        const height = item.prob * 200;
        const pulseHeight = height * (1 + Math.sin(tokenFlowProgress * Math.PI * 2 + i) * 0.1);
        
        // Draw 3D bar
        const barColor = i === 0 ? '#50C878' : '#7B68EE';
        
        // Front face
        const frontPoints = [
            { x: x - 15, y: 60, z: -20 },
            { x: x + 15, y: 60, z: -20 },
            { x: x + 15, y: 60 + pulseHeight, z: -20 },
            { x: x - 15, y: 60 + pulseHeight, z: -20 }
        ];
        token3D.drawPlane(frontPoints, { color: barColor, alpha: 0.8 });
        
        // Top face
        const topPoints = [
            { x: x - 15, y: 60 + pulseHeight, z: -20 },
            { x: x + 15, y: 60 + pulseHeight, z: -20 },
            { x: x + 15, y: 60 + pulseHeight, z: 20 },
            { x: x - 15, y: 60 + pulseHeight, z: 20 }
        ];
        token3D.drawPlane(topPoints, { color: barColor, alpha: 0.5 });
        
        // Draw label
        const barLabelPos = token3D.project({ x, y: 60 + pulseHeight + 15, z: 0 });
        ctx.fillStyle = '#333';
        ctx.font = `${10 * barLabelPos.scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(item.token, barLabelPos.x, barLabelPos.y);
        ctx.fillText(`${(item.prob * 100).toFixed(0)}%`, barLabelPos.x, barLabelPos.y + 12);
    });
    
    // Draw flow arrows
    for (let i = 0; i < tokens.length - 1; i++) {
        const x1 = startX + i * spacing + 25;
        const x2 = startX + (i + 1) * spacing - 25;
        token3D.drawLine(
            { x: x1, y: -50, z: 0 },
            { x: x2, y: -50, z: 0 },
            { color: '#50C878', width: 2, alpha: 0.6 }
        );
    }
}

// Initialize role-based applications
function initRoleApplications() {
    const roleBtns = document.querySelectorAll('.role-btn');
    
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            roleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateApplications(btn.dataset.role);
        });
    });
    
    // Load default role
    updateApplications('writer');
}

function updateApplications(role) {
    const apps = roleApplications[role];
    if (!apps) return;
    
    const tokenList = document.getElementById('tokenAppsList');
    const probList = document.getElementById('probAppsList');
    
    if (tokenList) {
        tokenList.innerHTML = apps.token.map(app => `<li>${app}</li>`).join('');
    }
    
    if (probList) {
        probList.innerHTML = apps.probability.map(app => `<li>${app}</li>`).join('');
    }
}

// Sample vocabulary for demo (simplified)
const sampleVocab = [
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to',
    'and', 'but', 'or', 'nor', 'for', 'yet', 'so', 'if', 'then', 'else',
    'when', 'where', 'why', 'how', 'what', 'which', 'who', 'whom', 'whose',
    'this', 'that', 'these', 'those', 'here', 'there', 'now', 'then',
    'very', 'really', 'quite', 'rather', 'too', 'also', 'just', 'only',
    'cat', 'dog', 'fox', 'bird', 'fish', 'horse', 'mouse', 'rabbit',
    'quick', 'slow', 'fast', 'lazy', 'happy', 'sad', 'big', 'small',
    'brown', 'red', 'blue', 'green', 'yellow', 'black', 'white', 'gray',
    'jumps', 'runs', 'walks', 'sits', 'stands', 'lies', 'sleeps', 'eats',
    'over', 'under', 'above', 'below', 'beside', 'between', 'behind', 'in', 'on', 'at',
    'time', 'day', 'night', 'morning', 'evening', 'year', 'month', 'week',
    'once', 'upon', 'story', 'tale', 'adventure', 'journey', 'world', 'land',
    'king', 'queen', 'prince', 'princess', 'knight', 'dragon', 'castle', 'forest',
    'magic', 'spell', 'wish', 'dream', 'hope', 'love', 'life', 'death',
    '.', ',', '!', '?', ':', ';', '-', '"', "'", '(', ')'
];

// Context-aware next token probabilities (simplified simulation)
const contextProbabilities = {
    'the': { 'quick': 0.15, 'lazy': 0.12, 'big': 0.10, 'small': 0.08, 'brown': 0.08, 'cat': 0.07, 'dog': 0.07, 'fox': 0.06, 'king': 0.05, 'story': 0.05 },
    'quick': { 'brown': 0.25, 'fox': 0.15, 'dog': 0.10, 'cat': 0.08, 'and': 0.07, 'rabbit': 0.06, 'horse': 0.05, 'bird': 0.04, 'mouse': 0.03, 'jumps': 0.03 },
    'brown': { 'fox': 0.30, 'dog': 0.15, 'cat': 0.12, 'horse': 0.08, 'rabbit': 0.06, 'bird': 0.05, 'mouse': 0.04, 'and': 0.03, 'bear': 0.03, 'eyes': 0.02 },
    'fox': { 'jumps': 0.25, 'runs': 0.15, 'and': 0.10, 'is': 0.08, 'was': 0.07, 'quickly': 0.06, 'slowly': 0.05, 'the': 0.04, '.': 0.04, ',': 0.03 },
    'jumps': { 'over': 0.35, 'and': 0.12, 'quickly': 0.10, 'high': 0.08, 'around': 0.07, 'into': 0.06, 'onto': 0.05, 'up': 0.04, '.': 0.03, 'the': 0.02 },
    'over': { 'the': 0.40, 'a': 0.15, 'and': 0.08, 'it': 0.06, 'them': 0.05, 'here': 0.04, 'there': 0.04, 'quickly': 0.03, '.': 0.03, ',': 0.02 },
    'lazy': { 'dog': 0.30, 'cat': 0.20, 'fox': 0.10, 'and': 0.08, 'but': 0.06, 'afternoon': 0.05, 'day': 0.04, 'summer': 0.03, '.': 0.03, ',': 0.02 },
    'once': { 'upon': 0.45, 'a': 0.15, 'more': 0.10, 'again': 0.08, 'there': 0.05, 'in': 0.04, 'the': 0.03, 'when': 0.02, ',': 0.02, 'I': 0.01 },
    'upon': { 'a': 0.50, 'the': 0.20, 'time': 0.10, 'this': 0.05, 'that': 0.04, 'which': 0.03, 'it': 0.02, 'them': 0.02, 'him': 0.01, 'her': 0.01 },
    'a': { 'time': 0.15, 'day': 0.10, 'story': 0.08, 'tale': 0.07, 'dream': 0.06, 'wish': 0.05, 'king': 0.05, 'queen': 0.04, 'prince': 0.04, 'princess': 0.04 },
    'time': { 'there': 0.20, 'when': 0.15, 'in': 0.12, 'of': 0.10, 'and': 0.08, ',': 0.08, '.': 0.06, 'the': 0.05, 'a': 0.04, 'long': 0.03 },
    'default': { 'the': 0.15, 'a': 0.12, 'and': 0.10, 'is': 0.08, 'to': 0.07, 'in': 0.06, 'of': 0.05, 'that': 0.05, 'it': 0.04, 'for': 0.04 }
};

// State
let currentTemperature = 1.0;
let generatedTokens = [];
let trackToggle = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    init3DTokens();
    initRoleApplications();
    initTokenization();
    initPrediction();
    initTemperature();
    initGeneration();
});

// Track Toggle
function initTrackToggle() {
    trackToggle = new TrackToggle({
        defaultTrack: 'non-tech',
        onToggle: (track) => {
            console.log('Track changed to:', track);
        }
    });
}

// ============================================================================
// Section 1: Tokenization
// ============================================================================

function initTokenization() {
    const tokenizeBtn = document.getElementById('tokenizeBtn');
    const textInput = document.getElementById('textInput');
    
    tokenizeBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            animateTokenization(text);
        }
    });
    
    // Also tokenize on Enter
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            tokenizeBtn.click();
        }
    });
}

function animateTokenization(text) {
    const originalText = document.getElementById('originalText');
    const tokenArrow = document.getElementById('tokenArrow');
    const tokenDisplay = document.getElementById('tokenDisplay');
    const tokenCount = document.getElementById('tokenCount');
    
    // Reset
    originalText.textContent = '';
    tokenArrow.classList.remove('visible');
    tokenDisplay.innerHTML = '';
    tokenCount.innerHTML = '';
    
    // Step 1: Show original text
    originalText.textContent = text;
    originalText.style.animation = 'fadeIn 0.3s ease';
    
    // Step 2: Show arrow
    setTimeout(() => {
        tokenArrow.classList.add('visible');
    }, 500);
    
    // Step 3: Tokenize and display
    setTimeout(() => {
        const tokens = simpleTokenize(text);
        displayTokens(tokens, tokenDisplay);
        
        // Show count
        setTimeout(() => {
            tokenCount.innerHTML = `<strong>${tokens.length}</strong> tokens`;
        }, tokens.length * 150 + 200);
    }, 1000);
}

function simpleTokenize(text) {
    // Simple tokenization for demo - split on spaces and punctuation
    const tokens = [];
    let current = '';
    
    for (let char of text) {
        if (/\s/.test(char)) {
            if (current) {
                tokens.push(current);
                current = '';
            }
        } else if (/[.,!?;:'"()\-]/.test(char)) {
            if (current) {
                tokens.push(current);
                current = '';
            }
            tokens.push(char);
        } else {
            current += char;
        }
    }
    
    if (current) {
        tokens.push(current);
    }
    
    return tokens;
}

function displayTokens(tokens, container) {
    tokens.forEach((token, index) => {
        setTimeout(() => {
            const tokenEl = document.createElement('span');
            tokenEl.className = 'token';
            tokenEl.textContent = token;
            tokenEl.style.animationDelay = '0s';
            
            // Color coding based on token type
            if (/^[.,!?;:'"()\-]$/.test(token)) {
                tokenEl.style.background = '#FFE0B2';
                tokenEl.style.borderColor = '#FFB74D';
            } else if (token.length <= 2) {
                tokenEl.style.background = '#E3F2FD';
                tokenEl.style.borderColor = '#64B5F6';
            }
            
            container.appendChild(tokenEl);
        }, index * 150);
    });
}

// ============================================================================
// Section 2: Next Token Prediction
// ============================================================================

function initPrediction() {
    const sampleBtn = document.getElementById('sampleBtn');
    
    // Initialize with sample context
    updateContextDisplay(['The', 'quick', 'brown', 'fox']);
    updateProbabilityBars('fox');
    
    sampleBtn.addEventListener('click', () => {
        animateSampling();
    });
    
    // Initialize demo controller for step-through
    const steps = createPredictionSteps();
    const demoController = new DemoController({
        steps: steps,
        playSpeed: 1500
    });
}

function createPredictionSteps() {
    return [
        {
            title: 'Context Ready',
            explanation: 'The model has received the context tokens and is ready to predict the next token.',
            render: () => {
                updateContextDisplay(['The', 'quick', 'brown', 'fox']);
                document.getElementById('probBars').innerHTML = '<p style="text-align:center;color:#666;">Click "Next" to see predictions...</p>';
            }
        },
        {
            title: 'Computing Probabilities',
            explanation: 'The model processes the context through its neural network to compute probabilities for all possible next tokens.',
            render: () => {
                updateProbabilityBars('fox');
            }
        },
        {
            title: 'Sampling',
            explanation: 'A token is sampled from the probability distribution. Higher probability tokens are more likely to be chosen.',
            render: () => {
                animateSampling();
            }
        }
    ];
}

function updateContextDisplay(tokens) {
    const container = document.getElementById('contextTokens');
    container.innerHTML = '';
    
    tokens.forEach(token => {
        const tokenEl = document.createElement('span');
        tokenEl.className = 'token';
        tokenEl.textContent = token;
        container.appendChild(tokenEl);
    });
}

function updateProbabilityBars(lastToken) {
    const container = document.getElementById('probBars');
    container.innerHTML = '';
    
    // Get probabilities based on context
    const probs = contextProbabilities[lastToken.toLowerCase()] || contextProbabilities['default'];
    const entries = Object.entries(probs).sort((a, b) => b[1] - a[1]).slice(0, 8);
    
    entries.forEach(([token, prob], index) => {
        const row = document.createElement('div');
        row.className = 'prob-bar-row';
        
        const label = document.createElement('span');
        label.className = 'prob-bar-label';
        label.textContent = token;
        
        const track = document.createElement('div');
        track.className = 'prob-bar-track';
        
        const fill = document.createElement('div');
        fill.className = 'prob-bar-fill';
        fill.dataset.token = token;
        fill.dataset.prob = prob;
        
        track.appendChild(fill);
        row.appendChild(label);
        row.appendChild(track);
        container.appendChild(row);
        
        // Animate bar growth
        setTimeout(() => {
            fill.style.width = `${prob * 100 * 2}%`; // Scale for visibility
            fill.textContent = `${(prob * 100).toFixed(1)}%`;
        }, index * 100);
    });
}

function animateSampling() {
    const fills = document.querySelectorAll('#probBars .prob-bar-fill');
    const selectedDisplay = document.getElementById('selectedToken');
    
    // Reset
    fills.forEach(f => f.classList.remove('selected'));
    selectedDisplay.textContent = '';
    
    // Animate sweep
    let index = 0;
    const sweep = setInterval(() => {
        fills.forEach(f => f.style.opacity = '0.5');
        if (index < fills.length) {
            fills[index].style.opacity = '1';
            fills[index].style.transform = 'scaleY(1.1)';
            setTimeout(() => {
                if (fills[index]) {
                    fills[index].style.transform = '';
                }
            }, 100);
            index++;
        } else {
            clearInterval(sweep);
            
            // Select based on probability (weighted random)
            const selected = weightedRandomSelect(fills);
            fills.forEach(f => f.style.opacity = '1');
            fills[selected].classList.add('selected');
            selectedDisplay.textContent = fills[selected].dataset.token;
        }
    }, 150);
}

function weightedRandomSelect(fills) {
    const probs = Array.from(fills).map(f => parseFloat(f.dataset.prob));
    const sum = probs.reduce((a, b) => a + b, 0);
    let r = Math.random() * sum;
    
    for (let i = 0; i < probs.length; i++) {
        r -= probs[i];
        if (r <= 0) return i;
    }
    return probs.length - 1;
}

// ============================================================================
// Section 3: Temperature Control
// ============================================================================

function initTemperature() {
    const slider = document.getElementById('temperatureSlider');
    const tempValue = document.getElementById('tempValue');
    
    // Initialize bars
    updateTemperatureBars(1.0);
    
    slider.addEventListener('input', (e) => {
        const temp = parseFloat(e.target.value);
        currentTemperature = temp;
        tempValue.textContent = temp.toFixed(1);
        updateTemperatureBars(temp);
        updateTemperatureExplanation(temp);
    });
}

function updateTemperatureBars(temperature) {
    const container = document.getElementById('tempBars');
    container.innerHTML = '';
    
    // Base probabilities
    const baseProbs = [0.35, 0.25, 0.15, 0.10, 0.08, 0.04, 0.02, 0.01];
    const labels = ['jumps', 'over', 'and', 'quickly', 'runs', 'the', 'into', 'away'];
    
    // Apply temperature
    const scaledLogits = baseProbs.map(p => Math.log(p + 0.001) / temperature);
    const expLogits = scaledLogits.map(l => Math.exp(l));
    const sum = expLogits.reduce((a, b) => a + b, 0);
    const adjustedProbs = expLogits.map(e => e / sum);
    
    // Find max for scaling
    const maxProb = Math.max(...adjustedProbs);
    
    adjustedProbs.forEach((prob, index) => {
        const bar = document.createElement('div');
        bar.className = 'temp-bar';
        bar.style.height = `${(prob / maxProb) * 150}px`;
        bar.dataset.label = labels[index];
        
        if (index === 0) {
            bar.classList.add('highlight');
        }
        
        // Color based on probability
        const hue = 200 + (prob * 100); // Blue to purple
        bar.style.background = `linear-gradient(180deg, hsl(${hue}, 70%, 50%) 0%, hsl(${hue}, 70%, 70%) 100%)`;
        
        container.appendChild(bar);
    });
}

function updateTemperatureExplanation(temp) {
    const icon = document.getElementById('tempIcon');
    const desc = document.getElementById('tempDesc');
    
    if (temp < 0.5) {
        icon.textContent = '🎯';
        desc.textContent = 'Very focused and deterministic. Almost always picks the most likely token. Best for factual, consistent outputs.';
    } else if (temp < 0.8) {
        icon.textContent = '📊';
        desc.textContent = 'Mostly predictable with slight variation. Good for structured content that needs some flexibility.';
    } else if (temp < 1.2) {
        icon.textContent = '⚖️';
        desc.textContent = 'Balanced between predictability and creativity. Good default for most tasks.';
    } else if (temp < 1.6) {
        icon.textContent = '🎨';
        desc.textContent = 'More creative and varied outputs. Good for brainstorming and creative writing.';
    } else {
        icon.textContent = '🎲';
        desc.textContent = 'Highly random and unpredictable. Can produce surprising or nonsensical outputs. Use with caution!';
    }
}

// ============================================================================
// Section 4: Interactive Generation
// ============================================================================

function initGeneration() {
    const generateBtn = document.getElementById('generateBtn');
    const autoGenerateBtn = document.getElementById('autoGenerateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const promptInput = document.getElementById('promptInput');
    
    // Initialize
    resetGeneration();
    
    generateBtn.addEventListener('click', () => {
        generateNextToken();
    });
    
    autoGenerateBtn.addEventListener('click', () => {
        autoGenerate(5);
    });
    
    clearBtn.addEventListener('click', () => {
        resetGeneration();
    });
    
    promptInput.addEventListener('change', () => {
        resetGeneration();
    });
}

function resetGeneration() {
    const promptInput = document.getElementById('promptInput');
    const generatedText = document.getElementById('generatedText');
    const miniProbs = document.getElementById('miniProbs');
    
    generatedTokens = simpleTokenize(promptInput.value);
    generatedText.textContent = promptInput.value;
    miniProbs.innerHTML = '';
}

function generateNextToken() {
    const generatedText = document.getElementById('generatedText');
    const miniProbs = document.getElementById('miniProbs');
    
    // Get last token for context
    const lastToken = generatedTokens[generatedTokens.length - 1] || '';
    
    // Get probabilities
    let probs = contextProbabilities[lastToken.toLowerCase()] || contextProbabilities['default'];
    
    // Apply temperature
    const entries = Object.entries(probs);
    const scaledLogits = entries.map(([_, p]) => Math.log(p + 0.001) / currentTemperature);
    const expLogits = scaledLogits.map(l => Math.exp(l));
    const sum = expLogits.reduce((a, b) => a + b, 0);
    const adjustedProbs = entries.map(([token, _], i) => ({
        token,
        prob: expLogits[i] / sum
    }));
    
    // Sort by probability
    adjustedProbs.sort((a, b) => b.prob - a.prob);
    
    // Display mini probabilities
    miniProbs.innerHTML = '';
    adjustedProbs.slice(0, 6).forEach((item, index) => {
        const probItem = document.createElement('div');
        probItem.className = 'mini-prob-item';
        probItem.innerHTML = `
            <span class="prob-token">${item.token}</span>
            <span class="prob-value">${(item.prob * 100).toFixed(1)}%</span>
        `;
        miniProbs.appendChild(probItem);
    });
    
    // Sample token
    const selectedIndex = weightedRandomSelectFromArray(adjustedProbs.map(p => p.prob));
    const selectedToken = adjustedProbs[selectedIndex].token;
    
    // Highlight selected in mini display
    setTimeout(() => {
        const items = miniProbs.querySelectorAll('.mini-prob-item');
        if (items[selectedIndex]) {
            items[selectedIndex].classList.add('selected');
        }
    }, 300);
    
    // Add to generated text
    setTimeout(() => {
        generatedTokens.push(selectedToken);
        
        // Add space if not punctuation
        const separator = /^[.,!?;:'")\-]$/.test(selectedToken) ? '' : ' ';
        
        generatedText.innerHTML += `${separator}<span class="new-token">${selectedToken}</span>`;
    }, 600);
}

function weightedRandomSelectFromArray(probs) {
    const sum = probs.reduce((a, b) => a + b, 0);
    let r = Math.random() * sum;
    
    for (let i = 0; i < probs.length; i++) {
        r -= probs[i];
        if (r <= 0) return i;
    }
    return probs.length - 1;
}

async function autoGenerate(count) {
    for (let i = 0; i < count; i++) {
        generateNextToken();
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}
