import subprocess
import sys
import os
def start_server():
    print("Starting FastAPI server on port 1008...")
    try:
        os.system("pip install -r requirements.txt")
        subprocess.run(
            [sys.executable, "-m", "uvicorn", "src.main:server", "--port", "1008"], 
            check=True
        )
    except KeyboardInterrupt:
        print("\nServer shutting down gracefully...")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    start_server()