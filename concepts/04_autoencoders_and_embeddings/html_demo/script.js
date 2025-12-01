/**
 * Autoencoders & Embeddings - Interactive Demo Script
 * 
 * This demo shows how embeddings represent meaning and how autoencoders
 * compress and reconstruct data.
 */

// Simulated word embeddings (2D for visualization)
const wordEmbeddings = {
    // Royalty
    king: { x: 0.8, y: 0.9, category: 'royalty' },
    queen: { x: 0.75, y: 0.85, category: 'royalty' },
    prince: { x: 0.7, y: 0.95, category: 'royalty' },
    princess: { x: 0.65, y: 0.9, category: 'royalty' },
    // Gender
    man: { x: 0.6, y: 0.7, category: 'people' },
    woman: { x: 0.55, y: 0.65, category: 'people' },
    // Animals
    cat: { x: 0.2, y: 0.3, category: 'animals' },
    dog: { x: 0.25, y: 0.35, category: 'animals' },
    lion: { x: 0.3, y: 0.25, category: 'animals' },
    tiger: { x: 0.35, y: 0.2, category: 'animals' },
    // Food
    apple: { x: 0.15, y: 0.7, category: 'food' },
    banana: { x: 0.2, y: 0.75, category: 'food' },
    pizza: { x: 0.1, y: 0.8, category: 'food' },
    burger: { x: 0.15, y: 0.85, category: 'food' },
    // Places
    paris: { x: 0.9, y: 0.3, category: 'places' },
    france: { x: 0.85, y: 0.25, category: 'places' },
    japan: { x: 0.95, y: 0.35, category: 'places' },
    tokyo: { x: 0.9, y: 0.4, category: 'places' },
    // Verbs
    walking: { x: 0.5, y: 0.1, category: 'verbs' },
    walked: { x: 0.55, y: 0.15, category: 'verbs' },
    running: { x: 0.45, y: 0.05, category: 'verbs' }
};

// Word arithmetic results
const arithmeticResults = {
    'king-man+woman': 'queen',
    'paris-france+japan': 'tokyo',
    'walking-walking+walked': 'walked',
    'queen-woman+man': 'king',
    'prince-man+woman': 'princess'
};

// State
let selectedWords = [];
let autoencoderState = {
    inputGrid: new Array(64).fill(0),
    latentSize: 8,
    isDrawing: false
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    initEmbeddingVisualization();
    initWordArithmetic();
    initAutoencoder();
    initLatentExplorer();
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
// Section 1: Word Embeddings
// ============================================================================

function initEmbeddingVisualization() {
    const canvas = document.getElementById('embeddingPlot');
    const ctx = canvas.getContext('2d');
    const labelsContainer = document.getElementById('wordLabels');
    
    // Draw embedding space
    drawEmbeddingSpace(ctx, canvas.width, canvas.height);
    
    // Create word labels
    createWordLabels(labelsContainer, canvas.width, canvas.height);
    
    // Word button handlers
    document.querySelectorAll('.word-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const word = btn.dataset.word;
            toggleWordSelection(word, btn);
        });
    });
}

