/**
 * Responsible AI and Ethics - Interactive Demo Script
 * 
 * This demo shows key principles of responsible AI including
 * fairness, transparency, and ethical considerations.
 */

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
    initPrinciplesDemo();
    initBiasDemo();
    initScenariosDemo();
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
