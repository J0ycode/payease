import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const COLORS = {
  blue: '#3B82F6',
  muted: '#6B7280',
  bg: '#F0F4FF',
};

/**
 * Full-screen loading spinner with optional message.
 */
export default function Spinner({ message = 'Loading...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.blue} />
      {message ? <Text style={styles.text}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  text: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '500',
  },
});
