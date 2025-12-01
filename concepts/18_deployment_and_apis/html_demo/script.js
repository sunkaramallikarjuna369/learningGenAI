/**
 * Deployment and APIs - Interactive Demo Script
 * 
 * This demo shows how APIs work and different deployment options
 * for GenAI applications.
 */

// Role-based applications data
const roleApplications = {
    startup: {
        title: 'Startup',
        apps: [
            { name: 'Cloud APIs', desc: 'Use OpenAI, Anthropic, or Google APIs for quick deployment' },
            { name: 'Serverless Functions', desc: 'AWS Lambda or Vercel for cost-effective scaling' },
            { name: 'Managed Services', desc: 'Use platforms like Replicate or Modal for model hosting' },
            { name: 'Rate Limiting', desc: 'Implement usage limits to control costs' }
        ]
    },
    enterprise: {
        title: 'Enterprise',
        apps: [
            { name: 'Private Cloud', desc: 'Deploy on AWS, Azure, or GCP with VPC isolation' },
            { name: 'On-Premise', desc: 'Self-hosted models for maximum data control' },
            { name: 'Load Balancing', desc: 'Distribute traffic across multiple model instances' },
            { name: 'Monitoring', desc: 'Comprehensive logging, metrics, and alerting' }
        ]
    },
    realtime: {
        title: 'Real-time',
        apps: [
            { name: 'Edge Deployment', desc: 'Run smaller models closer to users for low latency' },
            { name: 'Streaming', desc: 'Server-sent events for token-by-token responses' },
            { name: 'Caching', desc: 'Cache common responses to reduce latency' },
            { name: 'Model Optimization', desc: 'Quantization and distillation for faster inference' }
        ]
    },
    privacy: {
        title: 'Privacy-First',
        apps: [
            { name: 'On-Device', desc: 'Run models locally on user devices' },
            { name: 'Federated Learning', desc: 'Train models without centralizing data' },
            { name: 'Differential Privacy', desc: 'Add noise to protect individual data points' },
            { name: 'Data Anonymization', desc: 'Remove PII before sending to APIs' }
        ]
    }
};

// 3D Deployment visualization state
let deploy3D = {
    mini3d: null,
    rotationY: 0,
    animating: false,
    progress: 0,
    nodes: [],
    packets: []
};

// Deployment option details
const deploymentOptions = {
    cloud: {
        title: "Cloud API Services",
        description: "Use managed API services from providers like OpenAI, Anthropic, or Google. The easiest way to get started - no infrastructure to manage.",
        pros: [
            "Quick to start - just get an API key",
            "Automatically scales with demand",
            "Always up-to-date models",
            "No hardware to maintain"
        ],
        cons: [
            "Pay per request (can get expensive)",
            "Data leaves your network",
            "Dependent on provider availability",
            "Limited customization"
        ],
        bestFor: "Startups, MVPs, variable workloads, teams without ML infrastructure"
    },
    selfhost: {
        title: "Self-Hosted Deployment",
        description: "Run open-source models on your own servers or cloud infrastructure. Maximum control but requires significant expertise.",
        pros: [
            "Full control over data and models",
            "No per-request costs after setup",
            "Can fine-tune for your use case",
            "No external dependencies"
        ],
        cons: [
            "High upfront infrastructure cost",
            "Requires ML/DevOps expertise",
            "You handle scaling and maintenance",
            "May lag behind latest models"
        ],
        bestFor: "Enterprise, privacy-sensitive industries, high-volume applications"
    },
    edge: {
        title: "Edge / On-Device",
        description: "Run smaller models directly on user devices (phones, laptops, IoT). Great for offline use and privacy.",
        pros: [
            "Works offline",
            "Zero latency to server",
            "Complete data privacy",
            "No ongoing API costs"
        ],
        cons: [
            "Limited to smaller models",
            "Device hardware constraints",
            "Harder to update models",
            "Inconsistent performance across devices"
        ],
        bestFor: "Mobile apps, IoT, privacy-critical applications, offline scenarios"
    },
    hybrid: {
        title: "Hybrid Approach",
        description: "Combine multiple deployment methods. Use edge for simple tasks, cloud for complex ones. Balance cost, performance, and privacy.",
        pros: [
            "Optimize cost vs performance",
            "Graceful degradation",
            "Flexibility for different use cases",
            "Best of multiple worlds"
        ],
        cons: [
            "More complex architecture",
            "Multiple systems to maintain",
            "Routing logic needed",
            "Testing complexity"
        ],
        bestFor: "Mature products, variable workloads, cost-conscious enterprises"
    }
};

