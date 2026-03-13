import feedparser
import requests
from datetime import datetime, timedelta
from config import RSS_FEEDS, NEWS_API_KEY
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def fetch_rss(language: str) -> list[dict]:
    articles = []
    feeds = RSS_FEEDS.get(language, [])

    for url in feeds:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:5]:
                articles.append({
                    "title": entry.get("title", ""),
                    "summary": entry.get("summary", ""),
                    "url": entry.get("link", ""),
                    "source": feed.feed.get("title", url),
                    "language": language,
                    "published": entry.get("published", datetime.now().isoformat()),
                })
            logger.info(f"Fetched {len(feed.entries[:5])} articles from {url}")
        except Exception as e:
            logger.error(f"Error fetching {url}: {e}")

    return articles


def fetch_newsapi(language: str) -> list[dict]:
    if not NEWS_API_KEY:
        return []

    lang_code = {"en": "en", "de": "de", "fr": "fr"}.get(language, "en")

    try:
        res = requests.get(
            "https://newsapi.org/v2/top-headlines",
            params={
                "apiKey": NEWS_API_KEY,
                "language": lang_code,
                "category": "technology",
                "pageSize": 10,
            },
            timeout=10,
        )
        data = res.json()
        articles = []
        for item in data.get("articles", []):
            if item.get("title") and item.get("url"):
                articles.append({
                    "title": item["title"],
                    "summary": item.get("description", ""),
                    "url": item["url"],
                    "source": item.get("source", {}).get("name", "NewsAPI"),
                    "language": language,
                    "published": item.get("publishedAt", datetime.now().isoformat()),
                })
        logger.info(f"Fetched {len(articles)} articles from NewsAPI ({language})")
        return articles
    except Exception as e:
        logger.error(f"NewsAPI error: {e}")
        return []


def fetch_all(language: str) -> list[dict]:
    rss = fetch_rss(language)
    api = fetch_newsapi(language)
    all_articles = rss + api

    # Remove empty titles
    return [a for a in all_articles if a.get("title") and len(a["title"]) > 10]
