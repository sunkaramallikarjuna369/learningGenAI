/**
 * Generative AI 360° - Animation Controller Toolkit
 * 
 * A reusable animation framework for educational GenAI demos.
 * Provides step-based animations, controls, and common visualization components.
 */

// ============================================================================
// Demo Controller - Main animation state machine
// ============================================================================

class DemoController {
    constructor(options = {}) {
        this.steps = options.steps || [];
        this.currentStep = 0;
        this.isPlaying = false;
        this.playSpeed = options.playSpeed || 2000; // ms between steps
        this.onStepChange = options.onStepChange || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.playInterval = null;
        
        this.init();
    }
    
    init() {
        this.bindControls();
        this.updateStepIndicator();
        this.renderCurrentStep();
    }
    
    bindControls() {
        // Play/Pause button
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }
        
        // Step forward
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }
        
        // Step backward
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevStep());
        }
        
        // Reset
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
        
        // Speed slider
        const speedSlider = document.getElementById('speedSlider');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.playSpeed = 3000 - (e.target.value * 25); // Invert: higher = faster
                const speedValue = document.getElementById('speedValue');
                if (speedValue) {
                    speedValue.textContent = `${(3000 / this.playSpeed).toFixed(1)}x`;
                }
            });
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.isPlaying = true;
        this.updatePlayButton();
        
        this.playInterval = setInterval(() => {
            if (this.currentStep < this.steps.length - 1) {
                this.nextStep();
            } else {
                this.pause();
                this.onComplete();
            }
        }, this.playSpeed);
    }
    
    pause() {
        this.isPlaying = false;
        this.updatePlayButton();
        
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }
    
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.renderCurrentStep();
            this.updateStepIndicator();
        }
    }
    
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderCurrentStep();
            this.updateStepIndicator();
        }
    }
    
    goToStep(index) {
        if (index >= 0 && index < this.steps.length) {
            this.currentStep = index;
            this.renderCurrentStep();
            this.updateStepIndicator();
        }
    }
    
    reset() {
        this.pause();
        this.currentStep = 0;
        this.renderCurrentStep();
        this.updateStepIndicator();
    }
    
    renderCurrentStep() {
        const step = this.steps[this.currentStep];
        if (step && step.render) {
            step.render();
        }
        this.onStepChange(this.currentStep, step);
        
        // Update explanation
        const explanation = document.getElementById('stepExplanation');
        if (explanation && step && step.explanation) {
            explanation.innerHTML = step.explanation;
        }
    }
    
    updateStepIndicator() {
        const indicator = document.getElementById('stepIndicator');
        if (!indicator) return;
        
        indicator.innerHTML = '';
        this.steps.forEach((step, index) => {
            const dot = document.createElement('div');
            dot.className = 'step-dot';
            if (index === this.currentStep) {
                dot.classList.add('active');
            } else if (index < this.currentStep) {
                dot.classList.add('completed');
            }
            dot.addEventListener('click', () => this.goToStep(index));
            dot.title = step.title || `Step ${index + 1}`;
            indicator.appendChild(dot);
        });
    }
    
    updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.innerHTML = this.isPlaying ? '⏸' : '▶';
            playBtn.title = this.isPlaying ? 'Pause' : 'Play';
        }
    }
}


// ============================================================================
// Token Visualizer - For tokenization and probability demos
// ============================================================================

