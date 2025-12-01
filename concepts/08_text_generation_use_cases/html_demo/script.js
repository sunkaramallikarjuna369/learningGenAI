/**
 * Text Generation Use Cases - Interactive Demo Script
 * 
 * This demo shows various text generation use cases including
 * writing, content creation, analysis, and code documentation.
 */

// Role-based applications data
const roleApplications = {
    marketing: {
        title: 'Marketing',
        apps: [
            { name: 'Ad Copy Generation', desc: 'Create compelling headlines, taglines, and ad descriptions' },
            { name: 'Email Campaigns', desc: 'Personalized marketing emails at scale with A/B variations' },
            { name: 'Social Media Content', desc: 'Platform-optimized posts with hashtags and CTAs' },
            { name: 'SEO Content', desc: 'Keyword-rich articles and meta descriptions' }
        ]
    },
    education: {
        title: 'Education',
        apps: [
            { name: 'Lesson Plan Generation', desc: 'Create structured lesson plans aligned with curriculum' },
            { name: 'Quiz & Assessment Creation', desc: 'Generate questions with varying difficulty levels' },
            { name: 'Personalized Explanations', desc: 'Adapt explanations to student level and learning style' },
            { name: 'Feedback Generation', desc: 'Constructive feedback on student work' }
        ]
    },
    healthcare: {
        title: 'Healthcare',
        apps: [
            { name: 'Clinical Note Summarization', desc: 'Condense patient encounters into structured notes' },
            { name: 'Patient Communication', desc: 'Clear, empathetic messages about treatment plans' },
            { name: 'Research Summarization', desc: 'Digest medical literature and clinical trials' },
            { name: 'Documentation Assistance', desc: 'Streamline administrative paperwork' }
        ]
    },
    legal: {
        title: 'Legal',
        apps: [
            { name: 'Contract Analysis', desc: 'Summarize key terms, obligations, and risks' },
            { name: 'Legal Research', desc: 'Find relevant precedents and case summaries' },
            { name: 'Document Drafting', desc: 'Generate initial drafts of legal documents' },
            { name: 'Compliance Checking', desc: 'Verify regulatory requirements are met' }
        ]
    }
};

// 3D Text Generation visualization state
let textGen3D = {
    mini3d: null,
    rotationY: 0,
    animating: false,
    flowProgress: 0
};

// Category examples data
const categoryExamples = {
    writing: {
        title: 'Writing Assistance',
        examples: [
            { icon: '📧', name: 'Email Drafting', desc: 'Compose professional emails quickly with the right tone' },
            { icon: '📝', name: 'Report Writing', desc: 'Generate structured reports from bullet points' },
            { icon: '✏️', name: 'Editing & Proofreading', desc: 'Improve grammar, clarity, and flow' },
            { icon: '💡', name: 'Brainstorming', desc: 'Overcome writer\'s block with AI suggestions' }
        ]
    },
    content: {
        title: 'Content Creation',
        examples: [
            { icon: '📱', name: 'Social Media Posts', desc: 'Platform-optimized content for engagement' },
            { icon: '📰', name: 'Blog Articles', desc: 'SEO-friendly long-form content' },
            { icon: '🎯', name: 'Ad Copy', desc: 'Compelling headlines and descriptions' },
            { icon: '📦', name: 'Product Descriptions', desc: 'Persuasive e-commerce content' }
        ]
    },
    analysis: {
        title: 'Information Analysis',
        examples: [
            { icon: '📊', name: 'Summarization', desc: 'Condense long documents into key points' },
            { icon: '🔍', name: 'Information Extraction', desc: 'Pull specific data from unstructured text' },
            { icon: '❓', name: 'Q&A', desc: 'Answer questions based on provided documents' },
            { icon: '🏷️', name: 'Classification', desc: 'Categorize and tag content automatically' }
        ]
    },
    code: {
        title: 'Code & Technical',
        examples: [
            { icon: '📚', name: 'Documentation', desc: 'Generate API docs and README files' },
            { icon: '💬', name: 'Code Comments', desc: 'Explain complex code sections' },
            { icon: '🐛', name: 'Bug Analysis', desc: 'Understand and explain error messages' },
            { icon: '📋', name: 'Release Notes', desc: 'Generate changelogs from commits' }
        ]
    }
};

