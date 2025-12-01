/**
 * AI vs Generative AI - Interactive 3D Demo Script
 * 
 * This demo shows the fundamental difference between Traditional AI (classification/prediction)
 * and Generative AI (content creation) through 3D animated visualizations and real-time applications.
 */

// Real-time applications by role
const roleApplications = {
    teacher: {
        traditional: [
            "Grade essays automatically (pass/fail)",
            "Detect plagiarism in student work",
            "Predict student performance",
            "Classify learning styles"
        ],
        generative: [
            "Create lesson plans and curricula",
            "Generate quiz questions",
            "Write personalized feedback",
            "Create educational content"
        ]
    },
    marketer: {
        traditional: [
            "Segment customers by behavior",
            "Predict campaign performance",
            "Detect ad fraud",
            "Score leads automatically"
        ],
        generative: [
            "Write ad copy and headlines",
            "Generate social media posts",
            "Create email campaigns",
            "Design marketing content"
        ]
    },
    developer: {
        traditional: [
            "Detect bugs and vulnerabilities",
            "Classify code quality",
            "Predict build failures",
            "Identify security threats"
        ],
        generative: [
            "Write code from descriptions",
            "Generate documentation",
            "Create unit tests",
            "Refactor and optimize code"
        ]
    },
    doctor: {
        traditional: [
            "Diagnose from medical images",
            "Predict patient outcomes",
            "Detect anomalies in scans",
            "Risk stratification"
        ],
        generative: [
            "Generate patient summaries",
            "Write clinical notes",
            "Create treatment explanations",
            "Draft referral letters"
        ]
    },
    hr: {
        traditional: [
            "Screen resumes automatically",
            "Predict employee turnover",
            "Match candidates to roles",
            "Detect policy violations"
        ],
        generative: [
            "Write job descriptions",
            "Generate interview questions",
            "Create onboarding materials",
            "Draft performance reviews"
        ]
    }
};

// 3D Factory visualization
let factory3D = null;
let isAutoRotating = false;
let animationFrame = null;

function init3DFactory() {
    const canvas = document.getElementById('factory3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    factory3D = new Mini3D(canvas, {
        focalLength: 500,
        rotationX: 0.2,
        rotationY: 0
    });
    
    render3DFactory();
    
    // Set up controls
    document.getElementById('rotateLeftBtn')?.addEventListener('click', () => {
        factory3D.rotationY -= 0.3;
        render3DFactory();
    });
    
    document.getElementById('rotateRightBtn')?.addEventListener('click', () => {
        factory3D.rotationY += 0.3;
        render3DFactory();
    });
    
    document.getElementById('autoRotateBtn')?.addEventListener('click', (e) => {
        isAutoRotating = !isAutoRotating;
        e.target.classList.toggle('active', isAutoRotating);
        if (isAutoRotating) {
            autoRotate();
        }
    });
    
    // Mouse drag rotation
    let isDragging = false;
    let lastX = 0;
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastX = e.clientX;
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - lastX;
            factory3D.rotationY += deltaX * 0.01;
            lastX = e.clientX;
            render3DFactory();
        }
    });
    
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);
}

function autoRotate() {
    if (!isAutoRotating) return;
    factory3D.rotationY += 0.01;
    render3DFactory();
    animationFrame = requestAnimationFrame(autoRotate);
}

