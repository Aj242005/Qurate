import os

os.system("pip install -r requirements.txt")
os.system("uvicorn src.main:server --port 1008")