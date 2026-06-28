import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentHistoryItem from '../components/PaymentHistoryItem';
import Spinner from '../components/Spinner';
import api from '../api';

const COLORS = {
  bg: '#F0F4FF',
  navy: '#0A1628',
  blue: '#3B82F6',
  white: '#FFFFFF',
  muted: '#6B7280',
};

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>📭</Text>
    <Text style={styles.emptyTitle}>No Payments Yet</Text>
    <Text style={styles.emptySubtitle}>Payment transactions will appear here once submitted.</Text>
  </View>
);

export default function PaymentHistoryScreen({ route, navigation }) {
  const { accountNumber, customerName } = route.params;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async () => {
    try {
      setError('');
      const { data } = await api.get(`/payments/${accountNumber}`);
      setPayments(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accountNumber]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  if (loading) return <Spinner message="Loading payment history..." />;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerMeta}>
          <Text style={styles.headerTitle}>Payment History</Text>
          {customerName && (
            <Text style={styles.headerSub}>{customerName} · {accountNumber}</Text>
          )}
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.body}>
        {/* Stats bar */}
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            {payments.length} transaction{payments.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>⚠️ Failed to load history</Text>
            <Text style={styles.errorMsg}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchHistory}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* List */}
        <FlatList
          data={payments}
          keyExtractor={(item) => item._id || item.transactionId}
          renderItem={({ item }) => <PaymentHistoryItem payment={item} />}
          ListEmptyComponent={!error ? <EmptyState /> : null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.blue}
            />
          }
        />
      </View>
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
  headerMeta: { alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  headerSpacer: { width: 36 },
  body: { flex: 1, backgroundColor: COLORS.bg },
  statsBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statsText: { color: COLORS.muted, fontSize: 13, fontWeight: '500' },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorTitle: { color: '#991B1B', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  errorMsg: { color: '#B91C1C', fontSize: 13, marginBottom: 12 },
  retryBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  retryText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
