import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/lib/AuthContext'
import { Colors } from '@/constants/colors'

type Step = 'email' | 'sent'

export default function AuthScreen() {
  const { sendMagicLink } = useAuth()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !trimmed.includes('@')) {
      Alert.alert('Invalid email', 'Please enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      await sendMagicLink(trimmed)
      setStep('sent')
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not send magic link. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={['#0A0A0A', '#1a1a2e']}
        style={styles.container}
      >
        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.brandDot} />
          <Text style={styles.brandText}>PulseWire</Text>
        </View>

        {step === 'email' ? (
          <View style={styles.content}>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you a magic link — no password needed.
            </Text>

            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />
            </View>

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSend}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.btnText}>Send Magic Link</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.note}>
              No account? We'll create one automatically.
            </Text>
          </View>
        ) : (
          <View style={styles.content}>
            {/* Sent state */}
            <View style={styles.sentIcon}>
              <Ionicons name="mail" size={36} color={Colors.accent} />
            </View>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We sent a sign-in link to{'\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
            <Text style={styles.sentNote}>
              Tap the link in the email to sign in. It expires in 15 minutes.
            </Text>

            <TouchableOpacity
              style={styles.resendBtn}
              onPress={() => setStep('email')}
            >
              <Text style={styles.resendText}>Use a different email</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 24, paddingTop: 60 },

  closeBtn: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },

  brand: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 48,
  },
  brandDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.accent },
  brandText: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },

  content: { flex: 1, gap: 16 },

  title: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 22 },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 16,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  note: {
    textAlign: 'center',
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 8,
  },

  // Sent state
  sentIcon: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: 'rgba(230,57,70,0.15)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  emailHighlight: { color: '#fff', fontWeight: '700' },
  sentNote: {
    fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 20,
  },
  resendBtn: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendText: { color: Colors.accent, fontSize: 14, fontWeight: '600' },
})
