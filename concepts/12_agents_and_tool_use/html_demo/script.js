/**
 * Agents and Tool Use - Interactive Demo Script
 * 
 * This demo shows how AI agents work, including the ReAct loop,
 * tool use, and multi-agent collaboration.
 */

// Task data for ReAct demo
const taskData = {
    weather: {
        steps: [
            { type: 'thought', text: 'I need to find the current weather in Tokyo. I should use the weather search tool.' },
            { type: 'action', text: 'search_weather(location="Tokyo")' },
            { type: 'observation', text: 'Temperature: 22°C, Humidity: 65%, Conditions: Partly cloudy, Rain chance: 30%' },
            { type: 'thought', text: 'The weather is nice but there\'s a 30% chance of rain. I should recommend bringing an umbrella just in case.' },
            { type: 'final', text: 'The weather in Tokyo is 22°C and partly cloudy. There\'s a 30% chance of rain, so I recommend bringing an umbrella just to be safe!' }
        ]
    },
    math: {
        steps: [
            { type: 'thought', text: 'I need to calculate 15% of $47.50. I should use the calculator tool.' },
            { type: 'action', text: 'calculator(expression="47.50 * 0.15")' },
            { type: 'observation', text: 'Result: 7.125' },
            { type: 'thought', text: 'The tip amount is $7.125. I should round this to a practical amount.' },
            { type: 'final', text: 'A 15% tip on $47.50 is $7.13 (or round up to $7.50 for convenience). Your total would be $54.63 or $55.00.' }
        ]
    },
    research: {
        steps: [
            { type: 'thought', text: 'I need to find the latest AI news. I should search the web for recent articles.' },
            { type: 'action', text: 'search_web(query="latest AI news December 2024")' },
            { type: 'observation', text: 'Found 5 articles: 1) "GPT-5 Rumors Intensify" 2) "Google Gemini 2.0 Launch" 3) "AI Regulation Updates" 4) "Open Source LLM Breakthroughs" 5) "AI in Healthcare Advances"' },
            { type: 'thought', text: 'I found several relevant articles. Let me summarize the key headlines.' },
            { type: 'final', text: 'Here are the latest AI news highlights: GPT-5 development rumors, Google\'s Gemini 2.0 launch, new AI regulations being discussed, breakthroughs in open-source LLMs, and significant advances in AI healthcare applications.' }
        ]
    }
};

