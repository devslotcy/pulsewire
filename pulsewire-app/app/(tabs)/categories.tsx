import { useEffect, useState, useRef } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ImageBackground, Animated, Dimensions,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { getArticles } from '@/lib/api'
import { Colors } from '@/constants/colors'
import { useLang } from '@/lib/LanguageContext'

const { width } = Dimensions.get('window')

const CATEGORIES = [
  {
    name: 'Technology',
    slug: 'technology',
    icon: 'laptop-outline' as const,
    color: '#457B9D',
    gradient: ['#457B9D', '#1D3557'] as const,
    desc: 'Latest in tech & innovation',
  },
  {
    name: 'Business',
    slug: 'business',
    icon: 'bar-chart-outline' as const,
    color: '#2A9D8F',
    gradient: ['#2A9D8F', '#1B6B62'] as const,
    desc: 'Markets, economy & finance',
  },
  {
    name: 'World',
    slug: 'world',
    icon: 'globe-outline' as const,
    color: '#E76F51',
    gradient: ['#E76F51', '#C1503A'] as const,
    desc: 'Global news & geopolitics',
  },
  {
    name: 'Science',
    slug: 'science',
    icon: 'flask-outline' as const,
    color: '#8338EC',
    gradient: ['#8338EC', '#5A1EAD'] as const,
    desc: 'Discoveries & research',
  },
  {
    name: 'AI Trends',
    slug: 'ai-trends',
    icon: 'flash-outline' as const,
    color: '#E63946',
    gradient: ['#E63946', '#A31D28'] as const,
    desc: 'Machine learning & AI weekly',
  },
]

function CategoryCard({
  cat,
  count,
  index,
}: {
  cat: (typeof CATEGORIES)[0]
  count: number
  index: number
}) {
  const scale = useRef(new Animated.Value(1)).current

  function onPressIn() {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 30 }).start()
  }
  function onPressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start()
  }

  const isFeatured = index === 0

  return (
    <Animated.View style={[{ transform: [{ scale }] }, isFeatured ? styles.featuredWrap : styles.cardWrap]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => router.push(`/category/${cat.slug}` as any)}
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient
          colors={cat.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.gradient]}
        />

        {/* Background icon watermark */}
        <View style={styles.watermark}>
          <Ionicons name={cat.icon} size={isFeatured ? 120 : 80} color="rgba(255,255,255,0.08)" />
        </View>

        <View style={styles.cardInner}>
          {/* Icon badge */}
          <View style={styles.iconBadge}>
            <Ionicons name={cat.icon} size={isFeatured ? 26 : 22} color="#fff" />
          </View>

          <View style={styles.cardBottom}>
            <Text style={[styles.catName, isFeatured && styles.catNameLarge]}>{cat.name}</Text>
            <Text style={styles.catDesc}>{cat.desc}</Text>
            <View style={styles.countRow}>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{count > 0 ? `${count} articles` : 'Coming soon'}</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.7)" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function CategoriesScreen() {
  const { lang } = useLang()
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    async function loadCounts() {
      const results = await Promise.allSettled(
        CATEGORIES.map((c) => getArticles({ category: c.slug, language: lang, limit: 1 }))
      )
      const map: Record<string, number> = {}
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') map[CATEGORIES[i].slug] = r.value.totalDocs
      })
      setCounts(map)
    }
    loadCounts()
  }, [lang])

  const featured = CATEGORIES[0]
  const rest = CATEGORIES.slice(1)

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Explore</Text>
        <Text style={styles.subheading}>Browse all categories</Text>
      </View>

      {/* Featured (first category — full width) */}
      <CategoryCard cat={featured} count={counts[featured.slug] ?? 0} index={0} />

      {/* 2-column grid for the rest */}
      <View style={styles.grid}>
        {rest.map((cat, i) => (
          <CategoryCard key={cat.slug} cat={cat} count={counts[cat.slug] ?? 0} index={i + 1} />
        ))}
      </View>
    </ScrollView>
  )
}

const CARD_HEIGHT = 160
const FEATURED_HEIGHT = 200
const COL_WIDTH = (width - 16 * 2 - 10) / 2

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 16, paddingBottom: 32 },

  header: { paddingTop: 20, paddingBottom: 16 },
  heading: { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  subheading: { fontSize: 14, color: Colors.textLight, marginTop: 2 },

  featuredWrap: {
    height: FEATURED_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardWrap: {
    width: COL_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  gradient: { borderRadius: 0 },
  watermark: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  cardInner: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBottom: { gap: 4 },
  catName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
  },
  catNameLarge: { fontSize: 22 },
  catDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 16,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  countBadge: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  countText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
})
