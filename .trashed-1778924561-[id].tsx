import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { StarRating } from '@/components/StarRating';
import { ChevronLeft, MapPin, Calendar, Clock, Phone, MessageSquare, Star, CircleCheck as CheckCircle, X } from 'lucide-react-native';
import { MOCK_BOOKINGS } from '@/lib/mockData';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  pending: { label: 'Pending - Worker ka response awaited', color: '#F59E0B', bg: '#FFFBEB', emoji: '⏳' },
  accepted: { label: 'Accepted - Worker aayega scheduled time pe', color: '#2563EB', bg: '#EFF6FF', emoji: '✅' },
  in_progress: { label: 'In Progress - Kaam chal raha hai', color: '#7C3AED', bg: '#F5F3FF', emoji: '🔧' },
  completed: { label: 'Completed - Kaam ho gaya!', color: '#16A34A', bg: '#F0FDF4', emoji: '🎉' },
  cancelled: { label: 'Cancelled', color: '#EF4444', bg: '#FEF2F2', emoji: '❌' },
  rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEF2F2', emoji: '❌' },
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const booking = MOCK_BOOKINGS.find(b => b.id === id) || MOCK_BOOKINGS[0];
  const worker = booking.workers!;
  const profile = worker.profiles!;
  const [userRating, setUserRating] = useState(0);
  const [showRating, setShowRating] = useState(booking.status === 'completed');
  const statusConfig = STATUS_CONFIG[booking.status];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.statusBanner, { backgroundColor: statusConfig.bg, borderColor: statusConfig.color + '40' }]}>
          <Text style={styles.statusEmoji}>{statusConfig.emoji}</Text>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Worker Details</Text>
          <View style={styles.workerRow}>
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.workerName}>{profile.full_name}</Text>
              <Text style={styles.workerCat}>{worker.category_name}</Text>
              <View style={styles.ratingRow}>
                <Star size={12} color='#F59E0B' fill='#F59E0B' />
                <Text style={styles.rating}>{worker.rating.toFixed(1)}</Text>
              </View>
            </View>
            <View style={styles.workerActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Phone size={18} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push(`/chat/${booking.id}`)}
              >
                <MessageSquare size={18} color={Colors.accent} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Booking Information</Text>
          <InfoRow icon={<Calendar size={16} color={Colors.primary} />} label="Date" value={booking.scheduled_date} />
          <InfoRow icon={<Clock size={16} color={Colors.accent} />} label="Time" value={booking.scheduled_time} />
          <InfoRow icon={<MapPin size={16} color='#F97316' />} label="Address" value={booking.address} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Problem Description</Text>
          <Text style={styles.description}>{booking.problem_description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment</Text>
          <View style={styles.paymentRow}>
            <View>
              <Text style={styles.payLabel}>Estimated Cost</Text>
              <Text style={styles.payValue}>₹{booking.estimated_cost || 'TBD'}</Text>
            </View>
            {booking.final_cost > 0 && (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.payLabel}>Final Cost</Text>
                <Text style={[styles.payValue, { color: Colors.accent }]}>₹{booking.final_cost}</Text>
              </View>
            )}
          </View>
        </View>

        {showRating && booking.status === 'completed' && (
          <View style={styles.ratingCard}>
            <Text style={styles.ratingCardTitle}>Worker ko Rate Karein</Text>
            <Text style={styles.ratingCardSub}>Aapka kaam kaisa raha?</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setUserRating(star)} style={{ padding: 4 }}>
                  <Star
                    size={36}
                    color='#F59E0B'
                    fill={star <= userRating ? '#F59E0B' : 'transparent'}
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {userRating > 0 && (
              <TouchableOpacity style={styles.submitRatingBtn} activeOpacity={0.85}>
                <CheckCircle size={18} color={Colors.white} />
                <Text style={styles.submitRatingText}>Submit Rating</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {booking.status === 'pending' && (
          <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.85}>
            <X size={18} color={Colors.error} />
            <Text style={styles.cancelText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      {icon}
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary, width: 60 },
  value: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, flex: 1 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  backBtn: {},
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  content: { padding: Spacing.md, paddingBottom: 48 },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  statusEmoji: { fontSize: 20 },
  statusText: { fontSize: FontSize.sm, fontWeight: '700', flex: 1 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm },
  cardTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  workerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.gray200 },
  workerName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text },
  workerCat: { fontSize: FontSize.sm, color: Colors.primary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  rating: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  workerActions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: 'center', justifyContent: 'center',
  },
  description: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between' },
  payLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  payValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  ratingCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, ...Shadow.sm, alignItems: 'center' },
  ratingCardTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  ratingCardSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.lg },
  submitRatingBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitRatingText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.error,
    backgroundColor: Colors.errorSoft,
  },
  cancelText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.error },
});
