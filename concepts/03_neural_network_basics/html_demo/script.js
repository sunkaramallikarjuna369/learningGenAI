/**
 * Neural Network Basics - Interactive Demo Script
 * 
 * This demo shows how neural networks process information through layers,
 * learn from data, and use activation functions.
 */

// Role-based applications data
const roleApplications = {
    healthcare: {
        title: 'Healthcare Applications',
        apps: [
            { name: 'Medical Image Analysis', desc: 'Detecting tumors, fractures, and abnormalities in X-rays, MRIs, and CT scans' },
            { name: 'Drug Discovery', desc: 'Predicting molecular interactions and identifying potential drug candidates' },
            { name: 'Patient Risk Assessment', desc: 'Predicting patient outcomes and readmission risks' },
            { name: 'ECG Analysis', desc: 'Detecting heart arrhythmias and cardiac conditions from ECG signals' }
        ]
    },
    finance: {
        title: 'Finance Applications',
        apps: [
            { name: 'Fraud Detection', desc: 'Identifying suspicious transactions and fraudulent activities in real-time' },
            { name: 'Credit Scoring', desc: 'Assessing creditworthiness based on multiple financial factors' },
            { name: 'Algorithmic Trading', desc: 'Making split-second trading decisions based on market patterns' },
            { name: 'Risk Management', desc: 'Predicting market volatility and portfolio risks' }
        ]
    },
    retail: {
        title: 'Retail Applications',
        apps: [
            { name: 'Recommendation Systems', desc: 'Suggesting products based on browsing and purchase history' },
            { name: 'Demand Forecasting', desc: 'Predicting inventory needs and seasonal trends' },
            { name: 'Customer Segmentation', desc: 'Grouping customers by behavior for targeted marketing' },
            { name: 'Price Optimization', desc: 'Dynamic pricing based on demand, competition, and inventory' }
        ]
    },
    manufacturing: {
        title: 'Manufacturing Applications',
        apps: [
            { name: 'Predictive Maintenance', desc: 'Forecasting equipment failures before they occur' },
            { name: 'Quality Control', desc: 'Detecting defects in products using computer vision' },
            { name: 'Supply Chain Optimization', desc: 'Optimizing logistics and reducing waste' },
            { name: 'Process Optimization', desc: 'Fine-tuning manufacturing parameters for efficiency' }
        ]
    }
};

// 3D Network visualization state
let network3D = {
    mini3d: null,
    rotationY: 0,
    autoRotate: false,
    signalProgress: 0,
    isAnimating: false,
    layers: [4, 6, 6, 4, 2],
    nodePositions: []
};

// State
let networkState = {
    currentStep: 0,
    isPlaying: false,
    speed: 1
};

let trainingState = {
    epoch: 0,
    loss: 1.0,
    lossHistory: [],
    isTraining: false
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    init3DNetwork();
    initRoleApplications();
    initSingleNeuron();
    initNetworkVisualization();
    initLearningDemo();
    initActivationFunctions();
});

// ============================================================================
// 3D Neural Network Visualization
// ============================================================================

