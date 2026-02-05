from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import asyncio

from backend.graph import create_graph

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WorkflowInput(BaseModel):
    url: str

workflow = create_graph()

async def event_generator(url: str):
    """
    Generator that yields events from the LangGraph workflow.
    """
    inputs = {
        "input_url": url,
        "company_name": "",
        "business_summary": "",
        "personnel_data": {},
        "ad_hooks": {},
        "logs": []
    }
    
    # We use stream with output_keys to get state updates
    try:
        # stream() returns an iterator of events
        for event in workflow.stream(inputs):
            # event is a dict where keys are node names and values are the outputs of that node
            for node_name, node_state in event.items():
                # We yield a JSON string for each update
                # Construct a frontend-friendly payload
                payload = {
                    "step": node_name,
                    "data": node_state
                }
                yield json.dumps(payload) + "\n"
                
                # Small delay to ensure frontend sees animations (optional, for demo effect)
                await asyncio.sleep(0.5) 
                
    except Exception as e:
        yield json.dumps({"error": str(e)}) + "\n"

@app.post("/stream_workflow")
async def stream_workflow(request: WorkflowInput):
    return StreamingResponse(event_generator(request.url), media_type="application/x-ndjson")

@app.get("/health")
def health():
    return {"status": "ok"}
