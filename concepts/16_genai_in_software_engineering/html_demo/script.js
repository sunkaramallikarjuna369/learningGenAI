/**
 * GenAI in Software Engineering - Interactive Demo Script
 * 
 * This demo shows how AI assists with code completion,
 * generation, explanation, and the development workflow.
 */

// Role-based applications data
const roleApplications = {
    frontend: {
        title: 'Frontend',
        apps: [
            { name: 'Component Generation', desc: 'Generate React, Vue, or Angular components from descriptions' },
            { name: 'CSS Styling', desc: 'Create responsive CSS and animations from mockups' },
            { name: 'Accessibility Fixes', desc: 'Identify and fix accessibility issues automatically' },
            { name: 'Test Writing', desc: 'Generate unit and integration tests for UI components' }
        ]
    },
    backend: {
        title: 'Backend',
        apps: [
            { name: 'API Development', desc: 'Generate REST/GraphQL endpoints from specifications' },
            { name: 'Database Queries', desc: 'Write optimized SQL and NoSQL queries' },
            { name: 'Error Handling', desc: 'Add comprehensive error handling and logging' },
            { name: 'Documentation', desc: 'Generate API documentation and OpenAPI specs' }
        ]
    },
    devops: {
        title: 'DevOps',
        apps: [
            { name: 'CI/CD Pipelines', desc: 'Generate GitHub Actions, Jenkins, or GitLab CI configs' },
            { name: 'Infrastructure as Code', desc: 'Create Terraform, CloudFormation, or Pulumi templates' },
            { name: 'Docker & K8s', desc: 'Generate Dockerfiles and Kubernetes manifests' },
            { name: 'Monitoring Setup', desc: 'Configure alerting and observability tools' }
        ]
    },
    data: {
        title: 'Data Engineering',
        apps: [
            { name: 'ETL Pipelines', desc: 'Generate data transformation and loading scripts' },
            { name: 'Data Validation', desc: 'Create data quality checks and validation rules' },
            { name: 'Query Optimization', desc: 'Optimize slow queries and suggest indexes' },
            { name: 'Schema Design', desc: 'Design efficient database schemas from requirements' }
        ]
    }
};

// 3D Code visualization state
let code3D = {
    mini3d: null,
    rotationY: 0,
    animating: false,
    progress: 0,
    stages: []
};

// Code generation examples
const codeExamples = {
    validate: `import re

def validate_email(email: str) -> bool:
    """
    Validate an email address using regex.
    
    Args:
        email: The email address to validate
        
    Returns:
        True if valid, False otherwise
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

# Example usage
emails = ["user@example.com", "invalid-email", "test@domain.co.uk"]
for email in emails:
    result = "✓ Valid" if validate_email(email) else "✗ Invalid"
    print(f"{email}: {result}")`,

    sort: `def sort_by_property(items: list, property_name: str, reverse: bool = False) -> list:
    """
    Sort a list of objects by a specific property.
    
    Args:
        items: List of dictionaries or objects
        property_name: The key/attribute to sort by
        reverse: Sort in descending order if True
        
    Returns:
        Sorted list
    """
    return sorted(items, key=lambda x: x.get(property_name, 0), reverse=reverse)

# Example usage
products = [
    {"name": "Laptop", "price": 999, "rating": 4.5},
    {"name": "Phone", "price": 699, "rating": 4.8},
    {"name": "Tablet", "price": 449, "rating": 4.2}
]

# Sort by price (ascending)
by_price = sort_by_property(products, "price")
print("By price:", [p["name"] for p in by_price])

# Sort by rating (descending)
by_rating = sort_by_property(products, "rating", reverse=True)
print("By rating:", [p["name"] for p in by_rating])`,

    api: `import requests
from typing import Optional, Dict, Any

def make_api_request(
    url: str,
    method: str = "GET",
    data: Optional[Dict] = None,
    headers: Optional[Dict] = None,
    timeout: int = 30
) -> Dict[str, Any]:
    """
    Make an API request with comprehensive error handling.
    
    Args:
        url: The API endpoint URL
        method: HTTP method (GET, POST, PUT, DELETE)
        data: Request payload for POST/PUT
        headers: Custom headers
        timeout: Request timeout in seconds
        
    Returns:
        Dict with 'success', 'data' or 'error' keys
    """
    try:
        response = requests.request(
            method=method,
            url=url,
            json=data,
            headers=headers or {},
            timeout=timeout
        )
        response.raise_for_status()
        
        return {
            "success": True,
            "status_code": response.status_code,
            "data": response.json()
        }
        
    except requests.exceptions.Timeout:
        return {"success": False, "error": "Request timed out"}
    except requests.exceptions.ConnectionError:
        return {"success": False, "error": "Connection failed"}
    except requests.exceptions.HTTPError as e:
        return {"success": False, "error": f"HTTP error: {e}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

# Example usage
result = make_api_request("https://api.example.com/users")
if result["success"]:
    print("Data:", result["data"])
else:
    print("Error:", result["error"])`,

    test: `import pytest
from your_module import calculate_discount

class TestCalculateDiscount:
    """Unit tests for the calculate_discount function."""
    
    def test_basic_discount(self):
        """Test standard discount calculation."""
        result = calculate_discount(100, 20)
        assert result == 80.0
    
    def test_zero_discount(self):
        """Test with zero discount."""
        result = calculate_discount(100, 0)
        assert result == 100.0
    
    def test_full_discount(self):
        """Test with 100% discount."""
        result = calculate_discount(100, 100)
        assert result == 0.0
    
    def test_decimal_price(self):
        """Test with decimal price."""
        result = calculate_discount(99.99, 10)
        assert result == pytest.approx(89.991, rel=1e-3)
    
    def test_negative_price_raises_error(self):
        """Test that negative price raises ValueError."""
        with pytest.raises(ValueError):
            calculate_discount(-100, 20)
    
    def test_invalid_discount_raises_error(self):
        """Test that discount > 100 raises ValueError."""
        with pytest.raises(ValueError):
            calculate_discount(100, 150)

# Run with: pytest test_discount.py -v`
};

