import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { TrendingUp, ArrowDownLeft, ArrowUpRight, Wallet, ChevronRight } from 'lucide-react-native';
import { MOCK_WORKERS, MOCK_TRANSACTIONS } from '@/lib/mockData';

export default function EarningsScreen() {
  const worker = MOCK_WORKERS[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
        <Text style={styles.headerSub}>Kamaai</Text>
      </View>

      <View style={styles.walletCard}>
        <View style={styles.walletTop}>
          <View>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletBalance}>₹{worker.wallet_balance.toLocaleString()}</Text>
          </View>
          <Wallet size={32} color='rgba(255,255,255,0.5)' />
        </View>
        <TouchableOpacity style={styles.withdrawBtn} activeOpacity={0.85}>
          <ArrowUpRight size={18} color={Colors.accent} />
          <Text style={styles.withdrawBtnText}>Withdraw to Bank</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {[
          { label: 'Total Earned', value: `₹${(worker.total_earnings / 1000).toFixed(0)}K`, color: Colors.accent },
          { label: 'This Month', value: '₹8,200', color: Colors.primary },
          { label: 'Total Jobs', value: worker.total_jobs.toString(), color: '#F59E0B' },
        ].map((s, i) => (
          <View key={i} style={[styles.miniStat, Shadow.sm]}>
            <Text style={[styles.miniStatValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.miniStatLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>
        {MOCK_TRANSACTIONS.map((tx) => (
          <View key={tx.id} style={[styles.txCard, Shadow.sm]}>
            <View style={[styles.txIcon, { backgroundColor: tx.type === 'credit' || tx.type === 'bonus' ? Colors.accentSoft : '#FEF2F2' }]}>
              {tx.amount > 0 ? (
                <ArrowDownLeft size={20} color={Colors.accent} />
              ) : (
                <ArrowUpRight size={20} color='#EF4444' />
              )}
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txDesc}>{tx.description}</Text>
              <Text style={styles.txDate}>{new Date(tx.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
            </View>
            <Text style={[styles.txAmount, { color: tx.amount > 0 ? Colors.accent : '#EF4444' }]}>
              {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.planCard}>
        <Text style={styles.planEmoji}>⭐</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.planTitle}>Premium Listing</Text>
          <Text style={styles.planSub}>Featured ban ke zyada customers pao</Text>
        </View>
        <ChevronRight size={20} color={Colors.primary} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.accent,
    paddingTop: 52,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)' },
  walletCard: {
    backgroundColor: Colors.primary,
    margin: Spacing.md,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.lg,
  },
  walletTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  walletLabel: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  walletBalance: { fontSize: 36, fontWeight: '800', color: Colors.white },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    alignSelf: 'flex-start',
  },
  withdrawBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.accent },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  miniStat: { flex: 1, backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center' },
  miniStatValue: { fontSize: FontSize.lg, fontWeight: '800' },
  miniStatLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, textAlign: 'center' },
  section: { paddingHorizontal: Spacing.md, marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  seeAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  txCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  txIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txDesc: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: 2 },
  txDate: { fontSize: FontSize.xs, color: Colors.textSecondary },
  txAmount: { fontSize: FontSize.base, fontWeight: '800' },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.primarySoft,
    margin: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    marginBottom: 48,
  },
  planEmoji: { fontSize: 28 },
  planTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.primary },
  planSub: { fontSize: FontSize.xs, color: Colors.textSecondary },
});
