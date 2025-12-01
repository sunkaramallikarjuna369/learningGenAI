# Content Style Guide

## Folder Structure

Each concept folder must contain:

```
/XX_concept_name/
├── README.md                    # Concept explanation (dual-track)
├── intro_<concept>.ipynb        # Introduction notebook
├── visualization_<concept>.ipynb # Visual demos and animations
├── exercises_<concept>.ipynb    # Practice exercises
└── html_demo/
    ├── index.html              # Interactive browser demo
    ├── styles.css              # Styling
    └── script.js               # Interactivity
```

## README.md Structure

```markdown
# Concept Name

## For Non-Technical Readers
[Plain language explanation with analogies and real-world examples]

## For Technical Readers
[Formal explanation with terminology and architecture details]

## Why This Matters
[Practical relevance for both audiences]

## Real-World Examples
[Examples from different domains]

## Key Takeaways
[Bullet points summarizing main concepts]

## Related Concepts
[Links to other concept folders]
```

## Notebook Structure

### intro_<concept>.ipynb
1. Learning Objectives (2-5 bullet points)
2. Conceptual Explanation
3. For Non-IT: Simple demos with minimal code
4. For IT: Deeper technical content
5. Reflection Questions

### visualization_<concept>.ipynb
1. Visual Overview
2. Interactive Visualizations
3. Animations (at least one per concept)
4. Dual explanations (non-tech and tech)

### exercises_<concept>.ipynb
1. Non-IT Exercises (scenario-based, prompt design)
2. IT Exercises (coding challenges)
3. Challenge Problems
4. Solutions (hidden or separate)

## HTML Demo Structure

- Clean, modern design
- Responsive layout
- "For Everyone" and "For Techies" sections
- Interactive elements (buttons, sliders)
- Tooltips for technical terms
- No backend required

## Writing Guidelines

### For Non-Technical Content
- Use analogies and metaphors
- Avoid jargon (or explain it immediately)
- Focus on "what" and "why", not "how"
- Use real-world examples
- Keep sentences short and clear

### For Technical Content
- Include relevant math where appropriate
- Reference architectures and papers
- Provide code snippets
- Explain trade-offs and design decisions
- Link to further reading

## Code Style

- Clear comments explaining purpose
- Modular functions
- Error handling
- Use common/utils.py helpers
- Test all code before committing
