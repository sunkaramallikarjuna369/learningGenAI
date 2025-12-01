"""
Generative AI 360° - Shared Utility Functions

This module provides helper functions used across notebooks for:
- Visualization helpers
- Data loading utilities
- Simple UI components for notebooks
- Common GenAI operations
"""

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from matplotlib.patches import FancyBboxPatch
import plotly.graph_objects as go
import plotly.express as px
from IPython.display import display, HTML, clear_output
import ipywidgets as widgets
from typing import List, Dict, Tuple, Optional, Union, Any
import json
import os


# =============================================================================
# Color Schemes and Styling
# =============================================================================

COLORS = {
    'primary': '#4A90D9',
    'secondary': '#7B68EE',
    'accent': '#50C878',
    'warning': '#FFB347',
    'error': '#FF6B6B',
    'text': '#333333',
    'background': '#F8F9FA',
    'highlight': '#FFE066',
}

TRACK_COLORS = {
    'non_technical': '#4ECDC4',
    'technical': '#FF6B6B',
}


# =============================================================================
# Visualization Helpers
# =============================================================================

def create_token_visualization(text: str, tokens: List[str], 
                                probabilities: Optional[List[float]] = None) -> go.Figure:
    """
    Create an interactive visualization of tokenized text with optional probabilities.
    
    Args:
        text: Original text
        tokens: List of tokens
        probabilities: Optional list of probabilities for each token
    
    Returns:
        Plotly figure object
    """
    colors = px.colors.qualitative.Set3[:len(tokens)]
    
    fig = go.Figure()
    
    x_pos = 0
    for i, token in enumerate(tokens):
        width = len(token) * 0.1 + 0.2
        
        hover_text = f"Token: '{token}'"
        if probabilities:
            hover_text += f"<br>Probability: {probabilities[i]:.4f}"
        
        fig.add_trace(go.Bar(
            x=[x_pos + width/2],
            y=[1],
            width=[width],
            name=token,
            text=[token],
            textposition='inside',
            hovertext=[hover_text],
            hoverinfo='text',
            marker_color=colors[i % len(colors)],
            showlegend=False
        ))
        x_pos += width + 0.05
    
    fig.update_layout(
        title="Token Visualization",
        xaxis=dict(showticklabels=False, showgrid=False),
        yaxis=dict(showticklabels=False, showgrid=False, range=[0, 1.5]),
        height=200,
        margin=dict(l=20, r=20, t=40, b=20),
        plot_bgcolor='white'
    )
    
    return fig


def create_probability_distribution(tokens: List[str], 
                                     probabilities: List[float],
                                     top_k: int = 10) -> go.Figure:
    """
    Create a bar chart showing probability distribution over tokens.
    
    Args:
        tokens: List of token strings
        probabilities: Corresponding probabilities
        top_k: Number of top tokens to display
    
    Returns:
        Plotly figure object
    """
    sorted_indices = np.argsort(probabilities)[::-1][:top_k]
    top_tokens = [tokens[i] for i in sorted_indices]
    top_probs = [probabilities[i] for i in sorted_indices]
    
    fig = go.Figure(data=[
        go.Bar(
            x=top_tokens,
            y=top_probs,
            marker_color=COLORS['primary'],
            text=[f'{p:.2%}' for p in top_probs],
            textposition='outside'
        )
    ])
    
    fig.update_layout(
        title=f"Top {top_k} Token Probabilities",
        xaxis_title="Token",
        yaxis_title="Probability",
        yaxis=dict(range=[0, max(top_probs) * 1.2]),
        height=400,
        margin=dict(l=50, r=50, t=50, b=50)
    )
    
    return fig


def create_attention_heatmap(attention_weights: np.ndarray,
                              tokens: List[str],
                              layer: int = 0,
                              head: int = 0) -> go.Figure:
    """
    Create an attention heatmap visualization.
    
    Args:
        attention_weights: Attention matrix (seq_len x seq_len)
        tokens: List of token strings
        layer: Layer number for title
        head: Head number for title
    
    Returns:
        Plotly figure object
    """
    fig = go.Figure(data=go.Heatmap(
        z=attention_weights,
        x=tokens,
        y=tokens,
        colorscale='Blues',
        hoverongaps=False,
        hovertemplate='From: %{y}<br>To: %{x}<br>Attention: %{z:.4f}<extra></extra>'
    ))
    
    fig.update_layout(
        title=f"Attention Weights (Layer {layer}, Head {head})",
        xaxis_title="Key Tokens",
        yaxis_title="Query Tokens",
        height=500,
        width=600
    )
    
    return fig