function render3DFactory() {
    if (!factory3D) return;
    
    factory3D.clear();
    const ctx = factory3D.ctx;
    
    // Draw Traditional AI Factory (left side)
    drawFactory(factory3D, -180, 0, 0, '#4A90D9', 'Traditional AI', [
        { icon: '📧', label: 'Input' },
        { icon: '🧠', label: 'Classify' },
        { icon: '🏷️', label: 'Label' }
    ]);
    
    // Draw Generative AI Studio (right side)
    drawFactory(factory3D, 180, 0, 0, '#7B68EE', 'Generative AI', [
        { icon: '💬', label: 'Prompt' },
        { icon: '✨', label: 'Generate' },
        { icon: '📝', label: 'Content' }
    ]);
    
    // Draw VS badge in center
    const vsPos = factory3D.project({ x: 0, y: -80, z: 50 });
    ctx.beginPath();
    ctx.arc(vsPos.x, vsPos.y, 25 * vsPos.scale, 0, Math.PI * 2);
    ctx.fillStyle = '#FF9800';
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = `bold ${16 * vsPos.scale}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VS', vsPos.x, vsPos.y);
    
    // Draw data flow particles
    drawDataParticles(factory3D);
}

function drawFactory(mini3d, centerX, centerY, centerZ, color, label, stages) {
    const ctx = mini3d.ctx;
    
    // Draw factory base (3D box)
    const baseWidth = 140;
    const baseHeight = 180;
    const baseDepth = 80;
    
    // Draw back face
    const backPoints = [
        { x: centerX - baseWidth/2, y: centerY - baseHeight/2, z: centerZ + baseDepth/2 },
        { x: centerX + baseWidth/2, y: centerY - baseHeight/2, z: centerZ + baseDepth/2 },
        { x: centerX + baseWidth/2, y: centerY + baseHeight/2, z: centerZ + baseDepth/2 },
        { x: centerX - baseWidth/2, y: centerY + baseHeight/2, z: centerZ + baseDepth/2 }
    ];
    mini3d.drawPlane(backPoints, { color, alpha: 0.3 });
    
    // Draw front face
    const frontPoints = [
        { x: centerX - baseWidth/2, y: centerY - baseHeight/2, z: centerZ - baseDepth/2 },
        { x: centerX + baseWidth/2, y: centerY - baseHeight/2, z: centerZ - baseDepth/2 },
        { x: centerX + baseWidth/2, y: centerY + baseHeight/2, z: centerZ - baseDepth/2 },
        { x: centerX - baseWidth/2, y: centerY + baseHeight/2, z: centerZ - baseDepth/2 }
    ];
    mini3d.drawPlane(frontPoints, { color, alpha: 0.6 });
    
    // Draw connecting edges
    for (let i = 0; i < 4; i++) {
        mini3d.drawLine(frontPoints[i], backPoints[i], { color, width: 2, alpha: 0.8 });
    }
    
    // Draw label
    mini3d.drawText(label, { x: centerX, y: centerY - baseHeight/2 - 20, z: centerZ }, {
        fontSize: 14,
        fontWeight: 'bold',
        color: color
    });
    
    // Draw stages inside factory
    const stageSpacing = baseHeight / (stages.length + 1);
    stages.forEach((stage, i) => {
        const stageY = centerY - baseHeight/2 + stageSpacing * (i + 1);
        
        // Draw stage sphere
        mini3d.drawSphere({ x: centerX, y: stageY, z: centerZ - 20 }, 20, {
            color: i === 1 ? '#50C878' : color,
            alpha: 0.9
        });
        
        // Draw stage label
        const labelPos = mini3d.project({ x: centerX, y: stageY, z: centerZ - 20 });
        ctx.fillStyle = 'white';
        ctx.font = `${12 * labelPos.scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(stage.icon, labelPos.x, labelPos.y - 5);
        ctx.fillStyle = '#333';
        ctx.font = `${10 * labelPos.scale}px Arial`;
        ctx.fillText(stage.label, labelPos.x, labelPos.y + 12);
        
        // Draw arrows between stages
        if (i < stages.length - 1) {
            const nextY = centerY - baseHeight/2 + stageSpacing * (i + 2);
            mini3d.drawLine(
                { x: centerX, y: stageY + 25, z: centerZ - 20 },
                { x: centerX, y: nextY - 25, z: centerZ - 20 },
                { color: '#50C878', width: 3, alpha: 0.8 }
            );
        }
    });
}

function drawDataParticles(mini3d) {
    const time = Date.now() / 1000;
    const ctx = mini3d.ctx;
    
    // Animate particles flowing through traditional AI
    for (let i = 0; i < 3; i++) {
        const t = ((time * 0.5 + i * 0.33) % 1);
        const y = -60 + t * 120;
        const particle = mini3d.project({ x: -180, y, z: -20 });
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 5 * particle.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 144, 217, ${1 - t})`;
        ctx.fill();
    }
    
    // Animate particles flowing through generative AI
    for (let i = 0; i < 3; i++) {
        const t = ((time * 0.5 + i * 0.33) % 1);
        const y = -60 + t * 120;
        const particle = mini3d.project({ x: 180, y, z: -20 });
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 5 * particle.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123, 104, 238, ${1 - t})`;
        ctx.fill();
    }
}

