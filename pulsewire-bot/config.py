import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
PAYLOAD_API_URL = os.getenv("PAYLOAD_API_URL", "http://localhost:3005")
PAYLOAD_EMAIL = os.getenv("PAYLOAD_EMAIL", "")
PAYLOAD_PASSWORD = os.getenv("PAYLOAD_PASSWORD", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
DISCORD_WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")

# RSS Sources by language
RSS_FEEDS = {
    "en": [
        "https://feeds.feedburner.com/TechCrunch",
        "https://www.wired.com/feed/rss",
        "https://www.theverge.com/rss/index.xml",
        "https://feeds.reuters.com/reuters/technologyNews",
        "http://feeds.bbci.co.uk/news/technology/rss.xml",
    ],
    "de": [
        "https://www.heise.de/rss/heise-atom.xml",
        "https://www.spiegel.de/schlagzeilen/tops/index.rss",
        "https://rss.dw.com/rdf/rss-en-tech",
    ],
    "fr": [
        "https://www.lemonde.fr/rss/une.xml",
        "https://www.france24.com/fr/rss",
        "https://www.01net.com/feed/",
    ],
}

# Categories mapping
CATEGORY_SLUGS = ["technology", "business", "world", "science", "ai-trends"]

# Bot settings
ARTICLES_PER_RUN = 5
MAX_RETRIES = 3
