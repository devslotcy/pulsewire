import Constants from 'expo-constants'

const isExpoGo = Constants.executionEnvironment === 'storeClient'

if (!isExpoGo) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Notifications = require('expo-notifications')
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  })
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (isExpoGo) {
    console.log('Notifications not available in Expo Go — use a development build.')
    return null
  }

  const Device = require('expo-device')
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices')
    return null
  }

  const { Platform } = require('react-native')
  const Notifications = require('expo-notifications')

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission denied')
    return null
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'PulseWire News',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    })
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data
    return token
  } catch (e) {
    console.log('Could not get push token:', e)
    return null
  }
}

export async function scheduleDailyNewsNotification(hour = 9, minute = 0) {
  if (isExpoGo) return

  const Notifications = require('expo-notifications')

  // Cancel existing scheduled notifications before rescheduling
  await Notifications.cancelAllScheduledNotificationsAsync()

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📰 PulseWire',
      body: 'Your daily news digest is ready. Tap to read.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  })
}

export async function cancelAllNotifications() {
  if (isExpoGo) return
  const Notifications = require('expo-notifications')
  await Notifications.cancelAllScheduledNotificationsAsync()
}
