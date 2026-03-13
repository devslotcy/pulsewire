import requests
import logging
import os
from dotenv import load_dotenv

load_dotenv()

UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")
logger = logging.getLogger(__name__)

FALLBACK_IMAGES = {
    "technology": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=628&fit=crop",
    "business": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=628&fit=crop",
    "ai-trends": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=628&fit=crop",
    "science": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&h=628&fit=crop",
    "world": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=628&fit=crop",
    "default": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=628&fit=crop",
}


def find_image(query: str, category: str = "default") -> dict:
    if not UNSPLASH_ACCESS_KEY:
        logger.warning("No Unsplash key, using fallback image")
        return {
            "url": FALLBACK_IMAGES.get(category, FALLBACK_IMAGES["default"]),
            "alt": query,
        }

    try:
        res = requests.get(
            "https://api.unsplash.com/search/photos",
            params={
                "query": query,
                "per_page": 1,
                "orientation": "landscape",
                "content_filter": "high",
            },
            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
            timeout=10,
        )
        data = res.json()
        results = data.get("results", [])

        if results:
            photo = results[0]
            # Use raw URL with size params for Discover-ready images (1200x628)
            url = photo["urls"]["raw"] + "&w=1200&h=628&fit=crop&auto=format"
            alt = photo.get("alt_description") or query
            logger.info(f"Found Unsplash image for: {query}")
            return {"url": url, "alt": alt}

    except Exception as e:
        logger.error(f"Unsplash error for '{query}': {e}")

    # Fallback
    return {
        "url": FALLBACK_IMAGES.get(category, FALLBACK_IMAGES["default"]),
        "alt": query,
    }
