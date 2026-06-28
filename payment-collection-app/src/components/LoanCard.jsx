import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency, formatDate } from '../utils/formatters';

const COLORS = {
  navy: '#0A1628',
  blue: '#3B82F6',
  blueMuted: '#93C5FD',
  divider: '#1E2D4A',
  label: '#94A3B8',
  value: '#F1F5F9',
  badge: '#10B981',
};

const Row = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default function LoanCard({ customer }) {
  const rows = [
    { label: 'Account Number', value: customer.accountNumber },
    { label: 'Customer Name', value: customer.customerName },
    { label: 'Issue Date', value: formatDate(customer.issueDate) },
    { label: 'Interest Rate', value: `${customer.interestRate}% p.a.` },
    { label: 'Tenure', value: `${customer.tenure} months` },
    { label: 'EMI Due', value: formatCurrency(customer.emiDue) },
    { label: 'Loan Amount', value: formatCurrency(customer.loanAmount) },
    {
      label: 'Outstanding Balance',
      value: formatCurrency(
        customer.outstandingBalance !== undefined
          ? customer.outstandingBalance
          : customer.loanAmount
      ),
    },
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>🏦 Loan Details</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{customer.status?.toUpperCase()}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* EMI highlight */}
      <View style={styles.emiHighlight}>
        <Text style={styles.emiLabel}>Monthly EMI</Text>
        <Text style={styles.emiAmount}>{formatCurrency(customer.emiDue)}</Text>
      </View>

      <View style={styles.divider} />

      {/* Detail rows */}
      {rows.map((row) => (
        <Row key={row.label} label={row.label} value={row.value} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.navy,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.blueMuted,
  },
  badge: {
    backgroundColor: COLORS.badge,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
  emiHighlight: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  emiLabel: {
    color: COLORS.label,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  emiAmount: {
    color: '#34D399',
    fontSize: 32,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  label: {
    color: COLORS.label,
    fontSize: 13,
    flex: 1,
  },
  value: {
    color: COLORS.value,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
});