function drawEmbeddingSpace(ctx, width, height) {
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
        const x = (i / 10) * width;
        const y = (i / 10) * height;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw category regions (subtle)
    const categories = {
        royalty: { x: 0.7, y: 0.1, color: 'rgba(155, 89, 182, 0.1)' },
        animals: { x: 0.2, y: 0.65, color: 'rgba(230, 126, 34, 0.1)' },
        food: { x: 0.1, y: 0.15, color: 'rgba(39, 174, 96, 0.1)' },
        places: { x: 0.85, y: 0.6, color: 'rgba(52, 152, 219, 0.1)' }
    };
    
    Object.values(categories).forEach(cat => {
        ctx.fillStyle = cat.color;
        ctx.beginPath();
        ctx.arc(cat.x * width, cat.y * height, 80, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw points for each word
    const categoryColors = {
        royalty: '#9B59B6',
        animals: '#E67E22',
        food: '#27AE60',
        places: '#3498DB',
        people: '#E74C3C',
        verbs: '#95A5A6'
    };
    
    Object.entries(wordEmbeddings).forEach(([word, data]) => {
        const x = data.x * width;
        const y = (1 - data.y) * height; // Flip y for canvas
        
        ctx.fillStyle = categoryColors[data.category] || '#666';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    });
}

function createWordLabels(container, width, height) {
    container.innerHTML = '';
    
    Object.entries(wordEmbeddings).forEach(([word, data]) => {
        const label = document.createElement('div');
        label.className = `word-label ${data.category}`;
        label.textContent = word;
        label.dataset.word = word;
        
        const x = data.x * 100;
        const y = (1 - data.y) * 100;
        
        label.style.left = `${x}%`;
        label.style.top = `${y}%`;
        
        label.addEventListener('click', () => {
            toggleWordSelection(word);
        });
        
        container.appendChild(label);
    });
}

function toggleWordSelection(word, btn) {
    const label = document.querySelector(`.word-label[data-word="${word}"]`);
    const button = btn || document.querySelector(`.word-btn[data-word="${word}"]`);
    
    if (selectedWords.includes(word)) {
        selectedWords = selectedWords.filter(w => w !== word);
        if (label) label.classList.remove('selected');
        if (button) button.classList.remove('selected');
    } else {
        if (selectedWords.length >= 2) {
            // Deselect oldest
            const oldWord = selectedWords.shift();
            const oldLabel = document.querySelector(`.word-label[data-word="${oldWord}"]`);
            const oldBtn = document.querySelector(`.word-btn[data-word="${oldWord}"]`);
            if (oldLabel) oldLabel.classList.remove('selected');
            if (oldBtn) oldBtn.classList.remove('selected');
        }
        selectedWords.push(word);
        if (label) label.classList.add('selected');
        if (button) button.classList.add('selected');
    }
    
    updateSimilarityDisplay();
}

function updateSimilarityDisplay() {
    const display = document.getElementById('similarityDisplay');
    
    if (selectedWords.length < 2) {
        display.innerHTML = `
            <h4>Similarity Scores</h4>
            <p class="hint">Select two words to see their similarity</p>
        `;
        return;
    }
    
    const [word1, word2] = selectedWords;
    const emb1 = wordEmbeddings[word1];
    const emb2 = wordEmbeddings[word2];
    
    // Calculate cosine similarity (simplified for 2D)
    const similarity = 1 - Math.sqrt(Math.pow(emb1.x - emb2.x, 2) + Math.pow(emb1.y - emb2.y, 2));
    const normalizedSim = Math.max(0, Math.min(1, similarity));
    
    display.innerHTML = `
        <h4>Similarity: "${word1}" vs "${word2}"</h4>
        <div class="similarity-score">${(normalizedSim * 100).toFixed(1)}%</div>
        <div class="similarity-bar">
            <div class="similarity-fill" style="width: ${normalizedSim * 100}%"></div>
        </div>
        <p>${normalizedSim > 0.7 ? 'Very similar!' : normalizedSim > 0.4 ? 'Somewhat related' : 'Different concepts'}</p>
    `;
}

// ============================================================================
// Section 2: Word Arithmetic
// ============================================================================

function initWordArithmetic() {
    const calculateBtn = document.getElementById('calculateBtn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    calculateBtn.addEventListener('click', calculateWordArithmetic);
    
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('word1').value = btn.dataset.w1;
            document.getElementById('word2').value = btn.dataset.w2;
            document.getElementById('word3').value = btn.dataset.w3;
            calculateWordArithmetic();
        });
    });
    
    // Initialize visualization
    drawArithmeticVisualization();
}

function calculateWordArithmetic() {
    const word1 = document.getElementById('word1').value;
    const word2 = document.getElementById('word2').value;
    const word3 = document.getElementById('word3').value;
    
    const key = `${word1}-${word2}+${word3}`;
    const result = arithmeticResults[key] || findClosestWord(word1, word2, word3);
    
    // Animate result
    const resultEl = document.getElementById('resultWord');
    resultEl.textContent = '...';
    resultEl.style.animation = 'pulse 0.5s ease';
    
    setTimeout(() => {
        resultEl.textContent = result;
        resultEl.style.animation = '';
        drawArithmeticVisualization(word1, word2, word3, result);
    }, 500);
}

function findClosestWord(w1, w2, w3) {
    const emb1 = wordEmbeddings[w1] || { x: 0.5, y: 0.5 };
    const emb2 = wordEmbeddings[w2] || { x: 0.5, y: 0.5 };
    const emb3 = wordEmbeddings[w3] || { x: 0.5, y: 0.5 };
    
    // Calculate target position
    const targetX = emb1.x - emb2.x + emb3.x;
    const targetY = emb1.y - emb2.y + emb3.y;
    
    // Find closest word
    let closest = null;
    let minDist = Infinity;
    
    Object.entries(wordEmbeddings).forEach(([word, emb]) => {
        if (word === w1 || word === w2 || word === w3) return;
        
        const dist = Math.sqrt(Math.pow(emb.x - targetX, 2) + Math.pow(emb.y - targetY, 2));
        if (dist < minDist) {
            minDist = dist;
            closest = word;
        }
    });
    
    return closest || '?';
}

