import { useState, useCallback } from 'react'
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { NewsCard } from '@/components/NewsCard'
import { Colors } from '@/constants/colors'
import { getBookmarks } from '@/lib/bookmarks'
import { type Article } from '@/lib/api'

const STORAGE_KEY = 'pulsewire_bookmarks'

export default function BookmarksScreen() {
  const [articles, setArticles] = useState<Article[]>([])

  useFocusEffect(
    useCallback(() => {
      getBookmarks().then(setArticles)
    }, [])
  )

  async function handleRemove(id: string) {
    const next = articles.filter((a) => a.id !== id)
    setArticles(next)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.cardWrap}>
              <NewsCard article={item} variant="default" />
            </View>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemove(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.accent} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Ionicons name="bookmark" size={22} color={Colors.accent} />
            <Text style={styles.heading}>Saved Articles</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyTitle}>No saved articles</Text>
            <Text style={styles.emptySub}>Tap the bookmark icon on any article to save it here.</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { paddingBottom: 32 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, padding: 16, paddingBottom: 8,
  },
  heading: { fontSize: 22, fontWeight: '800', color: Colors.text },
  row: { position: 'relative' },
  cardWrap: { flex: 1 },
  removeBtn: {
    position: 'absolute', top: 14, right: 20, zIndex: 10,
    backgroundColor: Colors.white, padding: 6, borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 3,
  },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  emptySub: { fontSize: 14, color: Colors.textLight, textAlign: 'center', lineHeight: 20 },
})
