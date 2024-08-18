# Sherlock: AI-Powered Document Analysis Assistant

Sherlock is an AI-powered chat assistant that combines local document knowledge with general intelligence to provide accurate and context-aware responses to user queries. This project integrates various components including a Flask backend, React frontend, Groq API for AI model serving, and ChromaDB for efficient document storage and retrieval.

## Screenshots:
![img1.png](screenshots/img1.png)
![img2.png](screenshots/img2.png)

## Table of Contents
- [Features](#features)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)

## Features

- AI-powered chat interface for document analysis and general queries
- Integration with local document knowledge base
- Real-time message streaming
- Syntax highlighting for code blocks in responses
- Customizable settings for knowledge base usage and relevance
- Easy deployment using Docker Compose
- Integration with Groq API for advanced language models

## System Architecture

The system consists of three main components:

1. **Backend (Flask)**: Handles API requests, integrates with Groq API and ChromaDB, and manages document processing.
2. **Frontend (React)**: Provides the user interface for interacting with the AI assistant.
3. **ChromaDB**: Stores and indexes document embeddings for efficient retrieval.

## Prerequisites

- Docker and Docker Compose (For installation WSL2 Docker see https://gist.github.com/martinsam16/4492957e3bbea34046f2c8b49c3e5ac0)
- Git
- Groq API key (Sign up at https://console.groq.com to obtain an API key)

## Installation

1. Clone the repository:
   ```
   git clone git@github.com:mujahidniaz/sherlock-ai-groq.git
   cd sherlock-ai-groq
   ```

2. Build and start the containers:
   - For Linux:
     ```
     ./run_linux.sh
     ```
   - For Windows:
     ```
     run_window.bat
     ```

## Usage

1. Access the web interface at `http://localhost:3000` in your browser.
2. When prompted, enter your Groq API key.
3. Use the chat interface to interact with Sherlock.
4. Toggle the "Use Knowledge Base" option to include local document knowledge in responses.
5. Adjust the number of relevant documents and chat history messages as needed.
6. Use the "Reload Knowledge Base" button to update the system with new documents.
7. Click the "Set API Key" button to update or change your Groq API key.

## Configuration

### Environment Variables

- `FLASK_ENV`: Set to `development` or `production`
- `CHROMA_HOST`: ChromaDB host (default: chromadb)
- `CHROMA_PORT`: ChromaDB port (default: 8000)

### Adding Documents

Place your documents in the `./data` directory. The system will process and index these documents for use in responses.

### Groq API Key

Your Groq API key is securely stored in the browser's local storage. You can update it at any time using the "Set API Key" button in the interface.