function init3DNetwork() {
    const canvas = document.getElementById('network3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    network3D.mini3d = new Mini3D(canvas);
    
    // Calculate node positions for each layer
    calculateNodePositions();
    
    // Set up controls
    document.getElementById('rotateLeftBtn')?.addEventListener('click', () => {
        network3D.rotationY -= 0.3;
        render3DNetwork();
    });
    
    document.getElementById('rotateRightBtn')?.addEventListener('click', () => {
        network3D.rotationY += 0.3;
        render3DNetwork();
    });
    
    document.getElementById('pulseSignalBtn')?.addEventListener('click', () => {
        if (!network3D.isAnimating) {
            network3D.signalProgress = 0;
            network3D.isAnimating = true;
            animateSignalPulse();
        }
    });
    
    // Initial render
    render3DNetwork();
}

function calculateNodePositions() {
    network3D.nodePositions = [];
    const layerSpacing = 120;
    const startX = -((network3D.layers.length - 1) * layerSpacing) / 2;
    
    network3D.layers.forEach((nodeCount, layerIndex) => {
        const layerPositions = [];
        const nodeSpacing = 60;
        const startY = -((nodeCount - 1) * nodeSpacing) / 2;
        
        for (let i = 0; i < nodeCount; i++) {
            layerPositions.push({
                x: startX + layerIndex * layerSpacing,
                y: startY + i * nodeSpacing,
                z: 0
            });
        }
        network3D.nodePositions.push(layerPositions);
    });
}

function render3DNetwork() {
    const mini3d = network3D.mini3d;
    if (!mini3d) return;
    
    mini3d.clear();
    mini3d.setRotation(0, network3D.rotationY, 0);
    
    const centerX = mini3d.canvas.width / 2;
    const centerY = mini3d.canvas.height / 2;
    
    // Draw connections first (behind nodes)
    for (let l = 0; l < network3D.nodePositions.length - 1; l++) {
        const currentLayer = network3D.nodePositions[l];
        const nextLayer = network3D.nodePositions[l + 1];
        
        currentLayer.forEach((fromNode, fromIdx) => {
            nextLayer.forEach((toNode, toIdx) => {
                const from3D = mini3d.rotatePoint(fromNode.x, fromNode.y, fromNode.z);
                const to3D = mini3d.rotatePoint(toNode.x, toNode.y, toNode.z);
                
                const fromProj = mini3d.project(from3D.x + centerX, from3D.y + centerY, from3D.z);
                const toProj = mini3d.project(to3D.x + centerX, to3D.y + centerY, to3D.z);
                
                // Determine if this connection should be highlighted
                let alpha = 0.15;
                let color = '#4A90D9';
                
                if (network3D.isAnimating) {
                    const connectionProgress = l / (network3D.layers.length - 1);
                    if (network3D.signalProgress > connectionProgress && 
                        network3D.signalProgress < connectionProgress + 0.3) {
                        alpha = 0.8;
                        color = '#50C878';
                    }
                }
                
                mini3d.ctx.strokeStyle = color;
                mini3d.ctx.globalAlpha = alpha;
                mini3d.ctx.lineWidth = 1;
                mini3d.ctx.beginPath();
                mini3d.ctx.moveTo(fromProj.x, fromProj.y);
                mini3d.ctx.lineTo(toProj.x, toProj.y);
                mini3d.ctx.stroke();
            });
        });
    }
    
    mini3d.ctx.globalAlpha = 1;
    
    // Draw nodes
    const layerColors = ['#4A90D9', '#9B59B6', '#9B59B6', '#9B59B6', '#50C878'];
    const layerLabels = ['Input', 'Hidden 1', 'Hidden 2', 'Hidden 3', 'Output'];
    
    network3D.nodePositions.forEach((layer, layerIndex) => {
        layer.forEach((node, nodeIndex) => {
            const rotated = mini3d.rotatePoint(node.x, node.y, node.z);
            const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
            
            // Determine node state
            let nodeColor = layerColors[layerIndex] || '#4A90D9';
            let nodeSize = 12 * proj.scale;
            
            if (network3D.isAnimating) {
                const layerProgress = layerIndex / (network3D.layers.length - 1);
                if (Math.abs(network3D.signalProgress - layerProgress) < 0.15) {
                    nodeColor = '#FFB347';
                    nodeSize = 16 * proj.scale;
                }
            }
            
            // Draw node glow
            const gradient = mini3d.ctx.createRadialGradient(
                proj.x, proj.y, 0,
                proj.x, proj.y, nodeSize * 2
            );
            gradient.addColorStop(0, nodeColor);
            gradient.addColorStop(1, 'transparent');
            
            mini3d.ctx.fillStyle = gradient;
            mini3d.ctx.beginPath();
            mini3d.ctx.arc(proj.x, proj.y, nodeSize * 2, 0, Math.PI * 2);
            mini3d.ctx.fill();
            
            // Draw node
            mini3d.ctx.fillStyle = nodeColor;
            mini3d.ctx.beginPath();
            mini3d.ctx.arc(proj.x, proj.y, nodeSize, 0, Math.PI * 2);
            mini3d.ctx.fill();
            
            mini3d.ctx.strokeStyle = '#fff';
            mini3d.ctx.lineWidth = 2;
            mini3d.ctx.stroke();
        });
        
        // Draw layer label
        if (layer.length > 0) {
            const firstNode = layer[0];
            const rotated = mini3d.rotatePoint(firstNode.x, firstNode.y - 50, firstNode.z);
            const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY - 80, rotated.z);
            
            mini3d.ctx.fillStyle = '#fff';
            mini3d.ctx.font = '14px Arial';
            mini3d.ctx.textAlign = 'center';
            mini3d.ctx.fillText(layerLabels[layerIndex] || `Layer ${layerIndex}`, proj.x, proj.y);
        }
    });
}

