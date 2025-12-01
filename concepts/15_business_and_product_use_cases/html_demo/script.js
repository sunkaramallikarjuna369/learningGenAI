/**
 * Business and Product Use Cases - Interactive Demo Script
 * 
 * This demo shows practical business applications of GenAI
 * including ROI calculation and live task demonstrations.
 */

// Department use cases data
const departmentUseCases = {
    marketing: [
        { icon: '📝', title: 'Blog Posts', description: 'Generate SEO-optimized articles', timeSaved: '70% faster' },
        { icon: '📱', title: 'Social Media', description: 'Create engaging posts for all platforms', timeSaved: '80% faster' },
        { icon: '📧', title: 'Email Campaigns', description: 'Personalized email content at scale', timeSaved: '60% faster' },
        { icon: '🎨', title: 'Ad Copy', description: 'Generate variations for A/B testing', timeSaved: '75% faster' }
    ],
    sales: [
        { icon: '✉️', title: 'Outreach Emails', description: 'Personalized prospecting messages', timeSaved: '65% faster' },
        { icon: '📊', title: 'Proposals', description: 'Generate customized proposals', timeSaved: '50% faster' },
        { icon: '🎯', title: 'Lead Scoring', description: 'Analyze and prioritize leads', timeSaved: '40% faster' },
        { icon: '📞', title: 'Call Summaries', description: 'Transcribe and summarize calls', timeSaved: '90% faster' }
    ],
    support: [
        { icon: '💬', title: 'Chatbots', description: 'Intelligent customer assistance', timeSaved: '80% faster' },
        { icon: '📋', title: 'Ticket Responses', description: 'Draft replies to support tickets', timeSaved: '70% faster' },
        { icon: '📚', title: 'FAQ Generation', description: 'Create help documentation', timeSaved: '60% faster' },
        { icon: '📈', title: 'Sentiment Analysis', description: 'Analyze customer feedback', timeSaved: '85% faster' }
    ],
    operations: [
        { icon: '📄', title: 'Report Summaries', description: 'Summarize lengthy documents', timeSaved: '75% faster' },
        { icon: '📝', title: 'Meeting Notes', description: 'Generate action items from meetings', timeSaved: '80% faster' },
        { icon: '📋', title: 'SOPs', description: 'Create standard procedures', timeSaved: '50% faster' },
        { icon: '🔍', title: 'Data Analysis', description: 'Extract insights from data', timeSaved: '60% faster' }
    ],
    hr: [
        { icon: '📝', title: 'Job Descriptions', description: 'Generate compelling job posts', timeSaved: '70% faster' },
        { icon: '📧', title: 'Candidate Outreach', description: 'Personalized recruitment emails', timeSaved: '65% faster' },
        { icon: '📋', title: 'Policy Documents', description: 'Draft HR policies', timeSaved: '55% faster' },
        { icon: '🎓', title: 'Training Content', description: 'Create learning materials', timeSaved: '60% faster' }
    ]
};

// Task demo data
const taskDemoData = {
    product: {
        input: `<div class="input-field"><label>Product:</label><span>EcoBottle Pro</span></div>
                <div class="input-field"><label>Category:</label><span>Sustainable Products</span></div>
                <div class="input-field"><label>Features:</label><span>BPA-free, insulated, 24-hour cold</span></div>
                <div class="input-field"><label>Audience:</label><span>Eco-conscious consumers</span></div>`,
        output: `<strong>EcoBottle Pro - Your Sustainable Hydration Companion</strong>

Stay refreshed while saving the planet! The EcoBottle Pro combines cutting-edge insulation technology with eco-friendly materials for the ultimate drinking experience.

✓ BPA-free construction for your health
✓ 24-hour cold retention keeps drinks perfectly chilled
✓ Durable design that lasts for years

Join thousands of environmentally conscious consumers who've made the switch. Because staying hydrated shouldn't cost the Earth.

<em>Available in 5 stunning colors. Free shipping on orders over $30.</em>`
    },
    email: {
        input: `<div class="input-field"><label>Recipient:</label><span>Tech startup CEO</span></div>
                <div class="input-field"><label>Product:</label><span>AI Analytics Platform</span></div>
                <div class="input-field"><label>Goal:</label><span>Schedule demo meeting</span></div>
                <div class="input-field"><label>Tone:</label><span>Professional, friendly</span></div>`,
        output: `<strong>Subject: Quick question about your data strategy</strong>

Hi [Name],

I noticed your company recently raised Series B - congratulations! As you scale, I imagine data-driven decisions are becoming even more critical.

Our AI Analytics Platform has helped similar startups reduce analysis time by 60% while uncovering insights their teams were missing.

Would you be open to a 15-minute call this week to see if we might be a fit? I'd love to show you how [Similar Company] used our platform to identify a $2M revenue opportunity.

Best,
[Your name]

<em>P.S. No pressure - happy to just share some resources if a call isn't the right fit right now.</em>`
    },
    summary: {
        input: `<div class="input-field"><label>Meeting:</label><span>Q4 Planning Session</span></div>
                <div class="input-field"><label>Duration:</label><span>90 minutes</span></div>
                <div class="input-field"><label>Attendees:</label><span>Product, Engineering, Marketing</span></div>
                <div class="input-field"><label>Topics:</label><span>Roadmap, resources, timeline</span></div>`,
        output: `<strong>Q4 Planning Session - Summary</strong>

<strong>Key Decisions:</strong>
• Launch new dashboard feature by Nov 15
• Hire 2 additional engineers for mobile team
• Delay API v2 to Q1 to focus on stability

<strong>Action Items:</strong>
→ Sarah: Finalize feature specs by Friday
→ Mike: Post engineering job listings
→ Lisa: Update marketing timeline

<strong>Open Questions:</strong>
• Budget approval needed for contractor support
• Awaiting legal review on partnership terms

<strong>Next Meeting:</strong> Oct 15, 2pm - Progress check-in`
    },
    social: {
        input: `<div class="input-field"><label>Platform:</label><span>LinkedIn</span></div>
                <div class="input-field"><label>Topic:</label><span>AI in business</span></div>
                <div class="input-field"><label>Goal:</label><span>Thought leadership</span></div>
                <div class="input-field"><label>Tone:</label><span>Insightful, engaging</span></div>`,
        output: `<strong>LinkedIn Post</strong>

🤖 Hot take: AI won't replace your job. But someone using AI might.

After implementing AI tools across our team, here's what actually happened:

→ Content creation: 3 hours → 45 minutes
→ Data analysis: 2 days → 4 hours  
→ Customer response time: 24 hours → 2 hours

The secret? We didn't automate people out. We automated the boring stuff so our team could focus on what humans do best: creativity, strategy, and relationships.

The companies winning with AI aren't replacing workers. They're empowering them.

What's your experience been? 👇

#AI #FutureOfWork #Leadership`
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    initUseCaseExplorer();
    initROICalculator();
    initLiveDemo();
    initIndustryCards();
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
    const tabs = document.querySelectorAll('.dept-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            displayUseCases(tab.dataset.dept);
        });
    });
    
    // Initialize with marketing
    displayUseCases('marketing');
}

