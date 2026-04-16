import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Dimensions, Linking,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { StarRating } from '@/components/StarRating';
import { ChevronLeft, Star, MapPin, Clock, Phone, MessageCircle, CircleCheck as CheckCircle, Briefcase, Award, Heart, Share2, Calendar, Zap } from 'lucide-react-native';
import { MOCK_WORKERS, MOCK_REVIEWS } from '@/lib/mockData';

const { width } = Dimensions.get('window');

export default function WorkerProfileScreen() {
  const { id } = useLocalSearchParams();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'reviews' | 'portfolio'>('about');

  const worker = MOCK_WORKERS.find(w => w.id === id) || MOCK_WORKERS[0];
  const profile = worker.profiles!;
  const reviews = MOCK_REVIEWS.filter(r => r.worker_id === worker.id);

  const handleCall = () => Linking.openURL(`tel:${profile.phone}`);
  const handleWhatsApp = () => Linking.openURL(`https://wa.me/${profile.phone?.replace(/\D/g, '')}`);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <ChevronLeft size={22} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.heroActionBtn} onPress={() => setSaved(v => !v)}>
                <Heart size={20} color={saved ? '#EF4444' : Colors.white} fill={saved ? '#EF4444' : 'transparent'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroActionBtn}>
                <Share2 size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroProfile}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
              <View style={[styles.availabilityDot, { backgroundColor: worker.is_available ? Colors.accent : '#EF4444' }]} />
            </View>
            <Text style={styles.workerName}>{profile.full_name}</Text>
            <Text style={styles.workerCategory}>{worker.category_name}</Text>

            <View style={styles.ratingRow}>
              <Star size={16} color='#F59E0B' fill='#F59E0B' />
              <Text style={styles.ratingValue}>{worker.rating.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({worker.total_reviews} reviews)</Text>
              <View style={styles.badgeDot} />
              <Text style={styles.expText}>{worker.experience_years} yrs exp</Text>
            </View>

            <View style={styles.badgesRow}>
              {worker.is_verified && (
                <View style={styles.badge}>
                  <CheckCircle size={12} color={Colors.primary} fill={Colors.primary} />
                  <Text style={styles.badgeText}>ID Verified</Text>
                </View>
              )}
              {worker.is_featured && (
                <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}>
                  <Award size={12} color='#D97706' />
                  <Text style={[styles.badgeText, { color: '#D97706' }]}>Featured</Text>
                </View>
              )}
              <View style={[styles.badge, {
                backgroundColor: worker.is_available ? Colors.accentSoft : '#FEF2F2',
              }]}>
                <View style={[styles.dotSmall, { backgroundColor: worker.is_available ? Colors.accent : '#EF4444' }]} />
                <Text style={[styles.badgeText, { color: worker.is_available ? Colors.accent : '#EF4444' }]}>
                  {worker.is_available ? 'Available Now' : 'Busy'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { value: worker.total_jobs.toString(), label: 'Jobs Done', icon: <Briefcase size={16} color={Colors.primary} /> },
            { value: `₹${worker.hourly_rate}`, label: 'Per Hour', icon: <Clock size={16} color={Colors.accent} /> },
            { value: `₹${worker.daily_rate}`, label: 'Per Day', icon: <Calendar size={16} color='#F59E0B' /> },
          ].map((stat, i) => (
            <View key={i} style={[styles.statCard, i < 2 && styles.statBorder]}>
              {stat.icon}
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.tabs}>
          {(['about', 'reviews', 'portfolio'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'about' && (
            <View>
              {worker.description ? (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>About</Text>
                  <Text style={styles.description}>{worker.description}</Text>
                </View>
              ) : null}

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Skills</Text>
                <View style={styles.skillsRow}>
                  {worker.skills.map((skill) => (
                    <View key={skill} style={styles.skillChip}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Service Areas</Text>
                {worker.service_areas.map((area) => (
                  <View key={area} style={styles.areaItem}>
                    <MapPin size={14} color={Colors.primary} />
                    <Text style={styles.areaText}>{area}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Working Hours</Text>
                <View style={styles.hoursRow}>
                  <Clock size={16} color={Colors.accent} />
                  <Text style={styles.hoursText}>{worker.work_timing_start} - {worker.work_timing_end}</Text>
                  <Text style={styles.daysText}>Mon - Sat</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'reviews' && (
            <View>
              <View style={styles.ratingOverview}>
                <Text style={styles.bigRating}>{worker.rating.toFixed(1)}</Text>
                <StarRating rating={worker.rating} size={20} />
                <Text style={styles.totalReviewsText}>{worker.total_reviews} total reviews</Text>
              </View>
              {reviews.length === 0 ? (
                <View style={styles.noReviews}>
                  <Text style={styles.noReviewsText}>Abhi koi review nahi hai</Text>
                </View>
              ) : (
                reviews.map((review) => (
                  <View key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Image source={{ uri: review.profiles?.avatar_url }} style={styles.reviewAvatar} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.reviewerName}>{review.profiles?.full_name}</Text>
                        <StarRating rating={review.rating} size={12} />
                      </View>
                      <Text style={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</Text>
                    </View>
                    <Text style={styles.reviewText}>{review.comment}</Text>
                  </View>
                ))
              )}
            </View>
          )}

          {activeTab === 'portfolio' && (
            <View>
              {worker.portfolio_images.length === 0 ? (
                <View style={styles.noPortfolio}>
                  <Text style={styles.noPortfolioText}>Koi portfolio photos nahi hai</Text>
                </View>
              ) : (
                <View style={styles.portfolioGrid}>
                  {worker.portfolio_images.map((img, i) => (
                    <Image key={i} source={{ uri: img }} style={styles.portfolioImage} />
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.85}>
          <Phone size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
          <MessageCircle size={20} color={Colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push({ pathname: '/booking/new', params: { workerId: worker.id } })}
          activeOpacity={0.85}
        >
          <Calendar size={20} color={Colors.white} />
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sosBtn} activeOpacity={0.85}>
          <Zap size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  heroSection: {
    backgroundColor: Colors.primary,
    paddingBottom: Spacing.xl,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroActions: { flexDirection: 'row', gap: Spacing.sm },
  heroActionBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroProfile: { alignItems: 'center', paddingHorizontal: Spacing.md },
  avatarWrapper: { position: 'relative', marginBottom: Spacing.md },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  availabilityDot: { position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: Colors.primary },
  workerName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  workerCategory: { fontSize: FontSize.base, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginBottom: Spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.md },
  ratingValue: { fontSize: FontSize.base, fontWeight: '800', color: Colors.white },
  ratingCount: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)' },
  badgeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)' },
  expText: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.85)' },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: Spacing.sm + 4, paddingVertical: 4,
    borderRadius: Radius.full,
  },
  badgeText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.primary },
  dotSmall: { width: 6, height: 6, borderRadius: 3 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginTop: -Spacing.lg,
    borderRadius: Radius.lg,
    ...Shadow.lg,
  },
  statCard: { flex: 1, padding: Spacing.md, alignItems: 'center', gap: 4 },
  statBorder: { borderRightWidth: 1, borderRightColor: Colors.border },
  statValue: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary },
  tabs: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border, marginTop: Spacing.md },
  tab: { flex: 1, paddingVertical: Spacing.md, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  tabTextActive: { color: Colors.primary, fontWeight: '700' },
  tabContent: { padding: Spacing.md, paddingBottom: 100 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm },
  cardTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  description: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  skillChip: { backgroundColor: Colors.primarySoft, paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full },
  skillText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600' },
  areaItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  areaText: { fontSize: FontSize.sm, color: Colors.text },
  hoursRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  hoursText: { fontSize: FontSize.base, fontWeight: '600', color: Colors.text, flex: 1 },
  daysText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  ratingOverview: { alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.xl, marginBottom: Spacing.md, ...Shadow.sm },
  bigRating: { fontSize: 48, fontWeight: '800', color: Colors.text },
  totalReviewsText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.sm },
  noReviews: { alignItems: 'center', paddingVertical: Spacing.xxl },
  noReviewsText: { fontSize: FontSize.base, color: Colors.textSecondary },
  reviewCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadow.sm },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.gray200 },
  reviewerName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  reviewDate: { fontSize: FontSize.xs, color: Colors.textSecondary },
  reviewText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  noPortfolio: { alignItems: 'center', paddingVertical: Spacing.xxl },
  noPortfolioText: { fontSize: FontSize.base, color: Colors.textSecondary },
  portfolioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  portfolioImage: { width: (width - Spacing.md * 2 - Spacing.sm) / 2, height: 140, borderRadius: Radius.md },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    paddingBottom: 28,
    flexDirection: 'row',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.lg,
  },
  callBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  whatsappBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.accentSoft,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.accent + '30',
  },
  bookBtn: {
    flex: 1, height: 52, borderRadius: 26,
    backgroundColor: Colors.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8,
  },
  bookBtnText: { fontSize: FontSize.base, fontWeight: '700', color: Colors.white },
  sosBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center',
  },
});
