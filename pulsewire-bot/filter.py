import hashlib
import json
import os
import logging

logger = logging.getLogger(__name__)

SEEN_FILE = "seen_articles.json"


def load_seen() -> set:
    if os.path.exists(SEEN_FILE):
        with open(SEEN_FILE, "r") as f:
            return set(json.load(f))
    return set()


def save_seen(seen: set):
    with open(SEEN_FILE, "w") as f:
        json.dump(list(seen), f)


def article_hash(article: dict) -> str:
    key = article.get("url", "") + article.get("title", "")
    return hashlib.md5(key.encode()).hexdigest()


def filter_new(articles: list[dict]) -> list[dict]:
    seen = load_seen()
    new_articles = []

    for article in articles:
        h = article_hash(article)
        if h not in seen:
            new_articles.append(article)
            seen.add(h)

    save_seen(seen)
    logger.info(f"Filtered: {len(new_articles)} new out of {len(articles)} total")
    return new_articles


def quality_check(article: dict) -> bool:
    title = article.get("title", "")
    summary = article.get("summary", "")

    # Skip if title too short
    if len(title) < 15:
        return False

    # Skip if no summary
    if len(summary) < 20:
        return False

    # Skip if title looks like an ad or generic
    skip_keywords = ["[removed]", "advertisement", "sponsored", "subscribe"]
    for kw in skip_keywords:
        if kw.lower() in title.lower():
            return False

    return True


def filter_articles(articles: list[dict]) -> list[dict]:
    new = filter_new(articles)
    quality = [a for a in new if quality_check(a)]
    logger.info(f"Quality check: {len(quality)} passed")
    return quality