// Sample inputs and outputs for live demo
const demoData = {
    summarize: {
        label: 'Summarize',
        sampleInput: 'Artificial intelligence has transformed numerous industries over the past decade. From healthcare to finance, AI systems are now capable of analyzing vast amounts of data, identifying patterns, and making predictions that were previously impossible. Machine learning algorithms can diagnose diseases from medical images, detect fraud in financial transactions, and even drive autonomous vehicles. However, these advances also raise important ethical questions about privacy, job displacement, and algorithmic bias that society must address.',
        sampleOutput: 'AI has revolutionized industries including healthcare and finance by enabling data analysis, pattern recognition, and predictions. While it powers medical diagnosis, fraud detection, and self-driving cars, it also raises ethical concerns about privacy, employment, and bias.'
    },
    email: {
        label: 'Write Email',
        sampleInput: 'meeting request, project update, next Tuesday 2pm, discuss Q4 goals',
        sampleOutput: 'Subject: Project Update Meeting - Tuesday at 2 PM\n\nHi Team,\n\nI hope this message finds you well. I would like to schedule a meeting for next Tuesday at 2:00 PM to discuss our Q4 goals and provide a project update.\n\nPlease confirm your availability.\n\nBest regards'
    },
    simplify: {
        label: 'Simplify',
        sampleInput: 'The implementation of quantum computing paradigms necessitates a fundamental reconceptualization of classical algorithmic approaches, particularly in domains requiring exponential computational complexity reduction.',
        sampleOutput: 'Quantum computers work differently from regular computers. They can solve certain complex problems much faster, but we need to rethink how we write programs for them.'
    },
    expand: {
        label: 'Expand',
        sampleInput: 'AI helps doctors',
        sampleOutput: 'Artificial intelligence is revolutionizing healthcare by assisting doctors in numerous ways. AI-powered diagnostic tools can analyze medical images like X-rays and MRIs to detect diseases earlier and more accurately. Machine learning algorithms help predict patient outcomes and recommend personalized treatment plans. Virtual assistants handle administrative tasks, freeing up doctors to spend more time with patients. AI also accelerates drug discovery by analyzing molecular structures and predicting drug interactions.'
    },
    translate: {
        label: 'Change Tone',
        sampleInput: 'Hey! Just wanted to let you know the project is done. It was pretty tough but we figured it out. Let me know if you need anything else!',
        sampleOutput: 'Dear Team,\n\nI am pleased to inform you that the project has been successfully completed. Despite encountering several challenges during the process, our team was able to develop effective solutions. Please do not hesitate to reach out if you require any additional information or assistance.\n\nBest regards'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    init3DTextGen();
    initRoleApplications();
    initUseCaseExplorer();
    initLiveDemo();
    initIndustryShowcase();
    initChecklist();
});

// ============================================================================
// 3D Text Generation Pipeline Visualization
// ============================================================================

