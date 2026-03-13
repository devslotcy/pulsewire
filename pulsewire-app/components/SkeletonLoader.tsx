import { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

function Bone({ style }: { style?: object }) {
  const shimmer = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start()
  }, [])

  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] })

  return <Animated.View style={[styles.bone, style, { opacity }]} />
}

export function HeroSkeleton() {
  return (
    <View style={styles.heroWrap}>
      <Bone style={styles.heroImage} />
      <View style={styles.heroContent}>
        <Bone style={styles.badgeSmall} />
        <Bone style={styles.titleLarge} />
        <Bone style={styles.titleMedium} />
        <Bone style={styles.timeSmall} />
      </View>
    </View>
  )
}

export function CardSkeleton() {
  return (
    <View style={styles.card}>
      <Bone style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Bone style={styles.badgeSmall} />
        <Bone style={styles.titleMedium} />
        <Bone style={styles.titleShort} />
        <Bone style={styles.timeSmall} />
      </View>
    </View>
  )
}

export function FeedSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <View style={styles.sectionBar} />
      {[0, 1, 2, 3].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  bone: {
    backgroundColor: '#D1D5DB',
    borderRadius: 6,
  },
  heroWrap: {
    position: 'relative',
    marginBottom: 4,
  },
  heroImage: {
    width: '100%',
    height: 260,
    borderRadius: 0,
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    gap: 8,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderRadius: 0,
  },
  cardContent: {
    padding: 12,
    gap: 6,
  },
  badgeSmall: { width: 70, height: 14 },
  titleLarge: { width: '90%', height: 20 },
  titleMedium: { width: '75%', height: 16 },
  titleShort: { width: '55%', height: 14 },
  timeSmall: { width: 60, height: 12 },
  sectionBar: {
    marginHorizontal: 16,
    marginVertical: 12,
    height: 24,
    width: 120,
    backgroundColor: '#D1D5DB',
    borderRadius: 6,
    opacity: 0.5,
  },
})