def create_embedding_visualization(embeddings: np.ndarray,
                                    labels: List[str],
                                    method: str = 'pca') -> go.Figure:
    """
    Create a 2D/3D visualization of embeddings.
    
    Args:
        embeddings: Array of shape (n_samples, embedding_dim)
        labels: List of labels for each embedding
        method: Dimensionality reduction method ('pca', 'tsne', 'umap')
    
    Returns:
        Plotly figure object
    """
    from sklearn.decomposition import PCA
    
    if method == 'pca':
        reducer = PCA(n_components=2)
        reduced = reducer.fit_transform(embeddings)
    else:
        reduced = embeddings[:, :2]
    
    fig = go.Figure(data=go.Scatter(
        x=reduced[:, 0],
        y=reduced[:, 1],
        mode='markers+text',
        text=labels,
        textposition='top center',
        marker=dict(
            size=10,
            color=list(range(len(labels))),
            colorscale='Viridis',
            showscale=True
        ),
        hovertemplate='%{text}<br>x: %{x:.2f}<br>y: %{y:.2f}<extra></extra>'
    ))
    
    fig.update_layout(
        title=f"Embedding Visualization ({method.upper()})",
        xaxis_title="Component 1",
        yaxis_title="Component 2",
        height=500
    )
    
    return fig


def create_diffusion_steps_visualization(images: List[np.ndarray],
                                          step_labels: List[str]) -> go.Figure:
    """
    Create a visualization showing diffusion process steps.
    
    Args:
        images: List of image arrays at different steps
        step_labels: Labels for each step
    
    Returns:
        Plotly figure with subplots
    """
    from plotly.subplots import make_subplots
    
    n_steps = len(images)
    fig = make_subplots(rows=1, cols=n_steps, subplot_titles=step_labels)
    
    for i, img in enumerate(images):
        fig.add_trace(
            go.Heatmap(z=img, colorscale='gray', showscale=False),
            row=1, col=i+1
        )
    
    fig.update_layout(
        title="Diffusion Process Steps",
        height=300,
        showlegend=False
    )
    
    for i in range(n_steps):
        fig.update_xaxes(showticklabels=False, row=1, col=i+1)
        fig.update_yaxes(showticklabels=False, row=1, col=i+1)
    
    return fig


# =============================================================================
# Interactive Widget Helpers
# =============================================================================

def create_temperature_slider(callback, min_val=0.1, max_val=2.0, default=1.0):
    """
    Create an interactive temperature slider widget.
    
    Args:
        callback: Function to call when slider value changes
        min_val: Minimum temperature value
        max_val: Maximum temperature value
        default: Default temperature value
    
    Returns:
        ipywidgets slider
    """
    slider = widgets.FloatSlider(
        value=default,
        min=min_val,
        max=max_val,
        step=0.1,
        description='Temperature:',
        continuous_update=False,
        style={'description_width': 'initial'},
        layout=widgets.Layout(width='400px')
    )
    slider.observe(callback, names='value')
    return slider


def create_top_k_slider(callback, min_val=1, max_val=100, default=50):
    """
    Create an interactive top-k slider widget.
    
    Args:
        callback: Function to call when slider value changes
        min_val: Minimum top-k value
        max_val: Maximum top-k value
        default: Default top-k value
    
    Returns:
        ipywidgets slider
    """
    slider = widgets.IntSlider(
        value=default,
        min=min_val,
        max=max_val,
        step=1,
        description='Top-K:',
        continuous_update=False,
        style={'description_width': 'initial'},
        layout=widgets.Layout(width='400px')
    )
    slider.observe(callback, names='value')
    return slider


def create_prompt_input(callback, placeholder="Enter your prompt here..."):
    """
    Create a text input widget for prompts.
    
    Args:
        callback: Function to call when text is submitted
        placeholder: Placeholder text
    
    Returns:
        ipywidgets text area
    """
    text_area = widgets.Textarea(
        value='',
        placeholder=placeholder,
        description='Prompt:',
        layout=widgets.Layout(width='500px', height='100px'),
        style={'description_width': 'initial'}
    )
    
    submit_button = widgets.Button(
        description='Generate',
        button_style='primary',
        layout=widgets.Layout(width='100px')
    )
    
    output = widgets.Output()
    
    def on_submit(b):
        with output:
            clear_output()
            callback(text_area.value)
    
    submit_button.on_click(on_submit)
    
    return widgets.VBox([text_area, submit_button, output])


