/**
 * Prompt Engineering - Interactive Demo Script
 * 
 * This demo shows prompt engineering techniques including
 * good vs bad prompts, prompt components, and advanced techniques.
 */

// Role-based applications data
const roleApplications = {
    writer: {
        title: 'Content Writer',
        apps: [
            { name: 'Blog Post Generation', desc: 'Create SEO-optimized articles with specific tone and structure' },
            { name: 'Social Media Content', desc: 'Platform-specific posts with hashtags and engagement hooks' },
            { name: 'Email Campaigns', desc: 'Personalized marketing emails with A/B test variations' },
            { name: 'Product Descriptions', desc: 'Compelling copy that highlights features and benefits' }
        ]
    },
    developer: {
        title: 'Developer',
        apps: [
            { name: 'Code Generation', desc: 'Generate functions, classes, and boilerplate with specific patterns' },
            { name: 'Documentation', desc: 'Auto-generate API docs, README files, and code comments' },
            { name: 'Bug Analysis', desc: 'Describe errors and get debugging suggestions' },
            { name: 'Code Review', desc: 'Get feedback on code quality and best practices' }
        ]
    },
    analyst: {
        title: 'Data Analyst',
        apps: [
            { name: 'SQL Query Generation', desc: 'Convert natural language questions to SQL queries' },
            { name: 'Data Interpretation', desc: 'Explain statistical results in plain language' },
            { name: 'Report Summarization', desc: 'Condense lengthy reports into executive summaries' },
            { name: 'Visualization Suggestions', desc: 'Get chart type recommendations for your data' }
        ]
    },
    support: {
        title: 'Customer Support',
        apps: [
            { name: 'Response Templates', desc: 'Generate empathetic, helpful responses to common issues' },
            { name: 'Ticket Summarization', desc: 'Quickly understand long customer conversation threads' },
            { name: 'Knowledge Base Articles', desc: 'Create self-service help documentation' },
            { name: 'Escalation Analysis', desc: 'Identify when issues need human intervention' }
        ]
    }
};

// 3D Prompt visualization state
let prompt3D = {
    mini3d: null,
    rotationY: 0,
    animating: false,
    flowProgress: 0
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    init3DPrompt();
    initRoleApplications();
    initComparison();
    initPromptBuilder();
    initTechniques();
    initPromptLab();
});

// ============================================================================
// 3D Prompt Visualization
// ============================================================================

function init3DPrompt() {
    const canvas = document.getElementById('prompt3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    prompt3D.mini3d = new Mini3D(canvas);
    
    document.getElementById('rotateLeftBtn')?.addEventListener('click', () => {
        prompt3D.rotationY -= 0.3;
        render3DPrompt();
    });
    
    document.getElementById('rotateRightBtn')?.addEventListener('click', () => {
        prompt3D.rotationY += 0.3;
        render3DPrompt();
    });
    
    document.getElementById('animatePromptBtn')?.addEventListener('click', () => {
        if (!prompt3D.animating) {
            prompt3D.animating = true;
            prompt3D.flowProgress = 0;
            animatePromptFlow();
        }
    });
    
    render3DPrompt();
}

function animatePromptFlow() {
    if (!prompt3D.animating) return;
    
    prompt3D.flowProgress += 0.02;
    render3DPrompt();
    
    if (prompt3D.flowProgress < 1) {
        requestAnimationFrame(animatePromptFlow);
    } else {
        prompt3D.animating = false;
        prompt3D.flowProgress = 0;
    }
}

function render3DPrompt() {
    const mini3d = prompt3D.mini3d;
    if (!mini3d) return;
    
    mini3d.clear();
    mini3d.setRotation(0, prompt3D.rotationY, 0);
    
    const centerX = mini3d.canvas.width / 2;
    const centerY = mini3d.canvas.height / 2;
    
    const components = [
        { name: 'Role', color: '#4A90D9', z: -200 },
        { name: 'Task', color: '#50C878', z: -100 },
        { name: 'Format', color: '#E67E22', z: 0 },
        { name: 'Examples', color: '#9B59B6', z: 100 },
        { name: 'Constraints', color: '#E74C3C', z: 200 }
    ];
    
    // Draw connecting lines
    for (let i = 0; i < components.length - 1; i++) {
        const c1 = components[i];
        const c2 = components[i + 1];
        
        const p1 = mini3d.rotatePoint(0, 0, c1.z);
        const p2 = mini3d.rotatePoint(0, 0, c2.z);
        
        const proj1 = mini3d.project(p1.x + centerX, p1.y + centerY, p1.z);
        const proj2 = mini3d.project(p2.x + centerX, p2.y + centerY, p2.z);
        
        mini3d.ctx.strokeStyle = '#666';
        mini3d.ctx.lineWidth = 2;
        mini3d.ctx.beginPath();
        mini3d.ctx.moveTo(proj1.x, proj1.y);
        mini3d.ctx.lineTo(proj2.x, proj2.y);
        mini3d.ctx.stroke();
    }
    
    // Draw component spheres
    components.forEach((comp, i) => {
        const rotated = mini3d.rotatePoint(0, 0, comp.z);
        const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
        
        // Glow effect
        const gradient = mini3d.ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 50 * proj.scale);
        gradient.addColorStop(0, comp.color);
        gradient.addColorStop(1, 'transparent');
        mini3d.ctx.fillStyle = gradient;
        mini3d.ctx.beginPath();
        mini3d.ctx.arc(proj.x, proj.y, 50 * proj.scale, 0, Math.PI * 2);
        mini3d.ctx.fill();
        
        // Solid sphere
        mini3d.ctx.fillStyle = comp.color;
        mini3d.ctx.beginPath();
        mini3d.ctx.arc(proj.x, proj.y, 30 * proj.scale, 0, Math.PI * 2);
        mini3d.ctx.fill();
        
        // Label
        mini3d.ctx.fillStyle = '#fff';
        mini3d.ctx.font = `bold ${14 * proj.scale}px Arial`;
        mini3d.ctx.textAlign = 'center';
        mini3d.ctx.textBaseline = 'middle';
        mini3d.ctx.fillText(comp.name, proj.x, proj.y);
    });
    
    // Animate flow particles
    if (prompt3D.animating) {
        const particleZ = (prompt3D.flowProgress - 0.5) * 500;
        const rotated = mini3d.rotatePoint(0, 0, particleZ);
        const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
        
        const gradient = mini3d.ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 20);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, 'transparent');
        mini3d.ctx.fillStyle = gradient;
        mini3d.ctx.beginPath();
        mini3d.ctx.arc(proj.x, proj.y, 20, 0, Math.PI * 2);
        mini3d.ctx.fill();
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
    
    updateApplications('writer');
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
// Section 1: Good vs Bad Prompts Comparison
// ============================================================================

