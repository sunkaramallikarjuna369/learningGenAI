/**
 * AI vs Generative AI - Interactive Demo Script
 * 
 * This demo shows the fundamental difference between Traditional AI (classification/prediction)
 * and Generative AI (content creation) through animated scenarios.
 */

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
    document.querySelector('.example-card').classList.add('selected');
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
