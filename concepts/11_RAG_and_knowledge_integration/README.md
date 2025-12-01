# 11 - RAG and Knowledge Integration

## Overview

Retrieval-Augmented Generation (RAG) combines the power of Large Language Models with external knowledge sources. Instead of relying solely on what the model learned during training, RAG retrieves relevant information from documents, databases, or the web to provide accurate, up-to-date, and grounded responses.

---

## For Non-Technical Readers

### What is RAG?

RAG is like giving an AI assistant access to a library. Instead of answering from memory alone (which might be outdated or incomplete), the AI first looks up relevant information, then uses that information to craft a better answer.

**Analogy:** Imagine asking a friend a question. A regular LLM is like a friend answering from memory. RAG is like a friend who says "let me check my notes first" and then gives you a more accurate answer based on what they found.

### Why Do We Need RAG?

LLMs have limitations:
- **Knowledge Cutoff:** They don't know about events after their training
- **Hallucinations:** They sometimes make up facts confidently
- **No Private Data:** They can't access your company's documents

RAG solves these by:
- Retrieving current information
- Grounding answers in real documents
- Accessing private knowledge bases

### How Does RAG Work?

1. **Question:** User asks "What were our Q3 sales?"
2. **Retrieve:** System searches company documents for relevant info
3. **Augment:** Retrieved documents are added to the prompt
4. **Generate:** LLM answers using the retrieved context

### Real-World Examples

**Customer Support:** Answer questions using product documentation

**Legal Research:** Find relevant case law and cite sources

**Enterprise Search:** Query internal knowledge bases naturally

**Healthcare:** Access medical literature for clinical decisions

---

## For Technical Readers

### RAG Architecture

```
Query → Embedding → Vector Search → Top-K Documents → LLM → Response
                         ↑
              Document Store (Vector DB)
```

### Key Components

**1. Document Processing:**
- Chunking: Split documents into manageable pieces (512-1024 tokens)
- Overlap: Include context between chunks (10-20%)
- Metadata: Preserve source, date, section info

**2. Embedding Model:**
- Convert text to dense vectors
- Models: OpenAI Ada, Cohere, BGE, E5
- Dimension: 384-1536 typically

**3. Vector Database:**
- Store and index embeddings
- Options: Pinecone, Weaviate, Chroma, Milvus, pgvector
- Similarity: Cosine, dot product, Euclidean

**4. Retrieval:**
- Query embedding → similarity search
- Top-K retrieval (typically 3-10 documents)
- Reranking for relevance

**5. Generation:**
- Construct prompt with retrieved context
- LLM generates grounded response
- Optional: cite sources

### Advanced Techniques

**Hybrid Search:**
Combine dense (semantic) and sparse (keyword) retrieval.
```
score = α * dense_score + (1-α) * bm25_score
```

**Query Expansion:**
Rewrite or expand queries for better retrieval.
- HyDE: Generate hypothetical document, then retrieve
- Multi-query: Generate multiple query variations

**Reranking:**
Use cross-encoder to rerank initial results.
```python
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
scores = reranker.predict([(query, doc) for doc in candidates])
```

**Contextual Compression:**
Extract only relevant portions from retrieved documents.

**Self-RAG:**
Model decides when to retrieve and evaluates retrieval quality.

### Chunking Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| Fixed Size | Split by token count | General purpose |
| Sentence | Split at sentence boundaries | Narrative text |
| Semantic | Split by topic/meaning | Technical docs |
| Recursive | Hierarchical splitting | Structured docs |

### Evaluation Metrics

**Retrieval:**
- Recall@K: % of relevant docs in top K
- MRR: Mean Reciprocal Rank
- NDCG: Normalized Discounted Cumulative Gain

**Generation:**
- Faithfulness: Is answer grounded in context?
- Relevance: Does answer address the query?
- Groundedness: Are claims supported by sources?

---

## Implementation Example

```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(documents, embeddings)

# Create RAG chain
llm = ChatOpenAI(model="gpt-4")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(k=5),
    return_source_documents=True
)

# Query
result = qa_chain("What is our refund policy?")
print(result["result"])
print(result["source_documents"])
```

---

## Related Concepts

- **Previous:** [10_multimodal_models](../10_multimodal_models/) - Multimodal understanding
- **Next:** [12_agents_and_tool_use](../12_agents_and_tool_use/) - AI agents with tools
- **Related:** [04_autoencoders_and_embeddings](../04_autoencoders_and_embeddings/) - Embeddings for retrieval
- **Related:** [06_large_language_models](../06_large_language_models/) - The generation component

---

## Further Reading

- "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (Lewis et al., 2020)
- "Self-RAG: Learning to Retrieve, Generate, and Critique" (Asai et al., 2023)
- LangChain Documentation
- LlamaIndex Documentation
