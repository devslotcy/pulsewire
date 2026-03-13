import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Colors } from '@/constants/colors'
import { LanguageProvider } from '@/lib/LanguageContext'
import { AppProvider, useAppPrefs } from '@/lib/AppContext'
import { AuthProvider } from '@/lib/AuthContext'
import {
  registerForPushNotifications,
  scheduleDailyNewsNotification,
  cancelAllNotifications,
} from '@/lib/notifications'

function NotificationSync() {
  const { notificationsEnabled, notificationHour, notificationMinute } = useAppPrefs()

  useEffect(() => {
    if (notificationsEnabled) {
      scheduleDailyNewsNotification(notificationHour, notificationMinute)
    } else {
      cancelAllNotifications()
    }
  }, [notificationsEnabled, notificationHour, notificationMinute])

  return null
}

export default function RootLayout() {
  useEffect(() => {
    registerForPushNotifications()
  }, [])

  return (
    <AppProvider>
      <AuthProvider>
        <LanguageProvider>
          <StatusBar style="light" />
          <NotificationSync />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: Colors.primary },
              headerTintColor: Colors.white,
              headerTitleStyle: { fontWeight: 'bold' },
              contentStyle: { backgroundColor: Colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="news/[slug]"
              options={{ title: '', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="search"
              options={{ title: 'Search', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="auth"
              options={{ title: 'Sign In', presentation: 'modal' }}
            />
          </Stack>
        </LanguageProvider>
      </AuthProvider>
    </AppProvider>
  )
}
