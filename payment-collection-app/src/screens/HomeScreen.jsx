import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import api, { setAuthToken, clearAuthToken } from '../api';

const COLORS = {
  bg: '#F0F4FF',
  navy: '#0A1628',
  blue: '#3B82F6',
  blueDark: '#1D4ED8',
  white: '#FFFFFF',
  muted: '#6B7280',
  border: '#E5E7EB',
  card: '#FFFFFF',
};

export default function HomeScreen({ navigation }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    // Normalise to uppercase to match server-side regex validator (ACC001 etc.)
    const trimmed = accountNumber.trim().toUpperCase();
    if (!trimmed) {
      if (Platform.OS === 'web') alert('Required: Please enter your account number');
      else Alert.alert('Required', 'Please enter your account number');
      return;
    }
    setLoading(true);
    try {
      // Step 1 — authenticate: POST /api/auth/login → receive JWT scoped to this account
      const { data: authData } = await api.post('/auth/login', { accountNumber: trimmed });
      setAuthToken(authData.token);

      // Step 2 — fetch full customer details (Bearer token is now attached by interceptor)
      const { data } = await api.get(`/customers/${trimmed}`);
      navigation.navigate('LoanDetail', { customer: data.data });
    } catch (error) {
      clearAuthToken(); // Ensure no stale token is left on failure
      if (Platform.OS === 'web') alert(`Account Not Found: ${error.message}`);
      else Alert.alert('Account Not Found', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Logo / Brand */}
            <View style={styles.brand}>
              <Text style={styles.brandIcon}>🏦</Text>
              <Text style={styles.brandName}>PayEase</Text>
              <Text style={styles.brandTagline}>EMI Payment Portal</Text>
            </View>

            {/* Search Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>💳 Find Your Loan</Text>
              <Text style={styles.cardSubtitle}>
                Enter your loan account number to view details and make payments
              </Text>

              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. ACC001"
                placeholderTextColor={COLORS.muted}
                value={accountNumber}
                onChangeText={setAccountNumber}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSearch}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Search Account →</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.cardDivider} />

              {/* Calculator Link */}
              <TouchableOpacity
                style={styles.calcBtn}
                onPress={() => navigation.navigate('LoanCalculator')}
                activeOpacity={0.8}
              >
                <Text style={styles.calcBtnText}>🧮  Loan EMI Calculator</Text>
              </TouchableOpacity>
            </View>

            {/* Test accounts hint */}
            <View style={styles.hint}>
              <Text style={styles.hintTitle}>Test Accounts</Text>
              <View style={styles.hintRow}>
                {['ACC001', 'ACC002', 'ACC003'].map((acc) => (
                  <TouchableOpacity
                    key={acc}
                    style={styles.chip}
                    onPress={() => setAccountNumber(acc)}
                  >
                    <Text style={styles.chipText}>{acc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    paddingHorizontal: 24,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 36,
  },
  brandIcon: { fontSize: 52, marginBottom: 8 },
  brandName: {
    color: COLORS.navy,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandTagline: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 24,
  },
  cardTitle: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 22,
  },
  label: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.navy,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: COLORS.blue,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: { opacity: 0.65 },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    alignItems: 'center',
  },
  hintTitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '500',
  },
  hintRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: COLORS.blue,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipText: {
    color: COLORS.blue,
    fontSize: 13,
    fontWeight: '600',
  },
  calcBtn: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: COLORS.blue,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    width: '100%',
  },
  calcBtnText: {
    color: COLORS.blue,
    fontSize: 15,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
    width: '100%',
  },
});