function drawArithmeticVisualization(w1, w2, w3, result) {
    const canvas = document.getElementById('arithmeticPlot');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
        ctx.beginPath();
        ctx.moveTo((i / 8) * width, 0);
        ctx.lineTo((i / 8) * width, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, (i / 8) * height);
        ctx.lineTo(width, (i / 8) * height);
        ctx.stroke();
    }
    
    if (!w1) return;
    
    const emb1 = wordEmbeddings[w1] || { x: 0.5, y: 0.5 };
    const emb2 = wordEmbeddings[w2] || { x: 0.5, y: 0.5 };
    const emb3 = wordEmbeddings[w3] || { x: 0.5, y: 0.5 };
    const embResult = wordEmbeddings[result] || { x: emb1.x - emb2.x + emb3.x, y: emb1.y - emb2.y + emb3.y };
    
    const scale = (v) => ({ x: v.x * width, y: (1 - v.y) * height });
    
    const p1 = scale(emb1);
    const p2 = scale(emb2);
    const p3 = scale(emb3);
    const pR = scale(embResult);
    
    // Draw vectors
    // w1 to w2 (subtraction)
    ctx.strokeStyle = '#E74C3C';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    
    // w2 to w3 (addition direction)
    ctx.strokeStyle = '#27AE60';
    ctx.beginPath();
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();
    
    // Result vector
    ctx.strokeStyle = '#9B59B6';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(pR.x, pR.y);
    ctx.stroke();
    
    // Draw points
    const drawPoint = (p, color, label) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#333';
        ctx.font = '12px sans-serif';
        ctx.fillText(label, p.x + 12, p.y + 4);
    };
    
    drawPoint(p1, '#4A90D9', w1);
    drawPoint(p2, '#E74C3C', w2);
    drawPoint(p3, '#27AE60', w3);
    drawPoint(pR, '#9B59B6', result);
}

// ============================================================================
// Section 3: Autoencoder
// ============================================================================

function initAutoencoder() {
    createPixelGrids();
    initAutoencoderControls();
}

function createPixelGrids() {
    const inputGrid = document.getElementById('inputGrid');
    const outputGrid = document.getElementById('outputGrid');
    
    // Create input grid (drawable)
    for (let i = 0; i < 64; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        pixel.dataset.index = i;
        
        pixel.addEventListener('mousedown', () => {
            autoencoderState.isDrawing = true;
            togglePixel(i, inputGrid);
        });
        
        pixel.addEventListener('mouseenter', () => {
            if (autoencoderState.isDrawing) {
                togglePixel(i, inputGrid);
            }
        });
        
        inputGrid.appendChild(pixel);
    }
    
    document.addEventListener('mouseup', () => {
        autoencoderState.isDrawing = false;
    });
    
    // Create output grid (display only)
    for (let i = 0; i < 64; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        pixel.dataset.index = i;
        outputGrid.appendChild(pixel);
    }
    
    // Create latent vector display
    updateLatentDisplay();
}

function togglePixel(index, grid) {
    autoencoderState.inputGrid[index] = autoencoderState.inputGrid[index] ? 0 : 1;
    const pixel = grid.children[index];
    pixel.classList.toggle('active', autoencoderState.inputGrid[index] === 1);
}

function updateLatentDisplay() {
    const container = document.getElementById('latentVector');
    container.innerHTML = '';
    
    for (let i = 0; i < autoencoderState.latentSize; i++) {
        const value = document.createElement('div');
        value.className = 'latent-value';
        value.dataset.value = '0.0';
        container.appendChild(value);
    }
    
    document.getElementById('latentDimLabel').textContent = `${autoencoderState.latentSize} values`;
}

