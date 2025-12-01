/**
 * Multimodal Models - Interactive Demo Script
 * 
 * This demo shows how multimodal models work, including vision-language
 * capabilities, architecture, and real-world applications.
 */

// Role-based applications data
const roleApplications = {
    healthcare: {
        title: 'Healthcare',
        apps: [
            { name: 'Medical Image Analysis', desc: 'Analyze X-rays, MRIs, and CT scans with AI-assisted diagnosis' },
            { name: 'Clinical Documentation', desc: 'Convert voice notes and images into structured medical records' },
            { name: 'Patient Monitoring', desc: 'Combine video, audio, and sensor data for remote patient care' },
            { name: 'Drug Discovery', desc: 'Analyze molecular structures and research papers together' }
        ]
    },
    retail: {
        title: 'Retail',
        apps: [
            { name: 'Visual Search', desc: 'Find products by uploading photos or describing them' },
            { name: 'Virtual Try-On', desc: 'See how clothes, glasses, or makeup look on you' },
            { name: 'Inventory Management', desc: 'Automated shelf monitoring with image recognition' },
            { name: 'Customer Insights', desc: 'Analyze in-store video and audio for behavior patterns' }
        ]
    },
    education: {
        title: 'Education',
        apps: [
            { name: 'Interactive Tutoring', desc: 'AI that can see student work and explain concepts visually' },
            { name: 'Accessibility Tools', desc: 'Convert lectures to text, describe images for blind students' },
            { name: 'Lab Assistance', desc: 'Analyze experiment images and provide guidance' },
            { name: 'Language Learning', desc: 'Combine speech recognition with visual context' }
        ]
    },
    security: {
        title: 'Security',
        apps: [
            { name: 'Surveillance Analysis', desc: 'Intelligent video monitoring with anomaly detection' },
            { name: 'Document Verification', desc: 'Verify IDs by combining image and text analysis' },
            { name: 'Threat Detection', desc: 'Analyze multiple sensor inputs for security threats' },
            { name: 'Access Control', desc: 'Face recognition combined with voice verification' }
        ]
    }
};

// 3D Multimodal visualization state
let multimodal3D = {
    mini3d: null,
    rotationY: 0,
    animating: false,
    progress: 0,
    streams: []
};

// Scene data for vision demo
const scenes = {
    park: {
        draw: drawParkScene,
        answers: {
            describe: "I see a sunny park scene with green trees, a wooden bench, and a winding path. The sky is blue with a few white clouds.",
            count: "There are approximately 5 main objects: 2 trees, 1 bench, 1 path, and 1 sun.",
            color: "The prominent colors are green (trees, grass), blue (sky), brown (bench, path), and yellow (sun).",
            mood: "The mood is peaceful and serene - a perfect day for a relaxing walk in nature."
        }
    },
    office: {
        draw: drawOfficeScene,
        answers: {
            describe: "I see an office workspace with a desk, computer monitor, chair, and a potted plant. There's a window showing a city view.",
            count: "There are approximately 6 main objects: desk, monitor, chair, plant, window, and lamp.",
            color: "The prominent colors are gray (desk, monitor), blue (chair, window), green (plant), and white (walls).",
            mood: "The mood is professional and productive - a modern, organized workspace."
        }
    },
    food: {
        draw: drawFoodScene,
        answers: {
            describe: "I see a plate of food with what appears to be a salad, some bread, and a glass of orange juice on a wooden table.",
            count: "There are approximately 4 main items: a plate with salad, bread, a glass of juice, and utensils.",
            color: "The prominent colors are green (salad), orange (juice, carrots), brown (bread, table), and white (plate).",
            mood: "The mood is fresh and appetizing - a healthy, inviting meal."
        }
    }
};

let currentScene = 'park';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    init3DMultimodal();
    initRoleApplications();
    initModalityDemo();
    initVisionDemo();
    initArchitectureDemo();
    initUseCasesDemo();
});

// ============================================================================
// 3D Multimodal Fusion Visualization
// ============================================================================

