/**
 * Image Generation & Diffusion - Interactive Demo Script
 * 
 * This demo shows how diffusion models work, including the forward/reverse
 * process, text-to-image generation, and latent space concepts.
 */

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    initDiffusionDemo();
    initTextToImage();
    initParameters();
    initLatentDemo();
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
// Section 1: Diffusion Process
// ============================================================================

let baseImageData = null;

function initDiffusionDemo() {
    const noiseSlider = document.getElementById('noiseSlider');
    const forwardBtn = document.getElementById('forwardBtn');
    const reverseBtn = document.getElementById('reverseBtn');
    const resetBtn = document.getElementById('resetDiffusionBtn');
    
    // Draw initial image on all canvases
    drawBaseImage();
    
    noiseSlider.addEventListener('input', (e) => {
        const t = parseInt(e.target.value);
        document.getElementById('noiseValue').textContent = t;
        updateNoiseVisualization(t);
    });
    
    forwardBtn.addEventListener('click', animateForward);
    reverseBtn.addEventListener('click', animateReverse);
    resetBtn.addEventListener('click', resetDiffusion);
}

function drawBaseImage() {
    // Draw a simple colorful pattern as our "image"
    for (let i = 0; i < 5; i++) {
        const canvas = document.getElementById(`canvas${i}`);
        const ctx = canvas.getContext('2d');
        
        // Create a gradient pattern
        const gradient = ctx.createLinearGradient(0, 0, 150, 150);
        gradient.addColorStop(0, '#4A90D9');
        gradient.addColorStop(0.5, '#50C878');
        gradient.addColorStop(1, '#E67E22');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 150, 150);
        
        // Add some shapes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(75, 60, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#333';
        ctx.fillRect(40, 100, 70, 40);
        
        // Store base image data
        if (i === 0) {
            baseImageData = ctx.getImageData(0, 0, 150, 150);
        }
    }
    
    // Apply noise to each frame
    updateAllFrames();
}

function updateAllFrames() {
    const noiselevels = [0, 250, 500, 750, 1000];
    noiselevels.forEach((level, i) => {
        applyNoiseToCanvas(`canvas${i}`, level / 1000);
    });
}

function applyNoiseToCanvas(canvasId, noiseAmount) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    // Redraw base image
    if (baseImageData) {
        ctx.putImageData(baseImageData, 0, 0);
    }
    
    // Get current image data
    const imageData = ctx.getImageData(0, 0, 150, 150);
    const data = imageData.data;
    
    // Add noise
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 255 * noiseAmount;
        data[i] = Math.max(0, Math.min(255, data[i] * (1 - noiseAmount) + (128 + noise) * noiseAmount));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * (1 - noiseAmount) + (128 + noise) * noiseAmount));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * (1 - noiseAmount) + (128 + noise) * noiseAmount));
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function updateNoiseVisualization(t) {
    // Update the middle canvas based on slider
    const canvas = document.getElementById('canvas2');
    applyNoiseToCanvas('canvas2', t / 1000);
}

async function animateForward() {
    document.getElementById('processLabel').textContent = 'Forward Process: Adding Noise';
    const slider = document.getElementById('noiseSlider');
    
    for (let t = 0; t <= 1000; t += 20) {
        slider.value = t;
        document.getElementById('noiseValue').textContent = t;
        
        // Update all frames progressively
        for (let i = 0; i < 5; i++) {
            const frameNoise = Math.min(t, i * 250) / 1000;
            applyNoiseToCanvas(`canvas${i}`, frameNoise);
        }
        
        await new Promise(resolve => setTimeout(resolve, 30));
    }
}

async function animateReverse() {
    document.getElementById('processLabel').textContent = 'Reverse Process: Denoising';
    const slider = document.getElementById('noiseSlider');
    
    for (let t = 1000; t >= 0; t -= 20) {
        slider.value = t;
        document.getElementById('noiseValue').textContent = t;
        
        // Update all frames progressively (reverse)
        for (let i = 4; i >= 0; i--) {
            const frameNoise = Math.max(0, t - (4 - i) * 250) / 1000;
            applyNoiseToCanvas(`canvas${i}`, frameNoise);
        }
        
        await new Promise(resolve => setTimeout(resolve, 30));
    }
}

function resetDiffusion() {
    document.getElementById('noiseSlider').value = 0;
    document.getElementById('noiseValue').textContent = '0';
    document.getElementById('processLabel').textContent = 'Forward Process: Adding Noise';
    drawBaseImage();
}

