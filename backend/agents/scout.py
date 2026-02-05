import os
from firecrawl import FirecrawlApp
from dotenv import load_dotenv

load_dotenv()

EXPECTED_API_KEY = os.getenv("FIRECRAWL_API_KEY")

class ScoutAgent:
    def __init__(self):
        self.api_key = EXPECTED_API_KEY
        if self.api_key:
            self.app = FirecrawlApp(api_key=self.api_key)
        else:
            print("Warning: FIRECRAWL_API_KEY not found. Using mock mode.")
            self.app = None

    def scrape(self, url: str) -> str:
        """
        Scrapes the given URL and returns a markdown summary.
        """
        if not self.app:
            return self._mock_response(url)

        try:
            # Scrape the URL
            scrape_result = self.app.scrape_url(url, params={'formats': ['markdown']})
            return scrape_result.get('markdown', 'No markdown content found.')
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            return self._mock_response(url)

    def _mock_response(self, url: str) -> str:
        return f"""
# Mock Scrape for {url}

## Core Services
- **AI Analytics**: Predictive modeling for small businesses.
- **Data Visualization**: Real-time dashboards.
- **Consulting**: Strategic implementation of AI tools.

## Niche
- Focused on E-commerce and Retail sectors looking to optimize inventory through AI.
"""

scout_agent = ScoutAgent()
