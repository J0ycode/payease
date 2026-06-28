import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { formatCurrency } from '../utils/formatters';

const COLORS = {
  navy: '#0A1628',
  blue: '#3B82F6',
  green: '#10B981',
  white: '#FFFFFF',
  muted: '#6B7280',
  border: '#E5E7EB',
  bg: '#F9FAFB',
  error: '#EF4444',
};

export default function PaymentForm({
  accountNumber,
  emiDue,
  onSubmit,
  loading,
}) {
  const [amount, setAmount] = useState(String(emiDue || ''));
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const parsed = Number(amount);

    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid amount greater than ₹0');
      return;
    }

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Confirm Payment\n\nPay ${formatCurrency(parsed)} for account ${accountNumber}?`);
      if (confirmed) {
        setError('');
        onSubmit(parsed);
      }
      return;
    }

    Alert.alert(
      'Confirm Payment',
      `Pay ${formatCurrency(parsed)} for account ${accountNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'default',
          onPress: () => {
            setError('');
            onSubmit(parsed);
          },
        },
      ]
    );
  };

  return (
    <View>
      {/* Account Number (read-only) */}
      <Text style={styles.label}>Account Number</Text>
      <TextInput
        style={[styles.input, styles.readOnly]}
        value={accountNumber}
        editable={false}
        selectTextOnFocus={false}
      />

      {/* EMI Amount */}
      <Text style={styles.label}>EMI Amount (₹)</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={amount}
        onChangeText={(t) => {
          setAmount(t);
          if (error) setError('');
        }}
        keyboardType="numeric"
        placeholder={`Due: ${formatCurrency(emiDue)}`}
        placeholderTextColor={COLORS.muted}
      />

      {/* Hint */}
      <Text style={styles.hint}>
        Suggested EMI: <Text style={styles.hintAmount}>{formatCurrency(emiDue)}</Text>
      </Text>

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Payment</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: COLORS.muted,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: COLORS.navy,
    marginBottom: 4,
    backgroundColor: COLORS.white,
  },
  readOnly: {
    backgroundColor: COLORS.bg,
    color: COLORS.muted,
    marginBottom: 14,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  hint: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 10,
    marginTop: 2,
  },
  hintAmount: {
    color: COLORS.green,
    fontWeight: '700',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.green,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
