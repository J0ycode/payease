import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { formatCurrency } from '../utils/formatters';

const COLORS = {
  green: '#10B981',
  greenLight: '#D1FAE5',
  navy: '#0A1628',
  white: '#FFFFFF',
  muted: '#6B7280',
  overlay: 'rgba(0,0,0,0.5)',
};

/**
 * Modal overlay shown after a successful payment.
 * Props:
 *   visible  — boolean
 *   payment  — { transactionId, paymentAmount, status }
 *   onClose  — callback when dismissed
 */
export default function ConfirmationModal({ visible, payment, onClose }) {
  if (!payment) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Checkmark */}
          <View style={styles.checkOuter}>
            <View style={styles.checkInner}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          </View>

          <Text style={styles.title}>Payment Confirmed!</Text>
          <Text style={styles.subtitle}>Your EMI has been received.</Text>

          {/* Amount */}
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Amount Paid</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(payment.paymentAmount)}
            </Text>
          </View>

          {/* TXN ID */}
          <View style={styles.txnBox}>
            <Text style={styles.txnLabel}>Transaction ID</Text>
            <Text style={styles.txnValue}>{payment.transactionId}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  checkOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  checkInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '800',
  },
  title: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 24,
  },
  amountBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  amountValue: {
    color: COLORS.green,
    fontSize: 28,
    fontWeight: '800',
  },
  txnBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  txnLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  txnValue: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: COLORS.green,
    borderRadius: 14,
    height: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
