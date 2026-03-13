import logging
import os
import time
from datetime import datetime

os.makedirs("logs", exist_ok=True)

from fetcher import fetch_all
from filter import filter_articles
from rewriter import rewrite_article
from image_finder import find_image
from publisher import publish_article
from notifier import notify
from config import ARTICLES_PER_RUN

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("logs/bot.log"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)

LANGUAGES = ["en", "de", "fr"]


def run():
    logger.info("=== PulseWire Bot Starting ===")
    start = datetime.now()
    total_published = 0
    errors = 0

    for lang in LANGUAGES:
        logger.info(f"--- Processing language: {lang.upper()} ---")

        try:
            raw = fetch_all(lang)
            filtered = filter_articles(raw)

            if not filtered:
                logger.info(f"No new articles for {lang}")
                continue

            to_process = filtered[:ARTICLES_PER_RUN]
            logger.info(f"Processing {len(to_process)} articles for {lang}")

            for article in to_process:
                try:
                    rewritten = rewrite_article(article)
                    if not rewritten:
                        errors += 1
                        continue

                    # Find image using article title + category
                    image_query = rewritten.get("title", article.get("title", "technology news"))
                    category = rewritten.get("category_slug", "technology")
                    image = find_image(image_query, category)
                    rewritten["image"] = image["url"]
                    rewritten["image_alt"] = image["alt"]

                    success = publish_article(rewritten)
                    if success:
                        total_published += 1
                    else:
                        errors += 1

                    time.sleep(2)

                except Exception as e:
                    logger.error(f"Error processing article '{article.get('title', '')}': {e}")
                    errors += 1

        except Exception as e:
            logger.error(f"Error processing language {lang}: {e}")

    elapsed = (datetime.now() - start).seconds
    summary = (
        f"✅ PulseWire Bot Run Complete\n"
        f"Published: {total_published} articles\n"
        f"Errors: {errors}\n"
        f"Duration: {elapsed}s\n"
        f"Time: {start.strftime('%Y-%m-%d %H:%M')}"
    )

    logger.info(summary)
    notify(summary)


if __name__ == "__main__":
    run()
