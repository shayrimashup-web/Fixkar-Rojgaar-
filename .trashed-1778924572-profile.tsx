import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { User, Bell, Heart, Shield, Circle as HelpCircle, LogOut, ChevronRight, Settings, Star, Wallet, MapPin, CreditCard as Edit2, Phone } from 'lucide-react-native';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: <Edit2 size={20} color={Colors.primary} />, label: 'Edit Profile', sub: 'Naam, photo, address update karein', bg: Colors.primarySoft },
      { icon: <Bell size={20} color={Colors.warning} />, label: 'Notifications', sub: 'Notification settings', bg: Colors.warningSoft, onPress: '/notifications' },
      { icon: <Heart size={20} color='#EF4444' />, label: 'Saved Workers', sub: 'Favourite workers', bg: '#FFF1F0' },
    ],
  },
  {
    title: 'Services',
    items: [
      { icon: <Star size={20} color='#F59E0B' />, label: 'My Reviews', sub: 'Maine diye reviews', bg: '#FFFBEB' },
      { icon: <Wallet size={20} color={Colors.accent} />, label: 'Payments', sub: 'Transaction history', bg: Colors.accentSoft, onPress: '/wallet' },
      { icon: <MapPin size={20} color='#8B5CF6' />, label: 'Saved Addresses', sub: 'Ghar, office etc.', bg: '#F5F3FF' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: <Shield size={20} color={Colors.primary} />, label: 'Privacy Policy', sub: 'Data ki policy', bg: Colors.primarySoft },
      { icon: <HelpCircle size={20} color={Colors.accent} />, label: 'Help & Support', sub: 'Madad chahiye?', bg: Colors.accentSoft },
      { icon: <Settings size={20} color={Colors.gray600} />, label: 'App Settings', sub: 'Language, dark mode', bg: Colors.gray100 },
    ],
  },
];

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <User size={36} color={Colors.white} />
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Edit2 size={12} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{profile?.full_name || 'User'}</Text>
          <View style={styles.profileMeta}>
            <Phone size={13} color='rgba(255,255,255,0.75)' />
            <Text style={styles.profilePhone}>{profile?.phone || '+91 XXXXX XXXXX'}</Text>
          </View>
          <View style={styles.profileMeta}>
            <MapPin size={13} color='rgba(255,255,255,0.75)' />
            <Text style={styles.profileCity}>{profile?.city || 'Delhi'}</Text>
          </View>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{profile?.role === 'customer' ? 'Customer' : profile?.role}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        {[
          { value: '3', label: 'Bookings' },
          { value: '2', label: 'Reviews' },
          { value: '5', label: 'Saved' },
        ].map((stat, i) => (
          <View key={i} style={[styles.statCard, i < 2 && styles.statBorder]}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.body}>
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuItem, i < section.items.length - 1 && styles.menuItemBorder]}
                  onPress={() => item.onPress && router.push(item.onPress as any)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.menuIconBg, { backgroundColor: item.bg }]}>
                    {item.icon}
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                    <Text style={styles.menuItemSub}>{item.sub}</Text>
                  </View>
                  <ChevronRight size={18} color={Colors.gray400} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.85}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.signOutText}>Logout / Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Fixkar Rojgaar v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: { position: 'relative' },
  headerBg: {
    backgroundColor: Colors.primary,
    height: 180,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  avatarContainer: { position: 'relative', marginBottom: Spacing.sm },
  avatar: { width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: Colors.white, backgroundColor: Colors.gray300 },
  avatarPlaceholder: { backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  profileMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  profilePhone: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  profileCity: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)' },
  roleBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  roleText: { fontSize: FontSize.xs, color: Colors.white, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  statCard: { flex: 1, padding: Spacing.md, alignItems: 'center' },
  statBorder: { borderRightWidth: 1, borderRightColor: Colors.border },
  statValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  body: { paddingHorizontal: Spacing.md, paddingBottom: 48 },
  menuSection: { marginBottom: Spacing.md },
  menuSectionTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing.sm, paddingLeft: 4 },
  menuCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIconBg: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemContent: { flex: 1 },
  menuItemLabel: { fontSize: FontSize.base, fontWeight: '600', color: Colors.text },
  menuItemSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 1 },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorSoft,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  signOutText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.error },
  versionText: { fontSize: FontSize.xs, color: Colors.textLight, textAlign: 'center' },
});
