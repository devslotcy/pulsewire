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

export default function AiTrendsScreen() {
  const { lang } = useLang()
  const params = useMemo(() => ({ category: 'ai-trends', language: lang }), [lang])
  const { articles, loading, refreshing, loadingMore, hasMore, load, refresh, loadMore } =
    usePaginatedFeed(params)

  useEffect(() => { load(true) }, [lang])

  if (loading) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
        <FeedSkeleton />
      </ScrollView>
    )
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.accent} />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerBar} />
          <View>
            <Text style={styles.headerTitle}>AI Trends</Text>
            <Text style={styles.headerSub}>Weekly AI & machine learning insights</Text>
          </View>
        </View>
      }
      renderItem={({ item, index }) => (
        <View>
          <NewsCard article={item} variant="default" />
          {index === 3 && <AdBanner />}
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
      ListEmptyComponent={
        <Text style={styles.empty}>AI Trends articles coming soon.</Text>
      }
    />
  )
}

const styles = StyleSheet.create({
  list: { paddingBottom: 24, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, backgroundColor: Colors.white, marginBottom: 8,
  },
  headerBar: { width: 4, height: 40, backgroundColor: Colors.primary, borderRadius: 2 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  headerSub: { fontSize: 13, color: Colors.textLight, marginTop: 2 },
  empty: { textAlign: 'center', color: Colors.textLight, padding: 32 },
  footer: { paddingVertical: 20 },
  end: { textAlign: 'center', color: Colors.textLight, fontSize: 12, paddingVertical: 20 },
})