function initComparison() {
    const animateBtn = document.getElementById('animateComparisonBtn');
    
    animateBtn.addEventListener('click', animateComparison);
}

async function animateComparison() {
    const badResponse = document.getElementById('badResponse');
    const goodResponse = document.getElementById('goodResponse');
    const badMeter = document.querySelector('.comparison-side.bad .meter-fill');
    const goodMeter = document.querySelector('.comparison-side.good .meter-fill');
    
    // Reset
    badResponse.classList.remove('visible');
    goodResponse.classList.remove('visible');
    badMeter.style.width = '0%';
    goodMeter.style.width = '0%';
    
    // Animate bad prompt first
    await new Promise(resolve => setTimeout(resolve, 500));
    badResponse.classList.add('visible');
    badMeter.style.width = '30%';
    
    // Then good prompt
    await new Promise(resolve => setTimeout(resolve, 800));
    goodResponse.classList.add('visible');
    goodMeter.style.width = '90%';
}

// ============================================================================
// Section 2: Prompt Builder
// ============================================================================

function initPromptBuilder() {
    const toggles = {
        role: document.getElementById('toggleRole'),
        task: document.getElementById('toggleTask'),
        format: document.getElementById('toggleFormat'),
        examples: document.getElementById('toggleExamples'),
        constraints: document.getElementById('toggleConstraints')
    };
    
    // Set initial state
    updatePromptBuilder();
    
    // Add event listeners
    Object.values(toggles).forEach(toggle => {
        toggle.addEventListener('change', updatePromptBuilder);
    });
}

function updatePromptBuilder() {
    const components = {
        role: document.getElementById('toggleRole').checked,
        task: document.getElementById('toggleTask').checked,
        format: document.getElementById('toggleFormat').checked,
        examples: document.getElementById('toggleExamples').checked,
        constraints: document.getElementById('toggleConstraints').checked
    };
    
    // Update visibility of components
    Object.entries(components).forEach(([key, visible]) => {
        const element = document.querySelector(`.prompt-component.${key}`);
        if (element) {
            element.classList.toggle('hidden', !visible);
        }
    });
    
    // Calculate score
    const activeCount = Object.values(components).filter(v => v).length;
    const score = (activeCount / 5) * 100;
    
    document.getElementById('promptScore').style.width = `${score}%`;
    document.getElementById('scoreValue').textContent = `${Math.round(score)}%`;
}

// ============================================================================
// Section 3: Prompting Techniques
// ============================================================================

