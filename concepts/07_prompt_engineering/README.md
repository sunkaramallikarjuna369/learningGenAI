# 07 - Prompt Engineering

## Overview

Prompt engineering is the art and science of communicating effectively with AI models. It's how you craft your instructions to get the best possible results from Large Language Models. This skill is essential for both technical and non-technical users who want to leverage AI effectively.

---

## For Non-Technical Readers

### What is Prompt Engineering?

Prompt engineering is like learning to give clear instructions to a very capable but literal assistant. The AI doesn't read your mind - it responds based on exactly what you write. Better prompts lead to better results.

**Analogy:** Imagine asking someone to draw a picture. "Draw something nice" gives you unpredictable results. "Draw a sunset over mountains with orange and purple colors" gives you something much closer to what you want.

### Why Does It Matter?

The same AI model can give vastly different results based on how you ask:
- Vague prompt → Generic, unhelpful response
- Clear prompt → Specific, useful response
- Expert prompt → Exceptional, tailored response

### Key Prompting Techniques

**1. Be Specific**
- Bad: "Write about dogs"
- Good: "Write a 200-word article about the health benefits of owning a dog for seniors"

**2. Provide Context**
- Bad: "Summarize this"
- Good: "You are a business analyst. Summarize this quarterly report for executives who have 2 minutes to read it"

**3. Give Examples (Few-Shot)**
- Show the AI what you want by providing examples
- "Convert these to formal language: 'gonna' → 'going to', 'wanna' → 'want to', 'gotta' → ..."

**4. Ask for Step-by-Step (Chain of Thought)**
- "Solve this problem step by step, showing your reasoning"
- Helps the AI think through complex problems

**5. Assign a Role**
- "You are an experienced teacher explaining to a 10-year-old"
- "Act as a senior software engineer reviewing code"

### Common Mistakes

- Being too vague or too verbose
- Not specifying the desired format
- Forgetting to mention constraints
- Not iterating on prompts that don't work

---

## For Technical Readers

### Prompt Engineering Fundamentals

Prompts are the interface between human intent and model behavior. Understanding how models process prompts helps craft more effective ones.

### Prompt Components

1. **System Prompt:** Sets the model's behavior and persona
2. **User Prompt:** The actual request or question
3. **Context:** Background information or documents
4. **Examples:** Few-shot demonstrations
5. **Output Format:** Desired structure of response

### Advanced Techniques

**Zero-Shot Prompting:**
Direct instruction without examples.
```
Classify the sentiment of this review as positive, negative, or neutral: "The product arrived late but works great."
```

**Few-Shot Prompting:**
Provide examples to guide the model.
```
Classify sentiment:
"I love this!" → positive
"Terrible experience" → negative
"It's okay" → neutral
"The product arrived late but works great." →
```

**Chain-of-Thought (CoT):**
Encourage step-by-step reasoning.
```
Q: If a train travels 120 miles in 2 hours, what is its speed?
A: Let me solve this step by step:
1. Speed = Distance / Time
2. Distance = 120 miles
3. Time = 2 hours
4. Speed = 120 / 2 = 60 mph
```

**Self-Consistency:**
Generate multiple reasoning paths and take majority vote.

**Tree of Thoughts (ToT):**
Explore multiple reasoning branches, evaluate, and backtrack.

**ReAct (Reasoning + Acting):**
Interleave reasoning with actions/tool use.
```
Thought: I need to find the current weather
Action: search("weather in New York")
Observation: Currently 72°F and sunny
Thought: Now I can answer the user
```

### Prompt Templates

```python
# System prompt template
SYSTEM_PROMPT = """You are a {role} with expertise in {domain}.
Your task is to {task}.
Guidelines:
- {guideline_1}
- {guideline_2}
Output format: {format}"""

# Few-shot template
FEW_SHOT_PROMPT = """
Examples:
Input: {example_1_input}
Output: {example_1_output}

Input: {example_2_input}
Output: {example_2_output}

Input: {actual_input}
Output:"""
```

### Evaluation Metrics

- **Task Completion Rate:** Does the output achieve the goal?
- **Accuracy:** For factual tasks, is the answer correct?
- **Format Compliance:** Does output match requested format?
- **Consistency:** Same prompt → similar quality outputs?

---

## Real-World Applications

**Customer Service:** Crafting prompts for chatbots that handle diverse queries

**Content Creation:** Templates for blog posts, social media, marketing copy

**Code Generation:** Prompts that produce working, well-documented code

**Data Analysis:** Extracting insights from unstructured text

**Education:** Creating personalized learning experiences

**Research:** Summarizing papers, generating hypotheses

---

## Related Concepts

- **Previous:** [06_large_language_models](../06_large_language_models/) - The models you're prompting
- **Next:** [08_text_generation_use_cases](../08_text_generation_use_cases/) - Applying prompts to real tasks
- **Related:** [11_RAG_and_knowledge_integration](../11_RAG_and_knowledge_integration/) - Combining prompts with retrieval
- **Related:** [12_agents_and_tool_use](../12_agents_and_tool_use/) - Prompts that trigger actions

---

## Further Reading

- "Language Models are Few-Shot Learners" (Brown et al., 2020)
- "Chain-of-Thought Prompting Elicits Reasoning" (Wei et al., 2022)
- "Tree of Thoughts" (Yao et al., 2023)
- OpenAI Prompt Engineering Guide
- Anthropic's Claude Prompt Engineering Documentation
