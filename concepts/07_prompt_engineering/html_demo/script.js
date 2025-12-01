/**
 * Prompt Engineering - Interactive Demo Script
 * 
 * This demo shows prompt engineering techniques including
 * good vs bad prompts, prompt components, and advanced techniques.
 */

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    initComparison();
    initPromptBuilder();
    initTechniques();
    initPromptLab();
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
