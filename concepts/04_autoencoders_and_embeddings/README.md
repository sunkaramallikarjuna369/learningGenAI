# 04 - Autoencoders and Embeddings

## Overview

This module explores how AI systems compress and represent data in meaningful ways. Autoencoders learn to compress data into smaller representations, while embeddings convert words, images, or other data into numerical vectors that capture semantic meaning. These concepts are fundamental to how modern AI understands and generates content.

---

## For Non-Technical Readers

### What are Embeddings?

Imagine you want to describe a word to a computer. You can't just show it the letters - computers need numbers. **Embeddings** are a way to convert words (or images, or any data) into lists of numbers that capture their meaning.

**Analogy:** Think of embeddings like GPS coordinates for meaning. Just as GPS coordinates (latitude, longitude) tell you where a place is on Earth, embeddings tell you where a word is in "meaning space." Words with similar meanings have similar coordinates!

**Example:**
- "King" → [0.2, 0.8, 0.1, 0.9, ...]
- "Queen" → [0.2, 0.8, 0.1, 0.7, ...]  (similar to King!)
- "Apple" → [0.9, 0.1, 0.7, 0.2, ...]  (very different)

The amazing thing: "King" - "Man" + "Woman" ≈ "Queen" in embedding space!

### What are Autoencoders?

An **autoencoder** is a neural network that learns to compress data and then reconstruct it. It's like learning to summarize a book and then expand the summary back into the full book.

**Analogy:** Imagine you're playing a game of telephone, but with a twist:
1. You hear a long story (input)
2. You must summarize it in just 3 words (compression/encoding)
3. Your friend must recreate the full story from those 3 words (decompression/decoding)

The better you get at choosing those 3 words, the better your friend can recreate the story. Autoencoders learn to find the best "summary" automatically!

### Why Does This Matter?

**For Search:** Embeddings let computers find similar content. Search "happy" and find results about "joyful" and "cheerful" too.

**For Recommendations:** Netflix uses embeddings to find movies similar to ones you liked.

**For Generation:** Generative AI uses embeddings to understand what you're asking for and create relevant content.

**For Compression:** Autoencoders can compress images, audio, and video more efficiently than traditional methods.

---

## For Technical Readers

### Embeddings

Embeddings map discrete tokens to continuous vector spaces:

$$e: V \rightarrow \mathbb{R}^d$$

Where $V$ is the vocabulary and $d$ is the embedding dimension.

**Word2Vec (Skip-gram):**
Maximizes:
$$\frac{1}{T}\sum_{t=1}^{T}\sum_{-c \leq j \leq c, j \neq 0} \log P(w_{t+j}|w_t)$$

Where $P(w_O|w_I) = \frac{\exp(v'_{w_O}^T v_{w_I})}{\sum_{w=1}^{W}\exp(v'_w^T v_{w_I})}$

**Properties:**
- Semantic similarity → cosine similarity
- Linear relationships: $v_{king} - v_{man} + v_{woman} \approx v_{queen}$
- Clustering by meaning

### Autoencoders

Architecture:
- **Encoder:** $z = f_\theta(x)$ maps input to latent space
- **Decoder:** $\hat{x} = g_\phi(z)$ reconstructs from latent

**Loss function:**
$$L = ||x - \hat{x}||^2 + \lambda R(z)$$

Where $R(z)$ is a regularization term.

**Variational Autoencoders (VAE):**
Learn a distribution over latent space:
$$q_\phi(z|x) = \mathcal{N}(\mu_\phi(x), \sigma_\phi(x))$$

**ELBO (Evidence Lower Bound):**
$$\mathcal{L} = \mathbb{E}_{q_\phi(z|x)}[\log p_\theta(x|z)] - D_{KL}(q_\phi(z|x) || p(z))$$

### Applications in GenAI

**Transformer Embeddings:**
- Token embeddings + positional embeddings
- Contextual embeddings from attention layers
- Used in BERT, GPT, etc.

**Latent Diffusion:**
- VAE encodes images to latent space
- Diffusion operates in compressed latent space
- Enables efficient high-resolution generation

**Sentence Embeddings:**
- SBERT, sentence-transformers
- Used for semantic search, RAG

---

## Real-World Examples

**Search Engines:** Google uses embeddings to understand query intent and find relevant pages even when exact words don't match.

**Spotify:** Creates embeddings for songs and users to power "Discover Weekly" recommendations.

**Image Search:** Pinterest uses image embeddings to find visually similar pins.

**Fraud Detection:** Banks use transaction embeddings to detect unusual patterns.

**Language Translation:** Embeddings help align words across languages for better translation.

---

## Related Concepts

- **Previous:** [03_neural_network_basics](../03_neural_network_basics/) - Foundation for autoencoders
- **Next:** [05_transformers_and_attention](../05_transformers_and_attention/) - Uses embeddings extensively
- **Related:** [09_image_generation_diffusion](../09_image_generation_diffusion/) - Latent diffusion uses autoencoders
- **Related:** [11_RAG_and_knowledge_integration](../11_RAG_and_knowledge_integration/) - Uses embeddings for retrieval

---

## Further Reading

- "Efficient Estimation of Word Representations in Vector Space" (Mikolov et al., 2013) - Word2Vec
- "Auto-Encoding Variational Bayes" (Kingma & Welling, 2013) - VAE
- "Sentence-BERT" (Reimers & Gurevych, 2019)
- "High-Resolution Image Synthesis with Latent Diffusion Models" (Rombach et al., 2022)
