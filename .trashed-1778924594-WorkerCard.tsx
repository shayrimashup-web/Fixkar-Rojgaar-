import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Star, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';
import { Colors, Spacing, FontSize, Radius, Shadow } from '@/lib/theme';
import { Worker } from '@/lib/types';

interface WorkerCardProps {
  worker: Worker;
  onPress: () => void;
  horizontal?: boolean;
}

export function WorkerCard({ worker, onPress, horizontal = false }: WorkerCardProps) {
  const profile = worker.profiles;
  const isAvailable = worker.is_available;

  if (horizontal) {
    return (
      <TouchableOpacity style={[styles.horizontalCard, Shadow.md]} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.horizontalContent}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200' }}
              style={styles.avatarH}
            />
            <View style={[styles.statusDot, { backgroundColor: isAvailable ? Colors.accent : Colors.error }]} />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText} numberOfLines={1}>{profile?.full_name || 'Worker'}</Text>
              {worker.is_verified && (
                <CheckCircle size={14} color={Colors.primary} fill={Colors.primary} style={{ marginLeft: 4 }} />
              )}
            </View>
            <Text style={styles.categoryText}>{worker.category_name}</Text>
            <View style={styles.ratingRow}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{worker.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({worker.total_reviews})</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.expText}>{worker.experience_years} yrs</Text>
            </View>
            <View style={styles.bottomRow}>
              <Text style={styles.priceText}>₹{worker.hourly_rate}/hr</Text>
              <View style={[styles.statusBadge, { backgroundColor: isAvailable ? Colors.accentSoft : '#FEE2E2' }]}>
                <Text style={[styles.statusText, { color: isAvailable ? Colors.accent : Colors.error }]}>
                  {isAvailable ? 'Available' : 'Busy'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.card, Shadow.md]} onPress={onPress} activeOpacity={0.85}>
      {worker.is_featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}
      <View style={styles.avatarContainerV}>
        <Image
          source={{ uri: profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=200' }}
          style={styles.avatar}
        />
        <View style={[styles.statusDotV, { backgroundColor: isAvailable ? Colors.accent : Colors.error }]} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.nameRowV}>
          <Text style={styles.nameTextV} numberOfLines={1}>{profile?.full_name || 'Worker'}</Text>
          {worker.is_verified && (
            <CheckCircle size={14} color={Colors.primary} fill={Colors.primary} style={{ marginLeft: 4 }} />
          )}
        </View>
        <Text style={styles.categoryTextV}>{worker.category_name}</Text>
        <View style={styles.ratingRowV}>
          <Star size={11} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingV}>{worker.rating.toFixed(1)}</Text>
          <Text style={styles.reviewV}>({worker.total_reviews})</Text>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.locationRow}>
            <MapPin size={11} color={Colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>{worker.city}</Text>
          </View>
          <Text style={styles.priceV}>₹{worker.hourly_rate}/hr</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.sm + 4,
    marginRight: Spacing.md,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    zIndex: 1,
  },
  featuredText: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '600',
  },
  avatarContainerV: { position: 'relative', alignSelf: 'center', marginBottom: Spacing.sm },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.gray200 },
  statusDotV: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: Colors.white },
  cardBody: {},
  nameRowV: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  nameTextV: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, flex: 1 },
  categoryTextV: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '500', marginBottom: 4 },
  ratingRowV: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  ratingV: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.text, marginLeft: 2 },
  reviewV: { fontSize: FontSize.xs, color: Colors.textSecondary, marginLeft: 2 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locationRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationText: { fontSize: FontSize.xs, color: Colors.textSecondary, marginLeft: 2, flex: 1 },
  priceV: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },

  horizontalCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  horizontalContent: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative', marginRight: Spacing.md },
  avatarH: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.gray200 },
  statusDot: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 6.5, borderWidth: 2, borderColor: Colors.white },
  infoContainer: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  nameText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, flex: 1 },
  categoryText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '500', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  ratingText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, marginLeft: 3 },
  reviewCount: { fontSize: FontSize.xs, color: Colors.textSecondary, marginLeft: 2 },
  dot: { fontSize: FontSize.xs, color: Colors.textSecondary, marginHorizontal: 4 },
  expText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: '600' },
});