// Model pricing (per 1M tokens)
const modelPricing = {
    gpt4: { input: 30, output: 60, name: "GPT-4" },
    gpt35: { input: 0.5, output: 1.5, name: "GPT-3.5 Turbo" },
    claude: { input: 3, output: 15, name: "Claude 3 Sonnet" }
};

// Sample API responses
const sampleResponses = {
    "gpt-4": "An API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other, enabling them to request and exchange data or functionality.",
    "gpt-3.5-turbo": "An API is like a messenger that takes your request to a system and brings back the response, allowing different software programs to talk to each other.",
    "claude-3": "An API is a standardized interface that enables software applications to interact and share data with each other through defined requests and responses."
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    init3DDeploy();
    initRoleApplications();
    initAPIFlow();
    initPlayground();
    initDeploymentOptions();
    initCostCalculator();
});

// ============================================================================
// 3D Deployment Architecture Visualization
// ============================================================================

function init3DDeploy() {
    const canvas = document.getElementById('deploy3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    deploy3D.mini3d = new Mini3D(canvas);
    
    // Create deployment nodes
    const nodeData = [
        { name: 'Users', color: '#4A90D9', x: -200, y: 0, z: 0 },
        { name: 'Load Balancer', color: '#9B59B6', x: -80, y: 0, z: 0 },
        { name: 'API Gateway', color: '#E67E22', x: 40, y: -50, z: 50 },
        { name: 'Cache', color: '#50C878', x: 40, y: 50, z: -50 },
        { name: 'Model Server', color: '#E74C3C', x: 160, y: 0, z: 0 }
    ];
    
    nodeData.forEach(n => {
        deploy3D.nodes.push({
            x: n.x,
            y: n.y,
            z: n.z,
            name: n.name,
            color: n.color,
            active: false,
            scale: 1
        });
    });
    
    document.getElementById('rotateLeftBtn3D')?.addEventListener('click', () => {
        deploy3D.rotationY -= 0.3;
        render3DDeploy();
    });
    
    document.getElementById('rotateRightBtn3D')?.addEventListener('click', () => {
        deploy3D.rotationY += 0.3;
        render3DDeploy();
    });
    
    document.getElementById('animateDeployBtn')?.addEventListener('click', () => {
        if (!deploy3D.animating) {
            deploy3D.animating = true;
            deploy3D.progress = 0;
            deploy3D.nodes.forEach(n => n.active = false);
            animateDeploy3D();
        }
    });
    
    render3DDeploy();
}

function animateDeploy3D() {
    if (!deploy3D.animating) return;
    
    deploy3D.progress += 0.015;
    deploy3D.rotationY += 0.005;
    
    // Activate nodes progressively
    const nodeIndex = Math.floor(deploy3D.progress * deploy3D.nodes.length);
    deploy3D.nodes.forEach((n, i) => {
        n.active = i <= nodeIndex;
        n.scale = n.active ? 1.2 : 1;
    });
    
    render3DDeploy();
    
    if (deploy3D.progress < 1) {
        requestAnimationFrame(animateDeploy3D);
    } else {
        deploy3D.animating = false;
    }
}

function render3DDeploy() {
    const mini3d = deploy3D.mini3d;
    if (!mini3d) return;
    
    mini3d.clear();
    mini3d.setRotation(0.2, deploy3D.rotationY, 0);
    
    const centerX = mini3d.canvas.width / 2;
    const centerY = mini3d.canvas.height / 2;
    
    // Draw connections
    const connections = [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4]];
    connections.forEach(([i, j]) => {
        const n1 = deploy3D.nodes[i];
        const n2 = deploy3D.nodes[j];
        
        const r1 = mini3d.rotatePoint(n1.x, n1.y, n1.z);
        const r2 = mini3d.rotatePoint(n2.x, n2.y, n2.z);
        const p1 = mini3d.project(r1.x + centerX, r1.y + centerY, r1.z);
        const p2 = mini3d.project(r2.x + centerX, r2.y + centerY, r2.z);
        
        mini3d.ctx.strokeStyle = n1.active && n2.active ? '#50C878' : 'rgba(150, 150, 150, 0.3)';
        mini3d.ctx.lineWidth = n1.active && n2.active ? 3 : 1;
        mini3d.ctx.beginPath();
        mini3d.ctx.moveTo(p1.x, p1.y);
        mini3d.ctx.lineTo(p2.x, p2.y);
        mini3d.ctx.stroke();
    });
    
    // Draw nodes
    deploy3D.nodes.forEach(node => {
        const rotated = mini3d.rotatePoint(node.x, node.y, node.z);
        const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
        
        const nodeSize = 40 * node.scale;
        const gradient = mini3d.ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, nodeSize * proj.scale);
        gradient.addColorStop(0, node.active ? node.color : node.color + '66');
        gradient.addColorStop(1, 'transparent');
        
        mini3d.ctx.fillStyle = gradient;
        mini3d.ctx.beginPath();
        mini3d.ctx.arc(proj.x, proj.y, nodeSize * proj.scale, 0, Math.PI * 2);
        mini3d.ctx.fill();
        
        mini3d.ctx.fillStyle = '#fff';
        mini3d.ctx.font = `${9 * proj.scale}px Arial`;
        mini3d.ctx.textAlign = 'center';
        mini3d.ctx.fillText(node.name, proj.x, proj.y + 4);
    });
    
    // Draw title
    mini3d.ctx.fillStyle = '#ccc';
    mini3d.ctx.font = '14px Arial';
    mini3d.ctx.textAlign = 'center';
    mini3d.ctx.fillText('Deployment Architecture', centerX, 30);
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
    
    updateApplications('startup');
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
// Section 1: API Flow Animation
// ============================================================================

