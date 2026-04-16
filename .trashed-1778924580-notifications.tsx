import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { ChevronLeft, Bell, Check, CheckCheck, Trash2 } from 'lucide-react-native';
import { MOCK_NOTIFICATIONS } from '@/lib/mockData';
import { Notification } from '@/lib/types';

const TYPE_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  booking: { emoji: '📋', color: Colors.primary, bg: Colors.primarySoft },
  payment: { emoji: '💰', color: Colors.accent, bg: Colors.accentSoft },
  review: { emoji: '⭐', color: '#F59E0B', bg: '#FFFBEB' },
  general: { emoji: '📢', color: '#8B5CF6', bg: '#F5F3FF' },
  system: { emoji: '⚙️', color: Colors.gray600, bg: Colors.gray100 },
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={22} color={Colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && <Text style={styles.headerSub}>{unreadCount} unread</Text>}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <CheckCheck size={16} color='rgba(255,255,255,0.8)' />
            <Text style={styles.markAllText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <Bell size={48} color={Colors.gray300} />
            <Text style={styles.emptyTitle}>Koi notification nahi</Text>
            <Text style={styles.emptySub}>Nayi notifications yahan dikhein gi</Text>
          </View>
        ) : (
          notifications.map((notif) => {
            const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.general;
            return (
              <TouchableOpacity
                key={notif.id}
                style={[styles.notifCard, !notif.is_read && styles.notifCardUnread, Shadow.sm]}
                onPress={() => markRead(notif.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.iconBg, { backgroundColor: config.bg }]}>
                  <Text style={styles.iconEmoji}>{config.emoji}</Text>
                </View>
                <View style={styles.notifContent}>
                  <View style={styles.notifHeader}>
                    <Text style={styles.notifTitle}>{notif.title}</Text>
                    {!notif.is_read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifMessage}>{notif.message}</Text>
                  <Text style={styles.notifTime}>
                    {new Date(notif.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} •{' '}
                    {new Date(notif.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
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
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  backBtn: {},
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, flex: 1 },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.75)' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  markAllText: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  content: { padding: Spacing.md, paddingBottom: 48 },
  empty: { alignItems: 'center', paddingVertical: 64, gap: Spacing.md },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  emptySub: { fontSize: FontSize.sm, color: Colors.textSecondary },
  notifCard: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  iconBg: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconEmoji: { fontSize: 20 },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  notifTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginLeft: 8 },
  notifMessage: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: 6 },
  notifTime: { fontSize: FontSize.xs, color: Colors.textLight },
});