// Workflow stage details
const workflowDetails = {
    design: {
        title: "Design Phase",
        description: "AI helps architects and developers plan software systems before writing code.",
        capabilities: [
            "Generate architecture diagrams from descriptions",
            "Suggest design patterns for specific problems",
            "Review API designs for best practices",
            "Create database schema suggestions",
            "Identify potential scalability issues"
        ]
    },
    code: {
        title: "Coding Phase",
        description: "AI assists with writing code faster and with fewer errors.",
        capabilities: [
            "Real-time code completion as you type",
            "Generate functions from natural language",
            "Translate code between languages",
            "Suggest refactoring improvements",
            "Auto-complete repetitive patterns"
        ]
    },
    test: {
        title: "Testing Phase",
        description: "AI helps ensure code quality through automated test generation.",
        capabilities: [
            "Generate unit tests for functions",
            "Suggest edge cases to test",
            "Create integration test scenarios",
            "Generate mock data for testing",
            "Identify untested code paths"
        ]
    },
    review: {
        title: "Code Review Phase",
        description: "AI acts as a first-pass reviewer to catch issues early.",
        capabilities: [
            "Detect potential bugs and errors",
            "Identify security vulnerabilities",
            "Check for code style violations",
            "Suggest performance improvements",
            "Flag complex code that needs simplification"
        ]
    },
    deploy: {
        title: "Deployment Phase",
        description: "AI assists with deployment configuration and automation.",
        capabilities: [
            "Generate Docker configurations",
            "Create CI/CD pipeline scripts",
            "Suggest infrastructure as code",
            "Generate deployment documentation",
            "Create monitoring and alerting rules"
        ]
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTrackToggle();
    init3DCode();
    initRoleApplications();
    initCodeCompletion();
    initCodeGeneration();
    initCodeExplanation();
    initWorkflowDemo();
});

// ============================================================================
// 3D Code Pipeline Visualization
// ============================================================================

