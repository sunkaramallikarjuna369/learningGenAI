# 02 - Probabilities and Tokens

## Overview

This module explores how Generative AI models process and generate text through tokenization and probability distributions. Understanding tokens and probabilities is fundamental to grasping how language models "think" and produce coherent text.

---

## For Non-Technical Readers

### What are Tokens?

When you type a message to ChatGPT or any language model, the AI doesn't read your words the way you do. Instead, it breaks your text into smaller pieces called **tokens**. Think of tokens as the AI's vocabulary building blocks.

**Analogy:** Imagine you're playing Scrabble, but instead of individual letters, you have tiles with common word parts. Some tiles have whole words ("the", "and"), some have word pieces ("ing", "tion"), and some have just letters. The AI uses a similar system to break down and understand text.

**Examples of tokenization:**
- "Hello" → ["Hello"] (1 token)
- "unhappiness" → ["un", "happiness"] (2 tokens)
- "ChatGPT" → ["Chat", "G", "PT"] (3 tokens)

### What are Probabilities?

After the AI reads your tokens, it predicts what comes next by calculating **probabilities** for every possible next token. It's like a very sophisticated autocomplete.

**Analogy:** Imagine you're playing a word association game. If someone says "peanut butter and...", you'd probably think "jelly" with high confidence. The AI does something similar but with thousands of possible next words, each with a probability score.

**Example:**
- Input: "The cat sat on the..."
- Possible next tokens with probabilities:
  - "mat" → 25%
  - "floor" → 20%
  - "chair" → 15%
  - "bed" → 10%
  - ... (thousands more options)

### Temperature: Controlling Creativity

**Temperature** is a setting that controls how "creative" or "random" the AI's responses are:

- **Low temperature (0.1-0.3):** The AI almost always picks the most likely token. Responses are predictable and consistent.
- **Medium temperature (0.7-0.9):** Balanced between predictability and creativity.
- **High temperature (1.5-2.0):** The AI is more willing to pick less likely tokens. Responses are more creative but potentially less coherent.

**Analogy:** Think of temperature like a chef's creativity dial. Low temperature = follow the recipe exactly. High temperature = improvise and experiment.

---

## For Technical Readers

### Tokenization Algorithms

Modern LLMs use subword tokenization algorithms, primarily:

**Byte Pair Encoding (BPE):**
- Starts with individual characters
- Iteratively merges most frequent adjacent pairs
- Creates a vocabulary of subword units
- Used by GPT models

**WordPiece:**
- Similar to BPE but uses likelihood instead of frequency
- Adds "##" prefix for continuation tokens
- Used by BERT

**SentencePiece:**
- Language-agnostic tokenization
- Treats input as raw bytes
- Used by T5, LLaMA

### Probability Distribution

Given a sequence of tokens $x_1, x_2, ..., x_{n-1}$, the model computes:

$$P(x_n | x_1, x_2, ..., x_{n-1})$$

This is implemented via:

1. **Embedding lookup:** Convert tokens to vectors
2. **Transformer forward pass:** Process through attention layers
3. **Output projection:** Map to vocabulary size
4. **Softmax:** Convert logits to probabilities

$$P(x_i = v) = \frac{e^{z_v}}{\sum_{j=1}^{V} e^{z_j}}$$

Where $z_v$ is the logit for vocabulary item $v$.

### Temperature Scaling

Temperature $T$ modifies the softmax:

$$P(x_i = v) = \frac{e^{z_v/T}}{\sum_{j=1}^{V} e^{z_j/T}}$$

- $T < 1$: Sharpens distribution (more deterministic)
- $T = 1$: Original distribution
- $T > 1$: Flattens distribution (more random)

### Sampling Strategies

**Greedy Decoding:**
$$x_n = \arg\max_v P(x_n = v | x_{1:n-1})$$

**Top-K Sampling:**
Sample from the K most probable tokens after renormalization.

**Top-P (Nucleus) Sampling:**
Sample from smallest set of tokens whose cumulative probability exceeds P.

**Beam Search:**
Maintain B candidate sequences, expanding each and keeping top B overall.

---

## Why This Matters

Understanding tokens and probabilities helps you:

1. **Write better prompts:** Knowing how text is tokenized helps you structure prompts effectively
2. **Understand model behavior:** Why does the AI sometimes produce unexpected outputs?
3. **Control output quality:** Use temperature and sampling parameters appropriately
4. **Estimate costs:** API pricing is often based on token count
5. **Debug issues:** Understand why certain inputs produce certain outputs

---

## Real-World Examples

**Marketing:** Understanding token limits helps craft effective ad copy that fits within model constraints.

**Software Development:** Knowing tokenization helps when working with code completion tools—some variable names tokenize better than others.

**Content Creation:** Temperature settings let you choose between consistent, on-brand content (low temp) or creative brainstorming (high temp).

**Customer Service:** Predictable responses (low temperature) are better for FAQ bots, while creative responses might suit entertainment applications.

---

## Related Concepts

- **Previous:** [01_foundations_ai_vs_genai](../01_foundations_ai_vs_genai/) - What is Generative AI?
- **Next:** [03_neural_network_basics](../03_neural_network_basics/) - How neural networks process information
- **Related:** [05_transformers_and_attention](../05_transformers_and_attention/) - The architecture that enables this
- **Related:** [07_prompt_engineering](../07_prompt_engineering/) - Using this knowledge to write better prompts

---

## Further Reading

- "Neural Machine Translation of Rare Words with Subword Units" (Sennrich et al., 2016) - BPE paper
- "Google's Neural Machine Translation System" (Wu et al., 2016) - WordPiece
- "SentencePiece: A simple and language independent subword tokenizer" (Kudo & Richardson, 2018)
- OpenAI Tokenizer Tool: https://platform.openai.com/tokenizer
