import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type TextSize = 'small' | 'medium' | 'large'

interface AppPrefs {
  textSize: TextSize
  notificationsEnabled: boolean
  notificationHour: number
  notificationMinute: number
}

interface AppContextType extends AppPrefs {
  setTextSize: (s: TextSize) => void
  setNotificationsEnabled: (v: boolean) => void
  setNotificationTime: (hour: number, minute: number) => void
}

const DEFAULTS: AppPrefs = {
  textSize: 'medium',
  notificationsEnabled: true,
  notificationHour: 9,
  notificationMinute: 0,
}

const STORAGE_KEY = 'pulsewire_app_prefs'

const AppContext = createContext<AppContextType>({
  ...DEFAULTS,
  setTextSize: () => {},
  setNotificationsEnabled: () => {},
  setNotificationTime: () => {},
})

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<AppPrefs>(DEFAULTS)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setPrefs({ ...DEFAULTS, ...JSON.parse(raw) })
    })
  }, [])

  async function save(next: AppPrefs) {
    setPrefs(next)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <AppContext.Provider
      value={{
        ...prefs,
        setTextSize: (textSize) => save({ ...prefs, textSize }),
        setNotificationsEnabled: (notificationsEnabled) => save({ ...prefs, notificationsEnabled }),
        setNotificationTime: (notificationHour, notificationMinute) =>
          save({ ...prefs, notificationHour, notificationMinute }),
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppPrefs() {
  return useContext(AppContext)
}

export const TEXT_SIZES: Record<TextSize, { body: number; title: number; summary: number }> = {
  small:  { body: 13, title: 20, summary: 13 },
  medium: { body: 15, title: 22, summary: 15 },
  large:  { body: 18, title: 26, summary: 17 },
}
