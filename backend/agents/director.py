import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv
import json

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

class DirectorAgent:
    def __init__(self):
        self.api_key = GOOGLE_API_KEY
        if self.api_key:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-pro",
                google_api_key=self.api_key,
                temperature=0.7
            )
        else:
            print("Warning: GOOGLE_API_KEY not found. Using mock mode.")
            self.llm = None

    def generate_hooks(self, summary: str, personnel: dict) -> dict:
        """
        Synthesizes data to generate 3 ad hooks.
        """
        if not self.llm:
            return self._mock_response()

        founder_name = personnel.get("name", "the founder")
        role = personnel.get("role", "Founder")

        prompt = f"""
        You are a world-class Direct Response Copywriter.
        
        **Business Summary**:
        {summary}
        
        **Key Personnel**:
        {founder_name} ({role})
        
        **Task**:
        Generate 3 specific, high-conversion ad hooks based on the frameworks below.
        Return the result as a strict JSON object with keys: 'fomo', 'problem_solution', 'authority_gap'.
        
        1. 'fomo': The Fear of Missing Out.
        2. 'problem_solution': The Problem/Solution.
        3. 'authority_gap': The Authority Gap (leveraging {founder_name}'s expertise).
        
        Output JSON only. Do not include markdown code blocks.
        """
        
        try:
            response = self.llm.invoke([HumanMessage(content=prompt)])
            content = response.content.strip()
            # Clean md blocks if present
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            
            return json.loads(content)
        except Exception as e:
            print(f"Error calling Gemini: {e}")
            return self._mock_response()

    def _mock_response(self) -> dict:
        return {
            "fomo": "93% of e-commerce brands are bleeding 20% of revenue to inventory mismanagement. Are you one of them?",
            "problem_solution": "Stop guessing what to restock. Our AI Analytics predicts your next bestseller with 98% accuracy, so you never stock out again.",
            "authority_gap": "Sarah Jenkins built a $10M empire by solving one inventory glitch. Now, she's revealing the exact system she used."
        }

director_agent = DirectorAgent()
