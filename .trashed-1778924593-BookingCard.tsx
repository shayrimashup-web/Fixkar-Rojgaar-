import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react-native';
import { Colors, FontSize, Radius, Shadow, Spacing } from '@/lib/theme';
import { Booking, BookingStatus } from '@/lib/types';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  isWorkerView?: boolean;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB' },
  accepted: { label: 'Accepted', color: '#2563EB', bg: '#EFF6FF' },
  in_progress: { label: 'In Progress', color: '#7C3AED', bg: '#F5F3FF' },
  completed: { label: 'Completed', color: '#16A34A', bg: '#F0FDF4' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2' },
  rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEF2F2' },
};

export function BookingCard({ booking, onPress, isWorkerView = false }: BookingCardProps) {
  const config = STATUS_CONFIG[booking.status];
  const worker = booking.workers;
  const profile = isWorkerView ? booking.profiles : worker?.profiles;

  return (
    <TouchableOpacity style={[styles.card, Shadow.sm]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.workerRow}>
          <Image
            source={{ uri: profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200' }}
            style={styles.avatar}
          />
          <View style={styles.workerInfo}>
            <Text style={styles.workerName} numberOfLines={1}>
              {profile?.full_name || (isWorkerView ? 'Customer' : 'Worker')}
            </Text>
            <Text style={styles.categoryName}>{worker?.category_name || booking.workers?.category_name}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
          <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>{booking.problem_description}</Text>

      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <Calendar size={13} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{booking.scheduled_date}</Text>
        </View>
        <View style={styles.infoItem}>
          <Clock size={13} color={Colors.textSecondary} />
          <Text style={styles.infoText}>{booking.scheduled_time}</Text>
        </View>
        {booking.estimated_cost > 0 && (
          <Text style={styles.price}>₹{booking.estimated_cost}</Text>
        )}
        <ChevronRight size={16} color={Colors.gray400} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  workerRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.gray200, marginRight: Spacing.sm },
  workerInfo: { flex: 1 },
  workerName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text },
  categoryName: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: '700' },
  description: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm, lineHeight: 19 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  price: { marginLeft: 'auto' as any, fontSize: FontSize.base, fontWeight: '700', color: Colors.primary, marginRight: 4 },
});