// Initialize role-based applications
function initRoleApplications() {
    const roleBtns = document.querySelectorAll('.role-btn');
    
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            roleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateApplications(btn.dataset.role);
        });
    });
    
    // Load default role
    updateApplications('teacher');
}

function updateApplications(role) {
    const apps = roleApplications[role];
    if (!apps) return;
    
    const tradList = document.getElementById('tradAppsList');
    const genList = document.getElementById('genAppsList');
    
    if (tradList) {
        tradList.innerHTML = apps.traditional.map(app => `<li>${app}</li>`).join('');
    }
    
    if (genList) {
        genList.innerHTML = apps.generative.map(app => `<li>${app}</li>`).join('');
    }
}

// Scenarios data - each scenario shows both Traditional and Generative AI handling the same domain
const scenarios = [
    {
        id: 'email',
        title: 'Email Processing',
        description: 'See how AI handles email differently',
        traditional: {
            input: '📧',
            inputLabel: 'Email',
            inputDetail: '"Win $1000 NOW! Click here..."',
            process: 'Analyzing patterns...',
            output: '🚫 SPAM',
            outputClass: 'spam'
        },
        generative: {
            input: '💬',
            inputLabel: 'Prompt',
            inputDetail: '"Write a polite reply declining..."',
            process: 'Generating response...',
            output: '"Thank you for your email. Unfortunately, I must respectfully decline..."',
            outputClass: 'text'
        }
    },
    {
        id: 'medical',
        title: 'Medical Analysis',
        description: 'Healthcare applications of AI',
        traditional: {
            input: '🩻',
            inputLabel: 'X-Ray',
            inputDetail: 'Chest X-ray image',
            process: 'Detecting anomalies...',
            output: '✓ Normal',
            outputClass: 'normal'
        },
        generative: {
            input: '💬',
            inputLabel: 'Request',
            inputDetail: '"Explain this diagnosis simply..."',
            process: 'Creating explanation...',
            output: '"Your X-ray shows healthy lungs with no signs of infection or abnormalities..."',
            outputClass: 'text'
        }
    },
    {
        id: 'finance',
        title: 'Financial Services',
        description: 'AI in banking and finance',
        traditional: {
            input: '💳',
            inputLabel: 'Transaction',
            inputDetail: '$5,000 purchase in foreign country',
            process: 'Checking patterns...',
            output: '⚠️ FRAUD ALERT',
            outputClass: 'alert'
        },
        generative: {
            input: '💬',
            inputLabel: 'Request',
            inputDetail: '"Summarize Q3 financial report..."',
            process: 'Drafting summary...',
            output: '"Q3 showed 15% revenue growth driven by strong product adoption..."',
            outputClass: 'text'
        }
    },
    {
        id: 'creative',
        title: 'Creative Work',
        description: 'AI in art and design',
        traditional: {
            input: '🖼️',
            inputLabel: 'Artwork',
            inputDetail: 'Painting image',
            process: 'Analyzing style...',
            output: '🎨 Impressionist',
            outputClass: 'style'
        },
        generative: {
            input: '💬',
            inputLabel: 'Prompt',
            inputDetail: '"Create a sunset over mountains..."',
            process: 'Generating image...',
            output: '🌄 [New Artwork Created]',
            outputClass: 'image'
        }
    }
];

