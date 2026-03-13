import { useEffect, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  ScrollView, RefreshControl, ActivityIndicator,
} from 'react-native'
import { NewsCard } from '@/components/NewsCard'
import { AdBanner } from '@/components/AdBanner'
import { FeedSkeleton } from '@/components/SkeletonLoader'
import { Colors } from '@/constants/colors'
import { useLang } from '@/lib/LanguageContext'
import { usePaginatedFeed } from '@/lib/usePaginatedFeed'

export default function HomeScreen() {
  const { lang } = useLang()
  const params = useMemo(() => ({ language: lang }), [lang])
  const { articles, loading, refreshing, loadingMore, hasMore, error, load, refresh, loadMore } =
    usePaginatedFeed(params)

  useEffect(() => { load(true) }, [lang])

  if (loading) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
        <FeedSkeleton />
      </ScrollView>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Could not load articles.</Text>
        <Text style={styles.errorSub}>Make sure the CMS is running.</Text>
      </View>
    )
  }

  const hero = articles[0]
  const rest = articles.slice(1)

  return (
    <FlatList
      data={rest}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.accent} />
      }
      ListHeaderComponent={
        <View>
          {hero && <NewsCard article={hero} variant="hero" />}
          <AdBanner />
          <View style={styles.sectionHeader}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>Latest News</Text>
          </View>
        </View>
      }
      renderItem={({ item, index }) => (
        <View>
          <NewsCard article={item} variant="default" />
          {index === 4 && <AdBanner />}
          {index === 14 && <AdBanner />}
        </View>
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator style={styles.footer} size="small" color={Colors.accent} />
        ) : !hasMore && articles.length > 0 ? (
          <Text style={styles.end}>You're all caught up</Text>
        ) : null
      }
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No articles yet.</Text>}
    />
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.background, gap: 8,
  },
  errorText: { color: Colors.text, fontSize: 16, fontWeight: '600' },
  errorSub: { color: Colors.textLight, fontSize: 13 },
  list: { paddingBottom: 24, backgroundColor: Colors.background },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.background,
  },
  sectionBar: { width: 4, height: 20, backgroundColor: Colors.accent, borderRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  empty: { textAlign: 'center', color: Colors.textLight, padding: 32 },
  footer: { paddingVertical: 20 },
  end: { textAlign: 'center', color: Colors.textLight, fontSize: 12, paddingVertical: 20 },
})
