import os
import threading
from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import chromadb
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
from chromadb.utils import embedding_functions
from groq import Groq
from llama_index.core import SimpleDirectoryReader
import os


def get_env_as_int(var_name, default=0):
    """
    Retrieve an environment variable and convert it to an integer.

    :param var_name: Name of the environment variable.
    :param default: Default value to return if the environment variable is not set
                    or cannot be converted to an integer. Defaults to 0.
    :return: Integer value of the environment variable or the default value.
    """
    # Retrieve the environment variable as a string
    env_var_str = os.getenv(var_name, str(default))  # Default to str(default) if not set

    try:
        # Convert the string to an integer
        return int(env_var_str)
    except ValueError:
        # Handle cases where conversion fails
        print(f"Warning: Environment variable '{var_name}' is not a valid integer. Returning default value.")
        return default


def get_env_as_float(var_name, default=0.5):
    """
    Retrieve an environment variable and convert it to an integer.

    :param var_name: Name of the environment variable.
    :param default: Default value to return if the environment variable is not set
                    or cannot be converted to an integer. Defaults to 0.
    :return: Integer value of the environment variable or the default value.
    """
    # Retrieve the environment variable as a string
    env_var_str = os.getenv(var_name, str(default))  # Default to str(default) if not set

    try:
        # Convert the string to an integer
        return float(env_var_str)
    except ValueError:
        # Handle cases where conversion fails
        print(f"Warning: Environment variable '{var_name}' is not a valid integer. Returning default value.")
        return default


# Example usage


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
CHROMA_HOST = os.environ.get('CHROMA_HOST', "chromadb")
CHROMA_PORT = os.environ.get('CHROMA_PORT', "8000")
CHROMA_COLLECTION = os.environ.get('CHROMA_COLLECTION', "documents_collection")
CHUNK_SIZE = get_env_as_int('CHUNK_SIZE', 1000)
TEMP_KNOWLEDGE_BASE = get_env_as_float('TEMP_KNOWLEDGE_BASE', 0.4)
TEMP_GEN_KNOWLEDGE = get_env_as_float('TEMP_GEN_KNOWLEDGE', 0.7)

chroma_client = chromadb.HttpClient(
    host=CHROMA_HOST,
    port=CHROMA_PORT,
    ssl=False,
    headers=None,
    settings=Settings(),
    tenant=DEFAULT_TENANT,
    database=DEFAULT_DATABASE,
)
collection = chroma_client.create_collection(
            name=CHROMA_COLLECTION,
            embedding_function=embedding_functions.DefaultEmbeddingFunction(),
            # Chroma will use this to generate embeddings
            get_or_create=True
        )

results = collection.query(query_texts=["begin"], n_results=1)
# Create or get ChromaDB collection


# A dictionary to keep track of active streams
active_streams = {}

SYSTEM_PROMPT = """
Your name is Sherlock, an AI assistant that answers queries based on local documents and general knowledge. Follow these guidelines:
1. If relevant information is found in the provided context, use it to answer accurately.
2. If no relevant information is in the context, state this clearly.
3. After stating no relevant information was found, answer using your general knowledge.
4. Always clarify when you're using local document info vs. general knowledge.
5. Be concise but thorough. Offer to elaborate if needed.
6. Maintain conversation flow by referring to chat history when appropriate.
7. If uncertain, state it clearly. Don't make up information.
8. For vague queries, ask for clarification or suggest related topics.
9. Always provide citations if local knowledge is used otherwise mentioned that its from the general knowledge and not from the documents.

Your goal is to assist users with accurate, helpful information from documents or general knowledge."""


