import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const COLORS = {
  navy: '#0A1628',
  green: '#10B981',
  greenBg: '#D1FAE5',
  blue: '#3B82F6',
  muted: '#6B7280',
  border: '#F3F4F6',
  white: '#FFFFFF',
};

const statusColor = {
  success: { bg: '#D1FAE5', text: '#065F46' },
  pending: { bg: '#FEF3C7', text: '#92400E' },
  failed: { bg: '#FEE2E2', text: '#991B1B' },
};

export default function PaymentHistoryItem({ payment }) {
  const status = payment.status || 'success';
  const colors = statusColor[status] || statusColor.success;

  return (
    <View style={styles.card}>
      {/* Left: icon + meta */}
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>💳</Text>
        </View>
        <View>
          <Text style={styles.txnId} numberOfLines={1}>
            {payment.transactionId}
          </Text>
          <Text style={styles.date}>{formatDateTime(payment.paymentDate)}</Text>
        </View>
      </View>

      {/* Right: amount + status */}
      <View style={styles.right}>
        <Text style={styles.amount}>{formatCurrency(payment.paymentAmount)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
          <Text style={[styles.statusText, { color: colors.text }]}>
            {status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 18 },
  txnId: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 160,
  },
  date: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    color: COLORS.green,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