# =============================================================================
# Data Loading Utilities
# =============================================================================

def load_sample_text(name: str = 'default') -> str:
    """
    Load sample text for demonstrations.
    
    Args:
        name: Name of the sample text to load
    
    Returns:
        Sample text string
    """
    samples = {
        'default': "The quick brown fox jumps over the lazy dog.",
        'shakespeare': "To be, or not to be, that is the question.",
        'technical': "Machine learning models learn patterns from data to make predictions.",
        'business': "Our Q3 revenue exceeded expectations, driven by strong product adoption.",
        'creative': "In a hole in the ground there lived a hobbit.",
    }
    return samples.get(name, samples['default'])


def load_sample_embeddings(n_samples: int = 20, dim: int = 768) -> Tuple[np.ndarray, List[str]]:
    """
    Generate sample embeddings for visualization demos.
    
    Args:
        n_samples: Number of sample embeddings
        dim: Embedding dimension
    
    Returns:
        Tuple of (embeddings array, labels list)
    """
    np.random.seed(42)
    
    categories = ['technology', 'nature', 'food', 'sports', 'music']
    words = {
        'technology': ['computer', 'software', 'algorithm', 'data'],
        'nature': ['forest', 'ocean', 'mountain', 'river'],
        'food': ['pizza', 'sushi', 'pasta', 'salad'],
        'sports': ['football', 'basketball', 'tennis', 'swimming'],
        'music': ['guitar', 'piano', 'drums', 'violin']
    }
    
    embeddings = []
    labels = []
    
    for cat in categories:
        base_vector = np.random.randn(dim)
        for word in words[cat]:
            noise = np.random.randn(dim) * 0.3
            embeddings.append(base_vector + noise)
            labels.append(word)
    
    return np.array(embeddings), labels


def generate_sample_attention(seq_len: int = 8) -> np.ndarray:
    """
    Generate sample attention weights for visualization.
    
    Args:
        seq_len: Sequence length
    
    Returns:
        Attention weight matrix
    """
    np.random.seed(42)
    attention = np.random.rand(seq_len, seq_len)
    attention = attention / attention.sum(axis=-1, keepdims=True)
    return attention


# =============================================================================
# Display Helpers
# =============================================================================

def display_track_badge(track: str):
    """
    Display a colored badge indicating the content track.
    
    Args:
        track: Either 'technical' or 'non_technical'
    """
    color = TRACK_COLORS.get(track, COLORS['primary'])
    label = "Technical Track" if track == 'technical' else "Non-Technical Track"
    
    html = f"""
    <div style="
        display: inline-block;
        padding: 5px 15px;
        background-color: {color};
        color: white;
        border-radius: 15px;
        font-weight: bold;
        margin: 10px 0;
    ">
        {label}
    </div>
    """
    display(HTML(html))


def display_concept_card(title: str, description: str, 
                          related_concepts: List[str] = None):
    """
    Display a styled concept card.
    
    Args:
        title: Concept title
        description: Brief description
        related_concepts: List of related concept names
    """
    related_html = ""
    if related_concepts:
        links = ", ".join([f"<code>{c}</code>" for c in related_concepts])
        related_html = f"<p><strong>Related:</strong> {links}</p>"
    
    html = f"""
    <div style="
        border: 2px solid {COLORS['primary']};
        border-radius: 10px;
        padding: 20px;
        margin: 15px 0;
        background-color: {COLORS['background']};
    ">
        <h3 style="color: {COLORS['primary']}; margin-top: 0;">{title}</h3>
        <p>{description}</p>
        {related_html}
    </div>
    """
    display(HTML(html))


def display_learning_objectives(objectives: List[str]):
    """
    Display learning objectives in a styled box.
    
    Args:
        objectives: List of learning objective strings
    """
    items = "".join([f"<li>{obj}</li>" for obj in objectives])
    
    html = f"""
    <div style="
        border-left: 4px solid {COLORS['accent']};
        padding: 15px 20px;
        margin: 15px 0;
        background-color: #E8F5E9;
    ">
        <h4 style="margin-top: 0; color: {COLORS['accent']};">Learning Objectives</h4>
        <ul style="margin-bottom: 0;">
            {items}
        </ul>
    </div>
    """
    display(HTML(html))


def display_warning(message: str):
    """
    Display a warning message.
    
    Args:
        message: Warning text
    """
    html = f"""
    <div style="
        border-left: 4px solid {COLORS['warning']};
        padding: 15px 20px;
        margin: 15px 0;
        background-color: #FFF3E0;
    ">
        <strong style="color: {COLORS['warning']};">Note:</strong> {message}
    </div>
    """
    display(HTML(html))


