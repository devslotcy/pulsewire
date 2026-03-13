import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'

export type Lang = 'en' | 'de' | 'fr' | 'es' | 'tr' | 'ar' | 'zh' | 'pt' | 'ru'

export const LANGUAGES: { code: Lang; label: string; localLabel: string; flag: string; rtl?: boolean }[] = [
  { code: 'en', label: 'English',    localLabel: 'English',    flag: '🇬🇧' },
  { code: 'de', label: 'German',     localLabel: 'Deutsch',    flag: '🇩🇪' },
  { code: 'fr', label: 'French',     localLabel: 'Français',   flag: '🇫🇷' },
  { code: 'es', label: 'Spanish',    localLabel: 'Español',    flag: '🇪🇸' },
  { code: 'tr', label: 'Turkish',    localLabel: 'Türkçe',     flag: '🇹🇷' },
  { code: 'pt', label: 'Portuguese', localLabel: 'Português',  flag: '🇧🇷' },
  { code: 'ru', label: 'Russian',    localLabel: 'Русский',    flag: '🇷🇺' },
  { code: 'zh', label: 'Chinese',    localLabel: '中文',        flag: '🇨🇳' },
  { code: 'ar', label: 'Arabic',     localLabel: 'العربية',    flag: '🇸🇦', rtl: true },
]

const SUPPORTED = LANGUAGES.map((l) => l.code)
const STORAGE_KEY = 'preferred-lang'

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextType>({ lang: 'en', setLang: () => {} })

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    async function init() {
      // 1. Kullanıcının daha önce seçtiği dil varsa onu kullan
      const saved = await AsyncStorage.getItem(STORAGE_KEY)
      if (saved && SUPPORTED.includes(saved as Lang)) {
        setLangState(saved as Lang)
        return
      }

      // 2. Sistem dilini al — birden fazla locale varsa hepsini dene
      const locales = getLocales()
      for (const locale of locales) {
        const code = locale.languageCode?.toLowerCase() as Lang
        if (code && SUPPORTED.includes(code)) {
          setLangState(code)
          return
        }
      }

      // 3. Hiçbiri yoksa İngilizce
      setLangState('en')
    }
    init()
  }, [])

  async function setLang(newLang: Lang) {
    setLangState(newLang)
    await AsyncStorage.setItem(STORAGE_KEY, newLang)
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
