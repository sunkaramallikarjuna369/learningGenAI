"""
Generative AI 360° - Shared Utilities
=====================================
Common helper functions for visualizations, demos, and educational content.
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from IPython.display import HTML, display
import warnings
warnings.filterwarnings('ignore')

# Color scheme for consistent styling
COLORS = {
    'primary': '#4a90d9',
    'secondary': '#50c878',
    'accent': '#ff6b6b',
    'background': '#1a1a2e',
    'text': '#ffffff',
    'muted': '#8892b0',
    'success': '#00ff88',
    'warning': '#ffaa00',
    'error': '#ff4444'
}

# ============================================
# Text and Token Visualization Helpers
# ============================================

def visualize_tokens(text, tokens, token_ids=None):
    """
    Visualize how text is split into tokens with color coding.
    
    Args:
        text: Original text string
        tokens: List of token strings
        token_ids: Optional list of token IDs
    """
    colors = plt.cm.Set3(np.linspace(0, 1, len(tokens)))
    
    fig, ax = plt.subplots(figsize=(14, 3))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 2)
    ax.axis('off')
    
    x_pos = 0.5
    for i, token in enumerate(tokens):
        width = len(token) * 0.15 + 0.3
        rect = plt.Rectangle((x_pos, 0.8), width, 0.8, 
                             facecolor=colors[i], edgecolor='white', linewidth=2)
        ax.add_patch(rect)
        ax.text(x_pos + width/2, 1.2, token.replace('▁', '_'), 
               ha='center', va='center', fontsize=10, fontweight='bold')
        if token_ids is not None:
            ax.text(x_pos + width/2, 0.5, f'ID: {token_ids[i]}', 
                   ha='center', va='center', fontsize=8, color='gray')
        x_pos += width + 0.1
    
    ax.set_title(f'Tokenization: "{text}"', fontsize=12, pad=20)
    plt.tight_layout()
    return fig

def visualize_probability_distribution(tokens, probabilities, title="Next Token Probabilities"):
    """
    Visualize probability distribution over next tokens.
    
    Args:
        tokens: List of token strings
        probabilities: List of probabilities (should sum to ~1)
        title: Chart title
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    
    colors = [COLORS['primary'] if p == max(probabilities) else COLORS['muted'] 
              for p in probabilities]
    
    bars = ax.barh(tokens, probabilities, color=colors, edgecolor='white')
    ax.set_xlabel('Probability', fontsize=12)
    ax.set_title(title, fontsize=14, fontweight='bold')
    ax.set_xlim(0, 1)
    
    for bar, prob in zip(bars, probabilities):
        ax.text(bar.get_width() + 0.02, bar.get_y() + bar.get_height()/2,
               f'{prob:.1%}', va='center', fontsize=10)
    
    plt.tight_layout()
    return fig

# ============================================
# Neural Network Visualization Helpers
# ============================================

def draw_neural_network(layer_sizes, ax=None, title="Neural Network"):
    """
    Draw a simple neural network diagram.
    
    Args:
        layer_sizes: List of integers representing neurons per layer
        ax: Matplotlib axis (creates new if None)
        title: Diagram title
    """
    if ax is None:
        fig, ax = plt.subplots(figsize=(12, 8))
    else:
        fig = ax.figure
    
    ax.set_xlim(-0.5, len(layer_sizes) - 0.5)
    ax.set_ylim(-0.5, max(layer_sizes) - 0.5)
    ax.axis('off')
    ax.set_title(title, fontsize=14, fontweight='bold')
    
    layer_positions = []
    for i, size in enumerate(layer_sizes):
        positions = []
        for j in range(size):
            y = (max(layer_sizes) - size) / 2 + j
            positions.append((i, y))
            circle = plt.Circle((i, y), 0.15, color=COLORS['primary'], 
                               ec='white', linewidth=2)
            ax.add_patch(circle)
        layer_positions.append(positions)
    
    # Draw connections
    for i in range(len(layer_positions) - 1):
        for pos1 in layer_positions[i]:
            for pos2 in layer_positions[i + 1]:
                ax.plot([pos1[0], pos2[0]], [pos1[1], pos2[1]], 
                       color=COLORS['muted'], alpha=0.3, linewidth=0.5)
    
    # Layer labels
    labels = ['Input'] + [f'Hidden {i}' for i in range(1, len(layer_sizes)-1)] + ['Output']
    for i, label in enumerate(labels):
        ax.text(i, -0.8, label, ha='center', fontsize=10)
    
    return fig

