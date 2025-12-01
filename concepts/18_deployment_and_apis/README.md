# 18 - Deployment and APIs

## Overview

Deploying GenAI models and integrating them into applications requires understanding APIs, infrastructure, and best practices for production systems. This section covers how to take AI from experiments to real-world applications.

---

## For Non-Technical Readers

### What is an API?

An **API (Application Programming Interface)** is like a waiter at a restaurant:
- You (the customer) tell the waiter what you want
- The waiter takes your order to the kitchen (the AI model)
- The kitchen prepares your food (processes your request)
- The waiter brings back your meal (returns the AI's response)

You don't need to know how to cook - you just need to know how to order!

### How Do You Use AI APIs?

Most AI tools work through APIs. When you use ChatGPT, Claude, or other AI services:
1. You type a message (send a request)
2. The message goes to powerful computers (servers)
3. The AI processes your request
4. You get a response back

### Popular AI API Providers

- **OpenAI:** GPT-4, DALL-E, Whisper
- **Anthropic:** Claude models
- **Google:** Gemini, PaLM
- **Amazon:** Bedrock (access to multiple models)
- **Microsoft:** Azure OpenAI Service
- **Hugging Face:** Thousands of open models

### What Does "Deployment" Mean?

**Deployment** is making your AI application available for people to use. It's like:
- Writing a book (building the AI) vs. publishing it (deployment)
- Cooking at home (testing) vs. opening a restaurant (deployment)

### Key Considerations

- **Cost:** API calls cost money (usually per token/request)
- **Speed:** How fast does the AI respond?
- **Reliability:** Will it work 24/7?
- **Privacy:** Where does your data go?

---

## For Technical Readers

### API Integration Patterns

**Direct API Calls:**
```python
import openai

client = openai.OpenAI(api_key="your-key")

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain APIs in simple terms."}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)
```

**Using LangChain:**
```python
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

chat = ChatOpenAI(model="gpt-4", temperature=0.7)

messages = [
    SystemMessage(content="You are a helpful assistant."),
    HumanMessage(content="Explain APIs in simple terms.")
]

response = chat(messages)
print(response.content)
```

### Deployment Options

| Option | Pros | Cons | Best For |
|--------|------|------|----------|
| **API Services** | Easy, scalable, maintained | Cost, latency, data privacy | Most use cases |
| **Self-hosted** | Control, privacy, no per-call cost | Infrastructure, maintenance | Enterprise, privacy-critical |
| **Edge/On-device** | Low latency, offline, privacy | Limited model size | Mobile, IoT |
| **Hybrid** | Flexibility | Complexity | Variable workloads |

### Infrastructure Components

**API Gateway:**
- Rate limiting
- Authentication
- Request routing
- Logging and monitoring

**Load Balancer:**
- Distribute requests across servers
- Handle traffic spikes
- Failover support

**Caching Layer:**
- Reduce redundant API calls
- Lower costs
- Improve response times

**Queue System:**
- Handle async requests
- Manage backpressure
- Retry failed requests

### Production Best Practices

**1. Error Handling:**
```python
import openai
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def call_api_with_retry(prompt):
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except openai.RateLimitError:
        raise  # Will trigger retry
    except openai.APIError as e:
        logging.error(f"API error: {e}")
        raise
```

**2. Cost Management:**
```python
def estimate_cost(prompt, response, model="gpt-4"):
    # Approximate token counts
    prompt_tokens = len(prompt.split()) * 1.3
    response_tokens = len(response.split()) * 1.3
    
    # GPT-4 pricing (example)
    cost = (prompt_tokens * 0.03 + response_tokens * 0.06) / 1000
    return cost
```

**3. Monitoring:**
- Track latency, error rates, token usage
- Set up alerts for anomalies
- Log requests for debugging

### Scaling Strategies

**Horizontal Scaling:**
- Add more API instances
- Use container orchestration (Kubernetes)
- Auto-scale based on demand

**Caching:**
```python
import hashlib
import redis

cache = redis.Redis()

def cached_completion(prompt, ttl=3600):
    cache_key = hashlib.md5(prompt.encode()).hexdigest()
    
    cached = cache.get(cache_key)
    if cached:
        return cached.decode()
    
    response = call_api(prompt)
    cache.setex(cache_key, ttl, response)
    return response
```

**Batching:**
- Group similar requests
- Process in parallel
- Reduce overhead

### Security Considerations

- **API Key Management:** Use environment variables, secrets managers
- **Input Validation:** Sanitize user inputs
- **Output Filtering:** Check for sensitive data leakage
- **Rate Limiting:** Prevent abuse
- **Audit Logging:** Track all API usage

---

## Deployment Example

```python
# FastAPI deployment example
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai

app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    max_tokens: int = 500

class ChatResponse(BaseModel):
    response: str
    tokens_used: int

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": request.message}],
            max_tokens=request.max_tokens
        )
        
        return ChatResponse(
            response=response.choices[0].message.content,
            tokens_used=response.usage.total_tokens
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run with: uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Related Concepts

- **Previous:** [17_genai_in_non_it_roles](../17_genai_in_non_it_roles/) - AI for non-developers
- **Next:** [19_future_trends_and_limits](../19_future_trends_and_limits/) - What's next for GenAI
- **Related:** [11_RAG_and_knowledge_integration](../11_RAG_and_knowledge_integration/) - Building RAG systems
- **Related:** [12_agents_and_tool_use](../12_agents_and_tool_use/) - AI agents

---

## Further Reading

- OpenAI API Documentation
- "Designing Machine Learning Systems" by Chip Huyen
- AWS/GCP/Azure ML deployment guides
- LangChain deployment documentation