class TokenVisualizer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tokens = [];
        this.probabilities = {};
    }
    
    setText(text, tokenize = true) {
        this.container.innerHTML = '';
        
        if (tokenize) {
            // Simple word-level tokenization for demo
            this.tokens = this.simpleTokenize(text);
        } else {
            this.tokens = [text];
        }
        
        this.tokens.forEach((token, index) => {
            const tokenEl = document.createElement('span');
            tokenEl.className = 'token';
            tokenEl.textContent = token;
            tokenEl.dataset.index = index;
            tokenEl.style.animationDelay = `${index * 0.1}s`;
            this.container.appendChild(tokenEl);
        });
    }
    
    simpleTokenize(text) {
        // Split on spaces and punctuation, keeping punctuation as separate tokens
        return text.match(/[\w]+|[^\s\w]/g) || [];
    }
    
    highlightToken(index) {
        const tokens = this.container.querySelectorAll('.token');
        tokens.forEach((t, i) => {
            t.classList.remove('highlight');
            if (i === index) {
                t.classList.add('highlight');
            }
        });
    }
    
    addToken(text, isNew = true) {
        const tokenEl = document.createElement('span');
        tokenEl.className = 'token';
        if (isNew) tokenEl.classList.add('new');
        tokenEl.textContent = text;
        this.container.appendChild(tokenEl);
        this.tokens.push(text);
    }
    
    animateTokenization(text, callback) {
        const words = text.split(' ');
        this.container.innerHTML = '';
        
        let index = 0;
        const interval = setInterval(() => {
            if (index < words.length) {
                const tokenEl = document.createElement('span');
                tokenEl.className = 'token';
                tokenEl.textContent = words[index];
                tokenEl.style.animation = 'tokenPop 0.3s ease forwards';
                this.container.appendChild(tokenEl);
                index++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 200);
    }
}


// ============================================================================
// Probability Bar Chart - For next-token prediction visualization
// ============================================================================

class ProbabilityChart {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = [];
    }
    
    setData(data) {
        // data = [{label: 'token', probability: 0.5}, ...]
        this.data = data.sort((a, b) => b.probability - a.probability);
        this.render();
    }
    
    render() {
        this.container.innerHTML = '';
        
        this.data.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'prob-bar-row';
            
            const label = document.createElement('span');
            label.className = 'prob-bar-label';
            label.textContent = item.label;
            
            const track = document.createElement('div');
            track.className = 'prob-bar-track';
            
            const fill = document.createElement('div');
            fill.className = 'prob-bar-fill';
            fill.style.width = '0%';
            
            track.appendChild(fill);
            row.appendChild(label);
            row.appendChild(track);
            this.container.appendChild(row);
            
            // Animate bar growth
            setTimeout(() => {
                fill.style.width = `${item.probability * 100}%`;
                fill.textContent = `${(item.probability * 100).toFixed(1)}%`;
            }, index * 100);
        });
    }
    
    highlightBar(index) {
        const fills = this.container.querySelectorAll('.prob-bar-fill');
        fills.forEach((f, i) => {
            f.classList.remove('selected');
            if (i === index) {
                f.classList.add('selected');
            }
        });
    }
    
    applyTemperature(temperature) {
        // Simulate temperature effect on probabilities
        const adjusted = this.data.map(item => {
            const logit = Math.log(item.probability + 0.001);
            const scaledLogit = logit / temperature;
            return { ...item, adjustedProb: Math.exp(scaledLogit) };
        });
        
        // Normalize
        const sum = adjusted.reduce((s, item) => s + item.adjustedProb, 0);
        adjusted.forEach(item => {
            item.probability = item.adjustedProb / sum;
        });
        
        this.data = adjusted;
        this.render();
    }
    
    animateSampling(callback) {
        const fills = this.container.querySelectorAll('.prob-bar-fill');
        let index = 0;
        
        const sweep = setInterval(() => {
            fills.forEach(f => f.classList.remove('selected'));
            if (index < fills.length) {
                fills[index].classList.add('selected');
                index++;
            } else {
                clearInterval(sweep);
                // Select based on probability (weighted random)
                const selected = this.weightedRandom();
                fills.forEach(f => f.classList.remove('selected'));
                fills[selected].classList.add('selected');
                if (callback) callback(this.data[selected]);
            }
        }, 100);
    }
    
    weightedRandom() {
        const r = Math.random();
        let cumulative = 0;
        for (let i = 0; i < this.data.length; i++) {
            cumulative += this.data[i].probability;
            if (r <= cumulative) return i;
        }
        return this.data.length - 1;
    }
}


