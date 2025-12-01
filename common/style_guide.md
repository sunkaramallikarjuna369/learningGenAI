# Content Style Guide

This guide ensures consistency across all concept folders in the Generative AI 360° repository.

## Folder Structure

Each concept folder must contain:

```
/XX_concept_name/
├── README.md                    # Concept explanation (dual-track)
├── intro_<concept>.ipynb        # Introduction notebook
├── visualization_<concept>.ipynb # Visual explanations
├── exercises_<concept>.ipynb    # Practice exercises
└── /html_demo/
    ├── index.html               # Interactive browser demo
    ├── styles.css               # Styling
    └── script.js                # Animations and interactions
```

## README.md Structure

### Required Sections

1. **Title and Overview**
   - Clear, descriptive title
   - One-paragraph summary accessible to all readers

2. **For Non-Technical Readers**
   - Plain language explanation
   - Real-world analogies
   - Practical examples from various domains
   - No equations or code required

3. **For Technical Readers**
   - Formal definitions and terminology
   - Key mathematical concepts (where applicable)
   - Architecture diagrams
   - Position in the GenAI stack

4. **Why This Matters**
   - Practical relevance
   - Industry applications
   - Connection to other concepts

5. **Real-World Examples**
   - Examples from multiple domains:
     - Marketing/Business
     - Education
     - Healthcare
     - Software Development
     - Creative Industries

6. **Related Concepts**
   - Links to prerequisite concepts
   - Links to concepts that build on this one
   - Cross-references within the repository

## Notebook Standards

### intro_<concept>.ipynb

**Opening Section:**
```python
# Learning Objectives
# - Objective 1
# - Objective 2
# - Objective 3
```

**Content Flow:**
1. Learning objectives (2-5 bullet points)
2. Conceptual explanation with illustrations
3. Non-technical section (low-code/no-code cells)
4. Technical section (architecture, math, code)
5. Summary and reflection questions

**Code Cell Guidelines:**
- All code must be executable
- Include clear comments
- Use the shared utilities from `/common/utils.py`
- Provide expected outputs in markdown

### visualization_<concept>.ipynb

**Requirements:**
- At least one interactive widget per concept
- Use matplotlib, Plotly, or ipywidgets
- Include both static and animated visualizations
- Explain each visualization in dual-track format

**Visualization Types by Concept:**
- Text/LLM: Tokenization, probability distributions, attention heatmaps
- Image/Diffusion: Noise addition, denoising steps, latent space
- Embeddings: 2D/3D projections, clustering, similarity

### exercises_<concept>.ipynb

**Non-Technical Exercises:**
- Scenario-based prompts
- Parameter tweaking (no coding required)
- Risk/bias identification tasks
- Comparative analysis exercises

**Technical Exercises:**
- Implementation tasks
- Pipeline modifications
- Metric calculations
- Challenge problems (marked as "Hard Mode")

**Exercise Format:**
```markdown
## Exercise X: [Title]

**Difficulty:** [Easy/Medium/Hard]
**Track:** [Non-Technical/Technical/Both]

### Task
[Clear description of what to do]

### Hints
<details>
<summary>Click for hint</summary>
[Hint content]
</details>

### Solution
<details>
<summary>Click for solution</summary>
[Solution content]
</details>
```

## HTML Demo Standards

### index.html

**Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Concept Name] - Interactive Demo</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>[Concept Name]</h1>
        <p class="subtitle">[Brief description]</p>
    </header>
    
    <main>
        <section id="for-everyone">
            <h2>For Everyone</h2>
            <!-- Non-technical content -->
        </section>
        
        <section id="for-techies">
            <h2>For Techies</h2>
            <!-- Technical content -->
        </section>
        
        <section id="interactive">
            <h2>Try It Yourself</h2>
            <!-- Interactive elements -->
        </section>
    </main>
    
    <footer>
        <p>Part of the Generative AI 360° Learning Repository</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>
```

### styles.css

**Required Styles:**
- Responsive design (mobile-friendly)
- Clear typography (system fonts preferred)
- Consistent color scheme matching repository theme
- Accessible contrast ratios
- Smooth transitions and animations

**Color Palette:**
```css
:root {
    --primary: #4A90D9;
    --secondary: #7B68EE;
    --accent: #50C878;
    --warning: #FFB347;
    --error: #FF6B6B;
    --text: #333333;
    --background: #F8F9FA;
    --highlight: #FFE066;
    --non-tech: #4ECDC4;
    --tech: #FF6B6B;
}
```

### script.js

**Requirements:**
- No external dependencies (vanilla JS only)
- Progressive enhancement (works without JS)
- Clear function documentation
- Event delegation where appropriate

**Common Interactions:**
- Step-through animations
- Parameter sliders
- Hover tooltips
- Toggle between views

## Writing Style

### For Non-Technical Content

**Do:**
- Use everyday analogies
- Explain "why" before "how"
- Focus on outcomes and applications
- Use active voice
- Keep sentences short

**Don't:**
- Assume technical background
- Use jargon without explanation
- Include unnecessary math
- Overwhelm with details

### For Technical Content

**Do:**
- Define terms precisely
- Include mathematical notation where helpful
- Reference original papers/sources
- Provide code examples
- Explain trade-offs

**Don't:**
- Oversimplify to the point of inaccuracy
- Skip important implementation details
- Assume familiarity with specific frameworks
- Use vendor-specific terminology

## Quality Checklist

Before submitting content, verify:

- [ ] All notebooks execute end-to-end without errors
- [ ] HTML demos work in Chrome, Firefox, and Safari
- [ ] All images have alt text
- [ ] Code is clearly commented
- [ ] Both tracks are adequately covered
- [ ] Related concepts are properly linked
- [ ] No vendor bias in explanations
- [ ] Responsible AI considerations included where relevant
- [ ] Spelling and grammar checked
- [ ] Mobile responsiveness tested

## File Naming Conventions

- Use lowercase with underscores
- Prefix notebooks with their type: `intro_`, `visualization_`, `exercises_`
- Use descriptive names that match the concept folder
- Keep names concise but clear

## Version Control

- Commit messages should be descriptive
- One concept folder per commit when possible
- Test all notebooks before committing
- Include any new dependencies in requirements.txt
