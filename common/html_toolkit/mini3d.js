/**
 * Mini3D - Lightweight 3D Helper for Educational Animations
 * 
 * A simple 3D projection and rendering helper that works with Canvas 2D.
 * Designed for educational visualizations without heavy dependencies.
 */

class Mini3D {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        
        this.focalLength = options.focalLength || 400;
        this.rotationX = options.rotationX || 0;
        this.rotationY = options.rotationY || 0;
        this.rotationZ = options.rotationZ || 0;
        this.autoRotate = options.autoRotate || false;
        this.autoRotateSpeed = options.autoRotateSpeed || 0.005;
        
        this.objects = [];
        this.animationId = null;
    }
    
    project(point) {
        let { x, y, z } = point;
        
        // Apply rotations
        let rotated = this.rotatePoint(x, y, z);
        x = rotated.x;
        y = rotated.y;
        z = rotated.z;
        
        // Perspective projection
        const scale = this.focalLength / (this.focalLength + z);
        const screenX = this.centerX + x * scale;
        const screenY = this.centerY + y * scale;
        
        return { x: screenX, y: screenY, scale, z };
    }
    
    rotatePoint(x, y, z) {
        // Rotate around X axis
        let cosX = Math.cos(this.rotationX);
        let sinX = Math.sin(this.rotationX);
        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;
        
        // Rotate around Y axis
        let cosY = Math.cos(this.rotationY);
        let sinY = Math.sin(this.rotationY);
        let x2 = x * cosY + z1 * sinY;
        let z2 = -x * sinY + z1 * cosY;
        
        // Rotate around Z axis
        let cosZ = Math.cos(this.rotationZ);
        let sinZ = Math.sin(this.rotationZ);
        let x3 = x2 * cosZ - y1 * sinZ;
        let y3 = x2 * sinZ + y1 * cosZ;
        
        return { x: x3, y: y3, z: z2 };
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    
    drawPoint(point, options = {}) {
        const projected = this.project(point);
        const radius = (options.radius || 5) * projected.scale;
        const color = options.color || '#4A90D9';
        const alpha = options.alpha || 1;
        
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.hexToRgba(color, alpha * projected.scale);
        this.ctx.fill();
        
        if (options.glow) {
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = 10 * projected.scale;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
        
        return projected;
    }
    
    drawLine(point1, point2, options = {}) {
        const p1 = this.project(point1);
        const p2 = this.project(point2);
        const color = options.color || '#4A90D9';
        const width = (options.width || 2) * Math.min(p1.scale, p2.scale);
        const alpha = options.alpha || 0.8;
        
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = this.hexToRgba(color, alpha);
        this.ctx.lineWidth = width;
        this.ctx.stroke();
        
        return { p1, p2 };
    }
    
    drawSphere(center, radius, options = {}) {
        const projected = this.project(center);
        const projectedRadius = radius * projected.scale;
        const color = options.color || '#4A90D9';
        const alpha = options.alpha || 1;
        
        // Create gradient for 3D effect
        const gradient = this.ctx.createRadialGradient(
            projected.x - projectedRadius * 0.3,
            projected.y - projectedRadius * 0.3,
            0,
            projected.x,
            projected.y,
            projectedRadius
        );
        gradient.addColorStop(0, this.hexToRgba(this.lightenColor(color, 40), alpha));
        gradient.addColorStop(0.5, this.hexToRgba(color, alpha));
        gradient.addColorStop(1, this.hexToRgba(this.darkenColor(color, 40), alpha));
        
        this.ctx.beginPath();
        this.ctx.arc(projected.x, projected.y, projectedRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        if (options.outline) {
            this.ctx.strokeStyle = this.hexToRgba(this.darkenColor(color, 20), alpha);
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
        
        return projected;
    }
    
    drawCube(center, size, options = {}) {
        const halfSize = size / 2;
        const vertices = [
            { x: center.x - halfSize, y: center.y - halfSize, z: center.z - halfSize },
            { x: center.x + halfSize, y: center.y - halfSize, z: center.z - halfSize },
            { x: center.x + halfSize, y: center.y + halfSize, z: center.z - halfSize },
            { x: center.x - halfSize, y: center.y + halfSize, z: center.z - halfSize },
            { x: center.x - halfSize, y: center.y - halfSize, z: center.z + halfSize },
            { x: center.x + halfSize, y: center.y - halfSize, z: center.z + halfSize },
            { x: center.x + halfSize, y: center.y + halfSize, z: center.z + halfSize },
            { x: center.x - halfSize, y: center.y + halfSize, z: center.z + halfSize }
        ];
        
        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];
        
        const color = options.color || '#4A90D9';
        
        edges.forEach(([i, j]) => {
            this.drawLine(vertices[i], vertices[j], { color, width: options.lineWidth || 2 });
        });
        
        if (options.fillFaces) {
            // Draw faces with transparency
            const faces = [
                [0, 1, 2, 3], // front
                [4, 5, 6, 7], // back
                [0, 1, 5, 4], // top
                [2, 3, 7, 6], // bottom
                [0, 3, 7, 4], // left
                [1, 2, 6, 5]  // right
            ];
            
            faces.forEach(face => {
                const projectedFace = face.map(i => this.project(vertices[i]));
                this.ctx.beginPath();
                this.ctx.moveTo(projectedFace[0].x, projectedFace[0].y);
                projectedFace.forEach(p => this.ctx.lineTo(p.x, p.y));
                this.ctx.closePath();
                this.ctx.fillStyle = this.hexToRgba(color, 0.2);
                this.ctx.fill();
            });
        }
    }
    
    drawPlane(points, options = {}) {
        const projected = points.map(p => this.project(p));
        const color = options.color || '#4A90D9';
        const alpha = options.alpha || 0.5;
        
        this.ctx.beginPath();
        this.ctx.moveTo(projected[0].x, projected[0].y);
        projected.forEach(p => this.ctx.lineTo(p.x, p.y));
        this.ctx.closePath();
        
        if (options.fill !== false) {
            this.ctx.fillStyle = this.hexToRgba(color, alpha);
            this.ctx.fill();
        }
        
        if (options.stroke !== false) {
            this.ctx.strokeStyle = this.hexToRgba(color, alpha + 0.3);
            this.ctx.lineWidth = options.lineWidth || 1;
            this.ctx.stroke();
        }
    }
    
    drawText(text, point, options = {}) {
        const projected = this.project(point);
        const fontSize = (options.fontSize || 14) * projected.scale;
        const color = options.color || '#333';
        
        this.ctx.font = `${options.fontWeight || 'normal'} ${fontSize}px ${options.fontFamily || 'Arial'}`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = options.align || 'center';
        this.ctx.textBaseline = options.baseline || 'middle';
        this.ctx.fillText(text, projected.x, projected.y);
    }
    
    createParticleCloud(count, spread, options = {}) {
        const particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: (Math.random() - 0.5) * spread,
                y: (Math.random() - 0.5) * spread,
                z: (Math.random() - 0.5) * spread,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 0.5,
                color: options.color || '#4A90D9',
                radius: options.radius || 3
            });
        }
        return particles;
    }
    
    updateParticles(particles, options = {}) {
        const bounds = options.bounds || 200;
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            
            // Bounce off bounds
            if (Math.abs(p.x) > bounds) p.vx *= -1;
            if (Math.abs(p.y) > bounds) p.vy *= -1;
            if (Math.abs(p.z) > bounds) p.vz *= -1;
        });
    }
    
    drawParticles(particles, options = {}) {
        // Sort by z for proper depth rendering
        const sorted = [...particles].sort((a, b) => {
            const za = this.rotatePoint(a.x, a.y, a.z).z;
            const zb = this.rotatePoint(b.x, b.y, b.z).z;
            return zb - za;
        });
        
        sorted.forEach(p => {
            this.drawSphere(p, p.radius, { 
                color: p.color, 
                alpha: options.alpha || 0.8 
            });
        });
    }
    
    createNeuralNetwork(layers, spacing = 100) {
        const network = { nodes: [], connections: [] };
        const totalWidth = (layers.length - 1) * spacing;
        const startX = -totalWidth / 2;
        
        layers.forEach((nodeCount, layerIndex) => {
            const x = startX + layerIndex * spacing;
            const totalHeight = (nodeCount - 1) * 50;
            const startY = -totalHeight / 2;
            
            for (let i = 0; i < nodeCount; i++) {
                const y = startY + i * 50;
                network.nodes.push({
                    x, y, z: 0,
                    layer: layerIndex,
                    index: i,
                    activation: 0
                });
            }
        });
        
        // Create connections
        let nodeIndex = 0;
        for (let l = 0; l < layers.length - 1; l++) {
            const currentLayerStart = nodeIndex;
            const nextLayerStart = nodeIndex + layers[l];
            
            for (let i = 0; i < layers[l]; i++) {
                for (let j = 0; j < layers[l + 1]; j++) {
                    network.connections.push({
                        from: currentLayerStart + i,
                        to: nextLayerStart + j,
                        weight: Math.random() * 2 - 1
                    });
                }
            }
            nodeIndex += layers[l];
        }
        
        return network;
    }
    
    drawNeuralNetwork(network, options = {}) {
        const nodeRadius = options.nodeRadius || 15;
        const activeColor = options.activeColor || '#50C878';
        const inactiveColor = options.inactiveColor || '#4A90D9';
        const connectionColor = options.connectionColor || '#ccc';
        
        // Draw connections first
        network.connections.forEach(conn => {
            const fromNode = network.nodes[conn.from];
            const toNode = network.nodes[conn.to];
            const alpha = Math.abs(conn.weight) * 0.5 + 0.1;
            const width = Math.abs(conn.weight) * 2 + 0.5;
            
            this.drawLine(fromNode, toNode, {
                color: conn.active ? activeColor : connectionColor,
                width,
                alpha: conn.active ? 0.8 : alpha
            });
        });
        
        // Draw nodes
        network.nodes.forEach(node => {
            const color = node.activation > 0.5 ? activeColor : inactiveColor;
            const alpha = 0.5 + node.activation * 0.5;
            
            this.drawSphere(node, nodeRadius, {
                color,
                alpha,
                outline: true
            });
        });
    }
    
    startAutoRotate() {
        this.autoRotate = true;
        this.animate();
    }
    
    stopAutoRotate() {
        this.autoRotate = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    animate(renderCallback) {
        const loop = () => {
            if (this.autoRotate) {
                this.rotationY += this.autoRotateSpeed;
            }
            
            this.clear();
            
            if (renderCallback) {
                renderCallback();
            }
            
            if (this.autoRotate) {
                this.animationId = requestAnimationFrame(loop);
            }
        };
        loop();
    }
    
    // Utility functions
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    lightenColor(hex, percent) {
        const num = parseInt(hex.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
    
    darkenColor(hex, percent) {
        const num = parseInt(hex.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
    }
    
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
    
    lerpPoint(p1, p2, t) {
        return {
            x: this.lerp(p1.x, p2.x, t),
            y: this.lerp(p1.y, p2.y, t),
            z: this.lerp(p1.z, p2.z, t)
        };
    }
}

// CSS 3D Transform Helper
class CSS3DHelper {
    constructor(container, options = {}) {
        this.container = container;
        this.perspective = options.perspective || 1000;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        
        // Set up container
        this.container.style.perspective = `${this.perspective}px`;
        this.container.style.perspectiveOrigin = '50% 50%';
        this.container.style.transformStyle = 'preserve-3d';
    }
    
    createLayer(zOffset, options = {}) {
        const layer = document.createElement('div');
        layer.className = 'css3d-layer';
        layer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            transform: translateZ(${zOffset}px);
            transform-style: preserve-3d;
            transition: transform 0.5s ease;
        `;
        
        if (options.className) {
            layer.classList.add(options.className);
        }
        
        this.container.appendChild(layer);
        return layer;
    }
    
    createCard(content, options = {}) {
        const card = document.createElement('div');
        card.className = 'css3d-card';
        card.innerHTML = content;
        card.style.cssText = `
            position: absolute;
            background: ${options.background || 'white'};
            border-radius: ${options.borderRadius || '8px'};
            padding: ${options.padding || '20px'};
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transform-style: preserve-3d;
            transition: transform 0.3s ease;
            ${options.width ? `width: ${options.width};` : ''}
            ${options.height ? `height: ${options.height};` : ''}
        `;
        
        if (options.x !== undefined) card.style.left = `${options.x}px`;
        if (options.y !== undefined) card.style.top = `${options.y}px`;
        if (options.z !== undefined) card.style.transform = `translateZ(${options.z}px)`;
        
        return card;
    }
    
    setRotation(x, y, z) {
        this.rotationX = x;
        this.rotationY = y;
        this.rotationZ = z;
        this.applyTransform();
    }
    
    applyTransform() {
        const children = this.container.children;
        for (let child of children) {
            if (child.classList.contains('css3d-layer')) {
                const currentZ = child.style.transform.match(/translateZ\((-?\d+)px\)/);
                const zOffset = currentZ ? currentZ[1] : 0;
                child.style.transform = `
                    rotateX(${this.rotationX}deg) 
                    rotateY(${this.rotationY}deg) 
                    rotateZ(${this.rotationZ}deg)
                    translateZ(${zOffset}px)
                `;
            }
        }
    }
    
    animateRotation(targetX, targetY, targetZ, duration = 1000) {
        const startX = this.rotationX;
        const startY = this.rotationY;
        const startZ = this.rotationZ;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = this.easeInOutCubic(progress);
            
            this.rotationX = startX + (targetX - startX) * eased;
            this.rotationY = startY + (targetY - startY) * eased;
            this.rotationZ = startZ + (targetZ - startZ) * eased;
            this.applyTransform();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.Mini3D = Mini3D;
    window.CSS3DHelper = CSS3DHelper;
}
