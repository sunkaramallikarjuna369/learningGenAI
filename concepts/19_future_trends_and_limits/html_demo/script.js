/**
 * Future Trends and Limits - Interactive Demo Script
 * 
 * This demo explores the future of GenAI, emerging capabilities,
 * current limitations, and how to prepare for what's coming.
 */

// Role-based applications data
const roleApplications = {
    work: {
        title: 'Future of Work',
        apps: [
            { name: 'AI Colleagues', desc: 'AI agents that collaborate on projects alongside humans' },
            { name: 'Automated Research', desc: 'AI that conducts research and synthesizes findings' },
            { name: 'Personalized Training', desc: 'AI tutors that adapt to individual learning styles' },
            { name: 'Decision Support', desc: 'AI advisors for complex business decisions' }
        ]
    },
    science: {
        title: 'Science',
        apps: [
            { name: 'Drug Discovery', desc: 'AI-designed molecules and treatment protocols' },
            { name: 'Climate Modeling', desc: 'Advanced simulations for climate prediction' },
            { name: 'Materials Science', desc: 'Discovery of new materials with desired properties' },
            { name: 'Protein Engineering', desc: 'Design of novel proteins for medicine and industry' }
        ]
    },
    creative: {
        title: 'Creative',
        apps: [
            { name: 'Film Production', desc: 'AI-generated scenes, effects, and entire movies' },
            { name: 'Music Composition', desc: 'Original music tailored to any style or mood' },
            { name: 'Game Design', desc: 'Procedurally generated worlds and narratives' },
            { name: 'Fashion Design', desc: 'AI-created clothing designs and patterns' }
        ]
    },
    personal: {
        title: 'Personal AI',
        apps: [
            { name: 'Health Monitoring', desc: 'Continuous health analysis and early warning' },
            { name: 'Life Planning', desc: 'AI advisors for career and life decisions' },
            { name: 'Memory Augmentation', desc: 'AI that remembers and organizes your life' },
            { name: 'Personal Tutors', desc: 'Lifelong learning companions for any subject' }
        ]
    }
};

// 3D Future visualization state
let future3D = {
    mini3d: null,
    rotationY: 0,
    animating: false,
    progress: 0,
    capabilities: []
};

// Timeline event data
const timelineEvents = {
    "2017": {
        title: "Transformers Architecture",
        description: "Google introduces the Transformer architecture in 'Attention Is All You Need'. This breakthrough enables models to process sequences in parallel and handle long-range dependencies.",
        highlights: [
            "Self-attention mechanism revolutionizes NLP",
            "Foundation for all modern LLMs",
            "Enables massive scaling of models"
        ]
    },
    "2020": {
        title: "GPT-3 and Scaling Laws",
        description: "OpenAI releases GPT-3 with 175 billion parameters, demonstrating that scale leads to emergent capabilities. Few-shot learning becomes practical.",
        highlights: [
            "175B parameters - 100x larger than GPT-2",
            "Emergent few-shot learning abilities",
            "API access democratizes AI"
        ]
    },
    "2022": {
        title: "ChatGPT and RLHF",
        description: "ChatGPT launches and reaches 100M users in 2 months. Reinforcement Learning from Human Feedback (RLHF) makes AI more helpful and aligned.",
        highlights: [
            "Fastest-growing consumer app ever",
            "RLHF improves helpfulness and safety",
            "AI enters mainstream consciousness"
        ]
    },
    "2023": {
        title: "GPT-4 and Multimodal AI",
        description: "GPT-4 demonstrates near-human performance on many benchmarks. Multimodal models can understand images, audio, and text together.",
        highlights: [
            "Passes bar exam, medical licensing",
            "Vision capabilities added",
            "Open-source models catch up (Llama 2)"
        ]
    },
    "2025": {
        title: "AI Agents (Predicted)",
        description: "AI systems that can autonomously complete complex, multi-step tasks. Agents can use tools, browse the web, and work for extended periods.",
        highlights: [
            "Autonomous task completion",
            "Tool use and web browsing",
            "Multi-agent collaboration"
        ]
    },
    "2027": {
        title: "AGI? (Speculative)",
        description: "Artificial General Intelligence remains debated. Some predict human-level AI by late 2020s, others say it's decades away or may never happen.",
        highlights: [
            "Timeline highly uncertain",
            "Definition of AGI varies",
            "Safety and alignment critical"
        ]
    }
};