def display_code_explanation(code: str, explanation: str):
    """
    Display code with an explanation side by side.
    
    Args:
        code: Code snippet
        explanation: Plain language explanation
    """
    html = f"""
    <div style="display: flex; gap: 20px; margin: 15px 0;">
        <div style="flex: 1; background-color: #2D2D2D; color: #F8F8F2; padding: 15px; border-radius: 5px;">
            <pre style="margin: 0; white-space: pre-wrap;"><code>{code}</code></pre>
        </div>
        <div style="flex: 1; padding: 15px; background-color: {COLORS['background']}; border-radius: 5px;">
            <p style="margin: 0;">{explanation}</p>
        </div>
    </div>
    """
    display(HTML(html))


# =============================================================================
# Simple Model Wrappers (for demos)
# =============================================================================

def simple_tokenize(text: str) -> List[str]:
    """
    Simple word-level tokenization for demos.
    
    Args:
        text: Input text
    
    Returns:
        List of tokens
    """
    import re
    tokens = re.findall(r'\b\w+\b|[^\w\s]', text)
    return tokens


def simulate_next_token_probs(vocab: List[str], 
                               temperature: float = 1.0) -> Dict[str, float]:
    """
    Simulate next token probabilities for demos.
    
    Args:
        vocab: List of vocabulary tokens
        temperature: Sampling temperature
    
    Returns:
        Dictionary mapping tokens to probabilities
    """
    np.random.seed(42)
    logits = np.random.randn(len(vocab))
    logits = logits / temperature
    probs = np.exp(logits) / np.sum(np.exp(logits))
    return dict(zip(vocab, probs))


def simulate_embedding(text: str, dim: int = 768) -> np.ndarray:
    """
    Simulate text embedding for demos.
    
    Args:
        text: Input text
        dim: Embedding dimension
    
    Returns:
        Embedding vector
    """
    np.random.seed(hash(text) % (2**32))
    return np.random.randn(dim)


# =============================================================================
# Exercise Helpers
# =============================================================================

def check_answer(user_answer: Any, correct_answer: Any, 
                  tolerance: float = 0.01) -> bool:
    """
    Check if user's answer matches the correct answer.
    
    Args:
        user_answer: User's submitted answer
        correct_answer: Expected correct answer
        tolerance: Tolerance for numerical comparisons
    
    Returns:
        Boolean indicating correctness
    """
    if isinstance(correct_answer, (int, float)):
        return abs(user_answer - correct_answer) < tolerance
    elif isinstance(correct_answer, np.ndarray):
        return np.allclose(user_answer, correct_answer, atol=tolerance)
    else:
        return user_answer == correct_answer


def display_exercise_result(is_correct: bool, feedback: str = ""):
    """
    Display exercise result with appropriate styling.
    
    Args:
        is_correct: Whether the answer was correct
        feedback: Additional feedback message
    """
    if is_correct:
        color = COLORS['accent']
        icon = "&#10004;"
        status = "Correct!"
    else:
        color = COLORS['error']
        icon = "&#10008;"
        status = "Not quite right"
    
    html = f"""
    <div style="
        padding: 15px;
        margin: 10px 0;
        border-radius: 5px;
        background-color: {'#E8F5E9' if is_correct else '#FFEBEE'};
        border-left: 4px solid {color};
    ">
        <span style="font-size: 1.2em; color: {color};">{icon}</span>
        <strong style="color: {color};"> {status}</strong>
        {f'<p style="margin: 10px 0 0 0;">{feedback}</p>' if feedback else ''}
    </div>
    """
    display(HTML(html))


def create_hint_button(hint_text: str):
    """
    Create a button that reveals a hint when clicked.
    
    Args:
        hint_text: The hint to display
    
    Returns:
        Widget with hint functionality
    """
    button = widgets.Button(
        description='Show Hint',
        button_style='info',
        layout=widgets.Layout(width='100px')
    )
    
    output = widgets.Output()
    
    def show_hint(b):
        with output:
            clear_output()
            display(HTML(f"""
                <div style="
                    padding: 10px;
                    background-color: #E3F2FD;
                    border-radius: 5px;
                    margin-top: 10px;
                ">
                    <strong>Hint:</strong> {hint_text}
                </div>
            """))
    
    button.on_click(show_hint)
    return widgets.VBox([button, output])
