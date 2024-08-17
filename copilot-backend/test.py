from groq import Groq

client = Groq(api_key=key)
MODEL = 'llama3-70b-8192'
messages = [
    {
        "role": "user",
        "content": "What is the sentiment of this text: 'I love this product!'"
    }
]

response = client.chat.completions.create(
    model=MODEL,
    messages=messages
)
print(response)