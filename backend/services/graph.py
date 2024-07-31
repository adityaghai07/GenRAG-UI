from typing import Tuple, List, Optional
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
import dotenv
import os
from neo4j import GraphDatabase
from langchain_community.graphs import Neo4jGraph
from langchain_core.runnables import ConfigurableField
from yfiles_jupyter_graphs import GraphWidget
from neo4j import GraphDatabase
from langchain_openai import ChatOpenAI
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_community.vectorstores import Neo4jVector
from langchain.document_loaders import PyPDFLoader
from langchain_core.runnables import (
    RunnableBranch,
    RunnableLambda,
    RunnableParallel,
    RunnablePassthrough,
)

dotenv.load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")


llm=ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo-0125")

llm_transformer = LLMGraphTransformer(llm=llm)


def make_graph_widget(pdf_path):
    loader = PyPDFLoader(pdf_path, extract_images=True)
    pages = loader.load()
    from langchain_openai import ChatOpenAI
    
    graph_documents = llm_transformer.convert_to_graph_documents(pages)

    graph = Neo4jGraph(uri=NEO4J_URI, username=NEO4J_USERNAME, password=NEO4J_PASSWORD)

    graph.add_graph_documents(
    graph_documents,
    baseEntityLabel=True,
    include_source=True
    )

    # directly show the graph resulting from the given Cypher query
    default_cypher = "MATCH (s)-[r:!MENTIONS]->(t) RETURN s,r,t LIMIT 50"

    

    
   