function initAPIFlow() {
    const sendBtn = document.getElementById('sendRequestBtn');
    const resetBtn = document.getElementById('resetFlowBtn');
    const status = document.getElementById('flowStatus');
    
    sendBtn.addEventListener('click', runAPIFlow);
    resetBtn.addEventListener('click', resetAPIFlow);
}

async function runAPIFlow() {
    const nodes = document.querySelectorAll('.flow-node');
    const packet1 = document.getElementById('packet1');
    const packet2 = document.getElementById('packet2');
    const status = document.getElementById('flowStatus');
    const sendBtn = document.getElementById('sendRequestBtn');
    
    sendBtn.disabled = true;
    
    // Step 1: Client sends request
    status.textContent = "1. Your app sends a request to the API...";
    status.className = 'flow-status';
    nodes[0].classList.add('active');
    await sleep(500);
    
    packet1.classList.add('moving');
    await sleep(1000);
    
    // Step 2: API Gateway receives
    status.textContent = "2. API Gateway authenticates and routes the request...";
    nodes[0].classList.remove('active');
    nodes[1].classList.add('active');
    packet1.classList.remove('moving');
    await sleep(1000);
    
    packet2.classList.add('moving');
    await sleep(1000);
    
    // Step 3: Model processes
    status.textContent = "3. AI Model processes your request...";
    nodes[1].classList.remove('active');
    nodes[2].classList.add('active');
    packet2.classList.remove('moving');
    await sleep(1500);
    
    // Step 4: Response returns
    status.textContent = "4. Response travels back to your app!";
    status.className = 'flow-status success';
    
    await sleep(1000);
    nodes[2].classList.remove('active');
    sendBtn.disabled = false;
}

function resetAPIFlow() {
    const nodes = document.querySelectorAll('.flow-node');
    const packets = document.querySelectorAll('.arrow-packet');
    const status = document.getElementById('flowStatus');
    const sendBtn = document.getElementById('sendRequestBtn');
    
    nodes.forEach(n => n.classList.remove('active'));
    packets.forEach(p => p.classList.remove('moving'));
    status.textContent = 'Click "Send Request" to see how an API call works';
    status.className = 'flow-status';
    sendBtn.disabled = false;
}

// ============================================================================
// Section 2: API Playground
// ============================================================================

function initPlayground() {
    const tempSlider = document.getElementById('tempSlider');
    const tempValue = document.getElementById('tempValue');
    const callBtn = document.getElementById('callApiBtn');
    
    tempSlider.addEventListener('input', () => {
        tempValue.textContent = tempSlider.value;
    });
    
    callBtn.addEventListener('click', simulateAPICall);
}

