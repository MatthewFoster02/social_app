from decouple import config
import openai

API_KEY = config('OPENAI_API_KEY', cast=str)
openai.api_key = API_KEY

async def get_response(prompt:str):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
    ]
    )
    return str(response.choices[0].message.content)