function init3DCode() {
    const canvas = document.getElementById('code3DCanvas');
    if (!canvas || typeof Mini3D === 'undefined') return;
    
    code3D.mini3d = new Mini3D(canvas);
    
    // Create pipeline stages
    const stageData = [
        { name: 'Input', color: '#4A90D9', x: -200 },
        { name: 'Tokenize', color: '#9B59B6', x: -100 },
        { name: 'Embed', color: '#E67E22', x: 0 },
        { name: 'Generate', color: '#50C878', x: 100 },
        { name: 'Output', color: '#E74C3C', x: 200 }
    ];
    
    stageData.forEach(s => {
        code3D.stages.push({
            x: s.x,
            y: 0,
            z: 0,
            name: s.name,
            color: s.color,
            active: false,
            particles: []
        });
    });
    
    document.getElementById('rotateLeftBtn3D')?.addEventListener('click', () => {
        code3D.rotationY -= 0.3;
        render3DCode();
    });
    
    document.getElementById('rotateRightBtn3D')?.addEventListener('click', () => {
        code3D.rotationY += 0.3;
        render3DCode();
    });
    
    document.getElementById('animateCodeBtn')?.addEventListener('click', () => {
        if (!code3D.animating) {
            code3D.animating = true;
            code3D.progress = 0;
            code3D.stages.forEach(s => s.active = false);
            animateCodePipeline();
        }
    });
    
    render3DCode();
}

function animateCodePipeline() {
    if (!code3D.animating) return;
    
    code3D.progress += 0.015;
    code3D.rotationY += 0.005;
    
    // Activate stages progressively
    const stageIndex = Math.floor(code3D.progress * code3D.stages.length);
    code3D.stages.forEach((s, i) => {
        s.active = i <= stageIndex;
    });
    
    render3DCode();
    
    if (code3D.progress < 1) {
        requestAnimationFrame(animateCodePipeline);
    } else {
        code3D.animating = false;
    }
}

function render3DCode() {
    const mini3d = code3D.mini3d;
    if (!mini3d) return;
    
    mini3d.clear();
    mini3d.setRotation(0.2, code3D.rotationY, 0);
    
    const centerX = mini3d.canvas.width / 2;
    const centerY = mini3d.canvas.height / 2;
    
    // Draw connections between stages
    for (let i = 0; i < code3D.stages.length - 1; i++) {
        const s1 = code3D.stages[i];
        const s2 = code3D.stages[i + 1];
        
        const r1 = mini3d.rotatePoint(s1.x, s1.y, s1.z);
        const r2 = mini3d.rotatePoint(s2.x, s2.y, s2.z);
        const p1 = mini3d.project(r1.x + centerX, r1.y + centerY, r1.z);
        const p2 = mini3d.project(r2.x + centerX, r2.y + centerY, r2.z);
        
        mini3d.ctx.strokeStyle = s1.active && s2.active ? '#50C878' : 'rgba(150, 150, 150, 0.3)';
        mini3d.ctx.lineWidth = s1.active && s2.active ? 3 : 1;
        mini3d.ctx.beginPath();
        mini3d.ctx.moveTo(p1.x, p1.y);
        mini3d.ctx.lineTo(p2.x, p2.y);
        mini3d.ctx.stroke();
        
        // Draw arrow
        if (s1.active && s2.active) {
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            mini3d.ctx.fillStyle = '#50C878';
            mini3d.ctx.beginPath();
            mini3d.ctx.arc(midX, midY, 5, 0, Math.PI * 2);
            mini3d.ctx.fill();
        }
    }
    
    // Draw stages
    code3D.stages.forEach(stage => {
        const rotated = mini3d.rotatePoint(stage.x, stage.y, stage.z);
        const proj = mini3d.project(rotated.x + centerX, rotated.y + centerY, rotated.z);
        
        // Draw 3D box
        const boxSize = stage.active ? 50 : 40;
        const gradient = mini3d.ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, boxSize * proj.scale);
        gradient.addColorStop(0, stage.active ? stage.color : stage.color + '66');
        gradient.addColorStop(1, 'transparent');
        
        mini3d.ctx.fillStyle = gradient;
        mini3d.ctx.beginPath();
        mini3d.ctx.arc(proj.x, proj.y, boxSize * proj.scale, 0, Math.PI * 2);
        mini3d.ctx.fill();
        
        // Draw label
        mini3d.ctx.fillStyle = '#fff';
        mini3d.ctx.font = `${10 * proj.scale}px Arial`;
        mini3d.ctx.textAlign = 'center';
        mini3d.ctx.fillText(stage.name, proj.x, proj.y + 4);
    });
    
    // Draw title
    mini3d.ctx.fillStyle = '#ccc';
    mini3d.ctx.font = '14px Arial';
    mini3d.ctx.textAlign = 'center';
    mini3d.ctx.fillText('Code Generation Pipeline', centerX, 30);
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
    
    updateApplications('frontend');
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
// Section 1: Code Completion
// ============================================================================

