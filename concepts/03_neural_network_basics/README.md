# 03 - Neural Network Basics

## Overview

Neural networks are the foundation of modern AI, including all Generative AI systems. This module explains how neural networks process information, learn patterns, and make predictions. Understanding these basics helps you grasp how more complex systems like transformers and large language models work.

---

## For Non-Technical Readers

### What is a Neural Network?

A neural network is a computer system inspired by the human brain. Just like your brain has billions of neurons connected together, a neural network has artificial "neurons" (also called nodes) connected in layers.

**Analogy:** Think of a neural network like a factory assembly line:
- **Input layer:** Raw materials come in (your data - text, images, numbers)
- **Hidden layers:** Workers process and transform the materials step by step
- **Output layer:** The finished product comes out (predictions, classifications, generated content)

### How Does It Learn?

Neural networks learn through a process similar to how you learned to ride a bike:

1. **Try something:** The network makes a prediction
2. **Get feedback:** Compare the prediction to the correct answer
3. **Adjust:** Change internal settings to do better next time
4. **Repeat:** Do this millions of times until accurate

**Analogy:** Imagine learning to throw darts:
- First throw: Way off target
- You adjust your aim based on where the dart landed
- After thousands of throws, you become accurate
- The neural network does this automatically with math!

### Key Concepts

**Neurons/Nodes:** The basic units that receive inputs, process them, and pass outputs to the next layer.

**Weights:** Numbers that determine how important each input is. Learning = adjusting these weights.

**Layers:**
- **Input layer:** Receives raw data
- **Hidden layers:** Process and transform data (the "thinking" happens here)
- **Output layer:** Produces the final result

**Activation Functions:** Rules that decide whether a neuron should "fire" (pass information forward) or not. They add non-linearity, allowing the network to learn complex patterns.

---

## For Technical Readers

### Mathematical Foundation

A single neuron computes:

$$y = f(\sum_{i=1}^{n} w_i x_i + b)$$

Where:
- $x_i$ = inputs
- $w_i$ = weights
- $b$ = bias
- $f$ = activation function
- $y$ = output

### Forward Propagation

For a layer $l$:

$$z^{[l]} = W^{[l]} a^{[l-1]} + b^{[l]}$$
$$a^{[l]} = g^{[l]}(z^{[l]})$$

Where:
- $W^{[l]}$ = weight matrix for layer $l$
- $a^{[l-1]}$ = activations from previous layer
- $b^{[l]}$ = bias vector
- $g^{[l]}$ = activation function

### Common Activation Functions

**ReLU (Rectified Linear Unit):**
$$f(x) = \max(0, x)$$

**Sigmoid:**
$$f(x) = \frac{1}{1 + e^{-x}}$$

**Tanh:**
$$f(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}$$

**Softmax (for output layer):**
$$f(x_i) = \frac{e^{x_i}}{\sum_{j} e^{x_j}}$$

### Backpropagation

The learning algorithm uses gradient descent to minimize a loss function $L$:

$$w_{new} = w_{old} - \eta \frac{\partial L}{\partial w}$$

Where $\eta$ is the learning rate.

The chain rule computes gradients through layers:

$$\frac{\partial L}{\partial w^{[l]}} = \frac{\partial L}{\partial a^{[L]}} \cdot \frac{\partial a^{[L]}}{\partial z^{[L]}} \cdot ... \cdot \frac{\partial z^{[l]}}{\partial w^{[l]}}$$

### Network Architectures

**Feedforward Networks (MLP):** Information flows in one direction, input to output.

**Convolutional Neural Networks (CNN):** Specialized for spatial data (images), use convolution operations.

**Recurrent Neural Networks (RNN):** Have loops for sequential data, maintain hidden state.

**Transformers:** Use attention mechanisms instead of recurrence, foundation of modern LLMs.

---

## Why This Matters

Understanding neural networks helps you:

1. **Understand AI capabilities:** Know what neural networks can and cannot do
2. **Debug AI behavior:** Understand why models make certain predictions
3. **Choose the right model:** Different architectures suit different tasks
4. **Communicate with technical teams:** Speak the language of AI development
5. **Appreciate GenAI:** All generative models are built on these foundations

---

## Real-World Examples

**Image Recognition:** CNNs identify objects in photos for self-driving cars, medical diagnosis, and security systems.

**Language Processing:** Neural networks power translation, sentiment analysis, and chatbots.

**Recommendations:** Netflix, Spotify, and Amazon use neural networks to suggest content.

**Healthcare:** Neural networks analyze medical images, predict patient outcomes, and assist in drug discovery.

**Finance:** Fraud detection, algorithmic trading, and credit scoring use neural networks.

---

## Related Concepts

- **Previous:** [02_probabilities_and_tokens](../02_probabilities_and_tokens/) - How AI handles text
- **Next:** [04_autoencoders_and_embeddings](../04_autoencoders_and_embeddings/) - Compressing and representing data
- **Related:** [05_transformers_and_attention](../05_transformers_and_attention/) - Modern architecture for GenAI
- **Related:** [06_large_language_models](../06_large_language_models/) - Scaling neural networks

---

## Further Reading

- "Neural Networks and Deep Learning" by Michael Nielsen (free online book)
- "Deep Learning" by Goodfellow, Bengio, and Courville
- 3Blue1Brown YouTube series on neural networks
- Stanford CS231n: Convolutional Neural Networks for Visual Recognition