// ============================================================================
// Neural Network Visualizer - For forward propagation demos
// ============================================================================

class NeuralNetworkViz {
    constructor(containerId, config) {
        this.container = document.getElementById(containerId);
        this.layers = config.layers || [3, 4, 2]; // nodes per layer
        this.nodeSize = config.nodeSize || 40;
        this.layerGap = config.layerGap || 150;
        this.nodeGap = config.nodeGap || 60;
        this.nodes = [];
        this.connections = [];
        
        this.init();
    }
    
    init() {
        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        
        const totalWidth = (this.layers.length - 1) * this.layerGap + this.nodeSize;
        const maxNodes = Math.max(...this.layers);
        const totalHeight = (maxNodes - 1) * this.nodeGap + this.nodeSize;
        
        this.container.style.width = `${totalWidth + 100}px`;
        this.container.style.height = `${totalHeight + 50}px`;
        this.container.style.margin = '0 auto';
        
        // Create nodes
        this.layers.forEach((nodeCount, layerIndex) => {
            const layerNodes = [];
            const layerHeight = (nodeCount - 1) * this.nodeGap;
            const startY = (totalHeight - layerHeight) / 2;
            
            for (let i = 0; i < nodeCount; i++) {
                const node = document.createElement('div');
                node.className = 'nn-node';
                node.style.position = 'absolute';
                node.style.left = `${layerIndex * this.layerGap + 50}px`;
                node.style.top = `${startY + i * this.nodeGap}px`;
                node.style.width = `${this.nodeSize}px`;
                node.style.height = `${this.nodeSize}px`;
                node.dataset.layer = layerIndex;
                node.dataset.node = i;
                
                if (layerIndex === this.layers.length - 1) {
                    node.classList.add('output');
                }
                
                this.container.appendChild(node);
                layerNodes.push({
                    element: node,
                    x: layerIndex * this.layerGap + 50 + this.nodeSize / 2,
                    y: startY + i * this.nodeGap + this.nodeSize / 2
                });
            }
            this.nodes.push(layerNodes);
        });
        
        // Create connections
        for (let l = 0; l < this.layers.length - 1; l++) {
            for (let i = 0; i < this.nodes[l].length; i++) {
                for (let j = 0; j < this.nodes[l + 1].length; j++) {
                    const from = this.nodes[l][i];
                    const to = this.nodes[l + 1][j];
                    
                    const connection = this.createConnection(from, to);
                    this.container.appendChild(connection);
                    this.connections.push({
                        element: connection,
                        fromLayer: l,
                        fromNode: i,
                        toLayer: l + 1,
                        toNode: j
                    });
                }
            }
        }
    }
    
    createConnection(from, to) {
        const line = document.createElement('div');
        line.className = 'nn-connection';
        
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        line.style.position = 'absolute';
        line.style.width = `${length}px`;
        line.style.left = `${from.x}px`;
        line.style.top = `${from.y}px`;
        line.style.transform = `rotate(${angle}deg)`;
        
        return line;
    }
    
    activateNode(layer, node) {
        if (this.nodes[layer] && this.nodes[layer][node]) {
            this.nodes[layer][node].element.classList.add('active');
        }
    }
    
    deactivateNode(layer, node) {
        if (this.nodes[layer] && this.nodes[layer][node]) {
            this.nodes[layer][node].element.classList.remove('active');
        }
    }
    
    activateConnection(fromLayer, fromNode, toLayer, toNode) {
        const conn = this.connections.find(c => 
            c.fromLayer === fromLayer && 
            c.fromNode === fromNode && 
            c.toLayer === toLayer && 
            c.toNode === toNode
        );
        if (conn) {
            conn.element.classList.add('active');
        }
    }
    
