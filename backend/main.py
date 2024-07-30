from sentence_transformers import SentenceTransformer
from tqdm.auto import tqdm
import pandas as pd
import numpy as np
import torch
from services.retrieve import print_wrapped,retrieve_relevant_resources,print_top_results_and_scores
from services.evaluate import RAGEvaluator
from llm.get_response import ask
from create_embeddings import create_embeddings
from fastapi import FastAPI, Request, HTTPException, Query , UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import shutil
from fastapi.responses import JSONResponse
import json
import requests


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/")
async def render_index():
    return {"message": "Welcome to your PR201 Backend!"}


@app.post("/upload-pdf")
async def upload_file(file: UploadFile = File(...)):
    if file.filename == "":
        return {"error": "No file uploaded"}
    
    
    file_path = f"data/{file.filename}"
    
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    
    create_embeddings(file_path)
    
    return JSONResponse({'message': 'PDF uploaded successfully'})





@app.post("/ask")
async def ask_question(request: Request):
    data = await request.json()
    print(data)
    query = data['question']
    device = "cpu"
    print("The device is set to:",device)
    print("This may take a while...")

    print("Loading the Saved Embeddings DataFrame...")

    embeddings_df_save_path = "data/text_chunks_and_embeddings_df.csv"
    text_chunks_and_embeddings_df = pd.read_csv(embeddings_df_save_path)

    print("Converting the 'embedding' column to a numpy array...")
    text_chunks_and_embeddings_df["embedding"] = text_chunks_and_embeddings_df["embedding"].apply(lambda x: np.fromstring(x.strip("[]"), sep=" "))

    pages_and_chunks = text_chunks_and_embeddings_df.to_dict(orient="records")
    embeddings = torch.tensor(np.array(text_chunks_and_embeddings_df["embedding"].tolist()), dtype=torch.float32).to(device)

    print("Successsfully Converted the 'embedding' column to a torch tensor.")

    print("\n\n")
    print("Retrieving the most relevant resources...")
    print("\n\n")

    top_results_scores_string = print_top_results_and_scores(query=query, embeddings=embeddings, pages_and_chunks=pages_and_chunks)

    print("Using Gemini to generate a response...")
    print("\n\n")

    ans = ask(query=query, embeddings=embeddings, pages_and_chunks=pages_and_chunks,embeddings_df_save_path=embeddings_df_save_path)


    evaluator = RAGEvaluator()
    metrics = evaluator.evaluate_all(query, ans, top_results_scores_string)


    return {"answer": ans,
            "top_results": top_results_scores_string,
            "metrics": metrics}


@app.post("/evaluate")
async def evaluate(request: Request):
    data = await request.json()
    question = data['question']
    response = data['response']
    reference = data['reference']
    evaluator = RAGEvaluator()
    metrics = evaluator.evaluate_all(question, response, reference)
    return metrics


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



# Create the embeddings
# create_embeddings()


# device = "cpu"
# query = input("Enter your query: ")



# print("The device is set to:",device)
# print("This may take a while...")


# print("Loading the Saved Embeddings DataFrame...")

# embeddings_df_save_path = "data/text_chunks_and_embeddings_df.csv"
# text_chunks_and_embeddings_df = pd.read_csv(embeddings_df_save_path)




# print("Converting the 'embedding' column to a numpy array...")
# text_chunks_and_embeddings_df["embedding"] = text_chunks_and_embeddings_df["embedding"].apply(lambda x: np.fromstring(x.strip("[]"), sep=" "))


# pages_and_chunks = text_chunks_and_embeddings_df.to_dict(orient="records")
# embeddings = torch.tensor(np.array(text_chunks_and_embeddings_df["embedding"].tolist()), dtype=torch.float32).to(device)

# print("Successsfully Converted the 'embedding' column to a torch tensor.")


# print("\n\n")
# print("Retrieving the most relevant resources...")
# print("\n\n")


# print_top_results_and_scores(query=query, embeddings=embeddings, pages_and_chunks=pages_and_chunks)

 
# print("Using Gemini to generate a response...")
# print("\n\n")



# ans = ask(query=query, embeddings=embeddings, pages_and_chunks=pages_and_chunks,embeddings_df_save_path=embeddings_df_save_path)

# print_wrapped(ans)









