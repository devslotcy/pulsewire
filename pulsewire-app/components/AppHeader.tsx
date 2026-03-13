import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Platform,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'
import { useLang } from '@/lib/LanguageContext'

const FLAG: Record<string, string> = { en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷' }

export function AppHeader() {
  const insets = useSafeAreaInsets()
  const { lang } = useLang()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  function handleSearch() {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}` as any)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {searchOpen ? (
        <View style={styles.searchRow}>
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            placeholder="Search articles..."
            placeholderTextColor="#6B7280"
            returnKeyType="search"
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={() => { setSearchOpen(false); setQuery('') }}>
            <Ionicons name="close" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.row}>
          {/* Logo */}
          <TouchableOpacity onPress={() => router.push('/' as any)} style={styles.logo}>
            <View style={styles.dot} />
            <Text style={styles.logoText}>PulseWire</Text>
          </TouchableOpacity>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => router.push('/settings' as any)} style={styles.langBtn}>
              <Text style={styles.langText}>{FLAG[lang]} {lang.toUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSearchOpen(true)}>
              <Ionicons name="search" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
  logoText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  langBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  langText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: Colors.white,
    fontSize: 15,
  },
})
