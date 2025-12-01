/**
 * GenAI in Non-IT Roles - Interactive Demo Script
 * 
 * This demo shows how professionals in non-technical roles
 * can use AI to improve their productivity.
 */

// Role data
const roleData = {
    teacher: {
        title: "Teacher / Educator",
        description: "AI helps teachers create engaging content, personalize learning, and save time on administrative tasks.",
        useCases: [
            { icon: "📝", text: "Create lesson plans and curricula" },
            { icon: "📋", text: "Generate quizzes and assessments" },
            { icon: "💡", text: "Explain concepts at different levels" },
            { icon: "📊", text: "Provide personalized feedback" },
            { icon: "🎯", text: "Develop differentiated materials" }
        ]
    },
    marketer: {
        title: "Marketing Professional",
        description: "AI accelerates content creation, helps with campaign ideation, and enables personalization at scale.",
        useCases: [
            { icon: "✍️", text: "Write blog posts and articles" },
            { icon: "📱", text: "Create social media content" },
            { icon: "📧", text: "Draft email campaigns" },
            { icon: "🎨", text: "Generate ad copy variations" },
            { icon: "📈", text: "Analyze campaign performance" }
        ]
    },
    hr: {
        title: "HR Manager",
        description: "AI streamlines recruitment, improves employee communications, and helps create consistent policies.",
        useCases: [
            { icon: "📄", text: "Write job descriptions" },
            { icon: "🔍", text: "Screen resumes efficiently" },
            { icon: "❓", text: "Create interview questions" },
            { icon: "📋", text: "Draft policies and handbooks" },
            { icon: "🎓", text: "Develop training materials" }
        ]
    },
    sales: {
        title: "Sales Representative",
        description: "AI helps personalize outreach, research prospects, and create compelling proposals faster.",
        useCases: [
            { icon: "✉️", text: "Write personalized outreach emails" },
            { icon: "📊", text: "Create proposals and presentations" },
            { icon: "🔍", text: "Research prospects and companies" },
            { icon: "📝", text: "Summarize customer calls" },
            { icon: "💬", text: "Handle objections effectively" }
        ]
    },
    finance: {
        title: "Finance Professional",
        description: "AI assists with report generation, data analysis, and financial documentation.",
        useCases: [
            { icon: "📊", text: "Generate financial reports" },
            { icon: "📈", text: "Analyze trends and patterns" },
            { icon: "📝", text: "Create documentation" },
            { icon: "💼", text: "Draft client communications" },
            { icon: "🔍", text: "Research market conditions" }
        ]
    },
    legal: {
        title: "Legal Professional",
        description: "AI helps with document review, research, and drafting standard legal documents.",
        useCases: [
            { icon: "📄", text: "Review and summarize contracts" },
            { icon: "🔍", text: "Research case precedents" },
            { icon: "📝", text: "Draft standard documents" },
            { icon: "⚖️", text: "Analyze compliance requirements" },
            { icon: "📋", text: "Create client summaries" }
        ]
    }
};