// Tool simulation data
const toolSimulations = {
    search: {
        placeholder: 'Enter search query...',
        execute: (input) => `Search results for "${input}":\n1. Wikipedia: ${input}\n2. News article about ${input}\n3. Research paper on ${input}`
    },
    calculator: {
        placeholder: 'Enter math expression (e.g., 2+2)...',
        execute: (input) => {
            try {
                const result = eval(input);
                return `Result: ${result}`;
            } catch (e) {
                return 'Error: Invalid expression';
            }
        }
    },
    email: {
        placeholder: 'Enter recipient email...',
        execute: (input) => `Email draft created for: ${input}\nSubject: [Draft]\nBody: [Your message here]\n\nStatus: Ready to send`
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    initReactDemo();
    initToolsDemo();
    initMultiAgentDemo();
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
// Section 2: ReAct Demo
// ============================================================================

function initReactDemo() {
    const runBtn = document.getElementById('runAgentBtn');
    runBtn.addEventListener('click', runReactAgent);
}

async function runReactAgent() {
    const taskSelect = document.getElementById('taskSelect');
    const task = taskSelect.value;
    const steps = taskData[task].steps;
    
    const loopSteps = document.querySelectorAll('.loop-step');
    const scratchpad = document.querySelector('.scratchpad-content');
    
    // Reset
    loopSteps.forEach(s => s.classList.remove('active'));
    scratchpad.innerHTML = '';
    document.getElementById('thinkContent').textContent = 'Agent reasoning...';
    document.getElementById('actContent').textContent = 'Tool execution...';
    document.getElementById('observeContent').textContent = 'Results...';
    
    // Process each step
    for (const step of steps) {
        if (step.type === 'thought') {
            // Activate Think step
            loopSteps[0].classList.add('active');
            document.getElementById('thinkContent').textContent = step.text.substring(0, 50) + '...';
            
            await addToScratchpad(scratchpad, 'thought', `Thought: ${step.text}`);
            await sleep(1000);
            loopSteps[0].classList.remove('active');
        } else if (step.type === 'action') {
            // Activate Act step
            loopSteps[1].classList.add('active');
            document.getElementById('actContent').textContent = step.text;
            
            await addToScratchpad(scratchpad, 'action', `Action: ${step.text}`);
            await sleep(1000);
            loopSteps[1].classList.remove('active');
        } else if (step.type === 'observation') {
            // Activate Observe step
            loopSteps[2].classList.add('active');
            document.getElementById('observeContent').textContent = step.text.substring(0, 50) + '...';
            
            await addToScratchpad(scratchpad, 'observation', `Observation: ${step.text}`);
            await sleep(1000);
            loopSteps[2].classList.remove('active');
        } else if (step.type === 'final') {
            await addToScratchpad(scratchpad, 'final', `Final Answer: ${step.text}`);
        }
    }
}

async function addToScratchpad(container, type, text) {
    const line = document.createElement('div');
    line.className = `scratch-line ${type}`;
    container.appendChild(line);
    
    // Typing effect
    for (let i = 0; i < text.length; i++) {
        line.textContent += text[i];
        if (i % 5 === 0) await sleep(10);
    }
    
    container.scrollTop = container.scrollHeight;
}

// ============================================================================
// Section 3: Tools Demo
// ============================================================================

function initToolsDemo() {
    const toolCards = document.querySelectorAll('.tool-card');
    const toolSelect = document.getElementById('toolSelect');
    const toolInput = document.getElementById('toolInput');
    const runToolBtn = document.getElementById('runToolBtn');
    
    // Tool card clicks
    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            const tool = card.dataset.tool;
            if (toolSimulations[tool]) {
                toolSelect.value = tool;
                updateToolInput(tool);
            }
            
            toolCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
    
    // Tool select change
    toolSelect.addEventListener('change', () => {
        updateToolInput(toolSelect.value);
    });
    
    // Run tool
    runToolBtn.addEventListener('click', executeTool);
    
    // Initialize
    updateToolInput('search');
}

function updateToolInput(tool) {
    const toolInput = document.getElementById('toolInput');
    if (toolSimulations[tool]) {
        toolInput.placeholder = toolSimulations[tool].placeholder;
        toolInput.value = '';
    }
}

async function executeTool() {
    const tool = document.getElementById('toolSelect').value;
    const input = document.getElementById('toolInput').value;
    const output = document.getElementById('toolOutput');
    
    if (!input.trim()) {
        output.innerHTML = '<span style="color: var(--danger);">Please enter an input</span>';
        return;
    }
    
    output.innerHTML = '<span style="color: var(--primary);">Executing...</span>';
    
    await sleep(500);
    
    const result = toolSimulations[tool].execute(input);
    output.textContent = result;
}

// ============================================================================
// Section 4: Multi-Agent Demo
// ============================================================================

const agentTasks = {
    researcher: {
        status: 'Gathering data...',
        output: 'Market data collected',
        duration: 1500
    },
    analyst: {
        status: 'Analyzing trends...',
        output: 'Trends identified',
        duration: 1500
    },
    writer: {
        status: 'Writing report...',
        output: 'Draft complete',
        duration: 1500
    },
    reviewer: {
        status: 'Reviewing quality...',
        output: 'Approved',
        duration: 1000
    }
};

function initMultiAgentDemo() {
    const runTeamBtn = document.getElementById('runTeamBtn');
    runTeamBtn.addEventListener('click', runTeam);
}

async function runTeam() {
    const agents = document.querySelectorAll('.agent-node');
    const resultContent = document.querySelector('.result-content');
    
    // Reset
    agents.forEach(a => {
        a.classList.remove('active', 'complete');
        a.querySelector('.agent-status').textContent = 'Idle';
        a.querySelector('.agent-output').textContent = '';
    });
    resultContent.innerHTML = '<span class="placeholder">Team working...</span>';
    
    // Process each agent sequentially
    for (const agent of agents) {
        const agentType = agent.dataset.agent;
        const task = agentTasks[agentType];
        
        // Activate agent
        agent.classList.add('active');
        agent.querySelector('.agent-status').textContent = task.status;
        
        await sleep(task.duration);
        
        // Complete agent
        agent.classList.remove('active');
        agent.classList.add('complete');
        agent.querySelector('.agent-status').textContent = 'Done';
        agent.querySelector('.agent-output').textContent = task.output;
    }
    
    // Show final result
    resultContent.innerHTML = `
        <strong>Market Analysis Report</strong><br><br>
        <strong>Executive Summary:</strong> Based on comprehensive research and analysis, the market shows positive growth trends with a 15% increase in Q4.<br><br>
        <strong>Key Findings:</strong><br>
        - Consumer spending up 12%<br>
        - Digital adoption accelerating<br>
        - Emerging markets showing potential<br><br>
        <strong>Recommendation:</strong> Proceed with expansion strategy.<br><br>
        <em style="color: var(--accent);">✓ Report reviewed and approved by Quality Agent</em>
    `;
}

// Utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