# ============================================
# Attention Visualization Helpers
# ============================================

def visualize_attention(tokens, attention_weights, title="Attention Weights"):
    """
    Visualize attention weights as a heatmap.
    
    Args:
        tokens: List of token strings
        attention_weights: 2D numpy array of attention weights
        title: Chart title
    """
    fig, ax = plt.subplots(figsize=(10, 8))
    
    im = ax.imshow(attention_weights, cmap='Blues', aspect='auto')
    
    ax.set_xticks(range(len(tokens)))
    ax.set_yticks(range(len(tokens)))
    ax.set_xticklabels(tokens, rotation=45, ha='right')
    ax.set_yticklabels(tokens)
    
    ax.set_xlabel('Key (attending to)', fontsize=12)
    ax.set_ylabel('Query (from)', fontsize=12)
    ax.set_title(title, fontsize=14, fontweight='bold')
    
    plt.colorbar(im, ax=ax, label='Attention Weight')
    plt.tight_layout()
    return fig

# ============================================
# Embedding Visualization Helpers
# ============================================

def visualize_embeddings_2d(embeddings, labels, title="Embedding Space"):
    """
    Visualize embeddings in 2D using PCA or t-SNE.
    
    Args:
        embeddings: 2D numpy array of shape (n_samples, 2)
        labels: List of labels for each point
        title: Chart title
    """
    fig, ax = plt.subplots(figsize=(10, 8))
    
    scatter = ax.scatter(embeddings[:, 0], embeddings[:, 1], 
                        c=range(len(labels)), cmap='viridis', s=100, alpha=0.7)
    
    for i, label in enumerate(labels):
        ax.annotate(label, (embeddings[i, 0], embeddings[i, 1]),
                   xytext=(5, 5), textcoords='offset points', fontsize=9)
    
    ax.set_xlabel('Dimension 1', fontsize=12)
    ax.set_ylabel('Dimension 2', fontsize=12)
    ax.set_title(title, fontsize=14, fontweight='bold')
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    return fig

# ============================================
# Diffusion Process Visualization
# ============================================

def visualize_diffusion_steps(steps=10):
    """
    Create a simple visualization of the diffusion process.
    
    Args:
        steps: Number of diffusion steps to show
    """
    fig, axes = plt.subplots(2, steps, figsize=(2*steps, 4))
    
    # Create a simple "image" (gradient pattern)
    original = np.outer(np.linspace(0, 1, 32), np.linspace(0, 1, 32))
    
    # Forward diffusion (adding noise)
    for i in range(steps):
        noise_level = i / (steps - 1)
        noise = np.random.randn(32, 32) * noise_level
        noisy = original * (1 - noise_level) + noise * noise_level
        axes[0, i].imshow(noisy, cmap='gray', vmin=-1, vmax=2)
        axes[0, i].axis('off')
        axes[0, i].set_title(f't={i}', fontsize=8)
    
    # Reverse diffusion (denoising)
    for i in range(steps):
        noise_level = 1 - i / (steps - 1)
        noise = np.random.randn(32, 32) * noise_level
        denoised = original * (1 - noise_level) + noise * noise_level
        axes[1, steps - 1 - i].imshow(denoised, cmap='gray', vmin=-1, vmax=2)
        axes[1, steps - 1 - i].axis('off')
    
    axes[0, 0].set_ylabel('Forward\n(add noise)', fontsize=10)
    axes[1, 0].set_ylabel('Reverse\n(denoise)', fontsize=10)
    
    fig.suptitle('Diffusion Process: Forward and Reverse', fontsize=14, fontweight='bold')
    plt.tight_layout()
    return fig

# ============================================
# RAG Pipeline Visualization
# ============================================

