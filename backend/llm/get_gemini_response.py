
import pathlib
import textwrap
import google.generativeai as genai
import os
import dotenv

dotenv.load_dotenv()

gemini_api_key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=gemini_api_key )
model = genai.GenerativeModel('gemini-pro')

def get_gemini_response(context, query):
    

    response = model.generate_content(f""" 
    Using the context given below answer the query.Dont make up the answers.Keep the answers informative but short.
                                    
    CONTEXT: {context}

    QUERY: {query}   

    Answer in 3-4 sentences.                            
                                    """)


    return response.text


