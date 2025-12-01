/**
 * Responsible AI and Ethics - Interactive Demo Script
 * 
 * This demo shows key principles of responsible AI including
 * fairness, transparency, and ethical considerations.
 */

// Role-based applications data
const roleApplications = {
    hiring: {
        title: 'Hiring',
        apps: [
            { name: 'Bias Auditing', desc: 'Regular testing for demographic disparities in candidate screening' },
            { name: 'Explainable Decisions', desc: 'Clear reasons for why candidates were selected or rejected' },
            { name: 'Human Oversight', desc: 'Final hiring decisions made by humans, not algorithms' },
            { name: 'Diverse Training Data', desc: 'Ensure training data represents all demographic groups fairly' }
        ]
    },
    lending: {
        title: 'Lending',
        apps: [
            { name: 'Fair Lending Compliance', desc: 'Ensure equal access to credit across protected groups' },
            { name: 'Adverse Action Notices', desc: 'Clear explanations when loan applications are denied' },
            { name: 'Disparate Impact Testing', desc: 'Regular audits for unintentional discrimination' },
            { name: 'Alternative Data Review', desc: 'Careful evaluation of non-traditional credit factors' }
        ]
    },
    healthcare: {
        title: 'Healthcare',
        apps: [
            { name: 'Clinical Validation', desc: 'Rigorous testing across diverse patient populations' },
            { name: 'Informed Consent', desc: 'Patients understand when AI is used in their care' },
            { name: 'Physician Override', desc: 'Doctors can override AI recommendations' },
            { name: 'Outcome Monitoring', desc: 'Track AI impact on health outcomes by demographic' }
        ]
    },
    criminal: {
        title: 'Criminal Justice',
        apps: [
            { name: 'Risk Assessment Audits', desc: 'Regular testing for racial and socioeconomic bias' },
            { name: 'Transparency Requirements', desc: 'Defendants can understand and challenge AI assessments' },
            { name: 'Human Decision-Making', desc: 'Judges make final decisions, AI provides information only' },
            { name: 'Recidivism Accuracy', desc: 'Validate predictions against actual outcomes' }
        ]
    }
};

// 3D Ethics visualization state
let ethics3D = {
    mini3d: null,
    rotationY: 0,
    animating: false,
    progress: 0,
    principles: []
};

// Principle details
const principleDetails = {
    fairness: {
        title: 'Fairness',
        description: 'AI systems should treat all people equitably, without discrimination based on race, gender, age, or other protected characteristics. This requires measuring and mitigating bias in training data and model outputs.'
    },
    transparency: {
        title: 'Transparency',
        description: 'AI decisions should be explainable and understandable. Users have the right to know how AI systems work and why they made specific decisions, especially for high-stakes applications.'
    },
    privacy: {
        title: 'Privacy',
        description: 'AI systems must protect personal data and respect user privacy. This includes data minimization, secure storage, and giving users control over their information.'
    },
    accountability: {
        title: 'Accountability',
        description: 'There must be clear responsibility for AI outcomes. Organizations should document decisions, maintain audit trails, and have processes for addressing AI failures or harms.'
    },
    safety: {
        title: 'Safety',
        description: 'AI systems should be reliable and secure, with safeguards against misuse. This includes testing for edge cases, implementing guardrails, and monitoring for unexpected behavior.'
    },
    human: {
        title: 'Human-Centered',
        description: 'AI should augment human capabilities, not replace human judgment for critical decisions. Humans should remain in control, especially for high-stakes applications affecting people\'s lives.'
    }
};

// Mitigation data
const mitigationData = {
    none: {
        groupA: 75,
        groupB: 45,
        disparity: 30,
        biased: true,
        message: 'Bias Detected! 30% disparity in approval rates'
    },
    reweight: {
        groupA: 68,
        groupB: 62,
        disparity: 6,
        biased: false,
        message: 'Bias Reduced! 6% disparity after reweighting'
    },
    threshold: {
        groupA: 65,
        groupB: 65,
        disparity: 0,
        biased: false,
        message: 'Bias Eliminated! Equal approval rates achieved'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    init3DEthics();
    initRoleApplications();
    initPrinciplesDemo();
    initBiasDemo();
    initScenariosDemo();
});

