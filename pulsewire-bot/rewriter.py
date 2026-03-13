from groq import Groq
import json
import re
import logging
import time
from config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

logger = logging.getLogger(__name__)


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = text.strip("-")
    return text[:80]


def detect_category(title: str, summary: str) -> str:
    text = (title + " " + summary).lower()
    if any(w in text for w in ["ai", "artificial intelligence", "openai", "gpt", "llm", "machine learning", "deepmind", "gemini"]):
        return "ai-trends"
    if any(w in text for w in ["startup", "funding", "ipo", "revenue", "market", "stock", "economy", "billion", "million"]):
        return "business"
    if any(w in text for w in ["science", "research", "study", "climate", "space", "health", "nasa"]):
        return "science"
    if any(w in text for w in ["war", "election", "government", "policy", "politics", "country", "president"]):
        return "world"
    return "technology"


def rewrite_article(article: dict) -> dict | None:
    language = article.get("language", "en")
    title = article.get("title", "")
    summary = article.get("summary", "")
    source = article.get("source", "")
    url = article.get("url", "")

    lang_instruction = {
        "en": "Write in English.",
        "de": "Schreibe auf Deutsch.",
        "fr": "Écris en français.",
    }.get(language, "Write in English.")

    prompt = f"""You are a professional news editor. Based on the following news source, write an original article.

Source title: {title}
Source summary: {summary}
Source: {source}

Instructions:
- {lang_instruction}
- Write an original article that is at least 70% different from the source in wording
- Keep all facts accurate
- Format your response as valid JSON with these exact keys:
  - "title": SEO-optimized headline, 50-60 characters, impactful but not sensational
  - "seo_title": Same as title or slight variation for meta
  - "seo_description": 150-160 character meta description with main keyword
  - "summary": 100-150 word summary, keyword-rich, engaging
  - "content": Full article body, 500-600 words, well-structured paragraphs
  - "what_this_means": 2-3 sentence analysis of impact and implications
  - "key_points": Array of 4-5 strings, each a key takeaway
  - "tags": Array of 4-6 relevant keyword strings

Return ONLY the JSON object, no other text."""

    models = ["llama-3.3-70b-versatile", "llama3-8b-8192"]

    for model_name in models:
        for attempt in range(3):
            try:
                response = client.chat.completions.create(
                    model=model_name,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7,
                )
                raw = response.choices[0].message.content.strip()

                if "```json" in raw:
                    raw = raw.split("```json")[1].split("```")[0].strip()
                elif "```" in raw:
                    raw = raw.split("```")[1].split("```")[0].strip()

                data = json.loads(raw)
                category = detect_category(data.get("title", title), data.get("summary", summary))

                logger.info(f"Rewritten with {model_name}: {data.get('title', title)[:50]}")

                return {
                    "title": data.get("title", title),
                    "slug": slugify(data.get("title", title)),
                    "language": language,
                    "summary": data.get("summary", summary),
                    "content": data.get("content", ""),
                    "what_this_means": data.get("what_this_means", ""),
                    "key_points": [{"point": p} for p in data.get("key_points", [])],
                    "tags": [{"tag": t} for t in data.get("tags", [])],
                    "seo_title": data.get("seo_title", data.get("title", title)),
                    "seo_description": data.get("seo_description", ""),
                    "source_url": url,
                    "source_name": source,
                    "category_slug": category,
                    "status": "review",
                }

            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error for '{title}': {e}")
                return None
            except Exception as e:
                if "429" in str(e) or "rate_limit" in str(e).lower():
                    wait = 15 * (attempt + 1)
                    logger.warning(f"{model_name} rate limited (attempt {attempt+1}/3), waiting {wait}s...")
                    time.sleep(wait)
                    continue
                logger.error(f"Rewrite error for '{title}' with {model_name}: {e}")
                return None

    logger.error(f"All models failed for '{title}'")
    return None
