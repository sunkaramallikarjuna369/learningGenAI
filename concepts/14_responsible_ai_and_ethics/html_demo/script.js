// Generative AI 360° - Interactive Demo Script

document.addEventListener('DOMContentLoaded', function() {
    // Track switching
    const trackBtns = document.querySelectorAll('.track-btn');
    const trackContents = document.querySelectorAll('.track-content');
    
    trackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const track = btn.dataset.track;
            
            trackBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            trackContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === track + '-content') {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Canvas setup for "Everyone" demo
    const canvasEveryone = document.getElementById('canvas-everyone');
    const ctxEveryone = canvasEveryone.getContext('2d');
    
    // Canvas setup for "Technical" demo
    const canvasTech = document.getElementById('canvas-technical');
    const ctxTech = canvasTech.getContext('2d');
    
    // Demo state
    let isRunning = false;
    let animationFrame = null;
    let step = 0;
    
    // Draw initial state
    function drawInitialState(ctx, canvas) {
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#4a90d9';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Click "Start Demo" to begin', canvas.width/2, canvas.height/2);
    }
    
    drawInitialState(ctxEveryone, canvasEveryone);
    drawInitialState(ctxTech, canvasTech);
    
    // Animation for "Everyone" demo
    function animateEveryone() {
        ctxEveryone.fillStyle = '#0a0a1a';
        ctxEveryone.fillRect(0, 0, canvasEveryone.width, canvasEveryone.height);
        
        // Draw animated elements representing ethics
        const centerX = canvasEveryone.width / 2;
        const centerY = canvasEveryone.height / 2;
        
        // Input
        ctxEveryone.fillStyle = '#4a90d9';
        ctxEveryone.beginPath();
        ctxEveryone.arc(100, centerY, 30 + Math.sin(step * 0.05) * 5, 0, Math.PI * 2);
        ctxEveryone.fill();
        ctxEveryone.fillStyle = 'white';
        ctxEveryone.font = '12px Arial';
        ctxEveryone.textAlign = 'center';
        ctxEveryone.fillText('Input', 100, centerY + 50);
        
        // Process (animated)
        ctxEveryone.fillStyle = '#50c878';
        const processX = 100 + (step % 200) * 2;
        if (processX < 500) {
            ctxEveryone.beginPath();
            ctxEveryone.arc(processX, centerY, 20, 0, Math.PI * 2);
            ctxEveryone.fill();
        }
        
        // Arrow
        ctxEveryone.strokeStyle = '#8892b0';
        ctxEveryone.lineWidth = 2;
        ctxEveryone.beginPath();
        ctxEveryone.moveTo(140, centerY);
        ctxEveryone.lineTo(460, centerY);
        ctxEveryone.stroke();
        
        // Output
        ctxEveryone.fillStyle = '#ff6b6b';
        ctxEveryone.beginPath();
        ctxEveryone.arc(500, centerY, 30 + Math.sin(step * 0.05 + 1) * 5, 0, Math.PI * 2);
        ctxEveryone.fill();
        ctxEveryone.fillStyle = 'white';
        ctxEveryone.fillText('Output', 500, centerY + 50);
        
        // Title
        ctxEveryone.fillStyle = '#4a90d9';
        ctxEveryone.font = 'bold 18px Arial';
        ctxEveryone.fillText('Responsible AI and Ethics', centerX, 40);
        
        step++;
        
        if (isRunning) {
            animationFrame = requestAnimationFrame(animateEveryone);
        }
    }
    
    // Start button
    document.getElementById('btn-start').addEventListener('click', function() {
        if (!isRunning) {
            isRunning = true;
            this.textContent = 'Pause';
            animateEveryone();
            document.getElementById('explanation').innerHTML = 
                '<p>Watch how data flows through the ethics process!</p>' +
                '<p>The green dot represents data being transformed.</p>';
        } else {
            isRunning = false;
            this.textContent = 'Start Demo';
            cancelAnimationFrame(animationFrame);
        }
    });
    
    // Reset button
    document.getElementById('btn-reset').addEventListener('click', function() {
        isRunning = false;
        step = 0;
        document.getElementById('btn-start').textContent = 'Start Demo';
        cancelAnimationFrame(animationFrame);
        drawInitialState(ctxEveryone, canvasEveryone);
        document.getElementById('explanation').innerHTML = 
            '<p>Click "Start Demo" to see ethics in action!</p>';
    });
    
    // Technical slider
    const paramSlider = document.getElementById('param-slider');
    const paramValue = document.getElementById('param-value');
    
    function drawTechnicalDemo(value) {
        ctxTech.fillStyle = '#0a0a1a';
        ctxTech.fillRect(0, 0, canvasTech.width, canvasTech.height);
        
        // Draw parameter-dependent visualization
        const normalizedValue = value / 100;
        
        // Draw bars representing different aspects
        const barWidth = 50;
        const maxHeight = 300;
        const startX = 100;
        
        const aspects = ['Accuracy', 'Speed', 'Cost', 'Complexity'];
        const colors = ['#4a90d9', '#50c878', '#ff6b6b', '#ffaa00'];
        
        aspects.forEach((aspect, i) => {
            const height = maxHeight * (0.3 + normalizedValue * 0.7 * Math.sin(i + normalizedValue * Math.PI));
            const x = startX + i * (barWidth + 40);
            
            ctxTech.fillStyle = colors[i];
            ctxTech.fillRect(x, canvasTech.height - 50 - height, barWidth, height);
            
            ctxTech.fillStyle = 'white';
            ctxTech.font = '12px Arial';
            ctxTech.textAlign = 'center';
            ctxTech.fillText(aspect, x + barWidth/2, canvasTech.height - 30);
        });
        
        // Title
        ctxTech.fillStyle = '#4a90d9';
        ctxTech.font = 'bold 16px Arial';
        ctxTech.fillText('Parameter Impact on ethics', canvasTech.width/2, 30);
        ctxTech.font = '14px Arial';
        ctxTech.fillText('Parameter Value: ' + value, canvasTech.width/2, 55);
    }
    
    paramSlider.addEventListener('input', function() {
        paramValue.textContent = this.value;
        drawTechnicalDemo(parseInt(this.value));
    });
    
    // Initial technical demo draw
    drawTechnicalDemo(50);
});
