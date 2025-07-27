from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://*", "http://localhost:8000", "https://localhost:8000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

# stub endpoint you’ll call first from the extension
@app.post("/echo")
async def echo(payload: dict):
    return {"you_sent": payload}