function initTechniques() {
    const tabs = document.querySelectorAll('.technique-tab');
    const panels = document.querySelectorAll('.technique-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const technique = tab.dataset.technique;
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update panels
            panels.forEach(p => p.classList.remove('active'));
            document.querySelector(`.technique-panel[data-technique="${technique}"]`).classList.add('active');
            
            // Animate CoT steps if that technique is selected
            if (technique === 'cot') {
                animateCoTSteps();
            }
        });
    });
}

async function animateCoTSteps() {
    const steps = document.querySelectorAll('.cot-step');
    const answer = document.querySelector('.cot-answer');
    
    // Reset
    steps.forEach(s => s.classList.remove('visible'));
    answer.classList.remove('visible');
    
    // Animate each step
    for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        steps[i].classList.add('visible');
    }
    
    // Show answer
    await new Promise(resolve => setTimeout(resolve, 600));
    answer.classList.add('visible');
}

// ============================================================================
// Section 4: Prompt Lab
// ============================================================================

const promptKeywords = {
    specificity: ['specific', 'exactly', 'precisely', 'detailed', 'particular', 'words', 'sentences', 'paragraphs', 'steps'],
    context: ['you are', 'act as', 'role', 'expert', 'professional', 'specialist', 'background', 'context', 'scenario'],
    format: ['format', 'structure', 'bullet', 'list', 'json', 'markdown', 'table', 'sections', 'headers', 'output'],
    constraints: ['limit', 'maximum', 'minimum', 'avoid', 'don\'t', 'must', 'should', 'only', 'without', 'under', 'words']
};

const taskTips = {
    email: [
        'Specify the tone (formal, friendly, urgent)',
        'Mention the recipient relationship (colleague, client, manager)',
        'Include the main purpose of the email',
        'Specify any constraints (length, deadline mentions)'
    ],
    summary: [
        'Specify the target length (e.g., "in 3 sentences")',
        'Mention the audience (technical, executive, general)',
        'Indicate what aspects to focus on',
        'Specify the format (bullet points, paragraph)'
    ],
    code: [
        'Specify the programming language',
        'Describe the input/output format',
        'Mention any libraries or frameworks to use',
        'Include error handling requirements'
    ],
    creative: [
        'Specify the genre and tone',
        'Provide character or setting details',
        'Mention the target audience',
        'Include any themes to explore'
    ]
};

function initPromptLab() {
    const promptInput = document.getElementById('labPromptInput');
    const taskSelect = document.getElementById('labTaskSelect');
    
    promptInput.addEventListener('input', analyzePrompt);
    taskSelect.addEventListener('change', () => {
        updateTips();
        analyzePrompt();
    });
    
    // Initial tips
    updateTips();
}

function analyzePrompt() {
    const prompt = document.getElementById('labPromptInput').value.toLowerCase();
    const scores = {};
    
    // Calculate scores for each factor
    Object.entries(promptKeywords).forEach(([factor, keywords]) => {
        let score = 0;
        keywords.forEach(keyword => {
            if (prompt.includes(keyword)) {
                score += 20;
            }
        });
        scores[factor] = Math.min(score, 100);
    });
    
    // Bonus for length
    if (prompt.length > 50) scores.specificity = Math.min(scores.specificity + 20, 100);
    if (prompt.length > 100) scores.specificity = Math.min(scores.specificity + 20, 100);
    
    // Update UI
    Object.entries(scores).forEach(([factor, score]) => {
        const item = document.querySelector(`.analysis-item[data-factor="${factor}"]`);
        if (item) {
            item.querySelector('.factor-fill').style.width = `${score}%`;
            item.querySelector('.factor-score').textContent = `${score}%`;
        }
    });
    
    // Calculate overall score
    const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 4);
    document.getElementById('overallScore').textContent = `${overall}%`;
    
    // Update tips based on missing elements
    updateTipsBasedOnAnalysis(scores);
}

function updateTips() {
    const task = document.getElementById('labTaskSelect').value;
    const tipsList = document.getElementById('tipsList');
    
    tipsList.innerHTML = '';
    taskTips[task].forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });
}

function updateTipsBasedOnAnalysis(scores) {
    const tipsList = document.getElementById('tipsList');
    const tips = [];
    
    if (scores.specificity < 50) {
        tips.push('Add more specific details about what you want');
    }
    if (scores.context < 50) {
        tips.push('Try adding a role (e.g., "You are an expert...")');
    }
    if (scores.format < 50) {
        tips.push('Specify the desired output format');
    }
    if (scores.constraints < 50) {
        tips.push('Add constraints like length limits or things to avoid');
    }
    
    if (tips.length > 0) {
        tipsList.innerHTML = '';
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }
}