function initAutoencoderControls() {
    const bottleneckSlider = document.getElementById('bottleneckSize');
    const encodeBtn = document.getElementById('encodeBtn');
    const randomBtn = document.getElementById('randomDigitBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    bottleneckSlider.addEventListener('input', (e) => {
        autoencoderState.latentSize = parseInt(e.target.value);
        document.getElementById('bottleneckValue').textContent = e.target.value;
        updateLatentDisplay();
    });
    
    encodeBtn.addEventListener('click', runAutoencoder);
    
    randomBtn.addEventListener('click', () => {
        // Generate random pattern
        const patterns = [
            // Vertical line
            [0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0],
            // Horizontal line
            [0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0],
            // X pattern
            [1,0,0,0,0,0,0,1, 0,1,0,0,0,0,1,0, 0,0,1,0,0,1,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,1,0,0,1,0,0, 0,1,0,0,0,0,1,0, 1,0,0,0,0,0,0,1],
            // Square
            [0,0,0,0,0,0,0,0, 0,1,1,1,1,1,1,0, 0,1,0,0,0,0,1,0, 0,1,0,0,0,0,1,0, 0,1,0,0,0,0,1,0, 0,1,0,0,0,0,1,0, 0,1,1,1,1,1,1,0, 0,0,0,0,0,0,0,0],
            // Circle-ish
            [0,0,1,1,1,1,0,0, 0,1,0,0,0,0,1,0, 1,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,1, 1,0,0,0,0,0,0,1, 0,1,0,0,0,0,1,0, 0,0,1,1,1,1,0,0]
        ];
        
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        autoencoderState.inputGrid = [...pattern];
        updateInputDisplay();
    });
    
    clearBtn.addEventListener('click', () => {
        autoencoderState.inputGrid = new Array(64).fill(0);
        updateInputDisplay();
        clearOutputDisplay();
    });
}

function updateInputDisplay() {
    const inputGrid = document.getElementById('inputGrid');
    autoencoderState.inputGrid.forEach((val, i) => {
        inputGrid.children[i].classList.toggle('active', val === 1);
    });
}

function clearOutputDisplay() {
    const outputGrid = document.getElementById('outputGrid');
    for (let i = 0; i < 64; i++) {
        outputGrid.children[i].classList.remove('active');
    }
    document.getElementById('reconstructionLoss').textContent = '0.00';
    document.getElementById('lossBar').style.width = '0%';
}

function runAutoencoder() {
    const input = autoencoderState.inputGrid;
    const latentSize = autoencoderState.latentSize;
    
    // Simulate encoding (PCA-like compression)
    const latent = encode(input, latentSize);
    
    // Update latent display with animation
    animateLatentVector(latent);
    
    // Simulate decoding
    setTimeout(() => {
        const output = decode(latent, 64);
        animateReconstruction(output);
        
        // Calculate loss
        const loss = calculateLoss(input, output);
        document.getElementById('reconstructionLoss').textContent = loss.toFixed(3);
        document.getElementById('lossBar').style.width = `${loss * 100}%`;
    }, 800);
}

function encode(input, latentSize) {
    // Simple simulation: average regions
    const latent = [];
    const regionSize = Math.ceil(64 / latentSize);
    
    for (let i = 0; i < latentSize; i++) {
        let sum = 0;
        for (let j = i * regionSize; j < Math.min((i + 1) * regionSize, 64); j++) {
            sum += input[j] || 0;
        }
        latent.push(sum / regionSize);
    }
    
    return latent;
}

function decode(latent, outputSize) {
    // Simple simulation: expand regions
    const output = [];
    const regionSize = Math.ceil(outputSize / latent.length);
    
    for (let i = 0; i < outputSize; i++) {
        const latentIdx = Math.floor(i / regionSize);
        const value = latent[latentIdx] || 0;
        output.push(value > 0.3 ? 1 : 0);
    }
    
    return output;
}

function calculateLoss(input, output) {
    let diff = 0;
    for (let i = 0; i < input.length; i++) {
        diff += Math.abs((input[i] || 0) - (output[i] || 0));
    }
    return diff / input.length;
}

function animateLatentVector(latent) {
    const container = document.getElementById('latentVector');
    const values = container.querySelectorAll('.latent-value');
    
    values.forEach((el, i) => {
        setTimeout(() => {
            const val = latent[i] || 0;
            el.style.background = `linear-gradient(180deg, #9B59B6 ${val * 100}%, #E8DAEF ${val * 100}%)`;
            el.dataset.value = val.toFixed(2);
        }, i * 50);
    });
}

function animateReconstruction(output) {
    const outputGrid = document.getElementById('outputGrid');
    
    output.forEach((val, i) => {
        setTimeout(() => {
            outputGrid.children[i].classList.toggle('active', val === 1);
        }, i * 20);
    });
}

