# Deep Sea Protocol // Lead Research Agent

**Deep Sea Protocol** is a high-end, AI-powered SaaS tool designed for automated lead research and ad strategy generation. It uses a swarm of autonomous agents to analyze businesses and generate actionable marketing insights in seconds.

> Requires API keys (Gemini, Firecrawl, Proxycurl) to run. See setup instructions below.

## 🚀 What This Site Does

The application takes a target business URL and deploys a "Deep Sea Swarm" of AI agents to perform the following:

1.  **Scout Agent (The Eye)**:
    -   **Action**: Deploys a crawler (via Firecrawl) to the target URL.
    -   **Output**: Generates a comprehensive "Intel Report" summarizing the business's core services, value proposition, and niche.

2.  **Finder Agent (The Hunter)**:
    -   **Action**: Analyzes the company data to identify key decision-makers (e.g., Founders, Heads of Marketing).
    -   **Output**: Returns a "Target Profile" with the name, role, and LinkedIn profile of the best person to contact.

3.  **Director Agent (The Brain)**:
    -   **Action**: Synthesizes the Intel Report and Target Profile using Gemini 1.5 Pro.
    -   **Output**: Generates 3 high-conversion "Strategic Vectors" (Ad Hooks) tailored to the business:
        -   **FOMO**: A Fear Of Missing Out angle.
        -   **Problem/Solution**: A direct pain-point address.
        -   **Authority**: Leveraging the founder's credibility.

## 🛠 Tech Stack

-   **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Framer Motion.
-   **Backend**: Python FastAPI, LangGraph (Agent Orchestration).
-   **AI/Tools**: Gemini 1.5 Pro, Firecrawl, Proxycurl.

## ⚡️ Quick Start

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Add your API Keys to .env
uvicorn backend.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the Deep Sea Protocol.