// Animation steps for each scenario
function createStepsForScenario(scenario) {
    return [
        {
            title: `${scenario.title}`,
            explanation: `<strong>Scenario:</strong> ${scenario.description}. Watch how Traditional AI and Generative AI approach this differently.`,
            explanationTech: `Traditional AI will perform classification/prediction (discriminative model learning P(Y|X)), while Generative AI will create new content (generative model sampling from P(X)).`,
            render: () => {
                resetAnimation();
                updateScenario(scenario.title, scenario.description);
                
                // Set up inputs
                document.querySelector('#tradInput .input-icon').textContent = scenario.traditional.input;
                document.querySelector('#tradInput .input-label').textContent = scenario.traditional.inputLabel;
                document.querySelector('#genInput .input-icon').textContent = scenario.generative.input;
                document.querySelector('#genInput .input-label').textContent = scenario.generative.inputLabel;
            }
        },
        {
            title: 'Input Received',
            explanation: `<strong>Step 1:</strong> Both systems receive input. Traditional AI gets data to analyze (${scenario.traditional.inputDetail}). Generative AI gets a prompt or request (${scenario.generative.inputDetail}).`,
            explanationTech: `Input encoding: Traditional AI converts input to feature vectors for classification. Generative AI tokenizes the prompt for autoregressive generation.`,
            render: () => {
                // Highlight inputs
                document.getElementById('tradInput').classList.add('active');
                document.getElementById('genInput').classList.add('active');
                
                // Show input details
                updateScenario('Input Received', 
                    `Traditional: ${scenario.traditional.inputDetail}<br>Generative: ${scenario.generative.inputDetail}`);
            }
        },
        {
            title: 'Processing Begins',
            explanation: `<strong>Step 2:</strong> Data flows to the AI models. Traditional AI will analyze patterns to make a decision. Generative AI will use the prompt to create something new.`,
            explanationTech: `Traditional AI: Forward pass through discriminative network to compute P(Y|X). Generative AI: Begins autoregressive token generation or diffusion process.`,
            render: () => {
                // Activate first arrows
                document.getElementById('tradArrow1').classList.add('flowing');
                document.getElementById('genArrow1').classList.add('flowing');
                
                // Deactivate inputs after delay
                setTimeout(() => {
                    document.getElementById('tradInput').classList.remove('active');
                    document.getElementById('genInput').classList.remove('active');
                }, 500);
            }
        },
        {
            title: 'AI Models Working',
            explanation: `<strong>Step 3:</strong> The models are processing. Traditional AI: "${scenario.traditional.process}" Generative AI: "${scenario.generative.process}"`,
            explanationTech: `Traditional AI computes class probabilities via softmax. Generative AI samples tokens sequentially, each conditioned on previous tokens.`,
            render: () => {
                // Stop arrow animation, activate models
                document.getElementById('tradArrow1').classList.remove('flowing');
                document.getElementById('tradArrow1').classList.add('active');
                document.getElementById('genArrow1').classList.remove('flowing');
                document.getElementById('genArrow1').classList.add('active');
                
                // Activate model boxes
                document.getElementById('tradModel').classList.add('active', 'processing');
                document.getElementById('genModel').classList.add('active', 'processing');
                
                updateScenario('Processing...', 
                    `Traditional: ${scenario.traditional.process}<br>Generative: ${scenario.generative.process}`);
            }
        },
        {
            title: 'Output Generation',
            explanation: `<strong>Step 4:</strong> Results are being generated. Traditional AI produces a decision/label. Generative AI produces new content.`,
            explanationTech: `Traditional AI: argmax over class probabilities. Generative AI: Complete generated sequence after reaching end token or max length.`,
            render: () => {
                // Remove processing state
                document.getElementById('tradModel').classList.remove('processing');
                document.getElementById('genModel').classList.remove('processing');
                
                // Activate second arrows
                document.getElementById('tradArrow2').classList.add('flowing');
                document.getElementById('genArrow2').classList.add('flowing');
            }
        },
        {
            title: 'Results Ready',
            explanation: `<strong>Step 5:</strong> See the difference! Traditional AI output: <strong>${scenario.traditional.output}</strong> (a decision). Generative AI output: <strong>${scenario.generative.output}</strong> (new content).`,
            explanationTech: `Traditional AI returns discrete class label with confidence score. Generative AI returns novel sequence sampled from learned distribution.`,
            render: () => {
                // Stop arrow animation
                document.getElementById('tradArrow2').classList.remove('flowing');
                document.getElementById('tradArrow2').classList.add('active');
                document.getElementById('genArrow2').classList.remove('flowing');
                document.getElementById('genArrow2').classList.add('active');
                
                // Deactivate models
                document.getElementById('tradModel').classList.remove('active');
                document.getElementById('genModel').classList.remove('active');
                
                // Show outputs
                document.getElementById('tradOutput').classList.add('active');
                document.getElementById('genOutput').classList.add('active');
                
                const tradResult = document.getElementById('tradResult');
                const genResult = document.getElementById('genResult');
                
                tradResult.textContent = scenario.traditional.output;
                tradResult.classList.add('visible');
                
                genResult.textContent = scenario.generative.output.length > 50 
                    ? scenario.generative.output.substring(0, 50) + '...' 
                    : scenario.generative.output;
                genResult.classList.add('visible');
                
                updateScenario('Complete!', 
                    `Traditional AI made a <strong>decision</strong>. Generative AI <strong>created</strong> something new.`);
            }
        },
        {
            title: 'Key Insight',
            explanation: `<strong>The Key Difference:</strong> Traditional AI <em>analyzes and decides</em> (Is this spam? Is this fraud?). Generative AI <em>creates and generates</em> (Write a reply, Create an image). Both are powerful, but for different purposes!`,
            explanationTech: `Discriminative models optimize P(Y|X) for classification. Generative models learn P(X) to sample new instances. The choice depends on whether you need decisions or creations.`,
            render: () => {
                // Pulse both sides
                document.querySelector('.ai-side.traditional').classList.add('active');
                document.querySelector('.ai-side.generative').classList.add('active');
                
                updateScenario('Key Insight', 
                    'Traditional AI = Analyze & Decide | Generative AI = Create & Generate');
            }
        }
    ];
}

