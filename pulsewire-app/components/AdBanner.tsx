import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'

export function AdBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Advertisement</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: Colors.adBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: 11,
    color: Colors.textLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
})