// ============================================================================
// 3D Ethics Balance Visualization
// ============================================================================

function init3DEthics() {
    const canvas = document.getElementById('ethics3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    ethics3D.mini3d = new Mini3D(canvas);
    
    // Create principle nodes in 3D space
    const principleData = [
        { name: 'Fairness', color: '#4A90D9', angle: 0 },
        { name: 'Transparency', color: '#50C878', angle: 1.05 },
        { name: 'Privacy', color: '#9B59B6', angle: 2.09 },
        { name: 'Accountability', color: '#E67E22', angle: 3.14 },
        { name: 'Safety', color: '#E74C3C', angle: 4.19 },
        { name: 'Human-Centered', color: '#F1C40F', angle: 5.24 }
    ];
    
    const radius = 150;
    principleData.forEach(p => {
        ethics3D.principles.push({
            x: Math.cos(p.angle) * radius,
            y: (Math.random() - 0.5) * 50,
            z: Math.sin(p.angle) * radius,
            name: p.name,
            color: p.color,
            pulse: Math.random()
        });
    });
    
    document.getElementById('rotateLeftBtn3D')?.addEventListener('click', () => {
        ethics3D.rotationY -= 0.3;
        render3DEthics();
    });
    
    document.getElementById('rotateRightBtn3D')?.addEventListener('click', () => {
        ethics3D.rotationY += 0.3;
        render3DEthics();
    });
    
    document.getElementById('animateEthicsBtn')?.addEventListener('click', () => {
        if (!ethics3D.animating) {
            ethics3D.animating = true;
            ethics3D.progress = 0;
            animateEthicsBalance();
        }
    });
    
    render3DEthics();
}

function animateEthicsBalance() {
    if (!ethics3D.animating) return;
    
    ethics3D.progress += 0.02;
    ethics3D.rotationY += 0.02;
    
    // Pulse principles
    ethics3D.principles.forEach(p => {
        p.pulse += 0.05;
    });
    
    render3DEthics();
    
    if (ethics3D.progress < 1) {
        requestAnimationFrame(animateEthicsBalance);
    } else {
        ethics3D.animating = false;
    }
}

function render3DEthics() {
    const mini3d = ethics3D.mini3d;
    if (!mini3d) return;
    
    mini3d.clear();
    mini3d.setRotation(0, ethics3D.rotationY, 0);
    
    const centerX = mini3d.canvas.width / 2;
    const centerY = mini3d.canvas.height / 2;
    
    // Draw central "AI" sphere
    const centerRotated = mini3d.rotatePoint(0, 0, 0);
    const centerProj = mini3d.project(centerRotated.x + centerX, centerRotated.y + centerY, centerRotated.z);
    
    const gradient = mini3d.ctx.createRadialGradient(centerProj.x, centerProj.y, 0, centerProj.x, centerProj.y, 40);
    gradient.addColorStop(0, '#4A90D9');
    gradient.addColorStop(0.7, '#3498DB');
    gradient.addColorStop(1, 'transparent');
    mini3d.ctx.fillStyle = gradient;
    mini3d.ctx.beginPath();
    mini3d.ctx.arc(centerProj.x, centerProj.y, 40, 0, Math.PI * 2);
    mini3d.ctx.fill();
    
    mini3d.ctx.fillStyle = '#fff';
    mini3d.ctx.font = 'bold 14px Arial';
    mini3d.ctx.textAlign = 'center';
    mini3d.ctx.fillText('AI', centerProj.x, centerProj.y + 5);
    
    // Draw connections and principles
    ethics3D.principles.forEach((p, i) => {
        const rotated = mini3d.rotatePoint(p.x, p.y, p.z);
        const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
        
        // Draw connection line
        mini3d.ctx.strokeStyle = `${p.color}66`;
        mini3d.ctx.lineWidth = 2;
        mini3d.ctx.beginPath();
        mini3d.ctx.moveTo(centerProj.x, centerProj.y);
        mini3d.ctx.lineTo(proj.x, proj.y);
        mini3d.ctx.stroke();
        
        // Draw principle sphere
        const pulseSize = 25 + Math.sin(p.pulse) * 5;
        const pGradient = mini3d.ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, pulseSize * proj.scale);
        pGradient.addColorStop(0, p.color);
        pGradient.addColorStop(1, 'transparent');
        
        mini3d.ctx.fillStyle = pGradient;
        mini3d.ctx.beginPath();
        mini3d.ctx.arc(proj.x, proj.y, pulseSize * proj.scale, 0, Math.PI * 2);
        mini3d.ctx.fill();
        
        mini3d.ctx.fillStyle = '#fff';
        mini3d.ctx.font = `${9 * proj.scale}px Arial`;
        mini3d.ctx.fillText(p.name, proj.x, proj.y + 4);
    });
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
    
    updateApplications('hiring');
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
// Section 1: Principles Demo
// ============================================================================

function initPrinciplesDemo() {
    const principleItems = document.querySelectorAll('.principle-item');
    const detailPanel = document.getElementById('principleDetail');
    
    principleItems.forEach(item => {
        item.addEventListener('click', () => {
            principleItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const principle = item.dataset.principle;
            const details = principleDetails[principle];
            
            detailPanel.innerHTML = `
                <h4>${details.title}</h4>
                <p>${details.description}</p>
            `;
        });
    });
    
    // Auto-rotate through principles
    let currentIndex = 0;
    const principles = Array.from(principleItems);
    
    setInterval(() => {
        if (!document.querySelector('.principle-item:hover')) {
            principles[currentIndex].click();
            currentIndex = (currentIndex + 1) % principles.length;
        }
    }, 3000);
}

// ============================================================================
// Section 2: Bias Demo
// ============================================================================

function initBiasDemo() {
    const mitigationBtns = document.querySelectorAll('.mitigation-btn');
    
    mitigationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            mitigationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyMitigation(btn.dataset.method);
        });
    });
    
    // Initialize with threshold
    applyMitigation('threshold');
}

