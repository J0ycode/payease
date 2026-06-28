import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { formatCurrency } from '../utils/formatters';

const COLORS = {
  bg: '#F0F4FF',
  navy: '#0A1628',
  blue: '#3B82F6',
  white: '#FFFFFF',
  muted: '#6B7280',
  border: '#E5E7EB',
  green: '#10B981',
};

export default function LoanCalculatorScreen({ navigation }) {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('12');
  const [tenure, setTenure] = useState('12');

  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);

  const calculateEMI = () => {
    const P = Number(principal);
    const annualRate = Number(rate);
    const N = Number(tenure);

    if (!P || !annualRate || !N) return;

    const R = annualRate / 12 / 100; // monthly interest rate
    
    // EMI formula: [P x R x (1+R)^N]/[((1+R)^N)-1]
    const emiAmount = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayableVal = emiAmount * N;
    const totalInterestVal = totalPayableVal - P;

    setEmi(Math.round(emiAmount));
    setTotalInterest(Math.round(totalInterestVal));
    setTotalPayment(Math.round(totalPayableVal));
  };

  // Calculate automatically on load/change
  React.useEffect(() => {
    calculateEMI();
  }, [principal, rate, tenure]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loan EMI Calculator</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Input Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Calculate EMI</Text>
          
          <Text style={styles.label}>Loan Amount (Principal)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={principal}
            onChangeText={setPrincipal}
            placeholder="e.g. 100000"
          />

          <Text style={styles.label}>Interest Rate (% p.a.)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rate}
            onChangeText={setRate}
            placeholder="e.g. 12"
          />

          <Text style={styles.label}>Tenure (Months)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={tenure}
            onChangeText={setTenure}
            placeholder="e.g. 12"
          />
        </View>

        {/* Results Card */}
        {emi !== null && (
          <View style={styles.resultsCard}>
            <View style={styles.emiHighlight}>
              <Text style={styles.emiLabel}>Monthly EMI</Text>
              <Text style={styles.emiValue}>{formatCurrency(emi)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.resLabel}>Principal Amount</Text>
              <Text style={styles.resValue}>{formatCurrency(principal)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.resLabel}>Total Interest</Text>
              <Text style={[styles.resValue, { color: '#F59E0B' }]}>
                {formatCurrency(totalInterest)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.resLabel}>Total Payment</Text>
              <Text style={[styles.resValue, { color: COLORS.green }]}>
                {formatCurrency(totalPayment)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.navy },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.navy,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  headerSpacer: { width: 36 },
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  cardTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  label: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: COLORS.navy,
    backgroundColor: '#FAFAFA',
  },
  resultsCard: {
    backgroundColor: COLORS.navy,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  emiHighlight: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  emiLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  emiValue: {
    color: '#34D399',
    fontSize: 32,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#1E2D4A',
    marginVertical: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  resLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },
  resValue: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
  },
});