// ============================================================================
// Section 2: Text-to-Image Generation
// ============================================================================

function initTextToImage() {
    const generateBtn = document.getElementById('generateImageBtn');
    generateBtn.addEventListener('click', simulateGeneration);
}

async function simulateGeneration() {
    const canvas = document.getElementById('generationCanvas');
    const ctx = canvas.getContext('2d');
    const stepDisplay = document.getElementById('genStep');
    const progressBar = document.getElementById('stepProgress');
    const flowSteps = document.querySelectorAll('.flow-step');
    
    // Reset
    ctx.fillStyle = '#888';
    ctx.fillRect(0, 0, 300, 300);
    
    // Animate flow steps
    for (let i = 0; i < flowSteps.length; i++) {
        flowSteps.forEach(s => s.classList.remove('active'));
        flowSteps[i].classList.add('active');
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Start with pure noise
    addNoiseToGenerationCanvas(1.0);
    
    // Simulate denoising steps
    for (let step = 1; step <= 50; step++) {
        stepDisplay.textContent = step;
        progressBar.style.width = `${(step / 50) * 100}%`;
        
        // Gradually reduce noise and add structure
        const noiseLevel = 1 - (step / 50);
        simulateDenoising(ctx, step, noiseLevel);
        
        await new Promise(resolve => setTimeout(resolve, 80));
    }
    
    // Final image
    drawFinalGeneratedImage(ctx);
    flowSteps.forEach(s => s.classList.remove('active'));
}

function addNoiseToGenerationCanvas(amount) {
    const canvas = document.getElementById('generationCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(300, 300);
    
    for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 255;
        imageData.data[i] = noise;
        imageData.data[i + 1] = noise;
        imageData.data[i + 2] = noise;
        imageData.data[i + 3] = 255;
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function simulateDenoising(ctx, step, noiseLevel) {
    const imageData = ctx.getImageData(0, 0, 300, 300);
    const data = imageData.data;
    
    // Target colors based on prompt (mountain lake sunset)
    const skyColor = { r: 255, g: 150, b: 100 }; // Sunset orange
    const mountainColor = { r: 60, g: 80, b: 100 }; // Dark blue-gray
    const lakeColor = { r: 100, g: 150, b: 200 }; // Blue
    
    for (let y = 0; y < 300; y++) {
        for (let x = 0; x < 300; x++) {
            const i = (y * 300 + x) * 4;
            
            // Determine target color based on position
            let target;
            if (y < 100) {
                target = skyColor;
            } else if (y < 150 && (x < 100 || x > 200 || (x > 130 && x < 170))) {
                target = mountainColor;
            } else {
                target = lakeColor;
            }
            
            // Blend current with target based on step
            const blend = Math.min(1, step / 40);
            const noise = (Math.random() - 0.5) * 50 * noiseLevel;
            
            data[i] = data[i] * (1 - blend * 0.1) + (target.r + noise) * blend * 0.1;
            data[i + 1] = data[i + 1] * (1 - blend * 0.1) + (target.g + noise) * blend * 0.1;
            data[i + 2] = data[i + 2] * (1 - blend * 0.1) + (target.b + noise) * blend * 0.1;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function drawFinalGeneratedImage(ctx) {
    // Draw a simple mountain lake sunset scene
    
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 150);
    skyGradient.addColorStop(0, '#FF6B35');
    skyGradient.addColorStop(0.5, '#FFB347');
    skyGradient.addColorStop(1, '#87CEEB');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, 300, 150);
    
    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(150, 100, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Mountains
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(80, 80);
    ctx.lineTo(150, 130);
    ctx.lineTo(220, 70);
    ctx.lineTo(300, 150);
    ctx.closePath();
    ctx.fill();
    
    // Lake
    const lakeGradient = ctx.createLinearGradient(0, 150, 0, 300);
    lakeGradient.addColorStop(0, '#5DADE2');
    lakeGradient.addColorStop(1, '#2E86AB');
    ctx.fillStyle = lakeGradient;
    ctx.fillRect(0, 150, 300, 150);
    
    // Reflection
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(150, 200, 20, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
}

// ============================================================================
// Section 3: Parameters
// ============================================================================

function initParameters() {
    const guidanceSlider = document.getElementById('guidanceSlider');
    const stepsSlider = document.getElementById('stepsSlider');
    const randomSeedBtn = document.getElementById('randomSeedBtn');
    
    guidanceSlider.addEventListener('input', (e) => {
        document.getElementById('guidanceValue').textContent = e.target.value;
    });
    
    stepsSlider.addEventListener('input', (e) => {
        document.getElementById('stepsValue').textContent = e.target.value;
    });
    
    randomSeedBtn.addEventListener('click', () => {
        document.getElementById('seedInput').value = Math.floor(Math.random() * 999999);
    });
    
    // Draw comparison previews
    drawGuidanceComparisons();
}

function drawGuidanceComparisons() {
    // Low guidance - more abstract/creative
    const lowCanvas = document.getElementById('lowGuidanceCanvas');
    const lowCtx = lowCanvas.getContext('2d');
    drawAbstractImage(lowCtx, 0.3);
    
    // Medium guidance - balanced
    const medCanvas = document.getElementById('medGuidanceCanvas');
    const medCtx = medCanvas.getContext('2d');
    drawAbstractImage(medCtx, 0.7);
    
    // High guidance - very literal
    const highCanvas = document.getElementById('highGuidanceCanvas');
    const highCtx = highCanvas.getContext('2d');
    drawAbstractImage(highCtx, 1.0);
}

function drawAbstractImage(ctx, clarity) {
    // Background
    ctx.fillStyle = `rgba(135, 206, 235, ${clarity})`;
    ctx.fillRect(0, 0, 120, 120);
    
    // Add some noise for low clarity
    if (clarity < 1) {
        const imageData = ctx.getImageData(0, 0, 120, 120);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 100 * (1 - clarity);
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
    }
    
    // Simple shape
    ctx.globalAlpha = clarity;
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.moveTo(20, 80);
    ctx.lineTo(60, 30);
    ctx.lineTo(100, 80);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
}

// ============================================================================
// Section 4: Latent Space Demo
// ============================================================================

function initLatentDemo() {
    const animateBtn = document.getElementById('animateLatentBtn');
    animateBtn.addEventListener('click', animateLatentPipeline);
    
    // Initialize canvases
    drawLatentCanvases();
}

function drawLatentCanvases() {
    // Pixel space - colorful image
    const pixelCanvas = document.getElementById('pixelCanvas');
    const pixelCtx = pixelCanvas.getContext('2d');
    const gradient = pixelCtx.createLinearGradient(0, 0, 100, 100);
    gradient.addColorStop(0, '#E74C3C');
    gradient.addColorStop(0.5, '#3498DB');
    gradient.addColorStop(1, '#2ECC71');
    pixelCtx.fillStyle = gradient;
    pixelCtx.fillRect(0, 0, 100, 100);
    
    // Latent space - smaller, abstract
    const latentCanvas = document.getElementById('latentSpaceCanvas');
    const latentCtx = latentCanvas.getContext('2d');
    drawLatentRepresentation(latentCtx, true);
    
    // Denoised latent
    const denoisedCanvas = document.getElementById('denoisedLatentCanvas');
    const denoisedCtx = denoisedCanvas.getContext('2d');
    drawLatentRepresentation(denoisedCtx, false);
    
    // Output - reconstructed image
    const outputCanvas = document.getElementById('outputCanvas');
    const outputCtx = outputCanvas.getContext('2d');
    outputCtx.fillStyle = gradient;
    outputCtx.fillRect(0, 0, 100, 100);
}

function drawLatentRepresentation(ctx, noisy) {
    // Draw a grid pattern to represent latent space
    const cellSize = 12.5; // 8x8 grid
    
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const hue = (x + y) * 20 + (noisy ? Math.random() * 60 : 0);
            const saturation = noisy ? 30 + Math.random() * 40 : 70;
            const lightness = noisy ? 40 + Math.random() * 30 : 50;
            
            ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

async function animateLatentPipeline() {
    const stages = document.querySelectorAll('.pipeline-stage');
    
    // Reset
    stages.forEach(s => s.classList.remove('active'));
    
    // Animate through stages
    for (let i = 0; i < stages.length; i++) {
        stages[i].classList.add('active');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (i < stages.length - 1) {
            stages[i].classList.remove('active');
        }
    }
    
    // Keep last stage active briefly
    await new Promise(resolve => setTimeout(resolve, 500));
    stages[stages.length - 1].classList.remove('active');
}