    reset() {
        this.nodes.flat().forEach(n => n.element.classList.remove('active'));
        this.connections.forEach(c => c.element.classList.remove('active'));
    }
    
    animateForwardPass(callback) {
        this.reset();
        let step = 0;
        
        const animate = () => {
            if (step < this.layers.length) {
                // Activate current layer nodes
                this.nodes[step].forEach((_, i) => {
                    setTimeout(() => this.activateNode(step, i), i * 100);
                });
                
                // Activate connections to next layer
                if (step < this.layers.length - 1) {
                    setTimeout(() => {
                        this.nodes[step].forEach((_, i) => {
                            this.nodes[step + 1].forEach((_, j) => {
                                setTimeout(() => {
                                    this.activateConnection(step, i, step + 1, j);
                                }, (i * this.nodes[step + 1].length + j) * 50);
                            });
                        });
                    }, this.nodes[step].length * 100);
                }
                
                step++;
                setTimeout(animate, 800);
            } else {
                if (callback) callback();
            }
        };
        
        animate();
    }
    
    setNodeValue(layer, node, value) {
        if (this.nodes[layer] && this.nodes[layer][node]) {
            this.nodes[layer][node].element.textContent = value;
        }
    }
}


// ============================================================================
// Attention Heatmap - For transformer attention visualization
// ============================================================================

class AttentionHeatmap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tokens = [];
        this.weights = [];
    }
    
    setData(tokens, weights) {
        this.tokens = tokens;
        this.weights = weights; // 2D array [query][key]
        this.render();
    }
    
    render() {
        this.container.innerHTML = '';
        
        const grid = document.createElement('div');
        grid.className = 'attention-grid';
        grid.style.gridTemplateColumns = `80px repeat(${this.tokens.length}, 50px)`;
        
        // Header row
        const emptyCell = document.createElement('div');
        emptyCell.className = 'attention-cell';
        grid.appendChild(emptyCell);
        
        this.tokens.forEach(token => {
            const header = document.createElement('div');
            header.className = 'attention-cell attention-header';
            header.textContent = token;
            grid.appendChild(header);
        });
        
        // Data rows
        this.tokens.forEach((queryToken, i) => {
            const rowHeader = document.createElement('div');
            rowHeader.className = 'attention-cell attention-header';
            rowHeader.textContent = queryToken;
            grid.appendChild(rowHeader);
            
            this.tokens.forEach((keyToken, j) => {
                const cell = document.createElement('div');
                cell.className = 'attention-cell';
                const weight = this.weights[i][j];
                cell.style.backgroundColor = this.getColor(weight);
                cell.textContent = weight.toFixed(2);
                cell.title = `${queryToken} → ${keyToken}: ${weight.toFixed(3)}`;
                cell.dataset.query = i;
                cell.dataset.key = j;
                
                cell.addEventListener('mouseenter', () => this.highlightCell(i, j));
                cell.addEventListener('mouseleave', () => this.clearHighlight());
                
                grid.appendChild(cell);
            });
        });
        
        this.container.appendChild(grid);
    }
    
    getColor(weight) {
        // Blue gradient based on weight
        const intensity = Math.floor(weight * 255);
        return `rgba(74, 144, 217, ${weight})`;
    }
    
    highlightCell(queryIdx, keyIdx) {
        const cells = this.container.querySelectorAll('.attention-cell');
        cells.forEach(cell => {
            if (cell.dataset.query == queryIdx || cell.dataset.key == keyIdx) {
                cell.style.transform = 'scale(1.1)';
                cell.style.zIndex = '10';
            }
        });
    }
    
    clearHighlight() {
        const cells = this.container.querySelectorAll('.attention-cell');
        cells.forEach(cell => {
            cell.style.transform = '';
            cell.style.zIndex = '';
        });
    }
    
    animateAttention(queryIdx, callback) {
        const cells = this.container.querySelectorAll('.attention-cell');
        const rowCells = Array.from(cells).filter(c => c.dataset.query == queryIdx);
        
        let index = 0;
        const interval = setInterval(() => {
            if (index < rowCells.length) {
                rowCells[index].style.transform = 'scale(1.2)';
                rowCells[index].style.boxShadow = '0 0 10px rgba(74, 144, 217, 0.8)';
                setTimeout(() => {
                    rowCells[index - 1]?.style.transform && (rowCells[index - 1].style.transform = '');
                    rowCells[index - 1]?.style.boxShadow && (rowCells[index - 1].style.boxShadow = '');
                }, 200);
                index++;
            } else {
                clearInterval(interval);
                rowCells.forEach(c => {
                    c.style.transform = '';
                    c.style.boxShadow = '';
                });
                if (callback) callback();
            }
        }, 150);
    }
}


