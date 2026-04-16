import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { BookingCard } from '@/components/BookingCard';
import { Bell, Star, Briefcase, Wallet, TrendingUp, Clock, CircleCheck as CheckCircle, Phone, MessageSquare } from 'lucide-react-native';
import { MOCK_BOOKINGS, MOCK_WORKERS } from '@/lib/mockData';

export default function WorkerDashboardScreen() {
  const { profile, signOut } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const worker = MOCK_WORKERS[0];

  const pendingJobs = MOCK_BOOKINGS.filter(b => b.status === 'pending');
  const activeJobs = MOCK_BOOKINGS.filter(b => b.status === 'accepted' || b.status === 'in_progress');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Namaste!</Text>
              <Text style={styles.name}>{profile?.full_name || 'Worker'}</Text>
              <Text style={styles.category}>{worker.category_name}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notifBtn}>
            <Bell size={22} color={Colors.white} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.availabilityCard}>
          <View style={styles.availabilityLeft}>
            <View style={[styles.statusDot, { backgroundColor: isAvailable ? Colors.accent : Colors.gray400 }]} />
            <View>
              <Text style={styles.availabilityTitle}>{isAvailable ? 'Available for Work' : 'Currently Busy'}</Text>
              <Text style={styles.availabilitySub}>{isAvailable ? 'Customers aapko book kar sakte hain' : 'Aap abhi busy hain'}</Text>
            </View>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: Colors.gray300, true: Colors.accent }}
            thumbColor={Colors.white}
          />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.statsGrid}>
          {[
            { label: 'Total Earnings', value: `₹${(worker.total_earnings / 1000).toFixed(0)}K`, icon: <TrendingUp size={20} color={Colors.accent} />, bg: Colors.accentSoft },
            { label: 'Total Jobs', value: worker.total_jobs.toString(), icon: <Briefcase size={20} color={Colors.primary} />, bg: Colors.primarySoft },
            { label: 'Rating', value: worker.rating.toFixed(1), icon: <Star size={20} color='#F59E0B' />, bg: '#FFFBEB' },
            { label: 'Wallet', value: `₹${worker.wallet_balance.toLocaleString()}`, icon: <Wallet size={20} color='#8B5CF6' />, bg: '#F5F3FF' },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: stat.bg }, Shadow.sm]}>
              <View style={styles.statIcon}>{stat.icon}</View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {pendingJobs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.urgentDot} />
                <Text style={styles.sectionTitle}>New Job Requests</Text>
              </View>
              <Text style={styles.pendingCount}>{pendingJobs.length} pending</Text>
            </View>
            {pendingJobs.map((booking) => (
              <View key={booking.id} style={styles.jobRequestCard}>
                <View style={styles.jobRequestHeader}>
                  <Image
                    source={{ uri: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=200' }}
                    style={styles.customerAvatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.customerName}>Customer</Text>
                    <Text style={styles.jobDescription} numberOfLines={1}>{booking.problem_description}</Text>
                  </View>
                  <Text style={styles.jobTime}>{booking.scheduled_time}</Text>
                </View>
                <View style={styles.jobDate}>
                  <Clock size={12} color={Colors.textSecondary} />
                  <Text style={styles.jobDateText}>{booking.scheduled_date}</Text>
                </View>
                <View style={styles.jobActions}>
                  <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.85}>
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.acceptBtn} activeOpacity={0.85}>
                    <CheckCircle size={16} color={Colors.white} />
                    <Text style={styles.acceptBtnText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeJobs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Jobs</Text>
            {activeJobs.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onPress={() => router.push(`/booking/${booking.id}`)}
                isWorkerView
              />
            ))}
          </View>
        )}

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              { label: 'View Jobs', icon: '📋', onPress: () => {} },
              { label: 'My Earnings', icon: '💰', onPress: () => {} },
              { label: 'Update Profile', icon: '✏️', onPress: () => {} },
              { label: 'Chat', icon: '💬', onPress: () => {} },
            ].map((action, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.quickActionCard, Shadow.sm]}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <Text style={styles.quickActionEmoji}>{action.icon}</Text>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.accent,
    paddingTop: 52,
    paddingBottom: Spacing.xl + 8,
    paddingHorizontal: Spacing.md,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  greeting: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)' },
  name: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
  category: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)' },
  notifBtn: { position: 'relative' },
  notifDot: { position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  availabilityCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  availabilityLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  availabilityTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
  availabilitySub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.75)' },
  body: { padding: Spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md, marginTop: -28 },
  statCard: {
    width: '47.5%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  statIcon: { marginBottom: Spacing.sm },
  statValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  section: { marginBottom: Spacing.lg },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  urgentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  pendingCount: { fontSize: FontSize.sm, color: '#EF4444', fontWeight: '700', backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  jobRequestCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm },
  jobRequestHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  customerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.gray200 },
  customerName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  jobDescription: { fontSize: FontSize.xs, color: Colors.textSecondary },
  jobTime: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.primary },
  jobDate: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.md, paddingLeft: 52 },
  jobDateText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  jobActions: { flexDirection: 'row', gap: Spacing.sm },
  rejectBtn: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.error,
    alignItems: 'center',
  },
  rejectBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.error },
  acceptBtn: {
    flex: 2, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: Colors.accent,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  acceptBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white },
  quickActions: { marginBottom: Spacing.xl },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  quickActionCard: {
    width: '47.5%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  quickActionEmoji: { fontSize: 28, marginBottom: Spacing.sm },
  quickActionLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
});
