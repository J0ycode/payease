import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import LoanCard from '../components/LoanCard';
import PaymentForm from '../components/PaymentForm';
import api from '../api';

const COLORS = {
  bg: '#F0F4FF',
  navy: '#0A1628',
  blue: '#3B82F6',
  white: '#FFFFFF',
  muted: '#6B7280',
};

export default function LoanDetailScreen({ route, navigation }) {
  const { customer } = route.params;
  const [customerDetail, setCustomerDetail] = useState(customer);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCustomerDetail(customer);
  }, [customer]);

  const fetchCustomerDetails = useCallback(async () => {
    try {
      const { data } = await api.get(`/customers/${customer.accountNumber}`);
      setCustomerDetail(data.data);
    } catch (error) {
      console.error('Failed to refetch customer details:', error);
    }
  }, [customer.accountNumber]);

  useFocusEffect(
    useCallback(() => {
      fetchCustomerDetails();
    }, [fetchCustomerDetails])
  );

  const handlePayment = async (amount) => {
    setLoading(true);
    try {
      const { data } = await api.post('/payments', {
        accountNumber: customerDetail.accountNumber,
        paymentAmount: amount,
      });
      
      // Refresh local state before navigating
      await fetchCustomerDetails();
      
      navigation.navigate('Success', { payment: data.data });
    } catch (error) {
      if (Platform.OS === 'web') alert(`Payment Failed: ${error.message}`);
      else Alert.alert('Payment Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loan Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loan Info Card */}
        <LoanCard customer={customerDetail} />

        {/* Payment Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Make EMI Payment</Text>
          <PaymentForm
            accountNumber={customerDetail.accountNumber}
            emiDue={customerDetail.emiDue}
            onSubmit={handlePayment}
            loading={loading}
          />
        </View>

        {/* Payment History Link */}
        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() =>
            navigation.navigate('PaymentHistory', {
              accountNumber: customerDetail.accountNumber,
              customerName: customerDetail.customerName,
            })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.historyBtnText}>📋  View Payment History</Text>
        </TouchableOpacity>
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
  content: { padding: 20, paddingBottom: 50 },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  formTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 18,
  },
  historyBtn: {
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: COLORS.blue,
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
  },
  historyBtnText: {
    color: COLORS.blue,
    fontSize: 15,
    fontWeight: '700',
  },
});