// ============================================================================
// Flow Diagram - For pipeline visualizations (RAG, etc.)
// ============================================================================

class FlowDiagram {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.nodes = [];
        this.arrows = [];
    }
    
    addNode(id, label, options = {}) {
        const node = document.createElement('div');
        node.className = 'flow-box';
        node.id = id;
        node.innerHTML = options.icon ? `<span style="font-size:1.5em">${options.icon}</span><br>${label}` : label;
        
        if (options.style) {
            Object.assign(node.style, options.style);
        }
        
        this.container.appendChild(node);
        this.nodes.push({ id, element: node, label });
        return node;
    }
    
    addArrow(fromId, toId, options = {}) {
        const arrow = document.createElement('div');
        arrow.className = 'flow-arrow';
        if (options.animated) {
            arrow.classList.add('animated');
        }
        
        this.container.appendChild(arrow);
        this.arrows.push({ from: fromId, to: toId, element: arrow });
        return arrow;
    }
    
    highlightNode(id) {
        const node = this.nodes.find(n => n.id === id);
        if (node) {
            node.element.classList.add('highlight');
        }
    }
    
    unhighlightNode(id) {
        const node = this.nodes.find(n => n.id === id);
        if (node) {
            node.element.classList.remove('highlight');
        }
    }
    
    setNodeSuccess(id) {
        const node = this.nodes.find(n => n.id === id);
        if (node) {
            node.element.classList.remove('highlight');
            node.element.classList.add('success');
        }
    }
    
    animateArrow(fromId, toId) {
        const arrow = this.arrows.find(a => a.from === fromId && a.to === toId);
        if (arrow) {
            arrow.element.classList.add('animated');
        }
    }
    
    reset() {
        this.nodes.forEach(n => {
            n.element.classList.remove('highlight', 'success', 'warning');
        });
        this.arrows.forEach(a => {
            a.element.classList.remove('animated');
        });
    }
}


// ============================================================================
// Scratchpad - For agent reasoning visualization
// ============================================================================