function displayUseCases(department) {
    const container = document.getElementById('useCasesDisplay');
    const useCases = departmentUseCases[department];
    
    container.innerHTML = useCases.map(uc => `
        <div class="use-case-item">
            <div class="use-case-icon">${uc.icon}</div>
            <h5>${uc.title}</h5>
            <p>${uc.description}</p>
            <span class="time-saved">${uc.timeSaved}</span>
        </div>
    `).join('');
}

// ============================================================================
// Section 2: ROI Calculator
// ============================================================================

function initROICalculator() {
    const inputs = ['tasksPerWeek', 'minutesPerTask', 'hourlyCost', 'timeReduction'];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', updateROI);
    });
    
    // Initialize
    updateROI();
}

function updateROI() {
    const tasksPerWeek = parseInt(document.getElementById('tasksPerWeek').value);
    const minutesPerTask = parseInt(document.getElementById('minutesPerTask').value);
    const hourlyCost = parseInt(document.getElementById('hourlyCost').value);
    const timeReduction = parseInt(document.getElementById('timeReduction').value) / 100;
    
    // Update display values
    document.getElementById('tasksValue').textContent = tasksPerWeek;
    document.getElementById('minutesValue').textContent = minutesPerTask;
    document.getElementById('costValue').textContent = `$${hourlyCost}`;
    document.getElementById('reductionValue').textContent = `${Math.round(timeReduction * 100)}%`;
    
    // Calculate
    const manualHoursPerWeek = (tasksPerWeek * minutesPerTask) / 60;
    const aiHoursPerWeek = manualHoursPerWeek * (1 - timeReduction);
    const hoursSaved = manualHoursPerWeek - aiHoursPerWeek;
    const weeklySavings = hoursSaved * hourlyCost;
    const monthlySavings = weeklySavings * 4;
    const annualSavings = monthlySavings * 12;
    
    // Update results
    document.getElementById('hoursSaved').textContent = Math.round(hoursSaved);
    document.getElementById('monthlySavings').textContent = `$${monthlySavings.toLocaleString()}`;
    document.getElementById('annualROI').textContent = `$${annualSavings.toLocaleString()}`;
    
    // Update chart
    const maxHours = Math.max(manualHoursPerWeek, 60);
    document.getElementById('manualBar').style.width = `${(manualHoursPerWeek / maxHours) * 100}%`;
    document.getElementById('aiBar').style.width = `${(aiHoursPerWeek / maxHours) * 100}%`;
    document.getElementById('manualTime').textContent = `${Math.round(manualHoursPerWeek)} hrs/week`;
    document.getElementById('aiTime').textContent = `${Math.round(aiHoursPerWeek)} hrs/week`;
}

// ============================================================================
// Section 3: Live Demo
// ============================================================================

function initLiveDemo() {
    const taskSelect = document.getElementById('taskSelect');
    const generateBtn = document.getElementById('generateBtn');
    
    taskSelect.addEventListener('change', updateTaskInput);
    generateBtn.addEventListener('click', generateOutput);
    
    // Initialize
    updateTaskInput();
}

function updateTaskInput() {
    const task = document.getElementById('taskSelect').value;
    const inputContent = document.getElementById('inputContent');
    const outputContent = document.getElementById('outputContent');
    
    inputContent.innerHTML = taskDemoData[task].input;
    outputContent.innerHTML = '<span class="placeholder">Click Generate to see AI output...</span>';
}

async function generateOutput() {
    const task = document.getElementById('taskSelect').value;
    const outputContent = document.getElementById('outputContent');
    
    outputContent.innerHTML = '<span style="color: var(--primary);">Generating...</span>';
    
    await sleep(1000);
    
    // Typing effect
    const output = taskDemoData[task].output;
    outputContent.innerHTML = '';
    
    for (let i = 0; i < output.length; i++) {
        outputContent.innerHTML = output.substring(0, i + 1);
        if (i % 5 === 0) await sleep(10);
    }
}

// ============================================================================
// Section 4: Industry Cards
// ============================================================================

function initIndustryCards() {
    const cards = document.querySelectorAll('.industry-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

// Utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
