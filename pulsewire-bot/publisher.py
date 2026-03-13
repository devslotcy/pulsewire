import requests
import logging
from config import PAYLOAD_API_URL, PAYLOAD_EMAIL, PAYLOAD_PASSWORD

logger = logging.getLogger(__name__)

# Cache for category/author IDs and token
_cache = {}


def get_token() -> str:
    if "token" in _cache:
        return _cache["token"]
    try:
        res = requests.post(
            f"{PAYLOAD_API_URL}/api/users/login",
            json={"email": PAYLOAD_EMAIL, "password": PAYLOAD_PASSWORD},
            timeout=10,
        )
        token = res.json().get("token", "")
        _cache["token"] = token
        return token
    except Exception as e:
        logger.error(f"Failed to get auth token: {e}")
        return ""


def get_headers() -> dict:
    return {
        "Authorization": f"JWT {get_token()}",
        "Content-Type": "application/json",
    }


def get_categories() -> dict:
    if "categories" in _cache:
        return _cache["categories"]
    try:
        res = requests.get(f"{PAYLOAD_API_URL}/api/categories?limit=20", timeout=10)
        data = res.json()
        mapping = {cat["slug"]: cat["id"] for cat in data.get("docs", [])}
        _cache["categories"] = mapping
        return mapping
    except Exception as e:
        logger.error(f"Failed to fetch categories: {e}")
        return {}


def get_default_author() -> str | None:
    if "author_id" in _cache:
        return _cache["author_id"]
    try:
        res = requests.get(f"{PAYLOAD_API_URL}/api/authors?limit=1", timeout=10)
        data = res.json()
        docs = data.get("docs", [])
        if docs:
            _cache["author_id"] = docs[0]["id"]
            return docs[0]["id"]
    except Exception as e:
        logger.error(f"Failed to fetch authors: {e}")
    return None


def publish_article(article: dict) -> bool:
    categories = get_categories()
    author_id = get_default_author()

    category_slug = article.pop("category_slug", "technology")
    category_id = categories.get(category_slug) or categories.get("technology")

    payload = {
        "title": article["title"],
        "slug": article["slug"],
        "language": article["language"],
        "summary": article["summary"],
        "content": article["content"],
        "what_this_means": article.get("what_this_means", ""),
        "key_points": article.get("key_points", []),
        "tags": article.get("tags", []),
        "seo_title": article.get("seo_title", ""),
        "seo_description": article.get("seo_description", ""),
        "source_url": article["source_url"],
        "source_name": article.get("source_name", ""),
        "image": article.get("image", ""),
        "image_alt": article.get("image_alt", ""),
        "status": "review",
    }

    if category_id:
        payload["category"] = category_id
    if author_id:
        payload["author"] = author_id

    try:
        res = requests.post(
            f"{PAYLOAD_API_URL}/api/articles",
            json=payload,
            headers=get_headers(),
            timeout=15,
        )
        if res.status_code in (200, 201):
            logger.info(f"Published: {article['title']}")
            return True
        else:
            logger.error(f"Publish failed ({res.status_code}): {res.text[:200]}")
            return False
    except Exception as e:
        logger.error(f"Publish error: {e}")
        return False