function init3DTextGen() {
    const canvas = document.getElementById('textGen3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    textGen3D.mini3d = new Mini3D(canvas);
    
    document.getElementById('rotateLeftBtn')?.addEventListener('click', () => {
        textGen3D.rotationY -= 0.3;
        render3DTextGen();
    });
    
    document.getElementById('rotateRightBtn')?.addEventListener('click', () => {
        textGen3D.rotationY += 0.3;
        render3DTextGen();
    });
    
    document.getElementById('animateGenBtn')?.addEventListener('click', () => {
        if (!textGen3D.animating) {
            textGen3D.animating = true;
            textGen3D.flowProgress = 0;
            animateTextGenFlow();
        }
    });
    
    render3DTextGen();
}

function animateTextGenFlow() {
    if (!textGen3D.animating) return;
    
    textGen3D.flowProgress += 0.015;
    render3DTextGen();
    
    if (textGen3D.flowProgress < 1) {
        requestAnimationFrame(animateTextGenFlow);
    } else {
        textGen3D.animating = false;
        textGen3D.flowProgress = 0;
    }
}

function render3DTextGen() {
    const mini3d = textGen3D.mini3d;
    if (!mini3d) return;
    
    mini3d.clear();
    mini3d.setRotation(0, textGen3D.rotationY, 0);
    
    const centerX = mini3d.canvas.width / 2;
    const centerY = mini3d.canvas.height / 2;
    
    const stages = [
        { name: 'Input', color: '#4A90D9', z: -250 },
        { name: 'Tokenize', color: '#9B59B6', z: -125 },
        { name: 'Embed', color: '#E67E22', z: 0 },
        { name: 'Generate', color: '#27AE60', z: 125 },
        { name: 'Output', color: '#E74C3C', z: 250 }
    ];
    
    // Draw pipeline connections
    for (let i = 0; i < stages.length - 1; i++) {
        const s1 = stages[i];
        const s2 = stages[i + 1];
        
        const p1 = mini3d.rotatePoint(0, 0, s1.z);
        const p2 = mini3d.rotatePoint(0, 0, s2.z);
        
        const proj1 = mini3d.project(p1.x + centerX, p1.y + centerY, p1.z);
        const proj2 = mini3d.project(p2.x + centerX, p2.y + centerY, p2.z);
        
        mini3d.ctx.strokeStyle = '#555';
        mini3d.ctx.lineWidth = 3;
        mini3d.ctx.beginPath();
        mini3d.ctx.moveTo(proj1.x, proj1.y);
        mini3d.ctx.lineTo(proj2.x, proj2.y);
        mini3d.ctx.stroke();
    }
    
    // Draw stage boxes
    stages.forEach((stage, i) => {
        const rotated = mini3d.rotatePoint(0, 0, stage.z);
        const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
        
        const boxSize = 40 * proj.scale;
        
        // Draw 3D box effect
        mini3d.ctx.fillStyle = stage.color;
        mini3d.ctx.globalAlpha = 0.8;
        
        // Front face
        mini3d.ctx.fillRect(proj.x - boxSize, proj.y - boxSize, boxSize * 2, boxSize * 2);
        
        // Top face (lighter)
        mini3d.ctx.fillStyle = `${stage.color}cc`;
        mini3d.ctx.beginPath();
        mini3d.ctx.moveTo(proj.x - boxSize, proj.y - boxSize);
        mini3d.ctx.lineTo(proj.x - boxSize + 15, proj.y - boxSize - 15);
        mini3d.ctx.lineTo(proj.x + boxSize + 15, proj.y - boxSize - 15);
        mini3d.ctx.lineTo(proj.x + boxSize, proj.y - boxSize);
        mini3d.ctx.closePath();
        mini3d.ctx.fill();
        
        // Right face (darker)
        mini3d.ctx.fillStyle = `${stage.color}99`;
        mini3d.ctx.beginPath();
        mini3d.ctx.moveTo(proj.x + boxSize, proj.y - boxSize);
        mini3d.ctx.lineTo(proj.x + boxSize + 15, proj.y - boxSize - 15);
        mini3d.ctx.lineTo(proj.x + boxSize + 15, proj.y + boxSize - 15);
        mini3d.ctx.lineTo(proj.x + boxSize, proj.y + boxSize);
        mini3d.ctx.closePath();
        mini3d.ctx.fill();
        
        mini3d.ctx.globalAlpha = 1;
        
        // Label
        mini3d.ctx.fillStyle = '#fff';
        mini3d.ctx.font = `bold ${12 * proj.scale}px Arial`;
        mini3d.ctx.textAlign = 'center';
        mini3d.ctx.textBaseline = 'middle';
        mini3d.ctx.fillText(stage.name, proj.x, proj.y);
    });
    
    // Animate data flow
    if (textGen3D.animating) {
        const particleZ = (textGen3D.flowProgress - 0.5) * 600;
        const rotated = mini3d.rotatePoint(0, 0, particleZ);
        const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
        
        const gradient = mini3d.ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 25);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.5, '#50C878');
        gradient.addColorStop(1, 'transparent');
        mini3d.ctx.fillStyle = gradient;
        mini3d.ctx.beginPath();
        mini3d.ctx.arc(proj.x, proj.y, 25, 0, Math.PI * 2);
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
    
    updateApplications('marketing');
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
// Section 1: Use Case Explorer
// ============================================================================

function initUseCaseExplorer() {
    const cards = document.querySelectorAll('.category-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            
            // Update active state
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Show category details
            showCategoryDetails(category);
        });
    });
}

