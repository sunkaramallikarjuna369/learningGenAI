# 13 - Evaluation and Safety

## Overview

Evaluating Generative AI systems is crucial for ensuring they work correctly, safely, and reliably. This includes measuring quality, detecting harmful outputs, preventing misuse, and building systems that humans can trust.

---

## For Non-Technical Readers

### Why Evaluate AI?

Just like we test products before selling them, we need to test AI systems to make sure they:
- Give accurate, helpful answers
- Don't produce harmful or offensive content
- Work consistently and reliably
- Can be trusted for important decisions

### Common Problems with GenAI

**Hallucinations:** AI confidently states false information
- Example: "The Eiffel Tower was built in 1920" (actually 1889)

**Bias:** AI treats different groups unfairly
- Example: Associating certain jobs with specific genders

**Harmful Content:** AI generates inappropriate material
- Example: Instructions for dangerous activities

**Inconsistency:** AI gives different answers to the same question
- Example: Contradicting itself in the same conversation

### How Do We Test AI?

**Human Evaluation:** People rate AI outputs for quality
- Is this answer helpful?
- Is this content appropriate?
- Does this make sense?

**Automated Testing:** Computers check AI outputs
- Does the answer match known facts?
- Does it contain banned words?
- Is it similar to good examples?

**Red Teaming:** Experts try to break the AI
- Can we trick it into saying bad things?
- What happens with unusual inputs?

### Safety Measures

**Content Filters:** Block harmful outputs before users see them

**Guardrails:** Rules that prevent certain behaviors

**Human Review:** People check AI outputs for sensitive tasks

**Monitoring:** Track AI behavior over time to catch problems

---

## For Technical Readers

### Evaluation Metrics

**Text Generation:**
- **Perplexity:** How surprised is the model by the text?
- **BLEU/ROUGE:** Overlap with reference text
- **BERTScore:** Semantic similarity using embeddings
- **Human Preference:** A/B testing, Elo ratings

**Factuality:**
- **Groundedness:** Are claims supported by sources?
- **Attribution:** Can statements be traced to evidence?
- **Consistency:** Does the model contradict itself?

**Safety:**
- **Toxicity Score:** Probability of harmful content
- **Bias Metrics:** Fairness across demographic groups
- **Refusal Rate:** How often does it decline harmful requests?

### Evaluation Frameworks

```python
# Example: Evaluating with multiple metrics
from evaluate import load

# Load metrics
bleu = load("bleu")
rouge = load("rouge")
bertscore = load("bertscore")

# Compute scores
predictions = ["The cat sat on the mat."]
references = [["The cat is sitting on the mat."]]

bleu_score = bleu.compute(predictions=predictions, references=references)
rouge_score = rouge.compute(predictions=predictions, references=references)
bert_score = bertscore.compute(predictions=predictions, references=references, lang="en")
```

### Safety Techniques

**1. Content Moderation:**
```python
# Toxicity classification
from transformers import pipeline

classifier = pipeline("text-classification", model="unitary/toxic-bert")
result = classifier("Your input text here")
```

**2. Constitutional AI:**
- Train model to follow principles
- Self-critique and revision
- RLHF with safety constraints

**3. Guardrails:**
```python
# Input/output validation
def validate_output(text):
    if contains_pii(text):
        return "[REDACTED]"
    if toxicity_score(text) > 0.8:
        return "I can't provide that response."
    return text
```

**4. Red Teaming:**
- Adversarial prompt testing
- Jailbreak detection
- Edge case exploration

### Benchmark Datasets

| Benchmark | Purpose | Metrics |
|-----------|---------|---------|
| MMLU | Knowledge & reasoning | Accuracy |
| TruthfulQA | Factuality | % truthful |
| BBQ | Bias detection | Fairness gap |
| RealToxicityPrompts | Toxicity | Toxicity score |
| HumanEval | Code generation | Pass@k |

### LLM-as-Judge

Using LLMs to evaluate other LLMs:
```python
judge_prompt = """
Rate the following response on a scale of 1-5 for:
- Helpfulness
- Accuracy
- Safety

Response: {response}

Provide ratings and brief justification.
"""
```

### Monitoring in Production

- **Logging:** Track all inputs and outputs
- **Drift Detection:** Monitor for distribution shifts
- **Feedback Loops:** Collect user ratings
- **Alerting:** Flag anomalous behavior

---

## Implementation Example

```python
from langchain.evaluation import load_evaluator

# Create evaluators
helpfulness_evaluator = load_evaluator("criteria", criteria="helpfulness")
harmfulness_evaluator = load_evaluator("criteria", criteria="harmfulness")

# Evaluate a response
response = "Here's how to make a simple website..."

helpfulness = helpfulness_evaluator.evaluate_strings(
    prediction=response,
    input="How do I make a website?"
)

harmfulness = harmfulness_evaluator.evaluate_strings(
    prediction=response,
    input="How do I make a website?"
)

print(f"Helpfulness: {helpfulness['score']}")
print(f"Harmfulness: {harmfulness['score']}")
```

---

## Related Concepts

- **Previous:** [12_agents_and_tool_use](../12_agents_and_tool_use/) - AI agents
- **Next:** [14_responsible_ai_and_ethics](../14_responsible_ai_and_ethics/) - Ethical considerations
- **Related:** [07_prompt_engineering](../07_prompt_engineering/) - Crafting safe prompts
- **Related:** [06_large_language_models](../06_large_language_models/) - Understanding LLM behavior

---

## Further Reading

- "Constitutional AI: Harmlessness from AI Feedback" (Anthropic, 2022)
- "Red Teaming Language Models" (Perez et al., 2022)
- "Holistic Evaluation of Language Models" (HELM)
- NIST AI Risk Management Framework