// Capability data
const capabilityData = {
    reasoning: {
        title: "Advanced Reasoning",
        status: "Emerging",
        description: "AI systems are getting better at multi-step reasoning, mathematical problem-solving, and logical deduction. Chain-of-thought prompting and specialized training improve performance.",
        current: "Can solve many math problems, follow complex instructions, and reason through scenarios. Still struggles with novel problems and can make logical errors.",
        future: "Expect significant improvements in formal reasoning, planning, and problem decomposition. May approach human-level on structured reasoning tasks.",
        progress: 60
    },
    agents: {
        title: "Autonomous Agents",
        status: "Emerging",
        description: "AI agents can browse the web, use tools, write and execute code, and complete multi-step tasks with minimal human intervention.",
        current: "Early agent systems (AutoGPT, Devin) show promise but often fail on complex tasks. Reliability and error recovery remain challenges.",
        future: "Agents will become more reliable and capable. Expect AI assistants that can handle entire workflows, from research to implementation.",
        progress: 40
    },
    video: {
        title: "Video Generation",
        status: "Available",
        description: "AI can now generate realistic videos from text descriptions. Models like Sora, Runway, and Pika create impressive short clips.",
        current: "Can generate short (seconds to minutes) videos with good quality. Physics and consistency over time still challenging.",
        future: "Longer, more coherent videos. Real-time generation. Integration with other media production tools.",
        progress: 70
    },
    science: {
        title: "Scientific Discovery",
        status: "Research",
        description: "AI assists with scientific research - analyzing data, suggesting hypotheses, and even making discoveries (like AlphaFold for protein structure).",
        current: "AlphaFold solved protein folding. AI helps with drug discovery, materials science, and mathematical proofs. Still requires human guidance.",
        future: "AI may autonomously generate and test hypotheses, accelerating scientific progress across fields.",
        progress: 35
    },
    robots: {
        title: "Robot Control",
        status: "Research",
        description: "Combining language models with robotics enables more flexible, general-purpose robots that can understand and execute natural language commands.",
        current: "Research demos show robots following complex instructions. Real-world deployment limited. Safety and reliability are major concerns.",
        future: "General-purpose robots for homes and workplaces. AI that understands physical world and can manipulate objects safely.",
        progress: 25
    },
    agi: {
        title: "General Intelligence",
        status: "Future",
        description: "Artificial General Intelligence - AI that can perform any intellectual task a human can. The ultimate goal and greatest uncertainty in AI.",
        current: "Current AI is narrow - excellent at specific tasks but lacks true understanding, common sense, and transfer learning.",
        future: "Timeline highly uncertain (years to decades). May require fundamental breakthroughs. Safety and alignment are critical concerns.",
        progress: 15
    }
};