function animateSignalPulse() {
    if (!network3D.isAnimating) return;
    
    network3D.signalProgress += 0.02;
    render3DNetwork();
    
    if (network3D.signalProgress < 1.3) {
        requestAnimationFrame(animateSignalPulse);
    } else {
        network3D.isAnimating = false;
        network3D.signalProgress = 0;
        render3DNetwork();
    }
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
    
    // Initialize with first role
    updateApplications('healthcare');
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
// Section 1: Single Neuron
// ============================================================================

function initSingleNeuron() {
    const sliders = document.querySelectorAll('.input-slider');
    const weights = [0.6, 0.4, 0.9];
    const bias = 0.1;
    
    sliders.forEach((slider, index) => {
        slider.addEventListener('input', () => {
            updateNeuronOutput(weights, bias);
        });
    });
    
    // Initial calculation
    updateNeuronOutput(weights, bias);
}

function updateNeuronOutput(weights, bias) {
    const sliders = document.querySelectorAll('.input-slider');
    const inputs = Array.from(sliders).map(s => parseFloat(s.value));
    
    // Update input value displays
    sliders.forEach((slider, index) => {
        const valueDisplay = slider.parentElement.querySelector('.input-value');
        valueDisplay.textContent = inputs[index].toFixed(1);
    });
    
    // Calculate weighted sum
    let weightedSum = 0;
    for (let i = 0; i < inputs.length; i++) {
        weightedSum += inputs[i] * weights[i];
    }
    
    // Add bias
    const preActivation = weightedSum + bias;
    
    // Apply ReLU activation
    const output = Math.max(0, preActivation);
    
    // Update displays
    document.getElementById('weightedSum').textContent = weightedSum.toFixed(2);
    document.getElementById('activationOutput').textContent = output.toFixed(2);
    document.getElementById('outputValue').textContent = output.toFixed(2);
    
    // Update output bar (scale to percentage, max ~2)
    const barWidth = Math.min(100, (output / 2) * 100);
    document.getElementById('outputBar').style.width = `${barWidth}%`;
    
    // Update neuron circle state
    const neuronCircle = document.querySelector('.neuron-circle');
    if (output > 0) {
        neuronCircle.classList.add('active');
    } else {
        neuronCircle.classList.remove('active');
    }
    
    // Animate weight lines based on input values
    const weightLines = document.querySelectorAll('.weight-line');
    weightLines.forEach((line, index) => {
        const intensity = inputs[index];
        line.style.opacity = 0.3 + intensity * 0.7;
    });
}

// ============================================================================
// Section 2: Network Visualization
// ============================================================================

function initNetworkVisualization() {
    const networkConfig = {
        layers: [
            { name: 'Input', nodes: 4, type: 'input-layer' },
            { name: 'Hidden 1', nodes: 5, type: 'hidden-layer' },
            { name: 'Hidden 2', nodes: 4, type: 'hidden-layer' },
            { name: 'Output', nodes: 2, type: 'output-layer' }
        ]
    };
    
    createNetworkVisualization(networkConfig);
    initNetworkControls();
}

function createNetworkVisualization(config) {
    const container = document.getElementById('networkLayers');
    const svg = document.getElementById('networkSvg');
    container.innerHTML = '';
    
    // Create layers
    config.layers.forEach((layer, layerIndex) => {
        const layerDiv = document.createElement('div');
        layerDiv.className = 'network-layer';
        layerDiv.dataset.layer = layerIndex;
        
        const label = document.createElement('div');
        label.className = 'layer-label';
        label.textContent = layer.name;
        layerDiv.appendChild(label);
        
        for (let i = 0; i < layer.nodes; i++) {
            const node = document.createElement('div');
            node.className = `network-node ${layer.type}`;
            node.dataset.layer = layerIndex;
            node.dataset.node = i;
            node.textContent = layerIndex === 0 ? `x${i+1}` : 
                              layerIndex === config.layers.length - 1 ? `y${i+1}` : '';
            layerDiv.appendChild(node);
        }
        
        container.appendChild(layerDiv);
    });
    
    // Draw connections after a short delay to ensure layout is complete
    setTimeout(() => drawConnections(config), 100);
}

function drawConnections(config) {
    const svg = document.getElementById('networkSvg');
    const container = document.getElementById('networkLayers');
    svg.innerHTML = '';
    
    const containerRect = container.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    
    for (let l = 0; l < config.layers.length - 1; l++) {
        const currentLayerNodes = container.querySelectorAll(`[data-layer="${l}"].network-node`);
        const nextLayerNodes = container.querySelectorAll(`[data-layer="${l + 1}"].network-node`);
        
        currentLayerNodes.forEach((fromNode, fromIndex) => {
            nextLayerNodes.forEach((toNode, toIndex) => {
                const fromRect = fromNode.getBoundingClientRect();
                const toRect = toNode.getBoundingClientRect();
                
                const x1 = fromRect.right - svgRect.left;
                const y1 = fromRect.top + fromRect.height / 2 - svgRect.top;
                const x2 = toRect.left - svgRect.left;
                const y2 = toRect.top + toRect.height / 2 - svgRect.top;
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.dataset.fromLayer = l;
                line.dataset.fromNode = fromIndex;
                line.dataset.toLayer = l + 1;
                line.dataset.toNode = toIndex;
                
                svg.appendChild(line);
            });
        });
    }
}

function initNetworkControls() {
    const playBtn = document.getElementById('playNetworkBtn');
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const resetBtn = document.getElementById('resetNetworkBtn');
    const speedSlider = document.getElementById('speedSlider');
    
    const steps = [
        { name: 'Input Layer', description: 'Data enters the network through input nodes' },
        { name: 'First Hidden Layer', description: 'Input is transformed by the first hidden layer' },
        { name: 'Second Hidden Layer', description: 'Further processing in the second hidden layer' },
        { name: 'Output Layer', description: 'Final predictions are produced' },
        { name: 'Complete', description: 'Forward pass complete!' }
    ];
    
    playBtn.addEventListener('click', () => {
        if (networkState.isPlaying) {
            networkState.isPlaying = false;
            playBtn.textContent = '▶';
            playBtn.classList.remove('pause');
        } else {
            networkState.isPlaying = true;
            playBtn.textContent = '⏸';
            playBtn.classList.add('pause');
            autoPlayNetwork(steps);
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (networkState.currentStep > 0) {
            networkState.currentStep--;
            animateNetworkStep(networkState.currentStep, steps);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (networkState.currentStep < steps.length - 1) {
            networkState.currentStep++;
            animateNetworkStep(networkState.currentStep, steps);
        }
    });
    
    resetBtn.addEventListener('click', () => {
        networkState.currentStep = 0;
        networkState.isPlaying = false;
        playBtn.textContent = '▶';
        playBtn.classList.remove('pause');
        resetNetworkAnimation();
        updateStepIndicator(0, steps);
    });
    
    speedSlider.addEventListener('input', (e) => {
        networkState.speed = parseFloat(e.target.value);
    });
    
    // Initialize
    updateStepIndicator(0, steps);
}

function autoPlayNetwork(steps) {
    if (!networkState.isPlaying) return;
    
    if (networkState.currentStep < steps.length - 1) {
        networkState.currentStep++;
        animateNetworkStep(networkState.currentStep, steps);
        
        setTimeout(() => autoPlayNetwork(steps), 1500 / networkState.speed);
    } else {
        networkState.isPlaying = false;
        document.getElementById('playNetworkBtn').textContent = '▶';
        document.getElementById('playNetworkBtn').classList.remove('pause');
    }
}

function animateNetworkStep(step, steps) {
    const nodes = document.querySelectorAll('.network-node');
    const lines = document.querySelectorAll('#networkSvg line');
    
    // Reset all
    nodes.forEach(n => {
        n.classList.remove('active', 'processing');
    });
    lines.forEach(l => {
        l.classList.remove('active', 'signal');
    });
    
    // Activate based on step
    if (step >= 1) {
        // Activate input layer
        document.querySelectorAll('[data-layer="0"].network-node').forEach(n => {
            n.classList.add('active');
        });
    }
    
    if (step >= 2) {
        // Activate connections to first hidden layer
        document.querySelectorAll('line[data-from-layer="0"]').forEach(l => {
            l.classList.add('active');
        });
        document.querySelectorAll('[data-layer="1"].network-node').forEach(n => {
            n.classList.add('active');
        });
    }
    
    if (step >= 3) {
        // Activate connections to second hidden layer
        document.querySelectorAll('line[data-from-layer="1"]').forEach(l => {
            l.classList.add('active');
        });
        document.querySelectorAll('[data-layer="2"].network-node').forEach(n => {
            n.classList.add('active');
        });
    }
    
    if (step >= 4) {
        // Activate output layer
        document.querySelectorAll('line[data-from-layer="2"]').forEach(l => {
            l.classList.add('active');
        });
        document.querySelectorAll('[data-layer="3"].network-node').forEach(n => {
            n.classList.add('active');
        });
    }
    
    // Show signal animation for current step
    if (step > 0 && step <= 4) {
        const fromLayer = step - 1;
        document.querySelectorAll(`line[data-from-layer="${fromLayer}"]`).forEach(l => {
            l.classList.add('signal');
        });
        document.querySelectorAll(`[data-layer="${step - 1}"].network-node`).forEach(n => {
            n.classList.add('processing');
        });
    }
    
    updateStepIndicator(step, steps);
}

function resetNetworkAnimation() {
    const nodes = document.querySelectorAll('.network-node');
    const lines = document.querySelectorAll('#networkSvg line');
    
    nodes.forEach(n => {
        n.classList.remove('active', 'processing');
    });
    lines.forEach(l => {
        l.classList.remove('active', 'signal');
    });
}

function updateStepIndicator(step, steps) {
    const indicator = document.getElementById('networkStepIndicator');
    indicator.innerHTML = `<span class="step-text">Step ${step + 1} of ${steps.length}: ${steps[step].name}</span>`;
}

// ============================================================================
// Section 3: Learning Demo
// ============================================================================

function initLearningDemo() {
    const trainStepBtn = document.getElementById('trainStepBtn');
    const trainAutoBtn = document.getElementById('trainAutoBtn');
    const resetTrainBtn = document.getElementById('resetTrainBtn');
    
    // Initialize loss chart
    initLossChart();
    
    trainStepBtn.addEventListener('click', () => {
        trainOneStep();
    });
    
    trainAutoBtn.addEventListener('click', () => {
        if (trainingState.isTraining) {
            trainingState.isTraining = false;
            trainAutoBtn.textContent = 'Auto Train';
        } else {
            trainingState.isTraining = true;
            trainAutoBtn.textContent = 'Stop';
            autoTrain();
        }
    });
    
    resetTrainBtn.addEventListener('click', () => {
        resetTraining();
    });
    
    // Initialize display
    updateTrainingDisplay();
}

function initLossChart() {
    const canvas = document.getElementById('lossCanvas');
    const ctx = canvas.getContext('2d');
    
    // Draw axes
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 10);
    ctx.lineTo(30, 130);
    ctx.lineTo(290, 130);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    ctx.fillText('Loss', 5, 20);
    ctx.fillText('Epochs', 250, 145);
}

function trainOneStep() {
    if (trainingState.epoch >= 100) return;
    
    trainingState.epoch++;
    
    // Simulate loss decrease with some noise
    const baseLoss = Math.exp(-trainingState.epoch / 25);
    const noise = (Math.random() - 0.5) * 0.1 * baseLoss;
    trainingState.loss = Math.max(0.01, baseLoss + noise);
    trainingState.lossHistory.push(trainingState.loss);
    
    updateTrainingDisplay();
    drawLossChart();
}

function autoTrain() {
    if (!trainingState.isTraining || trainingState.epoch >= 100) {
        trainingState.isTraining = false;
        document.getElementById('trainAutoBtn').textContent = 'Auto Train';
        return;
    }
    
    trainOneStep();
    setTimeout(autoTrain, 100);
}

function resetTraining() {
    trainingState.epoch = 0;
    trainingState.loss = 1.0;
    trainingState.lossHistory = [];
    trainingState.isTraining = false;
    document.getElementById('trainAutoBtn').textContent = 'Auto Train';
    
    // Clear chart
    const canvas = document.getElementById('lossCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initLossChart();
    
    updateTrainingDisplay();
}

function updateTrainingDisplay() {
    document.getElementById('epochNumber').textContent = trainingState.epoch;
    document.getElementById('errorValue').textContent = `${(trainingState.loss * 100).toFixed(1)}%`;
    document.getElementById('errorBar').style.width = `${trainingState.loss * 100}%`;
    
    // Update prediction display based on training progress
    const predictionDisplay = document.getElementById('predictionDisplay');
    const predictionLabel = document.getElementById('predictionLabel');
    
    if (trainingState.loss > 0.7) {
        predictionDisplay.textContent = '?';
        predictionLabel.textContent = 'Unknown';
    } else if (trainingState.loss > 0.4) {
        predictionDisplay.textContent = '🐕';
        predictionLabel.textContent = 'Dog (wrong)';
    } else if (trainingState.loss > 0.15) {
        predictionDisplay.textContent = '🐱?';
        predictionLabel.textContent = 'Maybe Cat';
    } else {
        predictionDisplay.textContent = '🐱';
        predictionLabel.textContent = 'Cat (correct!)';
    }
}

function drawLossChart() {
    const canvas = document.getElementById('lossCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear and redraw axes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initLossChart();
    
    if (trainingState.lossHistory.length < 2) return;
    
    // Draw loss curve
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const xScale = 260 / 100; // 100 epochs across 260 pixels
    const yScale = 110; // Loss 0-1 across 110 pixels
    
    trainingState.lossHistory.forEach((loss, i) => {
        const x = 30 + i * xScale;
        const y = 130 - loss * yScale;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw current point
    const lastIndex = trainingState.lossHistory.length - 1;
    const lastX = 30 + lastIndex * xScale;
    const lastY = 130 - trainingState.lossHistory[lastIndex] * yScale;
    
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fill();
}

// ============================================================================
// Section 4: Activation Functions
// ============================================================================

function initActivationFunctions() {
    const buttons = document.querySelectorAll('.activation-btn');
    const inputSlider = document.getElementById('activationInput');
    
    let currentFunction = 'relu';
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFunction = btn.dataset.fn;
            updateActivationDisplay(currentFunction, parseFloat(inputSlider.value));
            drawActivationGraph(currentFunction, parseFloat(inputSlider.value));
        });
    });
    
    inputSlider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        document.getElementById('activationInputValue').textContent = value.toFixed(1);
        updateActivationDisplay(currentFunction, value);
        drawActivationGraph(currentFunction, value);
    });
    
    // Initialize
    drawActivationGraph('relu', 0);
    updateActivationDisplay('relu', 0);
}

