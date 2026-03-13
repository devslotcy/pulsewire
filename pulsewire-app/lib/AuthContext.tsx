import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_URL = 'http://192.168.1.43:3005'

export interface AuthUser {
  id: number
  email: string
  displayName: string | null
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  loading: boolean
  sendMagicLink: (email: string) => Promise<void>
  verifyMagicToken: (token: string) => Promise<boolean>
  signOut: () => Promise<void>
  updateDisplayName: (name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  sendMagicLink: async () => {},
  verifyMagicToken: async () => false,
  signOut: async () => {},
  updateDisplayName: async () => {},
})

const TOKEN_KEY = 'pulsewire_auth_token'
const USER_KEY = 'pulsewire_auth_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session from storage
    async function restore() {
      const [savedToken, savedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ])
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
      setLoading(false)
    }
    restore()
  }, [])

  async function sendMagicLink(email: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to send magic link')
    }
  }

  async function verifyMagicToken(magicToken: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/api/magic-link/verify?token=${magicToken}`)
      if (!res.ok) return false

      const data = await res.json()
      if (!data.token || !data.user) return false

      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, data.token),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user)),
      ])

      setToken(data.token)
      setUser(data.user)
      return true
    } catch {
      return false
    }
  }

  async function signOut(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ])
    setToken(null)
    setUser(null)
  }

  async function updateDisplayName(name: string): Promise<void> {
    if (!user || !token) return
    const res = await fetch(`${API_URL}/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ displayName: name }),
    })
    if (res.ok) {
      const updated = { ...user, displayName: name }
      setUser(updated)
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated))
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, sendMagicLink, verifyMagicToken, signOut, updateDisplayName }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
