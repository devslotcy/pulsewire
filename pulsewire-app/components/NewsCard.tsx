import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { type Article, timeAgo } from '@/lib/api'
import { Colors } from '@/constants/colors'

interface NewsCardProps {
  article: Article
  variant?: 'hero' | 'default'
}

export function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  function onPress() {
    router.push(`/news/${article.slug}` as any)
  }

  if (variant === 'hero') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.heroContainer}>
        {article.image ? (
          <Image source={{ uri: article.image }} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <View style={[styles.heroImage, styles.placeholder]} />
        )}
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          {article.category && (
            <View style={[styles.badge, { backgroundColor: article.category.color || Colors.accent }]}>
              <Text style={styles.badgeText}>{article.category.name}</Text>
            </View>
          )}
          <Text style={styles.heroTitle} numberOfLines={3}>{article.title}</Text>
          <Text style={styles.heroSummary} numberOfLines={2}>{article.summary}</Text>
          <Text style={styles.heroTime}>{timeAgo(article.published_at)}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.card}>
      {article.image ? (
        <Image source={{ uri: article.image }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImage, styles.placeholder]} />
      )}
      <View style={styles.cardContent}>
        {article.category && (
          <Text style={[styles.cardCategory, { color: article.category.color || Colors.accent }]}>
            {article.category.name}
          </Text>
        )}
        <Text style={styles.cardTitle} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.cardSummary} numberOfLines={2}>{article.summary}</Text>
        <Text style={styles.cardTime}>{timeAgo(article.published_at)}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  // Hero
  heroContainer: { margin: 0, position: 'relative' },
  heroImage: { width: '100%', height: 260 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    gap: 6,
  },
  heroTitle: { color: Colors.white, fontSize: 20, fontWeight: 'bold', lineHeight: 26 },
  heroSummary: { color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18 },
  heroTime: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },

  // Default card
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: { width: '100%', height: 160 },
  cardContent: { padding: 12, gap: 4 },
  cardCategory: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, lineHeight: 22 },
  cardSummary: { fontSize: 13, color: Colors.textLight, lineHeight: 18 },
  cardTime: { fontSize: 11, color: Colors.textLight, marginTop: 2 },

  // Shared
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  badgeText: { color: Colors.white, fontSize: 11, fontWeight: '600' },
  placeholder: { backgroundColor: '#D1D5DB' },
})
