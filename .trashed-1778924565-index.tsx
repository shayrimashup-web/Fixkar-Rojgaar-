import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { CategoryCard } from '@/components/CategoryCard';
import { WorkerCard } from '@/components/WorkerCard';
import { Search, Bell, MapPin, Star, Zap, ChevronRight, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { MOCK_CATEGORIES, MOCK_WORKERS } from '@/lib/mockData';

const { width } = Dimensions.get('window');

const BANNERS = [
  { id: 1, title: '20% OFF', sub: 'AC Repair pe discount', color: '#EFF6FF', accent: Colors.primary, emoji: '❄️' },
  { id: 2, title: 'Verified Workers', sub: 'Sabhi workers ID verified', color: '#F0FDF4', accent: Colors.accent, emoji: '✅' },
  { id: 3, title: 'Emergency Service', sub: '24/7 available', color: '#FFF7ED', accent: '#F97316', emoji: '🚨' },
];

export default function HomeScreen() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);

  const featuredWorkers = MOCK_WORKERS.filter(w => w.is_featured);
  const topRatedWorkers = [...MOCK_WORKERS].sort((a, b) => b.rating - a.rating);

  const handleSearch = () => {
    if (searchQuery.trim()) router.push(`/(tabs)/categories?q=${searchQuery}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.locationRow}>
            <MapPin size={16} color={Colors.white} />
            <Text style={styles.locationText}>{profile?.city || 'Delhi'}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notifBtn}>
            <Bell size={22} color={Colors.white} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <Text style={styles.greeting}>
          Namaste, {profile?.full_name?.split(' ')[0] || 'Guest'} 👋
        </Text>
        <Text style={styles.greetingSub}>Kaunsa kaam karwana hai aaj?</Text>

        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Plumber, Electrician, Painter..."
            placeholderTextColor={Colors.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={handleSearch}
              activeOpacity={0.85}
            >
              <Text style={styles.searchBtnText}>Search</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.emergencyBanner}>
          <View style={styles.emergencyLeft}>
            <AlertTriangle size={20} color='#EF4444' />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.emergencyTitle}>Emergency Service</Text>
              <Text style={styles.emergencySub}>Turant madad ke liye</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.emergencyBtn} activeOpacity={0.85}>
            <Zap size={14} color={Colors.white} />
            <Text style={styles.emergencyBtnText}>SOS</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannersScroll} contentContainerStyle={{ paddingRight: Spacing.md }}>
          {BANNERS.map((banner, i) => (
            <TouchableOpacity
              key={banner.id}
              style={[styles.bannerCard, { backgroundColor: banner.color, borderColor: banner.accent + '30' }]}
              activeOpacity={0.9}
            >
              <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
              <Text style={[styles.bannerTitle, { color: banner.accent }]}>{banner.title}</Text>
              <Text style={styles.bannerSub}>{banner.sub}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={15} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: Spacing.md }}>
            {MOCK_CATEGORIES.slice(0, 8).map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onPress={() => router.push(`/(tabs)/categories?cat=${cat.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Workers</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={15} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: Spacing.md }}>
            {featuredWorkers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onPress={() => router.push(`/worker/${worker.id}`)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.statsRow}>
          {[
            { value: '500+', label: 'Verified Workers' },
            { value: '12K+', label: 'Happy Customers' },
            { value: '4.8', label: 'App Rating' },
          ].map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Rated Workers</Text>
            <TouchableOpacity style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={15} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {topRatedWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onPress={() => router.push(`/worker/${worker.id}`)}
              horizontal
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52,
    paddingBottom: 28,
    paddingHorizontal: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: '500' },
  notifBtn: { position: 'relative', padding: 4 },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  greeting: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white, marginBottom: 2 },
  greetingSub: { fontSize: FontSize.base, color: 'rgba(255,255,255,0.8)', marginBottom: Spacing.lg },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    height: 50,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: FontSize.base, color: Colors.text },
  searchBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  searchBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white },
  body: { paddingTop: Spacing.md },
  emergencyBanner: {
    backgroundColor: '#FFF1F0',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyLeft: { flexDirection: 'row', alignItems: 'center' },
  emergencyTitle: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text },
  emergencySub: { fontSize: FontSize.xs, color: Colors.textSecondary },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    gap: 4,
  },
  emergencyBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white },
  bannersScroll: { marginBottom: Spacing.md, paddingLeft: Spacing.md },
  bannerCard: {
    width: 160,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginRight: Spacing.sm,
    borderWidth: 1,
  },
  bannerEmoji: { fontSize: 24, marginBottom: 6 },
  bannerTitle: { fontSize: FontSize.lg, fontWeight: '800' },
  bannerSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  section: { marginBottom: Spacing.lg, paddingLeft: Spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingRight: Spacing.md,
  },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  statValue: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 10, color: Colors.primary, fontWeight: '500', marginTop: 2, textAlign: 'center' },
});