class Scratchpad {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.lines = [];
    }
    
    clear() {
        this.container.innerHTML = '';
        this.lines = [];
    }
    
    addLine(content, type = 'normal') {
        const line = document.createElement('div');
        line.className = 'scratchpad-line';
        
        if (type === 'step') {
            line.innerHTML = `<span class="step-num">${this.lines.length + 1}.</span> ${content}`;
        } else if (type === 'tool') {
            line.innerHTML = `   <span class="tool-call">→ Calling: ${content}</span>`;
        } else if (type === 'result') {
            line.innerHTML = `   <span class="result">← Result: ${content}</span>`;
        } else {
            line.textContent = content;
        }
        
        this.container.appendChild(line);
        this.lines.push(line);
        
        // Scroll to bottom
        this.container.scrollTop = this.container.scrollHeight;
    }
    
    typewriterAdd(content, type = 'normal', callback) {
        const line = document.createElement('div');
        line.className = 'scratchpad-line';
        this.container.appendChild(line);
        this.lines.push(line);
        
        let prefix = '';
        if (type === 'step') {
            prefix = `<span class="step-num">${this.lines.length}.</span> `;
        } else if (type === 'tool') {
            prefix = `   <span class="tool-call">→ Calling: </span>`;
        } else if (type === 'result') {
            prefix = `   <span class="result">← Result: </span>`;
        }
        
        line.innerHTML = prefix;
        
        let charIndex = 0;
        const interval = setInterval(() => {
            if (charIndex < content.length) {
                line.innerHTML = prefix + content.substring(0, charIndex + 1);
                charIndex++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 30);
    }
}


// ============================================================================
// Track Toggle - For switching between technical and non-technical views
// ============================================================================

class TrackToggle {
    constructor(options = {}) {
        this.currentTrack = options.defaultTrack || 'non-tech';
        this.onToggle = options.onToggle || (() => {});
        
        this.init();
    }
    
    init() {
        const nonTechBtn = document.getElementById('nonTechBtn');
        const techBtn = document.getElementById('techBtn');
        
        if (nonTechBtn) {
            nonTechBtn.addEventListener('click', () => this.setTrack('non-tech'));
        }
        
        if (techBtn) {
            techBtn.addEventListener('click', () => this.setTrack('tech'));
        }
        
        this.updateUI();
    }
    
    setTrack(track) {
        this.currentTrack = track;
        this.updateUI();
        this.onToggle(track);
    }
    
    updateUI() {
        const nonTechBtn = document.getElementById('nonTechBtn');
        const techBtn = document.getElementById('techBtn');
        
        if (nonTechBtn) {
            nonTechBtn.classList.toggle('active', this.currentTrack === 'non-tech');
        }
        
        if (techBtn) {
            techBtn.classList.toggle('active', this.currentTrack === 'tech');
        }
        
        // Show/hide track-specific content
        document.querySelectorAll('.non-tech-content').forEach(el => {
            el.style.display = this.currentTrack === 'non-tech' ? 'block' : 'none';
        });
        
        document.querySelectorAll('.tech-content').forEach(el => {
            el.style.display = this.currentTrack === 'tech' ? 'block' : 'none';
        });
    }
    
    getTrack() {
        return this.currentTrack;
    }
}


// ============================================================================
// Tooltip Manager
// ============================================================================

class TooltipManager {
    constructor() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        document.body.appendChild(this.tooltip);
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.tooltip.style.left = `${e.pageX - this.tooltip.offsetWidth / 2}px`;
            this.tooltip.style.top = `${e.pageY - this.tooltip.offsetHeight - 15}px`;
        });
    }
    
    show(text) {
        this.tooltip.textContent = text;
        this.tooltip.classList.add('visible');
    }
    
    hide() {
        this.tooltip.classList.remove('visible');
    }
    
    attachTo(element, text) {
        element.addEventListener('mouseenter', () => this.show(text));
        element.addEventListener('mouseleave', () => this.hide());
    }
}


// ============================================================================
// Utility Functions
// ============================================================================

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateFakeProbabilities(tokens, temperature = 1.0) {
    const logits = tokens.map(() => Math.random() * 2 - 1);
    const scaled = logits.map(l => Math.exp(l / temperature));
    const sum = scaled.reduce((a, b) => a + b, 0);
    return tokens.map((token, i) => ({
        label: token,
        probability: scaled[i] / sum
    }));
}

function generateFakeAttention(size) {
    const weights = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(Math.random());
        }
        // Normalize row
        const sum = row.reduce((a, b) => a + b, 0);
        weights.push(row.map(w => w / sum));
    }
    return weights;
}


// Export for use in demos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DemoController,
        TokenVisualizer,
        ProbabilityChart,
        NeuralNetworkViz,
        AttentionHeatmap,
        FlowDiagram,
        Scratchpad,
        TrackToggle,
        TooltipManager,
        delay,
        randomBetween,
        shuffleArray,
        generateFakeProbabilities,
        generateFakeAttention
    };
}