function initCodeCompletion() {
    const showBtn = document.getElementById('showSuggestionBtn');
    const acceptBtn = document.getElementById('acceptSuggestionBtn');
    const suggestion = document.getElementById('aiSuggestion');
    const codeDisplay = document.getElementById('codeDisplay');
    
    showBtn.addEventListener('click', () => {
        suggestion.classList.add('visible');
        showBtn.disabled = true;
    });
    
    acceptBtn.addEventListener('click', () => {
        if (suggestion.classList.contains('visible')) {
            codeDisplay.innerHTML = `def calculate_discount(price, percent):
    """Calculate discounted price."""
    <span class="accepted">discount = price * (percent / 100)
    return price - discount</span>`;
            suggestion.classList.remove('visible');
            acceptBtn.textContent = 'Accepted!';
            acceptBtn.disabled = true;
        }
    });
}

// ============================================================================
// Section 2: Code Generation
// ============================================================================

function initCodeGeneration() {
    const generateBtn = document.getElementById('generateCodeBtn');
    const promptSelect = document.getElementById('promptSelect');
    const generatedCode = document.getElementById('generatedCode');
    const copyBtn = document.getElementById('copyCodeBtn');
    
    generateBtn.addEventListener('click', async () => {
        const prompt = promptSelect.value;
        generatedCode.innerHTML = '<span class="generating">Generating code...</span>';
        
        await sleep(1500);
        
        const code = codeExamples[prompt];
        generatedCode.textContent = '';
        
        // Typing effect
        for (let i = 0; i < code.length; i++) {
            generatedCode.textContent += code[i];
            if (i % 10 === 0) await sleep(5);
        }
    });
    
    copyBtn.addEventListener('click', () => {
        const code = generatedCode.textContent;
        navigator.clipboard.writeText(code).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = 'Copy', 2000);
        });
    });
}

// ============================================================================
// Section 3: Code Explanation
// ============================================================================

function initCodeExplanation() {
    const explainBtn = document.getElementById('explainCodeBtn');
    const result = document.getElementById('explanationResult');
    
    explainBtn.addEventListener('click', async () => {
        result.innerHTML = '<span style="color: var(--primary);">Analyzing code...</span>';
        
        await sleep(1500);
        
        result.innerHTML = `
            <h5>What This Code Does (Simple Explanation)</h5>
            <p>This code creates a "debounce" function - like a patient assistant who waits for you to stop typing before taking action. Instead of reacting to every keystroke, it waits until you pause.</p>
            
            <h5>Real-World Example</h5>
            <p>Imagine a search box that shows suggestions. Without debounce, it would search after every letter you type (expensive!). With debounce, it waits until you stop typing for a moment, then searches once.</p>
            
            <h5>Technical Breakdown</h5>
            <p><strong>Line 1:</strong> Creates a function that takes another function (fn) and a delay time</p>
            <p><strong>Line 2:</strong> Creates a variable to store a timer ID</p>
            <p><strong>Line 3:</strong> Returns a new function that captures any arguments</p>
            <p><strong>Line 4:</strong> Cancels any existing timer (resets the wait)</p>
            <p><strong>Line 5:</strong> Sets a new timer - when it expires, calls the original function</p>
            
            <h5>Key Concepts</h5>
            <p>• <strong>Closure:</strong> The inner function "remembers" timeoutId<br>
            • <strong>Rest parameters:</strong> ...args captures all arguments<br>
            • <strong>setTimeout/clearTimeout:</strong> JavaScript timer functions</p>
        `;
    });
}

// ============================================================================
// Section 4: Workflow Demo
// ============================================================================

function initWorkflowDemo() {
    const stages = document.querySelectorAll('.stage');
    const detail = document.getElementById('workflowDetail');
    
    stages.forEach(stage => {
        stage.addEventListener('click', () => {
            stages.forEach(s => s.classList.remove('active'));
            stage.classList.add('active');
            
            const stageData = workflowDetails[stage.dataset.stage];
            detail.innerHTML = `
                <h4>${stageData.title}</h4>
                <p>${stageData.description}</p>
                <ul>
                    ${stageData.capabilities.map(c => `<li>${c}</li>`).join('')}
                </ul>
            `;
        });
    });
}

// Utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
