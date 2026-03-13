import { useEffect, useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Switch, Alert, Linking, Platform, Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '@/constants/colors'
import { useLang, LANGUAGES, type Lang } from '@/lib/LanguageContext'
import { useAppPrefs, type TextSize } from '@/lib/AppContext'
import { getBookmarks, clearBookmarks } from '@/lib/bookmarks'
import { useAuth } from '@/lib/AuthContext'
import { router } from 'expo-router'

const { width } = Dimensions.get('window')

const TEXT_SIZE_OPTIONS: { value: TextSize; label: string; size: number }[] = [
  { value: 'small',  label: 'Small',  size: 12 },
  { value: 'medium', label: 'Medium', size: 15 },
  { value: 'large',  label: 'Large',  size: 19 },
]

const NOTIFICATION_HOURS = [6, 7, 8, 9, 10, 11, 12, 18, 20, 21, 22]

function Row({
  icon, iconBg, label, value, onPress, right, last,
}: {
  icon: string; iconBg: string; label: string
  value?: string; onPress?: () => void; right?: React.ReactNode; last?: boolean
}) {
  const inner = (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={17} color="#fff" />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {right ?? null}
      {onPress && !right ? <Ionicons name="chevron-forward" size={15} color="#C7C7CC" /> : null}
    </View>
  )
  return onPress
    ? <TouchableOpacity onPress={onPress} activeOpacity={0.6}>{inner}</TouchableOpacity>
    : inner
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  )
}