function applyMitigation(method) {
    const data = mitigationData[method];
    
    // Update bars
    const groupABar = document.getElementById('groupABar');
    const groupBBar = document.getElementById('groupBBar');
    const groupAValue = document.getElementById('groupAValue');
    const groupBValue = document.getElementById('groupBValue');
    
    groupABar.style.width = `${data.groupA}%`;
    groupBBar.style.width = `${data.groupB}%`;
    groupAValue.textContent = `${data.groupA}%`;
    groupBValue.textContent = `${data.groupB}%`;
    
    // Update bar colors
    groupABar.className = 'bar-fill';
    groupBBar.className = 'bar-fill';
    
    if (data.biased) {
        groupBBar.classList.add('biased');
    } else {
        groupABar.classList.add('mitigated');
        groupBBar.classList.add('mitigated');
    }
    
    // Update indicator
    const indicator = document.getElementById('biasIndicator');
    indicator.className = 'bias-indicator';
    
    if (data.biased) {
        indicator.innerHTML = `
            <div class="indicator-icon">⚠️</div>
            <div class="indicator-text">
                <strong>Bias Detected!</strong>
                <span>${data.disparity}% disparity in approval rates</span>
            </div>
        `;
    } else {
        indicator.classList.add('fair');
        indicator.innerHTML = `
            <div class="indicator-icon">✓</div>
            <div class="indicator-text">
                <strong>${data.disparity === 0 ? 'Bias Eliminated!' : 'Bias Reduced!'}</strong>
                <span>${data.message}</span>
            </div>
        `;
    }
}

// ============================================================================
// Section 4: Scenarios Demo
// ============================================================================

function initScenariosDemo() {
    const scenarioCards = document.querySelectorAll('.scenario-card');
    
    scenarioCards.forEach(card => {
        card.addEventListener('click', () => {
            scenarioCards.forEach(c => c.classList.remove('expanded'));
            card.classList.toggle('expanded');
        });
    });
}
