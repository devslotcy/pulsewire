import { useEffect, useMemo } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  ScrollView, RefreshControl, ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { NewsCard } from '@/components/NewsCard'
import { FeedSkeleton } from '@/components/SkeletonLoader'
import { Colors } from '@/constants/colors'
import { useLang } from '@/lib/LanguageContext'
import { usePaginatedFeed } from '@/lib/usePaginatedFeed'

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const { lang } = useLang()
  const name = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : ''

  const params = useMemo(() => ({ category: slug, language: lang }), [slug, lang])
  const { articles, loading, refreshing, loadingMore, hasMore, load, refresh, loadMore } =
    usePaginatedFeed(params)

  useEffect(() => { load(true) }, [slug, lang])

  if (loading) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
        <Stack.Screen options={{ title: name }} />
        <FeedSkeleton />
      </ScrollView>
    )
  }

  return (
    <>
      <Stack.Screen options={{ title: name }} />
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.accent} />
        }
        renderItem={({ item }) => <NewsCard article={item} variant="default" />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.footer} size="small" color={Colors.accent} />
          ) : !hasMore && articles.length > 0 ? (
            <Text style={styles.end}>All articles loaded</Text>
          ) : null
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No articles in this category yet.</Text>
        }
      />
    </>
  )
}

const styles = StyleSheet.create({
  list: { paddingBottom: 24, backgroundColor: Colors.background },
  empty: { textAlign: 'center', color: Colors.textLight, padding: 32 },
  footer: { paddingVertical: 20 },
  end: { textAlign: 'center', color: Colors.textLight, fontSize: 12, paddingVertical: 20 },
})