export default function SettingsScreen() {
  const { lang, setLang } = useLang()
  const {
    textSize, setTextSize,
    notificationsEnabled, setNotificationsEnabled,
    notificationHour, notificationMinute, setNotificationTime,
  } = useAppPrefs()
  const { user, signOut } = useAuth()
  const [bookmarkCount, setBookmarkCount] = useState(0)

  useEffect(() => {
    getBookmarks().then((b) => setBookmarkCount(b.length))
  }, [])

  const currentLang = LANGUAGES.find((l) => l.code === lang)

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ])
  }

  function handleClearBookmarks() {
    Alert.alert(
      'Clear Saved Articles',
      `Remove all ${bookmarkCount} saved article${bookmarkCount !== 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All', style: 'destructive',
          onPress: async () => {
            await clearBookmarks()
            setBookmarkCount(0)
          },
        },
      ]
    )
  }

  function handlePickLanguage() {
    // iOS supports up to ~8 options in Alert, show in chunks or use a modal approach
    // Simple approach: show all 9 with cancel
    Alert.alert(
      'Select Language',
      'Content will be filtered by your chosen language.',
      [
        ...LANGUAGES.map((l) => ({
          text: `${l.flag}  ${l.localLabel}${lang === l.code ? '  ✓' : ''}`,
          onPress: () => setLang(l.code as Lang),
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ]
    )
  }

  function handleNotificationTime() {
    Alert.alert(
      'Notification Time',
      'Daily digest delivery time:',
      [
        ...NOTIFICATION_HOURS.map((h) => ({
          text: `${String(h).padStart(2, '0')}:00${notificationHour === h ? '  ✓' : ''}`,
          onPress: () => setNotificationTime(h, 0),
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ]
    )
  }

  function openURL(url: string) {
    Linking.openURL(url).catch(() => Alert.alert('Could not open link'))
  }

  const hourLabel = `${String(notificationHour).padStart(2, '0')}:${String(notificationMinute).padStart(2, '0')}`

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero card ── */}
      <LinearGradient
        colors={['#0A0A0A', '#1a1a2e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        {/* Accent glow */}
        <View style={styles.heroGlow} />

        <View style={styles.heroBrand}>
          <View style={styles.heroDot} />
          <Text style={styles.heroBrandText}>PulseWire</Text>
        </View>
        <Text style={styles.heroTagline}>Global News · Local Insight</Text>

        {/* User info */}
        {user ? (
          <View style={styles.userRow}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {(user.displayName || user.email)[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.displayName || 'Reader'}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => router.push('/auth' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="person-outline" size={16} color="#fff" />
            <Text style={styles.signInBtnText}>Sign in to sync bookmarks</Text>
            <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        )}

        {/* Stats row */}
        <View style={styles.statsWrap}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{bookmarkCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentLang?.flag ?? '🌐'}</Text>
            <Text style={styles.statLabel}>{currentLang?.label ?? 'English'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {textSize === 'small' ? 'Aa' : textSize === 'large' ? 'AA' : 'Aa'}
            </Text>
            <Text style={styles.statLabel}>{textSize.charAt(0).toUpperCase() + textSize.slice(1)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Language ── */}
      <Section title="LANGUAGE">
        <Row
          icon="globe-outline"
          iconBg="#457B9D"
          label="Content Language"
          value={`${currentLang?.flag} ${currentLang?.localLabel}`}
          onPress={handlePickLanguage}
          last
        />
      </Section>

      {/* ── Reading ── */}
      <Section title="READING">
        {/* Text size — visual selector */}
        <View style={[styles.row, styles.rowBorder]}>
          <View style={[styles.iconBox, { backgroundColor: '#8338EC' }]}>
            <Ionicons name="text-outline" size={17} color="#fff" />
          </View>
          <Text style={styles.rowLabel}>Text Size</Text>
          <View style={styles.sizeGroup}>
            {TEXT_SIZE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.sizeBtn, textSize === opt.value && styles.sizeBtnActive]}
                onPress={() => setTextSize(opt.value)}
              >
                <Text style={[
                  styles.sizeBtnText,
                  { fontSize: opt.size },
                  textSize === opt.value && styles.sizeBtnTextActive,
                ]}>
                  Aa
                </Text>
                <Text style={[styles.sizeBtnLabel, textSize === opt.value && styles.sizeBtnLabelActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Row
          icon="bookmark-outline"
          iconBg={Colors.accent}
          label="Saved Articles"
          value={`${bookmarkCount}`}
          onPress={bookmarkCount > 0 ? handleClearBookmarks : undefined}
          last
        />
      </Section>

      {/* ── Notifications ── */}
      <Section title="NOTIFICATIONS">
        <View style={[styles.row, styles.rowBorder]}>
          <View style={[styles.iconBox, { backgroundColor: '#FF9500' }]}>
            <Ionicons name="notifications-outline" size={17} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>Daily Digest</Text>
            <Text style={styles.rowSub}>Get today's top stories every morning</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E5E7EB', true: Colors.accent + 'AA' }}
            thumbColor={notificationsEnabled ? Colors.accent : '#fff'}
            ios_backgroundColor="#E5E7EB"
          />
        </View>
        {notificationsEnabled && (
          <Row
            icon="time-outline"
            iconBg="#FF9500"
            label="Delivery Time"
            value={hourLabel}
            onPress={handleNotificationTime}
            last
          />
        )}
      </Section>

      {/* ── Account ── */}
      {user ? (
        <Section title="ACCOUNT">
          <Row
            icon="person-outline"
            iconBg="#457B9D"
            label={user.displayName || 'Reader'}
            value={user.email}
            last={false}
          />
          <Row
            icon="log-out-outline"
            iconBg={Colors.accent}
            label="Sign Out"
            onPress={handleSignOut}
            last
          />
        </Section>
      ) : (
        <Section title="ACCOUNT">
          <Row
            icon="person-add-outline"
            iconBg="#34C759"
            label="Sign in / Register"
            value="Sync bookmarks"
            onPress={() => router.push('/auth' as any)}
            last
          />
        </Section>
      )}

      {/* ── About ── */}
      <Section title="ABOUT">
        <Row icon="information-circle-outline" iconBg={Colors.secondary} label="Version" value="1.0.0" last={false} />
        <Row
          icon="shield-checkmark-outline" iconBg="#34C759" label="Privacy Policy"
          onPress={() => openURL('https://pulsewire.news/privacy')} last={false}
        />
        <Row
          icon="newspaper-outline" iconBg="#8338EC" label="Editorial Policy"
          onPress={() => openURL('https://pulsewire.news/editorial')} last={false}
        />
        <Row
          icon="star-outline" iconBg="#FF9500" label="Rate PulseWire"
          onPress={() => openURL(
            Platform.OS === 'ios'
              ? 'https://apps.apple.com/app/id0'
              : 'https://play.google.com/store/apps/details?id=news.pulsewire.app'
          )}
          last
        />
      </Section>

      <Text style={styles.footer}>Made with ❤️  for curious minds</Text>
    </ScrollView>
  )
}

const CARD_RADIUS = 16

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { paddingBottom: 52 },

  /* Hero */
  hero: {
    margin: 16,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    gap: 4,
  },
  heroGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.accent,
    opacity: 0.08,
    top: -60,
    right: -60,
  },
  heroBrand: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  heroDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.accent },
  heroBrandText: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  heroTagline: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12, letterSpacing: 0.3 },

  /* User info in hero */
  userRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12, padding: 12, marginBottom: 12,
  },
  userAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  userAvatarText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '700', color: '#fff' },
  userEmail: { fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 1 },

  /* Sign in button */
  signInBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  signInBtnText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#fff' },

  statsWrap: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingVertical: 16,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '600', letterSpacing: 0.5 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.08)', alignSelf: 'center' },

  /* Sections */
  section: { marginBottom: 0 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: '#8E8E93',
    letterSpacing: 0.6, marginBottom: 8, marginTop: 20, paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  /* Rows */
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13, gap: 12, minHeight: 54,
  },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5EA' },
  iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  rowLabel: { flex: 1, fontSize: 15, color: '#000', fontWeight: '500' },
  rowSub: { fontSize: 12, color: '#8E8E93', marginTop: 1 },
  rowValue: { fontSize: 14, color: '#8E8E93', marginRight: 4 },

  /* Text size selector */
  sizeGroup: { flexDirection: 'row', gap: 8 },
  sizeBtn: {
    width: (width - 32 - 16 - 32 - 12 - 12 - 24) / 3,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 2,
  },
  sizeBtnActive: { borderColor: Colors.accent, backgroundColor: Colors.accent + '10' },
  sizeBtnText: { fontWeight: '700', color: '#8E8E93', lineHeight: 22 },
  sizeBtnTextActive: { color: Colors.accent },
  sizeBtnLabel: { fontSize: 9, color: '#8E8E93', fontWeight: '600' },
  sizeBtnLabelActive: { color: Colors.accent },

  /* Language check inside picker row */
  checkCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center',
  },

  footer: {
    textAlign: 'center', color: '#8E8E93',
    fontSize: 12, marginTop: 32, marginBottom: 4,
  },
})