function showCategoryDetails(category) {
    const container = document.getElementById('categoryDetails');
    const data = categoryExamples[category];
    
    if (!data) return;
    
    let html = `
        <div class="details-content">
            <h4>${data.title}</h4>
            <div class="example-list">
    `;
    
    data.examples.forEach(example => {
        html += `
            <div class="example-item">
                <span class="example-icon">${example.icon}</span>
                <div class="example-info">
                    <h5>${example.name}</h5>
                    <p>${example.desc}</p>
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
}

// ============================================================================
// Section 2: Live Demo
// ============================================================================

function initLiveDemo() {
    const taskSelect = document.getElementById('taskSelect');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const input = document.getElementById('demoInput');
    
    // Set initial sample input
    updateSampleInput();
    
    taskSelect.addEventListener('change', () => {
        updateSampleInput();
        updateTaskLabel();
    });
    
    generateBtn.addEventListener('click', generateOutput);
    clearBtn.addEventListener('click', clearDemo);
}

function updateSampleInput() {
    const task = document.getElementById('taskSelect').value;
    const input = document.getElementById('demoInput');
    input.value = demoData[task].sampleInput;
    updateTaskLabel();
}

function updateTaskLabel() {
    const task = document.getElementById('taskSelect').value;
    document.getElementById('taskLabel').textContent = demoData[task].label;
}

async function generateOutput() {
    const task = document.getElementById('taskSelect').value;
    const output = document.getElementById('demoOutput');
    const arrow = document.getElementById('arrowAnim');
    
    // Start animation
    arrow.style.animation = 'none';
    arrow.offsetHeight; // Trigger reflow
    arrow.style.animation = 'pulse 0.3s ease infinite';
    
    // Clear and show typing indicator
    output.innerHTML = '<span class="typing-cursor"></span>';
    
    // Get the sample output
    const text = demoData[task].sampleOutput;
    
    // Simulate typing effect
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            output.innerHTML = `<span class="generated">${text.substring(0, i + 1)}</span><span class="typing-cursor"></span>`;
            i++;
        } else {
            clearInterval(typeInterval);
            output.innerHTML = `<span class="generated">${text}</span>`;
            arrow.style.animation = 'pulse 1.5s ease infinite';
        }
    }, 20);
}

function clearDemo() {
    document.getElementById('demoInput').value = '';
    document.getElementById('demoOutput').innerHTML = '<span class="placeholder">Generated text will appear here...</span>';
}

// ============================================================================
// Section 3: Industry Showcase
// ============================================================================

function initIndustryShowcase() {
    const tabs = document.querySelectorAll('.industry-tab');
    const panels = document.querySelectorAll('.industry-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const industry = tab.dataset.industry;
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update panels
            panels.forEach(p => p.classList.remove('active'));
            document.querySelector(`.industry-panel[data-industry="${industry}"]`).classList.add('active');
        });
    });
}

// ============================================================================
// Section 4: Quality Checklist
// ============================================================================

function initChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-item input');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateChecklistProgress);
    });
}

function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input');
    const checked = document.querySelectorAll('.checklist-item input:checked').length;
    const total = checkboxes.length;
    const percentage = (checked / total) * 100;
    
    document.getElementById('checklistProgress').style.width = `${percentage}%`;
    document.getElementById('progressText').textContent = `${checked}/${total} checks complete`;
}