// Task data by role
const taskData = {
    teacher: {
        tasks: ["Create a lesson plan", "Generate quiz questions", "Write feedback comments", "Explain a concept simply"],
        outputs: {
            "Create a lesson plan": `<h5>Lesson Plan: Introduction to Fractions</h5>
<p><strong>Grade Level:</strong> 4th Grade | <strong>Duration:</strong> 45 minutes</p>

<h5>Learning Objectives:</h5>
<ul>
<li>Students will understand what fractions represent</li>
<li>Students will identify numerators and denominators</li>
<li>Students will compare simple fractions</li>
</ul>

<h5>Materials Needed:</h5>
<ul>
<li>Fraction circles manipulatives</li>
<li>Whiteboard and markers</li>
<li>Practice worksheet</li>
</ul>

<h5>Lesson Structure:</h5>
<p><strong>Hook (5 min):</strong> Show a pizza divided into slices. Ask: "If we eat 2 of 8 slices, how much is left?"</p>
<p><strong>Direct Instruction (15 min):</strong> Introduce fraction vocabulary, demonstrate with manipulatives</p>
<p><strong>Guided Practice (15 min):</strong> Students work in pairs with fraction circles</p>
<p><strong>Independent Practice (10 min):</strong> Complete worksheet</p>`,
            "Generate quiz questions": `<h5>Quiz: Fractions (10 Questions)</h5>

<p><strong>Multiple Choice:</strong></p>
<p>1. What is the numerator in 3/4?<br>a) 3 b) 4 c) 7 d) 12</p>
<p>2. Which fraction is larger: 1/2 or 1/4?<br>a) 1/2 b) 1/4 c) They're equal</p>
<p>3. What fraction of this shape is shaded? [circle with 3/8 shaded]<br>a) 3/8 b) 5/8 c) 3/5</p>

<p><strong>Fill in the Blank:</strong></p>
<p>4. In the fraction 5/6, the number 6 is called the _______</p>
<p>5. 2/4 is equivalent to _______</p>

<p><strong>Short Answer:</strong></p>
<p>6. Draw a picture showing 2/3 of a rectangle</p>
<p>7. Explain why 1/2 is greater than 1/3</p>`,
            "Write feedback comments": `<h5>Student Feedback Comments</h5>

<p><strong>For strong work:</strong></p>
<p>"Excellent problem-solving! You showed clear understanding of how to find equivalent fractions. Your work is well-organized and easy to follow. Challenge yourself next time by trying mixed numbers!"</p>

<p><strong>For developing work:</strong></p>
<p>"Good effort on this assignment! I can see you understand the basics of fractions. Let's work together on comparing fractions - try drawing pictures to help visualize which is larger. Keep practicing!"</p>

<p><strong>For struggling work:</strong></p>
<p>"Thank you for your effort. I noticed you're having trouble identifying the numerator and denominator. Remember: the top number (numerator) tells us how many parts we have, and the bottom number (denominator) tells us how many equal parts make the whole. Let's meet during office hours to practice together."</p>`,
            "Explain a concept simply": `<h5>What are Fractions? (Simple Explanation)</h5>

<p>Imagine you have a pizza. 🍕</p>

<p>If you cut it into 4 equal slices, each slice is <strong>one fourth</strong> (1/4) of the pizza.</p>

<p>A fraction is just a way to describe <strong>parts of a whole thing</strong>.</p>

<p>The fraction has two numbers:</p>
<ul>
<li><strong>Top number (numerator):</strong> How many pieces you have</li>
<li><strong>Bottom number (denominator):</strong> How many equal pieces the whole thing is cut into</li>
</ul>

<p>So if you eat 2 slices of a pizza cut into 4 pieces, you ate <strong>2/4</strong> (two fourths) of the pizza!</p>

<p>That's the same as eating <strong>half</strong> the pizza (1/2). Cool, right? 😊</p>`
        },
        timeSaved: "~45 minutes saved"
    },
    marketer: {
        tasks: ["Write a blog post outline", "Create social media posts", "Draft email campaign", "Generate ad copy"],
        outputs: {
            "Write a blog post outline": `<h5>Blog Post: "5 Ways AI is Transforming Small Business Marketing"</h5>

<p><strong>Target Audience:</strong> Small business owners | <strong>Word Count:</strong> 1,500</p>

<h5>Outline:</h5>

<p><strong>Introduction (150 words)</strong></p>
<ul>
<li>Hook: Surprising stat about AI adoption in small businesses</li>
<li>Thesis: AI tools are now accessible and affordable for businesses of all sizes</li>
</ul>

<p><strong>Section 1: Content Creation (250 words)</strong></p>
<ul>
<li>AI writing assistants for blogs, social media</li>
<li>Example: How a bakery uses AI for Instagram captions</li>
</ul>

<p><strong>Section 2: Customer Service (250 words)</strong></p>
<ul>
<li>Chatbots and automated responses</li>
<li>24/7 availability without hiring staff</li>
</ul>

<p><strong>Section 3: Personalization (250 words)</strong></p>
<ul>
<li>Email segmentation and personalized recommendations</li>
<li>Case study: Local retailer increases sales 30%</li>
</ul>

<p><strong>Conclusion + CTA (150 words)</strong></p>`,
            "Create social media posts": `<h5>Social Media Posts: Product Launch</h5>

<p><strong>Instagram:</strong></p>
<p>✨ It's finally here! ✨</p>
<p>Introducing our new EcoBottle Pro - because staying hydrated shouldn't cost the Earth. 🌍💧</p>
<p>→ BPA-free materials<br>→ 24-hour cold retention<br>→ Made from 100% recycled ocean plastic</p>
<p>Link in bio to get yours! 🔗</p>
<p>#SustainableLiving #EcoFriendly #HydrationGoals</p>

<p><strong>LinkedIn:</strong></p>
<p>Excited to announce the launch of EcoBottle Pro!</p>
<p>After 18 months of R&D, we've created a water bottle that combines premium insulation technology with sustainable materials.</p>
<p>Key innovation: Our proprietary process transforms ocean plastic into durable, food-safe containers.</p>
<p>Learn more: [link]</p>

<p><strong>Twitter/X:</strong></p>
<p>🚀 NEW: EcoBottle Pro is here!</p>
<p>24-hr cold retention + made from recycled ocean plastic = guilt-free hydration</p>
<p>Shop now → [link]</p>`,
            "Draft email campaign": `<h5>Email Campaign: Welcome Series (Email 1 of 3)</h5>

<p><strong>Subject:</strong> Welcome to [Brand]! Here's 15% off your first order 🎉</p>

<p>Hi [First Name],</p>

<p>Welcome to the [Brand] family! We're thrilled to have you.</p>

<p>As a thank you for joining us, here's <strong>15% off</strong> your first purchase:</p>

<p><strong>Code: WELCOME15</strong></p>

<p>Here's what you can expect from us:</p>
<ul>
<li>🌱 Sustainable products that don't compromise on quality</li>
<li>📦 Free shipping on orders over $50</li>
<li>💚 A community of eco-conscious consumers like you</li>
</ul>

<p>Ready to shop? Browse our bestsellers →</p>

<p>[CTA Button: Shop Now]</p>

<p>Questions? Just reply to this email - we're real humans who love to help!</p>

<p>Cheers,<br>The [Brand] Team</p>`,
            "Generate ad copy": `<h5>Ad Copy Variations: EcoBottle Pro</h5>

<p><strong>Version A (Benefit-focused):</strong></p>
<p>Headline: "Ice-cold drinks. All day. Zero guilt."</p>
<p>Body: The EcoBottle Pro keeps drinks cold for 24 hours - and it's made from recycled ocean plastic. Hydration that helps the planet.</p>
<p>CTA: Shop Now</p>

<p><strong>Version B (Problem-solution):</strong></p>
<p>Headline: "Tired of lukewarm water by noon?"</p>
<p>Body: EcoBottle Pro's double-wall insulation keeps your drink ice-cold for 24 hours. Plus, every bottle removes plastic from our oceans.</p>
<p>CTA: Get Yours</p>

<p><strong>Version C (Social proof):</strong></p>
<p>Headline: "Join 50,000+ eco-warriors"</p>
<p>Body: "Best water bottle I've ever owned" - See why thousands are switching to EcoBottle Pro. Premium quality. Sustainable materials.</p>
<p>CTA: Join the Movement</p>`
        },
        timeSaved: "~2 hours saved"
    },
    hr: {
        tasks: ["Write job description", "Create interview questions", "Draft policy document", "Write rejection email"],
        outputs: {
            "Write job description": `<h5>Job Description: Senior Marketing Manager</h5>

<p><strong>Location:</strong> Remote (US) | <strong>Type:</strong> Full-time</p>

<p><strong>About the Role:</strong></p>
<p>We're looking for a Senior Marketing Manager to lead our brand strategy and drive growth. You'll own our marketing roadmap, manage a team of 3, and work closely with Sales and Product.</p>

<p><strong>What You'll Do:</strong></p>
<ul>
<li>Develop and execute integrated marketing campaigns</li>
<li>Manage $500K annual marketing budget</li>
<li>Lead brand positioning and messaging strategy</li>
<li>Analyze campaign performance and optimize ROI</li>
<li>Mentor and develop junior team members</li>
</ul>

<p><strong>What You'll Bring:</strong></p>
<ul>
<li>5+ years of B2B marketing experience</li>
<li>Proven track record of successful campaigns</li>
<li>Experience with marketing automation tools</li>
<li>Strong analytical and communication skills</li>
<li>Bachelor's degree in Marketing or related field</li>
</ul>

<p><strong>Benefits:</strong></p>
<ul>
<li>Competitive salary + equity</li>
<li>Unlimited PTO</li>
<li>Health, dental, vision insurance</li>
<li>$1,000 annual learning budget</li>
</ul>`,
            "Create interview questions": `<h5>Interview Questions: Senior Marketing Manager</h5>

<p><strong>Experience & Skills:</strong></p>
<p>1. Tell me about a marketing campaign you led that exceeded expectations. What made it successful?</p>
<p>2. How do you approach budget allocation across different marketing channels?</p>
<p>3. Describe your experience with marketing automation. Which tools have you used?</p>

<p><strong>Behavioral:</strong></p>
<p>4. Tell me about a time when a campaign didn't perform as expected. How did you handle it?</p>
<p>5. Describe a situation where you had to influence stakeholders who disagreed with your marketing strategy.</p>
<p>6. How do you prioritize when you have multiple competing projects?</p>

<p><strong>Leadership:</strong></p>
<p>7. How do you approach developing junior team members?</p>
<p>8. Tell me about a time you had to give difficult feedback to a team member.</p>

<p><strong>Strategic Thinking:</strong></p>
<p>9. How would you approach building a marketing strategy for a new product launch?</p>
<p>10. What metrics do you consider most important for measuring marketing success?</p>`,
            "Draft policy document": `<h5>Remote Work Policy</h5>

<p><strong>Effective Date:</strong> [Date] | <strong>Version:</strong> 1.0</p>

<p><strong>Purpose:</strong></p>
<p>This policy establishes guidelines for remote work arrangements to ensure productivity, collaboration, and work-life balance.</p>

<p><strong>Eligibility:</strong></p>
<p>All full-time employees who have completed their probationary period may request remote work arrangements, subject to manager approval.</p>

<p><strong>Guidelines:</strong></p>
<ul>
<li><strong>Core Hours:</strong> Employees must be available 10am-3pm in their local timezone</li>
<li><strong>Communication:</strong> Respond to messages within 4 business hours</li>
<li><strong>Equipment:</strong> Company provides laptop; employees ensure reliable internet</li>
<li><strong>Security:</strong> Use VPN for all company systems; no public WiFi for sensitive work</li>
</ul>

<p><strong>Expectations:</strong></p>
<ul>
<li>Maintain regular communication with team and manager</li>
<li>Attend required meetings via video when possible</li>
<li>Meet all deadlines and performance standards</li>
<li>Maintain a professional home office environment</li>
</ul>`,
            "Write rejection email": `<h5>Candidate Rejection Email (After Interview)</h5>

<p><strong>Subject:</strong> Your Application for [Position] at [Company]</p>

<p>Dear [Candidate Name],</p>

<p>Thank you for taking the time to interview for the [Position] role at [Company]. We enjoyed learning about your experience and career goals.</p>

<p>After careful consideration, we've decided to move forward with another candidate whose background more closely aligns with our current needs. This was a difficult decision, as we were impressed by your [specific positive quality].</p>

<p>We'd like to keep your resume on file for future opportunities that may be a better fit. The job market is always evolving, and we'd welcome the chance to reconnect.</p>

<p>We wish you the best in your job search and future career endeavors.</p>

<p>Warm regards,</p>
<p>[Your Name]<br>[Title]<br>[Company]</p>`
        },
        timeSaved: "~1 hour saved"
    },
    sales: {
        tasks: ["Write outreach email", "Create proposal outline", "Summarize customer call", "Handle objection"],
        outputs: {
            "Write outreach email": `<h5>Cold Outreach Email</h5>

<p><strong>Subject:</strong> Quick question about [Company]'s growth plans</p>

<p>Hi [First Name],</p>

<p>I noticed [Company] just expanded into the European market - congratulations! That's exciting growth.</p>

<p>I'm reaching out because we've helped similar companies like [Similar Company] streamline their international operations, reducing overhead by 30% while scaling.</p>

<p>Would you be open to a 15-minute call next week to see if we might be able to help [Company] as you expand?</p>

<p>If not, no worries at all - I'd be happy to just share some resources that might be useful.</p>

<p>Best,<br>[Your Name]</p>

<p>P.S. I saw your recent post about [topic] - great insights!</p>`,
            "Create proposal outline": `<h5>Proposal Outline: [Client Name]</h5>

<p><strong>1. Executive Summary</strong></p>
<ul>
<li>Client's challenge (in their words)</li>
<li>Our proposed solution</li>
<li>Expected outcomes and ROI</li>
</ul>

<p><strong>2. Understanding Your Needs</strong></p>
<ul>
<li>Current situation analysis</li>
<li>Key pain points identified</li>
<li>Goals and success metrics</li>
</ul>

<p><strong>3. Proposed Solution</strong></p>
<ul>
<li>Solution overview</li>
<li>Implementation approach</li>
<li>Timeline and milestones</li>
</ul>

<p><strong>4. Why [Our Company]</strong></p>
<ul>
<li>Relevant experience</li>
<li>Case studies</li>
<li>Team credentials</li>
</ul>

<p><strong>5. Investment</strong></p>
<ul>
<li>Pricing options</li>
<li>Payment terms</li>
<li>What's included</li>
</ul>

<p><strong>6. Next Steps</strong></p>`,
            "Summarize customer call": `<h5>Call Summary: [Client Name] - Discovery Call</h5>

<p><strong>Date:</strong> [Date] | <strong>Duration:</strong> 45 minutes | <strong>Attendees:</strong> [Names]</p>

<p><strong>Key Points Discussed:</strong></p>
<ul>
<li>Currently using [Competitor] but frustrated with limited reporting</li>
<li>Team of 15 users, expecting to grow to 25 by Q2</li>
<li>Budget: $50-75K annually</li>
<li>Decision timeline: 6-8 weeks</li>
</ul>

<p><strong>Pain Points:</strong></p>
<ul>
<li>Manual data entry taking 10+ hours/week</li>
<li>No visibility into team performance</li>
<li>Integration issues with their CRM</li>
</ul>

<p><strong>Next Steps:</strong></p>
<ul>
<li>Send product demo recording by Friday</li>
<li>Schedule technical call with their IT team</li>
<li>Prepare custom ROI analysis</li>
</ul>

<p><strong>Follow-up Date:</strong> [Date]</p>`,
            "Handle objection": `<h5>Objection Handling: "Your price is too high"</h5>

<p><strong>Acknowledge:</strong></p>
<p>"I appreciate you being direct about budget concerns. Price is definitely an important factor in any decision."</p>

<p><strong>Clarify:</strong></p>
<p>"Help me understand - when you say the price is too high, are you comparing us to a specific alternative, or is it about the overall budget allocation?"</p>

<p><strong>Reframe Value:</strong></p>
<p>"Let's look at the total cost of ownership. With [Competitor], you'd also need to pay for [additional costs]. Our solution includes [features] which typically saves customers [X hours/dollars] per month."</p>

<p><strong>Provide Options:</strong></p>
<p>"We do have a few options that might work better for your budget:</p>
<ul>
<li>Annual payment (15% discount)</li>
<li>Starter tier with core features</li>
<li>Phased implementation</li>
</ul>

<p><strong>Ask:</strong></p>
<p>"If we could find a way to make the investment work within your budget, would you be ready to move forward?"</p>`
        },
        timeSaved: "~30 minutes saved"
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    initRoleExplorer();
    initTaskAssistant();
    initPromptBuilder();
    initSavingsCalculator();
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
// Section 1: Role Explorer
// ============================================================================

function initRoleExplorer() {
    const roleCards = document.querySelectorAll('.role-card');
    const roleDetails = document.getElementById('roleDetails');
    
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            roleCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const role = roleData[card.dataset.role];
            roleDetails.innerHTML = `
                <h4>${role.title}</h4>
                <p>${role.description}</p>
                <ul class="use-case-list">
                    ${role.useCases.map(uc => `
                        <li><span class="case-icon">${uc.icon}</span> ${uc.text}</li>
                    `).join('')}
                </ul>
            `;
        });
    });
}

