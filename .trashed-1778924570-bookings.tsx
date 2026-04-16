import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSize, Spacing, Radius } from '@/lib/theme';
import { BookingCard } from '@/components/BookingCard';
import { MOCK_BOOKINGS } from '@/lib/mockData';
import { BookingStatus } from '@/lib/types';
import { Plus, ClipboardList } from 'lucide-react-native';

const TABS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'accepted' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');

  const filtered = MOCK_BOOKINGS.filter(b =>
    activeTab === 'all' ? true : b.status === activeTab
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <Text style={styles.headerSub}>Meri Bookings</Text>
        </View>
        <TouchableOpacity
          style={styles.newBookingBtn}
          onPress={() => router.push('/(tabs)/categories')}
          activeOpacity={0.85}
        >
          <Plus size={18} color={Colors.white} />
          <Text style={styles.newBookingBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[styles.tab, activeTab === tab.value && styles.tabActive]}
              onPress={() => setActiveTab(tab.value)}
            >
              <Text style={[styles.tabText, activeTab === tab.value && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <ClipboardList size={40} color={Colors.gray400} />
            </View>
            <Text style={styles.emptyTitle}>Koi booking nahi</Text>
            <Text style={styles.emptySub}>Abhi koi worker book karein!</Text>
            <TouchableOpacity
              style={styles.bookNowBtn}
              onPress={() => router.push('/(tabs)/categories')}
              activeOpacity={0.85}
            >
              <Text style={styles.bookNowBtnText}>Worker Dhundhein</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPress={() => router.push(`/booking/${booking.id}`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)' },
  newBookingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  newBookingBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white },
  tabsContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabs: { paddingHorizontal: Spacing.md, gap: Spacing.sm, paddingVertical: Spacing.sm },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: Colors.white, fontWeight: '700' },
  list: { flex: 1 },
  listContent: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  emptyState: { alignItems: 'center', paddingVertical: 64 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  emptySub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xl },
  bookNowBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  bookNowBtnText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
});