// Current state
let currentScenarioIndex = 0;
let demoController = null;
let trackToggle = null;

// Initialize the demo
function initDemo() {
    // Initialize track toggle
    trackToggle = new TrackToggle({
        defaultTrack: 'non-tech',
        onToggle: (track) => {
            updateExplanations();
        }
    });
    
    // Initialize 3D factory visualization
    init3DFactory();
    
    // Initialize role-based applications
    initRoleApplications();
    
    // Load first scenario
    loadScenario(0);
    
    // Set up example card clicks
    document.querySelectorAll('.example-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.example-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            loadScenario(index);
        });
    });
    
    // Select first card
    document.querySelector('.example-card')?.classList.add('selected');
}

// Load a scenario
function loadScenario(index) {
    currentScenarioIndex = index;
    const scenario = scenarios[index];
    const steps = createStepsForScenario(scenario);
    
    // Create or update demo controller
    if (demoController) {
        demoController.pause();
    }
    
    demoController = new DemoController({
        steps: steps,
        playSpeed: 2000,
        onStepChange: (stepIndex, step) => {
            updateExplanations();
        },
        onComplete: () => {
            console.log('Animation complete');
        }
    });
}

// Reset animation state
function resetAnimation() {
    // Remove all active states
    document.querySelectorAll('.active, .flowing, .processing, .visible').forEach(el => {
        el.classList.remove('active', 'flowing', 'processing', 'visible');
    });
    
    // Reset results
    document.getElementById('tradResult').textContent = '';
    document.getElementById('genResult').textContent = '';
    
    // Reset side panels
    document.querySelector('.ai-side.traditional').classList.remove('active');
    document.querySelector('.ai-side.generative').classList.remove('active');
}

// Update scenario display
function updateScenario(title, description) {
    document.getElementById('scenarioTitle').textContent = title;
    document.getElementById('scenarioDesc').innerHTML = description;
}

// Update explanations based on current track
function updateExplanations() {
    if (!demoController) return;
    
    const step = demoController.steps[demoController.currentStep];
    if (!step) return;
    
    const track = trackToggle ? trackToggle.getTrack() : 'non-tech';
    
    const nonTechExplanation = document.getElementById('stepExplanation');
    const techExplanation = document.getElementById('stepExplanationTech');
    
    if (nonTechExplanation) {
        nonTechExplanation.innerHTML = step.explanation || '';
    }
    
    if (techExplanation) {
        techExplanation.innerHTML = step.explanationTech || step.explanation || '';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDemo);
