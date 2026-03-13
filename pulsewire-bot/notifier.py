import requests
import logging
from config import DISCORD_WEBHOOK_URL

logger = logging.getLogger(__name__)


def notify(message: str):
    if not DISCORD_WEBHOOK_URL:
        logger.info(f"[Notifier] {message}")
        return
    try:
        requests.post(
            DISCORD_WEBHOOK_URL,
            json={"content": message},
            timeout=5,
        )
    except Exception as e:
        logger.error(f"Discord notify error: {e}")
