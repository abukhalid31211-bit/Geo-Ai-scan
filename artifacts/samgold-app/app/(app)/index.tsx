import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SAMGOLD_COLORS } from '@/constants/colors';

export default function AppIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SAMGOLD</Text>
      <Text style={styles.subtitle}>مرحباً بك</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAMGOLD_COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: SAMGOLD_COLORS.primary,
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: SAMGOLD_COLORS.muted,
  },
});
