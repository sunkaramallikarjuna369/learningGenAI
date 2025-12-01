# 05 - Transformers and Attention

## Overview

Transformers are the revolutionary architecture behind modern AI systems like ChatGPT, BERT, and image generators. The key innovation is the **attention mechanism**, which allows the model to focus on relevant parts of the input when producing each part of the output. This module explains how attention works and why transformers have become the foundation of Generative AI.

---

## For Non-Technical Readers

### What is Attention?

When you read a sentence, you don't give equal importance to every word. If someone asks "What color is the sky?", you focus on "color" and "sky" while "is" and "the" fade into the background. **Attention** in AI works similarly - it helps the model focus on the most relevant parts of the input.

**Analogy:** Imagine you're at a noisy party trying to listen to one person. Your brain automatically "attends" to their voice while filtering out background noise. AI attention does something similar with text or images.

**Example:**
- Input: "The cat sat on the mat because it was tired"
- When processing "it", the model needs to figure out what "it" refers to
- Attention helps the model focus on "cat" (high attention) rather than "mat" (low attention)

### What is a Transformer?

A **Transformer** is a type of neural network architecture that uses attention as its core mechanism. Before transformers, AI processed text word by word in sequence (like reading left to right). Transformers can look at all words simultaneously and understand relationships between any words, no matter how far apart.

**Analogy:** 
- Old approach (RNNs): Like reading a book one word at a time, remembering what you read
- Transformers: Like having the entire book spread out on a table, able to look at any page instantly

### Why Are Transformers Important?

1. **Parallel Processing:** Can process all words at once (much faster)
2. **Long-Range Dependencies:** Can connect words far apart in a sentence
3. **Scalability:** Can be made very large (billions of parameters)
4. **Versatility:** Work for text, images, audio, and more

### Self-Attention: The Key Mechanism

**Self-attention** lets each word "look at" every other word in the sentence to understand context. For each word, it asks: "Which other words are most relevant to understanding me?"

**Example:**
- "The animal didn't cross the street because it was too wide"
- "it" → attends strongly to "street" (the street is wide)
- "The animal didn't cross the street because it was too tired"  
- "it" → attends strongly to "animal" (the animal is tired)

---

## For Technical Readers

### Attention Mechanism

The attention function maps a query and key-value pairs to an output:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Where:
- $Q$ = Query matrix (what we're looking for)
- $K$ = Key matrix (what we're matching against)
- $V$ = Value matrix (what we retrieve)
- $d_k$ = dimension of keys (scaling factor)

### Self-Attention

In self-attention, Q, K, V all come from the same input sequence:

$$Q = XW^Q, \quad K = XW^K, \quad V = XW^V$$

Where $X$ is the input embeddings and $W^Q, W^K, W^V$ are learned projection matrices.

### Multi-Head Attention

Multiple attention heads capture different types of relationships:

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, ..., \text{head}_h)W^O$$

Where each head is:
$$\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$

### Transformer Architecture

**Encoder Block:**
1. Multi-Head Self-Attention
2. Add & Normalize (residual connection)
3. Feed-Forward Network
4. Add & Normalize

**Decoder Block:**
1. Masked Multi-Head Self-Attention
2. Add & Normalize
3. Multi-Head Cross-Attention (attends to encoder output)
4. Add & Normalize
5. Feed-Forward Network
6. Add & Normalize

### Positional Encoding

Since attention is permutation-invariant, positional information is added:

$$PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d_{model}})$$
$$PE_{(pos, 2i+1)} = \cos(pos / 10000^{2i/d_{model}})$$

### Key Innovations

**Residual Connections:** $\text{output} = \text{LayerNorm}(x + \text{Sublayer}(x))$

**Layer Normalization:** Stabilizes training of deep networks

**Masked Attention:** In decoders, prevents attending to future tokens

### Computational Complexity

Self-attention: $O(n^2 \cdot d)$ where $n$ is sequence length, $d$ is dimension

This quadratic complexity motivates efficient attention variants (Sparse, Linear, Flash Attention).

---

## Real-World Examples

**Language Models (GPT):** Use decoder-only transformers for text generation

**BERT:** Uses encoder-only transformers for understanding tasks

**Translation (T5):** Uses full encoder-decoder for sequence-to-sequence tasks

**Vision Transformers (ViT):** Apply transformers to image patches

**Stable Diffusion:** Uses transformer blocks in the U-Net for image generation

---

## Related Concepts

- **Previous:** [04_autoencoders_and_embeddings](../04_autoencoders_and_embeddings/) - Embeddings used in transformers
- **Next:** [06_large_language_models](../06_large_language_models/) - Scaling transformers
- **Related:** [02_probabilities_and_tokens](../02_probabilities_and_tokens/) - Tokenization for transformers
- **Related:** [09_image_generation_diffusion](../09_image_generation_diffusion/) - Transformers in diffusion models

---

## Further Reading

- "Attention Is All You Need" (Vaswani et al., 2017) - Original transformer paper
- "BERT: Pre-training of Deep Bidirectional Transformers" (Devlin et al., 2018)
- "Language Models are Few-Shot Learners" (Brown et al., 2020) - GPT-3
- "An Image is Worth 16x16 Words" (Dosovitskiy et al., 2020) - Vision Transformer
- The Illustrated Transformer by Jay Alammar