function init3DMultimodal() {
    const canvas = document.getElementById('multimodal3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    multimodal3D.mini3d = new Mini3D(canvas);
    
    // Initialize streams (text, image, audio converging to center)
    const modalities = [
        { name: 'Text', color: '#4A90D9', startAngle: 0 },
        { name: 'Image', color: '#50C878', startAngle: 2.09 },
        { name: 'Audio', color: '#E67E22', startAngle: 4.19 }
    ];
    
    modalities.forEach(m => {
        for (let i = 0; i < 15; i++) {
            const radius = 200;
            multimodal3D.streams.push({
                x: Math.cos(m.startAngle) * radius,
                y: (Math.random() - 0.5) * 100,
                z: Math.sin(m.startAngle) * radius,
                color: m.color,
                name: m.name,
                progress: Math.random()
            });
        }
    });
    
    document.getElementById('rotateLeftBtn3D')?.addEventListener('click', () => {
        multimodal3D.rotationY -= 0.3;
        render3DMultimodal();
    });
    
    document.getElementById('rotateRightBtn3D')?.addEventListener('click', () => {
        multimodal3D.rotationY += 0.3;
        render3DMultimodal();
    });
    
    document.getElementById('animateFusionBtn')?.addEventListener('click', () => {
        if (!multimodal3D.animating) {
            multimodal3D.animating = true;
            multimodal3D.progress = 0;
            animateMultimodalFusion();
        }
    });
    
    render3DMultimodal();
}

function animateMultimodalFusion() {
    if (!multimodal3D.animating) return;
    
    multimodal3D.progress += 0.01;
    multimodal3D.rotationY += 0.02;
    
    // Move particles toward center
    multimodal3D.streams.forEach(p => {
        p.progress += 0.02;
        if (p.progress > 1) p.progress = 0;
    });
    
    render3DMultimodal();
    
    if (multimodal3D.progress < 1) {
        requestAnimationFrame(animateMultimodalFusion);
    } else {
        multimodal3D.animating = false;
    }
}

function render3DMultimodal() {
    const mini3d = multimodal3D.mini3d;
    if (!mini3d) return;
    
    mini3d.clear();
    mini3d.setRotation(0, multimodal3D.rotationY, 0);
    
    const centerX = mini3d.canvas.width / 2;
    const centerY = mini3d.canvas.height / 2;
    
    // Draw central fusion sphere
    const centerRotated = mini3d.rotatePoint(0, 0, 0);
    const centerProj = mini3d.project(centerRotated.x + centerX, centerRotated.y + centerY, centerRotated.z);
    
    const gradient = mini3d.ctx.createRadialGradient(centerProj.x, centerProj.y, 0, centerProj.x, centerProj.y, 50);
    gradient.addColorStop(0, '#9B59B6');
    gradient.addColorStop(0.7, '#8E44AD');
    gradient.addColorStop(1, 'transparent');
    mini3d.ctx.fillStyle = gradient;
    mini3d.ctx.beginPath();
    mini3d.ctx.arc(centerProj.x, centerProj.y, 50, 0, Math.PI * 2);
    mini3d.ctx.fill();
    
    mini3d.ctx.fillStyle = '#fff';
    mini3d.ctx.font = 'bold 14px Arial';
    mini3d.ctx.textAlign = 'center';
    mini3d.ctx.fillText('Fusion', centerProj.x, centerProj.y + 5);
    
    // Draw streaming particles
    multimodal3D.streams.forEach(p => {
        const t = p.progress;
        const x = p.x * (1 - t);
        const y = p.y * (1 - t);
        const z = p.z * (1 - t);
        
        const rotated = mini3d.rotatePoint(x, y, z);
        const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
        
        mini3d.ctx.fillStyle = p.color;
        mini3d.ctx.globalAlpha = 0.7 * proj.scale;
        mini3d.ctx.beginPath();
        mini3d.ctx.arc(proj.x, proj.y, 6 * proj.scale, 0, Math.PI * 2);
        mini3d.ctx.fill();
    });
    
    mini3d.ctx.globalAlpha = 1;
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
    
    updateApplications('healthcare');
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
// Section 1: Modality Demo
// ============================================================================

function initModalityDemo() {
    const cards = document.querySelectorAll('.modality-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
    
    // Auto-animate modality cards
    let currentIndex = 0;
    setInterval(() => {
        cards.forEach(c => c.classList.remove('active'));
        cards[currentIndex].classList.add('active');
        currentIndex = (currentIndex + 1) % cards.length;
    }, 2000);
}

// ============================================================================
// Section 2: Vision-Language Demo
// ============================================================================

function initVisionDemo() {
    const imageButtons = document.querySelectorAll('.image-btn');
    const askButton = document.getElementById('askQuestionBtn');
    
    // Draw initial scene
    drawScene(currentScene);
    
    imageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            imageButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentScene = btn.dataset.scene;
            drawScene(currentScene);
            clearAnswer();
        });
    });
    
    askButton.addEventListener('click', answerQuestion);
}

