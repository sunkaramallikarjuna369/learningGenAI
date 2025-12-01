# 12 - Agents and Tool Use

## Overview

AI Agents are autonomous systems that can plan, reason, and take actions to accomplish goals. Unlike simple chatbots that just respond to prompts, agents can use tools, access external systems, and execute multi-step tasks with minimal human intervention.

---

## For Non-Technical Readers

### What is an AI Agent?

An AI agent is like a smart assistant that can actually DO things, not just talk. While a regular chatbot can only answer questions, an agent can:
- Search the web for information
- Send emails
- Book appointments
- Write and run code
- Interact with databases and APIs

**Analogy:** Think of a regular LLM as a knowledgeable friend who can give advice. An AI agent is like a personal assistant who can not only give advice but also make phone calls, schedule meetings, and handle tasks on your behalf.

### How Do Agents Work?

Agents follow a think-act-observe loop:

1. **Think:** Understand the goal and plan steps
2. **Act:** Use tools to take action
3. **Observe:** See the results
4. **Repeat:** Adjust and continue until done

### What Tools Can Agents Use?

- **Web Search:** Find current information online
- **Calculator:** Perform precise calculations
- **Code Execution:** Write and run programs
- **APIs:** Connect to external services
- **Databases:** Query and update data
- **File Systems:** Read and write files

### Real-World Examples

**Personal Assistant:** "Book me a flight to NYC next Friday under $300"
- Agent searches flights, compares prices, and books the best option

**Research Assistant:** "Summarize the latest AI papers on transformers"
- Agent searches arXiv, downloads papers, and creates a summary

**Customer Service:** "Process this refund and update the customer"
- Agent checks policy, processes refund, sends confirmation email

---

## For Technical Readers

### Agent Architecture

```
User Goal → Planning → Tool Selection → Execution → Observation → Response
                ↑                                        |
                └────────────── Feedback Loop ───────────┘
```

### Key Components

**1. Planning Module:**
- Task decomposition
- Step-by-step reasoning
- Goal tracking

**2. Memory:**
- Short-term: Current conversation/task context
- Long-term: Persistent knowledge, user preferences
- Episodic: Past interactions and outcomes

**3. Tool Interface:**
- Tool descriptions (name, parameters, usage)
- Function calling / tool use API
- Result parsing and error handling

**4. Reasoning Framework:**
- ReAct: Reasoning + Acting interleaved
- Chain-of-Thought: Step-by-step reasoning
- Tree-of-Thought: Exploring multiple paths

### ReAct Pattern

```
Thought: I need to find the current weather in Tokyo
Action: search_weather(location="Tokyo")
Observation: Temperature: 22°C, Partly cloudy
Thought: Now I have the weather, I can respond
Action: respond("The weather in Tokyo is 22°C and partly cloudy")
```

### Tool Definition Example

```python
tools = [
    {
        "name": "search_web",
        "description": "Search the web for current information",
        "parameters": {
            "query": {"type": "string", "description": "Search query"},
            "num_results": {"type": "integer", "default": 5}
        }
    },
    {
        "name": "send_email",
        "description": "Send an email to a recipient",
        "parameters": {
            "to": {"type": "string", "description": "Email address"},
            "subject": {"type": "string"},
            "body": {"type": "string"}
        }
    }
]
```

### Agent Frameworks

| Framework | Description | Use Case |
|-----------|-------------|----------|
| LangChain | Modular agent framework | General purpose |
| AutoGPT | Autonomous goal-driven agent | Complex tasks |
| CrewAI | Multi-agent collaboration | Team workflows |
| OpenAI Assistants | Built-in tool use | Simple integrations |

### Multi-Agent Systems

Multiple agents can collaborate:
- **Researcher:** Gathers information
- **Analyst:** Processes and analyzes data
- **Writer:** Creates reports
- **Reviewer:** Checks quality

### Safety Considerations

- **Sandboxing:** Limit what tools can do
- **Confirmation:** Require approval for sensitive actions
- **Rate Limiting:** Prevent runaway execution
- **Logging:** Track all actions for audit

---

## Implementation Example

```python
from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI

# Define tools
tools = [
    Tool(
        name="Calculator",
        func=lambda x: eval(x),
        description="Useful for math calculations"
    ),
    Tool(
        name="Search",
        func=search_function,
        description="Search the web for information"
    )
]

# Create agent
llm = OpenAI(temperature=0)
agent = initialize_agent(
    tools, 
    llm, 
    agent="zero-shot-react-description",
    verbose=True
)

# Run agent
result = agent.run("What is 15% of the current Bitcoin price?")
```

---

## Related Concepts

- **Previous:** [11_RAG_and_knowledge_integration](../11_RAG_and_knowledge_integration/) - Knowledge retrieval
- **Next:** [13_evaluation_and_safety](../13_evaluation_and_safety/) - Evaluating AI systems
- **Related:** [07_prompt_engineering](../07_prompt_engineering/) - Crafting agent prompts
- **Related:** [06_large_language_models](../06_large_language_models/) - The reasoning engine

---

## Further Reading

- "ReAct: Synergizing Reasoning and Acting in Language Models" (Yao et al., 2022)
- "Toolformer: Language Models Can Teach Themselves to Use Tools" (Schick et al., 2023)
- LangChain Agents Documentation
- OpenAI Function Calling Guide
