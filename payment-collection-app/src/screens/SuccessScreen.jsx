import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const COLORS = {
  bg: '#F0FDF4',
  navy: '#0A1628',
  green: '#10B981',
  greenDark: '#065F46',
  greenLight: '#D1FAE5',
  blue: '#3B82F6',
  white: '#FFFFFF',
  muted: '#6B7280',
};

const DetailRow = ({ label, value, valueStyle, mono }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text
      style={[styles.detailValue, valueStyle, mono && styles.monoValue]}
      numberOfLines={2}
    >
      {value}
    </Text>
  </View>
);

export default function SuccessScreen({ navigation, route }) {
  const { payment } = route.params || {};

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    // Checkmark bounces in → content fades up
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  if (!payment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>No payment data found.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.linkText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView
        style={styles.safeArea}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* Animated checkmark */}
          <Animated.View style={[styles.checkContainer, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.checkOuter}>
              <View style={styles.checkInner}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
            </View>
          </Animated.View>

          {/* Animated content */}
          <Animated.View
            style={[
              styles.content,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successSubtitle}>
              Your EMI payment has been processed successfully.
            </Text>

            {/* Payment Details Card */}
            <View style={styles.detailsCard}>
              <DetailRow
                label="Amount Paid"
                value={formatCurrency(payment.paymentAmount)}
                valueStyle={styles.amountValue}
              />
              <View style={styles.separator} />
              <DetailRow label="Transaction ID" value={payment.transactionId} mono />
              <View style={styles.separator} />
              <DetailRow label="Account Number" value={payment.accountNumber} />
              <View style={styles.separator} />
              <DetailRow label="Date & Time" value={formatDateTime(payment.paymentDate)} />
              <View style={styles.separator} />
              <DetailRow
                label="Status"
                value={payment.status?.toUpperCase()}
                valueStyle={styles.statusValue}
              />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() =>
                  navigation.navigate('PaymentHistory', {
                    accountNumber: payment.accountNumber,
                  })
                }
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>View Payment History</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate('Home')}
                activeOpacity={0.75}
              >
                <Text style={styles.secondaryBtnText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  checkContainer: { marginBottom: 28 },
  checkOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  checkInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: { color: COLORS.white, fontSize: 36, fontWeight: '800' },
  content: { width: '100%', alignItems: 'center' },
  successTitle: {
    color: COLORS.greenDark,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  monoValue: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  amountValue: { color: COLORS.greenDark, fontSize: 16, fontWeight: '800' },
  statusValue: { color: COLORS.green, fontWeight: '700' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  actions: { width: '100%', gap: 12 },
  primaryBtn: {
    backgroundColor: COLORS.green,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  secondaryBtn: {
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: COLORS.white,
  },
  secondaryBtnText: { color: '#374151', fontSize: 15, fontWeight: '600' },
  errorText: { color: COLORS.muted, fontSize: 15, marginBottom: 12 },
  linkText: { color: COLORS.blue, fontSize: 15, fontWeight: '600' },
});
