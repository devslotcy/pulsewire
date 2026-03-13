import { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, Image, StyleSheet,
  ActivityIndicator, TouchableOpacity, Linking, Share,
} from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { getArticleBySlug, timeAgo, type Article } from '@/lib/api'
import { AdBanner } from '@/components/AdBanner'
import { Colors } from '@/constants/colors'
import { toggleBookmark, isBookmarked } from '@/lib/bookmarks'
import { useAppPrefs, TEXT_SIZES } from '@/lib/AppContext'

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)
  const { textSize } = useAppPrefs()
  const ts = TEXT_SIZES[textSize]

  useEffect(() => {
    if (slug) {
      getArticleBySlug(slug)
        .then(async (a) => {
          setArticle(a)
          if (a) setBookmarked(await isBookmarked(a.id))
        })
        .finally(() => setLoading(false))
    }
  }, [slug])

  async function handleBookmark() {
    if (!article) return
    const added = await toggleBookmark(article)
    setBookmarked(added)
  }

  async function handleShare() {
    if (!article) return
    await Share.share({
      title: article.title,
      message: `${article.title}\n\n${article.summary ?? ''}`,
    })
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    )
  }

  if (!article) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Article not found.</Text>
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: article.category?.name || 'Article',
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleShare} style={styles.headerBtn}>
                <Ionicons name="share-outline" size={22} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleBookmark} style={styles.headerBtn}>
                <Ionicons
                  name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={bookmarked ? Colors.accent : Colors.white}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Hero image */}
        {article.image ? (
          <Image source={{ uri: article.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}

        <View style={styles.content}>
          {/* Category */}
          {article.category && (
            <View style={[styles.badge, { backgroundColor: article.category.color || Colors.accent }]}>
              <Text style={styles.badgeText}>{article.category.name}</Text>
            </View>
          )}

          {/* Title */}
          <Text style={[styles.title, { fontSize: ts.title, lineHeight: ts.title * 1.35 }]}>
            {article.title}
          </Text>

          {/* Meta */}
          <View style={styles.meta}>
            {article.author && (
              <Text style={styles.author}>{article.author.name}</Text>
            )}
            <Text style={styles.date}>{timeAgo(article.published_at)}</Text>
          </View>

          {/* Ad */}
          <AdBanner />

          {/* Summary */}
          {article.summary && (
            <View style={styles.summaryBox}>
              <Text style={[styles.summary, { fontSize: ts.summary, lineHeight: ts.summary * 1.65 }]}>
                {article.summary}
              </Text>
            </View>
          )}

          {/* Content */}
          {typeof article.content === 'string' && article.content ? (
            <Text style={[styles.body, { fontSize: ts.body, lineHeight: ts.body * 1.75 }]}>
              {article.content}
            </Text>
          ) : null}

          {/* What This Means */}
          {article.what_this_means ? (
            <View style={styles.wtmBox}>
              <Text style={styles.wtmTitle}>⚡ What This Means</Text>
              <Text style={[styles.wtmText, { fontSize: ts.body - 1, lineHeight: (ts.body - 1) * 1.65 }]}>
                {article.what_this_means}
              </Text>
            </View>
          ) : null}

          {/* Key Points */}
          {article.key_points && article.key_points.length > 0 && (
            <View style={styles.kpBox}>
              <Text style={styles.kpTitle}>📊 Key Points</Text>
              {article.key_points.map((kp, i) => (
                <View key={i} style={styles.kpRow}>
                  <View style={styles.kpNum}>
                    <Text style={styles.kpNumText}>{i + 1}</Text>
                  </View>
                  <Text style={[styles.kpText, { fontSize: ts.body - 1, lineHeight: (ts.body - 1) * 1.6 }]}>
                    {kp.point}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Ad */}
          <AdBanner />

          {/* Source */}
          {article.source_url && (
            <TouchableOpacity onPress={() => Linking.openURL(article.source_url)}>
              <Text style={styles.source}>
                Source: <Text style={styles.sourceLink}>{article.source_name || article.source_url}</Text>
              </Text>
            </TouchableOpacity>
          )}

          {/* Bottom bookmark CTA */}
          <TouchableOpacity style={[styles.bookmarkCta, bookmarked && styles.bookmarkCtaSaved]} onPress={handleBookmark} activeOpacity={0.8}>
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={bookmarked ? Colors.white : Colors.accent}
            />
            <Text style={[styles.bookmarkCtaText, bookmarked && styles.bookmarkCtaTextSaved]}>
              {bookmarked ? 'Saved to bookmarks' : 'Save this article'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  errorText: { color: Colors.text, fontSize: 16 },
  headerActions: { flexDirection: 'row', gap: 4, marginRight: 4 },
  headerBtn: { padding: 6 },
  image: { width: '100%', height: 220 },
  imagePlaceholder: { width: '100%', height: 220, backgroundColor: '#D1D5DB' },
  content: { padding: 16, gap: 16 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  title: { fontWeight: 'bold', color: Colors.text },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  author: { fontSize: 13, fontWeight: '600', color: Colors.text },
  date: { fontSize: 13, color: Colors.textLight },
  summaryBox: { borderLeftWidth: 4, borderLeftColor: Colors.accent, paddingLeft: 12 },
  summary: { color: '#4B5563', fontStyle: 'italic' },
  body: { color: Colors.text },
  wtmBox: { backgroundColor: Colors.text, borderRadius: 12, padding: 16, gap: 8 },
  wtmTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.white },
  wtmText: { color: '#D1D5DB' },
  kpBox: {
    backgroundColor: Colors.white, borderRadius: 12, padding: 16, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  kpTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  kpRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  kpNum: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center', marginTop: 1,
  },
  kpNumText: { color: Colors.white, fontSize: 11, fontWeight: 'bold' },
  kpText: { flex: 1, color: '#374151' },
  source: { fontSize: 12, color: Colors.textLight },
  sourceLink: { color: Colors.secondary, textDecorationLine: 'underline' },
  bookmarkCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
    backgroundColor: 'transparent',
  },
  bookmarkCtaSaved: {
    backgroundColor: Colors.accent,
  },
  bookmarkCtaText: { fontSize: 14, fontWeight: '700', color: Colors.accent },
  bookmarkCtaTextSaved: { color: Colors.white },
})