async function simulateAPICall() {
    const model = document.getElementById('modelSelect').value;
    const prompt = document.getElementById('promptInput').value;
    const temp = document.getElementById('tempSlider').value;
    const responseDisplay = document.getElementById('responseDisplay');
    const responseMeta = document.getElementById('responseMeta');
    
    responseDisplay.innerHTML = '<span style="color: #888;">Calling API...</span>';
    responseMeta.innerHTML = '';
    
    // Simulate latency
    await sleep(1500);
    
    // Get response
    const response = sampleResponses[model] || sampleResponses["gpt-4"];
    
    // Typing effect
    responseDisplay.textContent = '';
    for (let i = 0; i < response.length; i++) {
        responseDisplay.textContent += response[i];
        if (i % 5 === 0) await sleep(20);
    }
    
    // Show metadata
    const inputTokens = Math.round(prompt.split(' ').length * 1.3);
    const outputTokens = Math.round(response.split(' ').length * 1.3);
    const latency = Math.round(800 + Math.random() * 400);
    
    responseMeta.innerHTML = `
        <div class="meta-item"><strong>Model:</strong> ${model}</div>
        <div class="meta-item"><strong>Input tokens:</strong> ${inputTokens}</div>
        <div class="meta-item"><strong>Output tokens:</strong> ${outputTokens}</div>
        <div class="meta-item"><strong>Latency:</strong> ${latency}ms</div>
    `;
}

// ============================================================================
// Section 3: Deployment Options
// ============================================================================

function initDeploymentOptions() {
    const cards = document.querySelectorAll('.option-card');
    const details = document.getElementById('optionDetails');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const option = deploymentOptions[card.dataset.option];
            details.innerHTML = `
                <h4>${option.title}</h4>
                <p>${option.description}</p>
                <div class="pros-cons">
                    <div class="pros">
                        <h5>Pros</h5>
                        <ul>
                            ${option.pros.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="cons">
                        <h5>Cons</h5>
                        <ul>
                            ${option.cons.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <p><strong>Best for:</strong> ${option.bestFor}</p>
            `;
        });
    });
}

// ============================================================================
// Section 4: Cost Calculator
// ============================================================================

function initCostCalculator() {
    const inputs = ['requestsPerDay', 'inputTokens', 'outputTokens', 'costModel'];
    
    inputs.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', updateCosts);
        el.addEventListener('change', updateCosts);
    });
    
    updateCosts();
}

function updateCosts() {
    const requestsPerDay = parseInt(document.getElementById('requestsPerDay').value);
    const inputTokens = parseInt(document.getElementById('inputTokens').value);
    const outputTokens = parseInt(document.getElementById('outputTokens').value);
    const modelKey = document.getElementById('costModel').value;
    
    // Update display values
    document.getElementById('requestsValue').textContent = requestsPerDay.toLocaleString();
    document.getElementById('inputValue').textContent = inputTokens.toLocaleString();
    document.getElementById('outputValue').textContent = outputTokens.toLocaleString();
    
    // Get pricing
    const pricing = modelPricing[modelKey];
    
    // Calculate costs
    const dailyInputCost = (requestsPerDay * inputTokens / 1000000) * pricing.input;
    const dailyOutputCost = (requestsPerDay * outputTokens / 1000000) * pricing.output;
    const dailyCost = dailyInputCost + dailyOutputCost;
    const monthlyCost = dailyCost * 30;
    const annualCost = monthlyCost * 12;
    
    // Update results
    document.getElementById('dailyCost').textContent = `$${dailyCost.toFixed(2)}`;
    document.getElementById('monthlyCost').textContent = `$${monthlyCost.toFixed(2)}`;
    document.getElementById('annualCost').textContent = `$${annualCost.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
    
    // Update breakdown
    document.getElementById('costBreakdown').innerHTML = `
        <h4>Cost Breakdown (${pricing.name})</h4>
        <div class="breakdown-item">
            <span>Input tokens (${inputTokens.toLocaleString()} × ${requestsPerDay.toLocaleString()} requests)</span>
            <span>$${dailyInputCost.toFixed(2)}/day</span>
        </div>
        <div class="breakdown-item">
            <span>Output tokens (${outputTokens.toLocaleString()} × ${requestsPerDay.toLocaleString()} requests)</span>
            <span>$${dailyOutputCost.toFixed(2)}/day</span>
        </div>
        <div class="breakdown-item">
            <span><strong>Total daily tokens</strong></span>
            <span><strong>${((inputTokens + outputTokens) * requestsPerDay).toLocaleString()}</strong></span>
        </div>
    `;
}

// Utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
