import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { Users, Briefcase, ClipboardList, TrendingUp, CircleCheck as CheckCircle, X, Ban, Star, Bell, Settings, LogOut, ShieldCheck, Eye, Search } from 'lucide-react-native';
import { MOCK_WORKERS, MOCK_BOOKINGS } from '@/lib/mockData';

const ADMIN_EMAIL = 'ss@777888';

export default function AdminDashboardScreen() {
  const { signOut } = useAuth();
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<'overview' | 'workers' | 'bookings' | 'customers'>('overview');

  const handleAdminLogin = () => {
    if (email === 'ss@777888' && password === '777888') {
      setLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials. Email: ss@777888, Password: 777888');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  if (!loggedIn) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <View style={styles.adminIcon}>
            <ShieldCheck size={36} color={Colors.white} />
          </View>
          <Text style={styles.loginTitle}>Admin Login</Text>
          <Text style={styles.loginSub}>Fixkar Rojgaar Admin Panel</Text>

          {error ? <Text style={styles.loginError}>{error}</Text> : null}

          <TextInput
            style={styles.loginInput}
            placeholder="Admin Email"
            placeholderTextColor={Colors.gray400}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.loginInput}
            placeholder="Password"
            placeholderTextColor={Colors.gray400}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.loginBtn} onPress={handleAdminLogin} activeOpacity={0.85}>
            <ShieldCheck size={18} color={Colors.white} />
            <Text style={styles.loginBtnText}>Admin Login</Text>
          </TouchableOpacity>
          <Text style={styles.hintText}>Hint: ss@777888 / 777888</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: Spacing.md }}>
            <Text style={{ fontSize: FontSize.sm, color: Colors.textSecondary }}>← Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const pendingWorkers = MOCK_WORKERS.filter(w => !w.is_approved);
  const approvedWorkers = MOCK_WORKERS.filter(w => w.is_approved);
  const totalBookings = MOCK_BOOKINGS.length;
  const completedBookings = MOCK_BOOKINGS.filter(b => b.status === 'completed').length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSub}>Fixkar Rojgaar Control</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutBtn}>
          <LogOut size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.navTabs}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'workers', label: 'Workers' },
          { key: 'bookings', label: 'Bookings' },
          { key: 'customers', label: 'Customers' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.navTab, activeSection === tab.key && styles.navTabActive]}
            onPress={() => setActiveSection(tab.key as any)}
          >
            <Text style={[styles.navTabText, activeSection === tab.key && styles.navTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {activeSection === 'overview' && (
          <View>
            <View style={styles.statsGrid}>
              {[
                { label: 'Total Workers', value: MOCK_WORKERS.length, icon: '👷', color: Colors.primary },
                { label: 'Total Bookings', value: totalBookings, icon: '📋', color: Colors.accent },
                { label: 'Customers', value: '1,240', icon: '👥', color: '#F97316' },
                { label: 'Revenue', value: '₹42K', icon: '💰', color: '#8B5CF6' },
                { label: 'Pending Approvals', value: pendingWorkers.length, icon: '⏳', color: '#F59E0B' },
                { label: 'Completed', value: completedBookings, icon: '✅', color: Colors.accent },
              ].map((stat, i) => (
                <View key={i} style={[styles.statCard, Shadow.sm]}>
                  <Text style={styles.statEmoji}>{stat.icon}</Text>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionGrid}>
                {[
                  { label: 'Approve Workers', emoji: '✅', color: Colors.accentSoft },
                  { label: 'Send Notification', emoji: '🔔', color: Colors.primarySoft },
                  { label: 'Manage Categories', emoji: '📂', color: '#FFF7ED' },
                  { label: 'View Reports', emoji: '📊', color: '#F5F3FF' },
                  { label: 'Banner Ads', emoji: '🎯', color: '#FFFBEB' },
                  { label: 'Export Data', emoji: '📤', color: Colors.gray100 },
                ].map((a, i) => (
                  <TouchableOpacity key={i} style={[styles.actionCard, { backgroundColor: a.color }]} activeOpacity={0.8}>
                    <Text style={styles.actionEmoji}>{a.emoji}</Text>
                    <Text style={styles.actionLabel}>{a.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Analytics</Text>
              <View style={[styles.analyticsCard, Shadow.sm]}>
                {[
                  { label: 'Avg. Rating', value: '4.7 ⭐' },
                  { label: 'New Workers This Month', value: '12' },
                  { label: 'Bookings This Month', value: '89' },
                  { label: 'Revenue This Month', value: '₹8,400' },
                ].map((item, i) => (
                  <View key={i} style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>{item.label}</Text>
                    <Text style={styles.analyticsValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeSection === 'workers' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Worker Management</Text>
            {pendingWorkers.length > 0 && (
              <View style={styles.pendingSection}>
                <Text style={styles.pendingTitle}>⏳ Pending Approval ({pendingWorkers.length})</Text>
                {pendingWorkers.map((w) => (
                  <WorkerAdminCard key={w.id} worker={w} />
                ))}
              </View>
            )}
            <Text style={styles.approvedTitle}>✅ Approved Workers ({approvedWorkers.length})</Text>
            {approvedWorkers.map((w) => (
              <WorkerAdminCard key={w.id} worker={w} approved />
            ))}
          </View>
        )}

        {activeSection === 'bookings' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Bookings</Text>
            {MOCK_BOOKINGS.map((booking) => (
              <View key={booking.id} style={[styles.bookingAdminCard, Shadow.sm]}>
                <View style={styles.bookingAdminHeader}>
                  <Text style={styles.bookingId}>#{booking.id.substring(0, 8)}</Text>
                  <View style={[styles.statusPill, { backgroundColor: booking.status === 'completed' ? Colors.accentSoft : Colors.primarySoft }]}>
                    <Text style={[styles.statusPillText, { color: booking.status === 'completed' ? Colors.accent : Colors.primary }]}>
                      {booking.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.bookingDesc} numberOfLines={1}>{booking.problem_description}</Text>
                <Text style={styles.bookingMeta}>{booking.scheduled_date} • {booking.city}</Text>
              </View>
            ))}
          </View>
        )}

        {activeSection === 'customers' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Management</Text>
            {[
              { name: 'Amit Verma', phone: '+91 98765 43210', bookings: 3, city: 'Delhi' },
              { name: 'Priya Singh', phone: '+91 87654 32109', bookings: 7, city: 'Noida' },
              { name: 'Raj Kumar', phone: '+91 76543 21098', bookings: 2, city: 'Delhi' },
              { name: 'Sunita Devi', phone: '+91 65432 10987', bookings: 5, city: 'Gurgaon' },
            ].map((customer, i) => (
              <View key={i} style={[styles.customerCard, Shadow.sm]}>
                <View style={styles.customerAvatar}>
                  <Text style={styles.customerAvatarText}>{customer.name.charAt(0)}</Text>
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <Text style={styles.customerPhone}>{customer.phone}</Text>
                  <Text style={styles.customerMeta}>{customer.bookings} bookings • {customer.city}</Text>
                </View>
                <View style={styles.customerActions}>
                  <TouchableOpacity style={styles.banBtn} activeOpacity={0.8}>
                    <Ban size={14} color='#EF4444' />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function WorkerAdminCard({ worker, approved = false }: { worker: any; approved?: boolean }) {
  return (
    <View style={[workerCardStyles.card, Shadow.sm]}>
      <Image source={{ uri: worker.profiles?.avatar_url }} style={workerCardStyles.avatar} />
      <View style={workerCardStyles.info}>
        <Text style={workerCardStyles.name}>{worker.profiles?.full_name}</Text>
        <Text style={workerCardStyles.category}>{worker.category_name} • {worker.experience_years} yrs</Text>
        <Text style={workerCardStyles.city}>{worker.city}</Text>
      </View>
      {!approved ? (
        <View style={workerCardStyles.actions}>
          <TouchableOpacity style={workerCardStyles.approveBtn}>
            <CheckCircle size={16} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={workerCardStyles.rejectBtn}>
            <X size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={workerCardStyles.viewBtn}>
          <Eye size={16} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const workerCardStyles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.gray200 },
  info: { flex: 1 },
  name: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text },
  category: { fontSize: FontSize.xs, color: Colors.primary },
  city: { fontSize: FontSize.xs, color: Colors.textSecondary },
  actions: { flexDirection: 'row', gap: 6 },
  approveBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  rejectBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  viewBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  loginContainer: { flex: 1, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  loginCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.xl, width: '100%', maxWidth: 400, alignItems: 'center', ...Shadow.lg },
  adminIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.dark, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  loginTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text },
  loginSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  loginError: { fontSize: FontSize.sm, color: Colors.error, backgroundColor: Colors.errorSoft, padding: Spacing.sm, borderRadius: Radius.md, marginBottom: Spacing.md, width: '100%', textAlign: 'center' },
  loginInput: {
    width: '100%', height: 52, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md, fontSize: FontSize.base,
    color: Colors.text, marginBottom: Spacing.md, backgroundColor: Colors.gray50,
  },
  loginBtn: {
    width: '100%', height: 52, backgroundColor: Colors.dark, borderRadius: Radius.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
  },
  loginBtnText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
  hintText: { fontSize: FontSize.xs, color: Colors.textLight, marginTop: Spacing.sm },
  header: {
    backgroundColor: Colors.dark,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)' },
  logoutBtn: { padding: Spacing.sm },
  navTabs: { flexDirection: 'row', backgroundColor: Colors.gray900, paddingHorizontal: Spacing.sm },
  navTab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  navTabActive: { borderBottomWidth: 2, borderBottomColor: Colors.accent },
  navTabText: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
  navTabTextActive: { color: Colors.accent, fontWeight: '700' },
  body: { flex: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, padding: Spacing.md },
  statCard: {
    width: '30.5%', backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.sm + 4, alignItems: 'center',
  },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: FontSize.lg, fontWeight: '800' },
  statLabel: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center', marginTop: 2 },
  section: { padding: Spacing.md, paddingBottom: 0 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  actionCard: { width: '47.5%', borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', gap: 6 },
  actionEmoji: { fontSize: 28 },
  actionLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  analyticsCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md },
  analyticsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  analyticsLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  analyticsValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  pendingSection: { marginBottom: Spacing.md },
  pendingTitle: { fontSize: FontSize.base, fontWeight: '700', color: '#F59E0B', marginBottom: Spacing.sm },
  approvedTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.accent, marginBottom: Spacing.sm },
  bookingAdminCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm },
  bookingAdminHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  bookingId: { fontSize: FontSize.xs, color: Colors.textSecondary, fontFamily: 'monospace' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  statusPillText: { fontSize: FontSize.xs, fontWeight: '700' },
  bookingDesc: { fontSize: FontSize.sm, color: Colors.text, marginBottom: 2 },
  bookingMeta: { fontSize: FontSize.xs, color: Colors.textSecondary },
  customerCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm },
  customerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  customerAvatarText: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.white },
  customerInfo: { flex: 1 },
  customerName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text },
  customerPhone: { fontSize: FontSize.xs, color: Colors.textSecondary },
  customerMeta: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '500' },
  customerActions: {},
  banBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.errorSoft, alignItems: 'center', justifyContent: 'center' },
});
