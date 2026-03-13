import { useState, useEffect } from 'react'
import {
  View, Text, TextInput, FlatList,
  TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { searchArticles, type Article } from '@/lib/api'
import { NewsCard } from '@/components/NewsCard'
import { Colors } from '@/constants/colors'
import { useLang } from '@/lib/LanguageContext'

const LANG_OPTIONS = ['all', 'en', 'de', 'fr'] as const
const LANG_LABELS: Record<string, string> = { all: 'ALL', en: 'EN', de: 'DE', fr: 'FR' }

export default function SearchScreen() {
  const { q: initialQ } = useLocalSearchParams<{ q?: string }>()
  const { lang: deviceLang } = useLang()

  const [query, setQuery] = useState(initialQ ?? '')
  const [filterLang, setFilterLang] = useState<string>(deviceLang)
  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(q = query, lang = filterLang) {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const data = await searchArticles(q.trim(), lang === 'all' ? undefined : lang)
      setResults(data.docs)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQ) handleSearch(initialQ, filterLang)
  }, [])

  function onLangChange(l: string) {
    setFilterLang(l)
    if (searched) handleSearch(query, l)
  }

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textLight} style={styles.searchIcon} />
        <TextInput
          autoFocus={!initialQ}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch()}
          placeholder="Search articles..."
          placeholderTextColor={Colors.textLight}
          returnKeyType="search"
          style={styles.input}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false) }}>
            <Ionicons name="close-circle" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Language filter chips */}
      <View style={styles.chips}>
        {LANG_OPTIONS.map((l) => (
          <TouchableOpacity
            key={l}
            style={[styles.chip, filterLang === l && styles.chipActive]}
            onPress={() => onLangChange(l)}
          >
            <Text style={[styles.chipText, filterLang === l && styles.chipTextActive]}>
              {LANG_LABELS[l]}
            </Text>
          </TouchableOpacity>
        ))}
        {searched && !loading && (
          <Text style={styles.resultCount}>
            {results.length} result{results.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color={Colors.accent} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NewsCard article={item} variant="default" />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            searched ? (
              <View style={styles.empty}>
                <Ionicons name="search-outline" size={40} color={Colors.border} />
                <Text style={styles.emptyText}>No results for "{query}"</Text>
                <Text style={styles.emptySub}>Try a different keyword or language filter</Text>
              </View>
            ) : (
              <View style={styles.empty}>
                <Ionicons name="newspaper-outline" size={40} color={Colors.border} />
                <Text style={styles.emptySub}>Type a keyword and press Search</Text>
              </View>
            )
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: 12,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: Colors.text },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: Colors.textLight },
  chipTextActive: { color: Colors.white },
  resultCount: {
    marginLeft: 'auto',
    fontSize: 12,
    color: Colors.textLight,
  },
  loader: { marginTop: 40 },
  list: { paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 15, fontWeight: '600', color: Colors.text },
  emptySub: { fontSize: 13, color: Colors.textLight, textAlign: 'center' },
})
