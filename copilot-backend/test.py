import chromadb
from chromadb import Settings, DEFAULT_TENANT, DEFAULT_DATABASE
from chromadb.utils import embedding_functions

chroma_client = chromadb.HttpClient(
    host="localhost",
    port=9000,
    ssl=False,
    headers=None,
    settings=Settings(),
    tenant=DEFAULT_TENANT,
    database=DEFAULT_DATABASE,
)
collection = chroma_client.create_collection(
    name="documents_collection",
    embedding_function=embedding_functions.DefaultEmbeddingFunction(),
    # Chroma will use this to generate embeddings
    get_or_create=True
)

results = collection.query(query_texts=["which date zayan was born?"], n_results=15)
print(results)
