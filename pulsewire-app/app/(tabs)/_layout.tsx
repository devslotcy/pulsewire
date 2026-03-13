import { View } from 'react-native'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/colors'
import { AppHeader } from '@/components/AppHeader'

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.primary,
            borderTopColor: '#1a1a1a',
            height: 64,
            paddingBottom: 10,
            paddingTop: 6,
          },
          tabBarActiveTintColor: Colors.accent,
          tabBarInactiveTintColor: '#4B5563',
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            tabBarLabel: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'compass' : 'compass-outline'} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="ai-trends"
          options={{
            tabBarLabel: 'AI',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'flash' : 'flash-outline'} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            tabBarLabel: 'Saved',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'bookmark' : 'bookmark-outline'} size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  )
}
