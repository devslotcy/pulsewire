import AsyncStorage from '@react-native-async-storage/async-storage'
import { type Article } from '@/lib/api'

const API_URL = 'http://192.168.1.43:3005'
const LOCAL_KEY = 'pulsewire_bookmarks'

// ─── Local storage (always works, no auth needed) ─────────────────────────

export async function getBookmarks(): Promise<Article[]> {
  const raw = await AsyncStorage.getItem(LOCAL_KEY)
  return raw ? JSON.parse(raw) : []
}

export async function toggleBookmark(article: Article): Promise<boolean> {
  const current = await getBookmarks()
  const exists = current.some((a) => a.id === article.id)
  const next = exists ? current.filter((a) => a.id !== article.id) : [article, ...current]
  await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(next))
  return !exists
}

export async function isBookmarked(id: string): Promise<boolean> {
  const current = await getBookmarks()
  return current.some((a) => a.id === id)
}

export async function clearBookmarks(): Promise<void> {
  await AsyncStorage.removeItem(LOCAL_KEY)
}

// ─── Server sync (only when user is logged in) ────────────────────────────

/**
 * Push local bookmarks to server user record.
 * Call after login or when a bookmark is toggled while logged in.
 */
export async function syncBookmarksToServer(
  userId: number,
  token: string,
  articles: Article[]
): Promise<void> {
  try {
    const bookmarks = articles.map((a) => ({
      articleId: a.id,
      savedAt: new Date().toISOString(),
    }))

    await fetch(`${API_URL}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ bookmarks }),
    })
  } catch (e) {
    // Sync failure is non-critical — local copy stays intact
    console.warn('Bookmark sync failed:', e)
  }
}

/**
 * Fetch bookmarks from server and merge with local.
 * Server is source of truth for article IDs; local has full Article objects.
 */
export async function pullBookmarksFromServer(
  userId: number,
  token: string
): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/api/users/${userId}`, {
      headers: { Authorization: `JWT ${token}` },
    })
    if (!res.ok) return

    const data = await res.json()
    const serverIds: string[] = (data.bookmarks ?? []).map((b: any) => b.articleId)

    if (serverIds.length === 0) return

    // Keep local articles that are still in server list
    const local = await getBookmarks()
    const localFiltered = local.filter((a) => serverIds.includes(a.id))

    // Save back
    await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(localFiltered))
  } catch (e) {
    console.warn('Bookmark pull failed:', e)
  }
}