function drawScene(sceneName) {
    const canvas = document.getElementById('sceneCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 200, 200);
    scenes[sceneName].draw(ctx);
}

function drawParkScene(ctx) {
    // Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, 200, 120);
    
    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(160, 40, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Clouds
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(50, 30, 15, 0, Math.PI * 2);
    ctx.arc(70, 30, 20, 0, Math.PI * 2);
    ctx.arc(90, 30, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Grass
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, 120, 200, 80);
    
    // Path
    ctx.fillStyle = '#D2691E';
    ctx.beginPath();
    ctx.moveTo(80, 200);
    ctx.quadraticCurveTo(100, 150, 120, 120);
    ctx.lineTo(140, 120);
    ctx.quadraticCurveTo(120, 150, 100, 200);
    ctx.fill();
    
    // Trees
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(25, 90, 15, 50);
    ctx.fillRect(155, 80, 15, 60);
    
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(32, 70, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(162, 60, 35, 0, Math.PI * 2);
    ctx.fill();
    
    // Bench
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(60, 150, 40, 5);
    ctx.fillRect(65, 155, 5, 15);
    ctx.fillRect(90, 155, 5, 15);
}

function drawOfficeScene(ctx) {
    // Wall
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, 200, 200);
    
    // Window
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(120, 20, 60, 60);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(120, 20, 60, 60);
    ctx.beginPath();
    ctx.moveTo(150, 20);
    ctx.lineTo(150, 80);
    ctx.moveTo(120, 50);
    ctx.lineTo(180, 50);
    ctx.stroke();
    
    // Desk
    ctx.fillStyle = '#696969';
    ctx.fillRect(20, 120, 160, 10);
    ctx.fillRect(30, 130, 10, 50);
    ctx.fillRect(160, 130, 10, 50);
    
    // Monitor
    ctx.fillStyle = '#333';
    ctx.fillRect(70, 70, 60, 45);
    ctx.fillStyle = '#4A90D9';
    ctx.fillRect(75, 75, 50, 35);
    ctx.fillStyle = '#333';
    ctx.fillRect(95, 115, 10, 5);
    ctx.fillRect(85, 118, 30, 3);
    
    // Chair
    ctx.fillStyle = '#4A90D9';
    ctx.fillRect(85, 145, 30, 25);
    ctx.fillRect(90, 140, 20, 5);
    ctx.fillStyle = '#333';
    ctx.fillRect(98, 170, 4, 15);
    
    // Plant
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(15, 100, 20, 20);
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(25, 85, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Lamp
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(155, 100, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.fillRect(153, 105, 4, 15);
}

function drawFoodScene(ctx) {
    // Table
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 100, 200, 100);
    
    // Tablecloth pattern
    ctx.fillStyle = '#A0522D';
    for (let i = 0; i < 200; i += 20) {
        ctx.fillRect(i, 100, 10, 100);
    }
    
    // Plate
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(100, 140, 50, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Salad
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(90, 135, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.arc(100, 130, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFA500';
    ctx.fillRect(110, 140, 15, 5);
    
    // Bread
    ctx.fillStyle = '#DEB887';
    ctx.beginPath();
    ctx.ellipse(160, 130, 20, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Glass
    ctx.fillStyle = 'rgba(255, 165, 0, 0.7)';
    ctx.fillRect(30, 110, 25, 40);
    ctx.strokeStyle = '#ddd';
    ctx.strokeRect(30, 110, 25, 40);
    
    // Fork and knife
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(55, 160, 3, 30);
    ctx.fillRect(145, 160, 3, 30);
}

function answerQuestion() {
    const questionSelect = document.getElementById('questionSelect');
    const answerDisplay = document.getElementById('answerDisplay');
    const question = questionSelect.value;
    
    const answer = scenes[currentScene].answers[question];
    
    // Typing effect
    answerDisplay.innerHTML = '<span class="answer"></span>';
    const answerSpan = answerDisplay.querySelector('.answer');
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < answer.length) {
            answerSpan.textContent += answer[i];
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 20);
}

function clearAnswer() {
    document.getElementById('answerDisplay').innerHTML = '<span class="placeholder">Select a question to see the AI\'s response...</span>';
}

// ============================================================================
// Section 3: Architecture Demo
// ============================================================================

function initArchitectureDemo() {
    const animateBtn = document.getElementById('animateArchBtn');
    animateBtn.addEventListener('click', animateArchitecture);
}

async function animateArchitecture() {
    const nodes = document.querySelectorAll('.arch-node');
    
    // Reset
    nodes.forEach(n => n.classList.remove('active'));
    
    // Animate image path
    const imagePath = document.querySelectorAll('.image-path .arch-node');
    for (const node of imagePath) {
        node.classList.add('active');
        await new Promise(resolve => setTimeout(resolve, 500));
        node.classList.remove('active');
    }
    
    // Animate text path
    const textPath = document.querySelectorAll('.text-path .arch-node');
    for (const node of textPath) {
        node.classList.add('active');
        await new Promise(resolve => setTimeout(resolve, 500));
        node.classList.remove('active');
    }
    
    // Animate LLM
    const llm = document.querySelector('.arch-node.llm');
    llm.classList.add('active');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Animate output
    const output = document.querySelector('.arch-node.output');
    output.classList.add('active');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear
    await new Promise(resolve => setTimeout(resolve, 1000));
    nodes.forEach(n => n.classList.remove('active'));
}

// ============================================================================
// Section 4: Use Cases Demo
// ============================================================================

function initUseCasesDemo() {
    const cards = document.querySelectorAll('.use-case-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('expanded'));
            card.classList.toggle('expanded');
        });
    });
}