// Limitation data
const limitationData = {
    hallucination: {
        title: "Hallucination",
        description: "AI models can generate confident, plausible-sounding information that is completely false. They don't 'know' what they don't know.",
        impact: "High - Can spread misinformation, cause errors in critical applications, erode trust in AI systems.",
        research: "Active research in retrieval-augmented generation (RAG), uncertainty quantification, and factual grounding. Progress is steady but problem not solved.",
        mitigation: "Use RAG for factual queries, verify important claims, implement fact-checking pipelines, train users to verify AI outputs.",
        progress: 40
    },
    reasoning: {
        title: "Complex Reasoning",
        description: "AI struggles with multi-step logical reasoning, especially novel problems that require combining concepts in new ways.",
        impact: "Medium - Limits use in complex analysis, planning, and problem-solving. Can produce plausible but incorrect reasoning.",
        research: "Chain-of-thought prompting, process reward models, neuro-symbolic approaches, and specialized reasoning training.",
        mitigation: "Break complex problems into steps, verify intermediate reasoning, use specialized tools for math/logic, human oversight for critical decisions.",
        progress: 55
    },
    memory: {
        title: "Limited Memory",
        description: "Most AI models don't remember previous conversations. Each session starts fresh. Long-term learning and personalization are limited.",
        impact: "Medium - Requires re-explaining context, limits personalization, can't build on previous interactions.",
        research: "Longer context windows (now 100K+ tokens), retrieval systems, memory-augmented architectures, and persistent storage solutions.",
        mitigation: "Use conversation history, implement external memory systems, leverage RAG for persistent knowledge.",
        progress: 60
    },
    realtime: {
        title: "No Real-Time Learning",
        description: "AI models are trained once and frozen. They can't learn from conversations or update their knowledge in real-time.",
        impact: "Low - Knowledge cutoff dates, can't incorporate feedback immediately, requires retraining for updates.",
        research: "Continual learning, online learning, efficient fine-tuning methods, and retrieval-based knowledge updates.",
        mitigation: "Use RAG for current information, implement feedback loops for future training, combine with real-time data sources.",
        progress: 30
    },
    physical: {
        title: "Physical World Understanding",
        description: "AI has limited understanding of physics, spatial reasoning, and how the physical world works. It learns from text, not experience.",
        impact: "Medium - Limits robotics applications, can give physically impossible advice, struggles with spatial tasks.",
        research: "World models, embodied AI, physics simulators, and multimodal training with video and 3D data.",
        mitigation: "Use specialized physics engines, verify physical claims, combine with simulation tools.",
        progress: 35
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    init3DFuture();
    initRoleApplications();
    initTimeline();
    initCapabilities();
    initLimitations();
});

// ============================================================================
// 3D AI Evolution Visualization
// ============================================================================

