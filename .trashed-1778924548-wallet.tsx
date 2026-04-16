import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { ChevronLeft, Wallet, ArrowDownLeft, ArrowUpRight, CreditCard } from 'lucide-react-native';
import { MOCK_TRANSACTIONS } from '@/lib/mockData';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet & Payments</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.balanceCard}>
          <Wallet size={28} color='rgba(255,255,255,0.5)' />
          <Text style={styles.balanceLabel}>Total Spent</Text>
          <Text style={styles.balanceAmount}>₹1,250</Text>
          <Text style={styles.balanceSub}>3 bookings completed</Text>
        </View>

        <View style={styles.actionsRow}>
          {[
            { label: 'Add Money', emoji: '➕', color: Colors.primarySoft },
            { label: 'Offers', emoji: '🎁', color: Colors.accentSoft },
            { label: 'Referral', emoji: '👥', color: '#FFF7ED' },
          ].map((a, i) => (
            <TouchableOpacity key={i} style={[styles.actionBtn, { backgroundColor: a.color }]} activeOpacity={0.8}>
              <Text style={styles.actionEmoji}>{a.emoji}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          {[
            { desc: 'Electrician Booking - Ramesh Kumar', amount: -750, date: 'Jan 15, 2024', type: 'debit' },
            { desc: 'AC Repair Refund', amount: 200, date: 'Jan 10, 2024', type: 'credit' },
            { desc: 'Plumber Booking', amount: -500, date: 'Dec 28, 2023', type: 'debit' },
          ].map((tx, i) => (
            <View key={i} style={[styles.txCard, Shadow.sm]}>
              <View style={[styles.txIcon, { backgroundColor: tx.amount > 0 ? Colors.accentSoft : '#FEF2F2' }]}>
                {tx.amount > 0 ? (
                  <ArrowDownLeft size={20} color={Colors.accent} />
                ) : (
                  <ArrowUpRight size={20} color='#EF4444' />
                )}
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txDesc}>{tx.desc}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.amount > 0 ? Colors.accent : '#EF4444' }]}>
                {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.referralCard}>
          <Text style={styles.referralEmoji}>🎉</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.referralTitle}>Refer a Friend</Text>
            <Text style={styles.referralSub}>Dost ko refer karo, ₹50 pao har booking pe</Text>
          </View>
          <TouchableOpacity style={styles.referBtn} activeOpacity={0.85}>
            <Text style={styles.referBtnText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  backBtn: {},
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  content: { padding: Spacing.md, paddingBottom: 48 },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.lg,
  },
  balanceLabel: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginTop: Spacing.sm },
  balanceAmount: { fontSize: 44, fontWeight: '800', color: Colors.white },
  balanceSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.6)' },
  actionsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  actionBtn: { flex: 1, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', gap: 6 },
  actionEmoji: { fontSize: 24 },
  actionLabel: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.text },
  section: { marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md },
  txCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm,
  },
  txIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txDesc: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: 2 },
  txDate: { fontSize: FontSize.xs, color: Colors.textSecondary },
  txAmount: { fontSize: FontSize.base, fontWeight: '800' },
  referralCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.primarySoft, borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.primary + '20',
  },
  referralEmoji: { fontSize: 28 },
  referralTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.primary },
  referralSub: { fontSize: FontSize.xs, color: Colors.textSecondary },
  referBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  referBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white },
});