function activationFunctions(fn, x) {
    switch (fn) {
        case 'relu':
            return Math.max(0, x);
        case 'sigmoid':
            return 1 / (1 + Math.exp(-x));
        case 'tanh':
            return Math.tanh(x);
        case 'linear':
            return x;
        default:
            return x;
    }
}

function getActivationFormula(fn) {
    switch (fn) {
        case 'relu':
            return 'f(x) = max(0, x)';
        case 'sigmoid':
            return 'f(x) = 1 / (1 + e^(-x))';
        case 'tanh':
            return 'f(x) = (e^x - e^(-x)) / (e^x + e^(-x))';
        case 'linear':
            return 'f(x) = x';
        default:
            return '';
    }
}

function updateActivationDisplay(fn, x) {
    const output = activationFunctions(fn, x);
    document.getElementById('activationOutputValue').textContent = output.toFixed(3);
    document.getElementById('activationFormula').textContent = getActivationFormula(fn);
}

function drawActivationGraph(fn, currentX) {
    const canvas = document.getElementById('activationGraph');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
        const x = (i / 10) * width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 6; i++) {
        const y = (i / 6) * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    
    // X axis (y = 0)
    const yZero = height / 2;
    ctx.beginPath();
    ctx.moveTo(0, yZero);
    ctx.lineTo(width, yZero);
    ctx.stroke();
    
    // Y axis (x = 0)
    const xZero = width / 2;
    ctx.beginPath();
    ctx.moveTo(xZero, 0);
    ctx.lineTo(xZero, height);
    ctx.stroke();
    
    // Draw function
    ctx.strokeStyle = '#4A90D9';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const xMin = -5;
    const xMax = 5;
    const yMin = fn === 'linear' ? -5 : -1.5;
    const yMax = fn === 'linear' ? 5 : 1.5;
    
    for (let px = 0; px < width; px++) {
        const x = xMin + (px / width) * (xMax - xMin);
        const y = activationFunctions(fn, x);
        
        // Clamp y for display
        const clampedY = Math.max(yMin, Math.min(yMax, y));
        
        const py = height - ((clampedY - yMin) / (yMax - yMin)) * height;
        
        if (px === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.stroke();
    
    // Draw current point
    const currentY = activationFunctions(fn, currentX);
    const clampedCurrentY = Math.max(yMin, Math.min(yMax, currentY));
    
    const pointX = ((currentX - xMin) / (xMax - xMin)) * width;
    const pointY = height - ((clampedCurrentY - yMin) / (yMax - yMin)) * height;
    
    // Vertical line to point
    ctx.strokeStyle = '#50C878';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pointX, yZero);
    ctx.lineTo(pointX, pointY);
    ctx.stroke();
    
    // Horizontal line to point
    ctx.beginPath();
    ctx.moveTo(xZero, pointY);
    ctx.lineTo(pointX, pointY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw point
    ctx.fillStyle = '#50C878';
    ctx.beginPath();
    ctx.arc(pointX, pointY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.fillText('-5', 5, yZero + 15);
    ctx.fillText('5', width - 15, yZero + 15);
    ctx.fillText('x', width - 10, yZero - 5);
    ctx.fillText('f(x)', xZero + 5, 15);
}