def handle_message_stream(message, chat_history, use_knowledge_base, relevant_documents, api_key,model, sid):
    try:

        print(model)
        context = ""
        collection = chroma_client.create_collection(
            name=CHROMA_COLLECTION,
            embedding_function=embedding_functions.DefaultEmbeddingFunction(),
            # Chroma will use this to generate embeddings
            get_or_create=True
        )
        if use_knowledge_base:

            results = collection.query(
                query_texts=[message], n_results=relevant_documents
            )
            documents = results['documents'][0]
            ids = results['ids'][0]
            context = "\n\n".join(f"Document ID: {id}\nContent:\n{doc}" for id, doc in zip(ids, documents))

        # Construct the full context string
        full_context = f"User Query: {message}\n\n"
        if chat_history:
            full_context = f"Chat History: {chat_history}\n\n" + full_context
        if context:
            full_context = f"Current Context:\n{context}\n\n" + full_context

        # Generate response using LLaMA model
        client = Groq(api_key=api_key)
        stream = client.chat.completions.create(model=model, messages=[
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': full_context}
        ], stream=True)

        for chunk in stream:
            # Check if the generation has been stopped by the client
            if active_streams.get(sid) == 'stopped':
                break
            if chunk.choices[0].delta.content:
                socketio.emit('receive_message', {'content': chunk.choices[0].delta.content}, room=sid)
        socketio.emit('generation_completed', room=sid)

    except Exception as e:
        print(f"Error: {e}")
        socketio.emit('receive_message', {'content': "Error generating response. Check your Groq API Key!!"}, room=sid)
    finally:
        # Cleanup the active stream entry after the response is completed or stopped
        active_streams.pop(sid, None)


@socketio.on('send_message')
def handle_message(data):
    sid = request.sid
    message = data.get('message', '')
    chat_history = data.get('chat_history', '')
    use_knowledge_base = data.get('use_knowledge_base', False)
    relevant_documents = data.get('relevant_documents', 5)
    api_key = data.get('api_key', '')
    model = data.get('model', '')
    print(relevant_documents)
    active_streams[sid] = 'active'  # Mark this stream as active
    thread = threading.Thread(target=handle_message_stream,
                              args=(message, chat_history, use_knowledge_base, relevant_documents, api_key,model, sid))
    thread.start()


@socketio.on('stop_generation')
def stop_generation():
    sid = request.sid
    active_streams[sid] = 'stopped'  # Mark this stream as stopped


def split_document(doc_text, chunk_size=CHUNK_SIZE):
    """Split a document into smaller chunks based on word count."""
    words = doc_text.split()
    return [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]


@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200


@app.route('/add_documents', methods=['POST'])
def add_documents():
    try:
        chroma_client.delete_collection(CHROMA_COLLECTION)
    except:
        print("collection doesnt exist!!")
    collection = chroma_client.create_collection(
        name=CHROMA_COLLECTION,
        embedding_function=embedding_functions.DefaultEmbeddingFunction(),
        # Chroma will use this to generate embeddings
        get_or_create=True
    )
    directory_path = "/data"

    if not directory_path or not os.path.isdir(directory_path):
        return jsonify({"error": "Invalid directory path"}), 400

    # Use LlamaIndex to read files (or any other method to read documents)
    documents = SimpleDirectoryReader(directory_path, filename_as_id=True).load_data()

    all_documents = []
    all_ids = []

    # Split and add each document
    for doc in documents:
        chunks = split_document(doc.text)
        ids = [f"{os.path.basename(doc.doc_id)}_{i}" for i in range(len(chunks))]
        all_documents.extend(chunks)
        all_ids.extend(ids)

    # Add documents to ChromaDB
    collection.add(
        documents=all_documents,  # Document chunks
        ids=all_ids  # Unique IDs for each chunk
    )

    return jsonify({"status": "Documents added successfully"}), 200


@app.route('/list_models', methods=['GET'])
def get_models():
    api_key = request.args.get('api_key')
    if not api_key:
        return jsonify({"Error": "API key is missing"}), 400

    try:
        client = Groq(api_key=api_key)
        models = client.models.list()
        text_models = [model for model in models if "whisper" not in model["id"]]
        return text_models.json(), 200
    except Exception as e:
        return jsonify({"Error": str(e)}), 500


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8000, debug=True, allow_unsafe_werkzeug=True)