function init3DFuture() {
    const canvas = document.getElementById('future3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    future3D.mini3d = new Mini3D(canvas);
    
    // Create capability nodes representing AI evolution
    const capData = [
        { name: 'Language', color: '#4A90D9', x: -150, y: -80, z: 0, level: 0.9 },
        { name: 'Vision', color: '#9B59B6', x: -50, y: -80, z: 50, level: 0.85 },
        { name: 'Reasoning', color: '#E67E22', x: 50, y: -80, z: -50, level: 0.6 },
        { name: 'Agents', color: '#50C878', x: 150, y: -80, z: 0, level: 0.4 },
        { name: 'Robotics', color: '#E74C3C', x: 0, y: 80, z: 0, level: 0.25 }
    ];
    
    capData.forEach(c => {
        future3D.capabilities.push({
            x: c.x,
            y: c.y,
            z: c.z,
            name: c.name,
            color: c.color,
            level: c.level,
            currentLevel: 0,
            active: false
        });
    });
    
    document.getElementById('rotateLeftBtn3D')?.addEventListener('click', () => {
        future3D.rotationY -= 0.3;
        render3DFuture();
    });
    
    document.getElementById('rotateRightBtn3D')?.addEventListener('click', () => {
        future3D.rotationY += 0.3;
        render3DFuture();
    });
    
    document.getElementById('animateFutureBtn')?.addEventListener('click', () => {
        if (!future3D.animating) {
            future3D.animating = true;
            future3D.progress = 0;
            future3D.capabilities.forEach(c => {
                c.currentLevel = 0;
                c.active = false;
            });
            animateFuture3D();
        }
    });
    
    render3DFuture();
}

function animateFuture3D() {
    if (!future3D.animating) return;
    
    future3D.progress += 0.01;
    future3D.rotationY += 0.005;
    
    // Grow capability levels progressively
    future3D.capabilities.forEach((c, i) => {
        const delay = i * 0.15;
        if (future3D.progress > delay) {
            c.active = true;
            c.currentLevel = Math.min(c.level, (future3D.progress - delay) * 2);
        }
    });
    
    render3DFuture();
    
    if (future3D.progress < 1.5) {
        requestAnimationFrame(animateFuture3D);
    } else {
        future3D.animating = false;
    }
}

function render3DFuture() {
    const mini3d = future3D.mini3d;
    if (!mini3d) return;
    
    mini3d.clear();
    mini3d.setRotation(0.3, future3D.rotationY, 0);
    
    const centerX = mini3d.canvas.width / 2;
    const centerY = mini3d.canvas.height / 2;
    
    // Draw capability bars
    future3D.capabilities.forEach(cap => {
        const rotated = mini3d.rotatePoint(cap.x, cap.y, cap.z);
        const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
        
        // Draw bar background
        const barHeight = 100 * proj.scale;
        const barWidth = 30 * proj.scale;
        
        mini3d.ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        mini3d.ctx.fillRect(proj.x - barWidth/2, proj.y - barHeight/2, barWidth, barHeight);
        
        // Draw filled portion
        const fillHeight = barHeight * cap.currentLevel;
        const gradient = mini3d.ctx.createLinearGradient(proj.x, proj.y + barHeight/2 - fillHeight, proj.x, proj.y + barHeight/2);
        gradient.addColorStop(0, cap.color);
        gradient.addColorStop(1, cap.color + '66');
        
        mini3d.ctx.fillStyle = gradient;
        mini3d.ctx.fillRect(proj.x - barWidth/2, proj.y + barHeight/2 - fillHeight, barWidth, fillHeight);
        
        // Draw border
        mini3d.ctx.strokeStyle = cap.active ? cap.color : 'rgba(150, 150, 150, 0.5)';
        mini3d.ctx.lineWidth = 2;
        mini3d.ctx.strokeRect(proj.x - barWidth/2, proj.y - barHeight/2, barWidth, barHeight);
        
        // Draw label
        mini3d.ctx.fillStyle = '#fff';
        mini3d.ctx.font = `${10 * proj.scale}px Arial`;
        mini3d.ctx.textAlign = 'center';
        mini3d.ctx.fillText(cap.name, proj.x, proj.y + barHeight/2 + 15 * proj.scale);
        
        // Draw percentage
        if (cap.currentLevel > 0) {
            mini3d.ctx.fillStyle = cap.color;
            mini3d.ctx.fillText(`${Math.round(cap.currentLevel * 100)}%`, proj.x, proj.y - barHeight/2 - 5 * proj.scale);
        }
    });
    
    // Draw title
    mini3d.ctx.fillStyle = '#ccc';
    mini3d.ctx.font = '14px Arial';
    mini3d.ctx.textAlign = 'center';
    mini3d.ctx.fillText('AI Capability Evolution', centerX, 30);
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
    
    updateApplications('work');
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
// Section 1: Timeline
// ============================================================================

function initTimeline() {
    const events = document.querySelectorAll('.timeline-event');
    const detail = document.getElementById('timelineDetail');
    
    events.forEach(event => {
        event.addEventListener('click', () => {
            events.forEach(e => e.classList.remove('active'));
            event.classList.add('active');
            
            const year = event.dataset.year;
            const data = timelineEvents[year];
            
            detail.innerHTML = `
                <h4>${data.title} (${year})</h4>
                <p>${data.description}</p>
                <ul>
                    ${data.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
            `;
        });
    });
}

// ============================================================================
// Section 2: Capabilities
// ============================================================================

function initCapabilities() {
    const cards = document.querySelectorAll('.capability-card');
    const detail = document.getElementById('capabilityDetail');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const cap = capabilityData[card.dataset.cap];
            
            detail.innerHTML = `
                <h4>${cap.title}</h4>
                <p><strong>Status:</strong> ${cap.status}</p>
                <p>${cap.description}</p>
                <p><strong>Current State:</strong> ${cap.current}</p>
                <p><strong>Future Outlook:</strong> ${cap.future}</p>
                <div class="research-progress">
                    <h5>Development Progress</h5>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${cap.progress}%"></div>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 5px;">${cap.progress}% toward mainstream availability</p>
                </div>
            `;
        });
    });
}

// ============================================================================
// Section 3: Limitations
// ============================================================================

function initLimitations() {
    const items = document.querySelectorAll('.limitation-item');
    const detail = document.getElementById('limitationDetail');
    
    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const limit = limitationData[item.dataset.limit];
            
            detail.innerHTML = `
                <h4>${limit.title}</h4>
                <p>${limit.description}</p>
                <p><strong>Impact:</strong> ${limit.impact}</p>
                <p><strong>Research Progress:</strong> ${limit.research}</p>
                <p><strong>How to Mitigate:</strong> ${limit.mitigation}</p>
                <div class="research-progress">
                    <h5>Progress Toward Solution</h5>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${limit.progress}%"></div>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 5px;">${limit.progress}% solved</p>
                </div>
            `;
        });
    });
}

// Utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
