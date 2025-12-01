/**
 * Text Generation Use Cases - Interactive Demo Script
 * 
 * This demo shows various text generation use cases including
 * writing, content creation, analysis, and code documentation.
 */

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
    initUseCaseExplorer();
    initLiveDemo();
    initIndustryShowcase();
    initChecklist();
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