// ============================================================================
// Section 2: Task Assistant
// ============================================================================

function initTaskAssistant() {
    const roleSelect = document.getElementById('roleSelect');
    const taskSelect = document.getElementById('taskSelect');
    const generateBtn = document.getElementById('generateTaskBtn');
    const taskOutput = document.getElementById('taskOutput');
    const timeBadge = document.getElementById('timeBadge');
    
    // Update tasks when role changes
    roleSelect.addEventListener('change', updateTaskOptions);
    
    // Generate output
    generateBtn.addEventListener('click', async () => {
        const role = roleSelect.value;
        const task = taskSelect.value;
        
        taskOutput.innerHTML = '<span style="color: var(--primary);">Generating...</span>';
        
        await sleep(1500);
        
        const output = taskData[role].outputs[task];
        taskOutput.innerHTML = output;
        timeBadge.textContent = taskData[role].timeSaved;
    });
    
    // Initialize
    updateTaskOptions();
}

function updateTaskOptions() {
    const role = document.getElementById('roleSelect').value;
    const taskSelect = document.getElementById('taskSelect');
    const tasks = taskData[role].tasks;
    
    taskSelect.innerHTML = tasks.map(task => 
        `<option value="${task}">${task}</option>`
    ).join('');
}

// ============================================================================
// Section 3: Prompt Builder
// ============================================================================

