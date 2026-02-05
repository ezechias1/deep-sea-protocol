from typing import TypedDict, Dict, Any, List
from langgraph.graph import StateGraph, END

from backend.agents.scout import scout_agent
from backend.agents.finder import finder_agent
from backend.agents.director import director_agent

class AgentState(TypedDict):
    input_url: str
    company_name: str
    business_summary: str
    personnel_data: Dict[str, Any]
    ad_hooks: Dict[str, str]
    # For tracking progress
    logs: List[str]

def scout_node(state: AgentState):
    url = state["input_url"]
    summary = scout_agent.scrape(url)
    
    # Simple logic to extract company name from url or content
    # For demo, taking prompt domain or part of URL
    domain = url.replace("https://", "").replace("http://", "").split("/")[0]
    name = domain.split(".")[0].capitalize()
    
    return {
        "business_summary": summary, 
        "company_name": name,
        "logs": state.get("logs", []) + [f"Scouted {url}: Summary generated."]
    }

def finder_node(state: AgentState):
    name = state["company_name"]
    personnel = finder_agent.find_key_personnel(name)
    return {
        "personnel_data": personnel,
        "logs": state.get("logs", []) + [f"Found personnel for {name}: {personnel['name']}"]
    }

def director_node(state: AgentState):
    summary = state["business_summary"]
    personnel = state["personnel_data"]
    hooks = director_agent.generate_hooks(summary, personnel)
    return {
        "ad_hooks": hooks,
        "logs": state.get("logs", []) + ["Generated ad hooks."]
    }

def create_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("scout", scout_node)
    workflow.add_node("finder", finder_node)
    workflow.add_node("director", director_node)
    
    workflow.set_entry_point("scout")
    
    workflow.add_edge("scout", "finder")
    workflow.add_edge("finder", "director")
    workflow.add_edge("director", END)
    
    return workflow.compile()