// ============================================================================
// Section 4: Latent Space Explorer
// ============================================================================

function initLatentExplorer() {
    const canvas = document.getElementById('latentSpaceCanvas');
    const cursor = document.getElementById('latentCursor');
    const generatedGrid = document.getElementById('generatedGrid');
    
    // Create generated grid
    for (let i = 0; i < 64; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        generatedGrid.appendChild(pixel);
    }
    
    // Draw latent space background
    drawLatentSpaceBackground(canvas);
    
    // Mouse interaction
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Update cursor position
        cursor.style.left = `${x * 100}%`;
        cursor.style.top = `${y * 100}%`;
        
        // Update coordinates display
        const z1 = (x - 0.5) * 4;
        const z2 = (0.5 - y) * 4;
        document.getElementById('z1Value').textContent = z1.toFixed(2);
        document.getElementById('z2Value').textContent = z2.toFixed(2);
        
        // Generate output
        generateFromLatent(z1, z2, generatedGrid);
    });
    
    // Initialize interpolation
    initInterpolation();
}

function drawLatentSpaceBackground(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Gradient background representing latent space
    for (let x = 0; x < width; x += 10) {
        for (let y = 0; y < height; y += 10) {
            const z1 = (x / width - 0.5) * 4;
            const z2 = (0.5 - y / height) * 4;
            
            // Color based on position
            const r = Math.floor(128 + z1 * 30);
            const g = Math.floor(128 + z2 * 30);
            const b = Math.floor(180 + (z1 + z2) * 20);
            
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, y, 10, 10);
        }
    }
    
    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 6; i++) {
        const pos = (i / 6) * width;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(width, pos);
        ctx.stroke();
    }
    
    // Center crosshair
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
}

function generateFromLatent(z1, z2, grid) {
    // Generate pattern based on latent coordinates
    const pattern = [];
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            // Different patterns based on z1, z2
            let value = 0;
            
            // Vertical tendency from z1
            if (z1 > 0.5 && col >= 3 && col <= 4) value = 1;
            if (z1 < -0.5 && (col <= 1 || col >= 6)) value = 1;
            
            // Horizontal tendency from z2
            if (z2 > 0.5 && row >= 3 && row <= 4) value = 1;
            if (z2 < -0.5 && (row <= 1 || row >= 6)) value = 1;
            
            // Diagonal from combined
            if (Math.abs(z1) < 0.5 && Math.abs(z2) < 0.5) {
                if (row === col || row === 7 - col) value = 1;
            }
            
            pattern.push(value);
        }
    }
    
    // Update grid
    pattern.forEach((val, i) => {
        grid.children[i].classList.toggle('active', val === 1);
    });
}

function initInterpolation() {
    const slider = document.getElementById('interpolationSlider');
    const framesContainer = document.getElementById('interpolationFrames');
    
    // Create interpolation frames
    const numFrames = 7;
    for (let i = 0; i < numFrames; i++) {
        const frame = document.createElement('div');
        frame.className = 'interp-frame';
        frame.dataset.index = i;
        
        for (let j = 0; j < 64; j++) {
            const pixel = document.createElement('div');
            pixel.className = 'interp-pixel';
            frame.appendChild(pixel);
        }
        
        framesContainer.appendChild(frame);
    }
    
    // Generate initial interpolation
    updateInterpolation(50);
    
    slider.addEventListener('input', (e) => {
        updateInterpolation(parseInt(e.target.value));
    });
}

function updateInterpolation(sliderValue) {
    const frames = document.querySelectorAll('.interp-frame');
    const numFrames = frames.length;
    
    // Point A: vertical line, Point B: horizontal line
    const patternA = [0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0, 0,0,0,1,1,0,0,0];
    const patternB = [0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0];
    
    frames.forEach((frame, frameIdx) => {
        const alpha = frameIdx / (numFrames - 1);
        const pixels = frame.querySelectorAll('.interp-pixel');
        
        pixels.forEach((pixel, i) => {
            // Interpolate between patterns
            const valA = patternA[i];
            const valB = patternB[i];
            const interpolated = valA * (1 - alpha) + valB * alpha;
            
            pixel.classList.toggle('active', interpolated > 0.5);
        });
        
        // Highlight current frame based on slider
        const currentFrame = Math.round((sliderValue / 100) * (numFrames - 1));
        frame.classList.toggle('active', frameIdx === currentFrame);
    });
}