function initPromptBuilder() {
    const inputs = ['promptTask', 'promptAudience', 'promptFormat', 'promptTone'];
    const preview = document.getElementById('promptPreview');
    const copyBtn = document.getElementById('copyPromptBtn');
    
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updatePromptPreview);
        document.getElementById(id).addEventListener('change', updatePromptPreview);
    });
    
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(preview.textContent).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy Prompt', 2000);
        });
    });
}

function updatePromptPreview() {
    const task = document.getElementById('promptTask').value || '[your task]';
    const audience = document.getElementById('promptAudience').value || '[your audience]';
    const format = document.getElementById('promptFormat').value;
    const tone = document.getElementById('promptTone').value;
    
    const formatMap = {
        paragraph: 'in paragraph form',
        bullets: 'as a bullet point list',
        table: 'in a table format',
        steps: 'as numbered steps'
    };
    
    const prompt = `Please help me ${task}.

Target audience: ${audience}

Requirements:
- Format the response ${formatMap[format]}
- Use a ${tone} tone
- Keep it clear and concise
- Include specific examples where helpful

Please provide a complete, ready-to-use response.`;
    
    document.getElementById('promptPreview').textContent = prompt;
}

// ============================================================================
// Section 4: Savings Calculator
// ============================================================================

function initSavingsCalculator() {
    const checkboxes = document.querySelectorAll('.check-item input');
    
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateSavings);
    });
}

function updateSavings() {
    const checkboxes = document.querySelectorAll('.check-item input:checked');
    let totalMinutes = 0;
    
    checkboxes.forEach(cb => {
        totalMinutes += parseInt(cb.dataset.time);
    });
    
    const currentHours = totalMinutes / 60;
    const aiHours = currentHours * 0.35; // AI reduces time by ~65%
    const savedHours = currentHours - aiHours;
    const annualSaved = savedHours * 52;
    
    document.getElementById('currentTime').textContent = `${currentHours.toFixed(1)} hrs/week`;
    document.getElementById('aiTime').textContent = `${aiHours.toFixed(1)} hrs/week`;
    document.getElementById('timeSaved').textContent = `${savedHours.toFixed(1)} hrs/week`;
    document.getElementById('annualSaved').textContent = `${Math.round(annualSaved)} hours`;
}

// Utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
