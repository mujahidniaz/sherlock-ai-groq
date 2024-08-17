from groq import Groq

client = Groq(api_key='YOUR_API_KEY')
MODEL = 'llama3-70b-8192'

prompt_template = {
    "response_format": {"type": "json_object"},
    "system": """
You are a data analyst API capable of sentiment analysis that responds in JSON.  
The JSON schema should include 
{
  "sentiment_analysis": {
    "sentiment": "string (positive, negative, neutral)",
    "confidence_score": "number (0-1)"
  }
}
"""
}

messages = [
    {
        "role": "user",
        "content": "What is the sentiment of this text: 'I love this product!'"
    }
]

response = client.chat.completions.create(
    model=MODEL,
    messages=messages,
    prompt_template=prompt_template
)

print(response.choices[0].message.content)