def visualize_rag_pipeline():
    """
    Create a visual diagram of the RAG pipeline.
    """
    fig, ax = plt.subplots(figsize=(14, 6))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 6)
    ax.axis('off')
    
    # Components
    components = [
        (1, 3, 2, 1.5, 'User Query', COLORS['primary']),
        (4, 3, 2, 1.5, 'Retriever', COLORS['secondary']),
        (4, 0.5, 2, 1.5, 'Vector DB', COLORS['accent']),
        (7.5, 3, 2.5, 1.5, 'Context +\nQuery', COLORS['warning']),
        (11, 3, 2, 1.5, 'LLM', COLORS['success']),
    ]
    
    for x, y, w, h, label, color in components:
        rect = plt.Rectangle((x, y), w, h, facecolor=color, 
                             edgecolor='white', linewidth=2, alpha=0.8)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, label, ha='center', va='center',
               fontsize=11, fontweight='bold', color='white')
    
    # Arrows
    arrows = [
        (3, 3.75, 0.8, 0),      # Query to Retriever
        (5, 3, 0, -0.8),        # Retriever to Vector DB
        (5, 2, 0, 0.8),         # Vector DB to Retriever
        (6, 3.75, 1.3, 0),      # Retriever to Context
        (10, 3.75, 0.8, 0),     # Context to LLM
    ]
    
    for x, y, dx, dy in arrows:
        ax.annotate('', xy=(x+dx, y+dy), xytext=(x, y),
                   arrowprops=dict(arrowstyle='->', color='white', lw=2))
    
    ax.set_title('RAG (Retrieval-Augmented Generation) Pipeline', 
                fontsize=16, fontweight='bold', color=COLORS['text'])
    
    return fig

# ============================================
# Educational Display Helpers
# ============================================

def create_comparison_table(items, headers):
    """
    Create a formatted comparison table for display.
    
    Args:
        items: List of dictionaries with comparison data
        headers: List of column headers
    """
    html = '<table style="width:100%; border-collapse: collapse;">'
    html += '<tr style="background-color: #4a90d9; color: white;">'
    for h in headers:
        html += f'<th style="padding: 12px; text-align: left;">{h}</th>'
    html += '</tr>'
    
    for i, item in enumerate(items):
        bg = '#f8f9fa' if i % 2 == 0 else '#ffffff'
        html += f'<tr style="background-color: {bg};">'
        for h in headers:
            html += f'<td style="padding: 10px; border-bottom: 1px solid #ddd;">{item.get(h, "")}</td>'
        html += '</tr>'
    
    html += '</table>'
    return HTML(html)

def display_key_concept(title, description, icon="💡"):
    """
    Display a key concept in a styled box.
    """
    html = f'''
    <div style="background: linear-gradient(135deg, #4a90d9 0%, #357abd 100%); 
                padding: 20px; border-radius: 10px; margin: 10px 0;">
        <h3 style="color: white; margin: 0 0 10px 0;">{icon} {title}</h3>
        <p style="color: #e8e8e8; margin: 0; line-height: 1.6;">{description}</p>
    </div>
    '''
    display(HTML(html))

def display_for_audience(non_tech_content, tech_content):
    """
    Display content split for different audiences.
    """
    html = f'''
    <div style="display: flex; gap: 20px; margin: 20px 0;">
        <div style="flex: 1; background: #e8f4f8; padding: 15px; border-radius: 10px; border-left: 4px solid #4a90d9;">
            <h4 style="color: #4a90d9; margin: 0 0 10px 0;">For Everyone</h4>
            <p style="color: #333; margin: 0;">{non_tech_content}</p>
        </div>
        <div style="flex: 1; background: #f0f8e8; padding: 15px; border-radius: 10px; border-left: 4px solid #50c878;">
            <h4 style="color: #50c878; margin: 0 0 10px 0;">For Technical Readers</h4>
            <p style="color: #333; margin: 0;">{tech_content}</p>
        </div>
    </div>
    '''
    display(HTML(html))

# ============================================
# Simple Demo Data Generators
# ============================================

def generate_sample_embeddings(words, dim=2):
    """
    Generate sample embeddings for demonstration.
    Clusters similar words together.
    """
    np.random.seed(42)
    embeddings = np.random.randn(len(words), dim)
    return embeddings

def generate_sample_attention(seq_len):
    """
    Generate sample attention weights for demonstration.
    """
    np.random.seed(42)
    attention = np.random.rand(seq_len, seq_len)
    attention = attention / attention.sum(axis=1, keepdims=True)
    return attention

def generate_sample_probabilities(vocab_size=10):
    """
    Generate sample probability distribution over vocabulary.
    """
    np.random.seed(42)
    probs = np.random.exponential(1, vocab_size)
    probs = probs / probs.sum()
    return np.sort(probs)[::-1]
