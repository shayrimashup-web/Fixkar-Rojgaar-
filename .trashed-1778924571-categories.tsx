import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, Spacing, Radius, Shadow } from '@/lib/theme';
import { CategoryCard } from '@/components/CategoryCard';
import { WorkerCard } from '@/components/WorkerCard';
import { Search, ListFilter as Filter, X, SlidersHorizontal } from 'lucide-react-native';
import { MOCK_CATEGORIES, MOCK_WORKERS } from '@/lib/mockData';

const SORT_OPTIONS = ['Recommended', 'Top Rated', 'Nearby', 'Price: Low to High', 'Price: High to Low'];

export default function CategoriesScreen() {
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.q as string || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(params.cat as string || null);
  const [selectedSort, setSelectedSort] = useState('Recommended');
  const [showFilter, setShowFilter] = useState(false);

  const filteredWorkers = MOCK_WORKERS.filter(w => {
    const matchesCat = !selectedCategory || w.category_id === selectedCategory;
    const matchesSearch = !searchQuery ||
      w.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.profiles?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const selectedCatData = MOCK_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Workers</Text>
        <Text style={styles.headerSub}>Apna kaam chunein</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search category or worker..."
              placeholderTextColor={Colors.gray400}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(v => !v)} activeOpacity={0.85}>
            <SlidersHorizontal size={20} color={showFilter ? Colors.white : Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            <TouchableOpacity
              style={[styles.allChip, !selectedCategory && styles.allChipActive]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[styles.allChipText, !selectedCategory && styles.allChipTextActive]}>All</Text>
            </TouchableOpacity>
            {MOCK_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
                onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.catChipText, selectedCategory === cat.id && styles.catChipTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {showFilter && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterTitle}>Sort By</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
              {SORT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.sortChip, selectedSort === opt && styles.sortChipActive]}
                  onPress={() => setSelectedSort(opt)}
                >
                  <Text style={[styles.sortChipText, selectedSort === opt && styles.sortChipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {selectedCatData ? selectedCatData.name : 'All Categories'}
            </Text>
            <Text style={styles.resultsCount}>{filteredWorkers.length} workers</Text>
          </View>

          {filteredWorkers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>Koi worker nahi mila</Text>
              <Text style={styles.emptySub}>Search ya category change karein</Text>
            </View>
          ) : (
            <View style={styles.workersList}>
              {filteredWorkers.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                  onPress={() => router.push(`/worker/${worker.id}`)}
                  horizontal
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.allCategoriesSection}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <View style={styles.categoriesGrid}>
            {MOCK_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.gridItem, { borderColor: cat.color + '30' }]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.gridIconBg, { backgroundColor: cat.color + '15' }]}>
                  <Text style={[styles.gridCount, { color: cat.color }]}>{cat.workers_count}</Text>
                </View>
                <Text style={styles.gridName}>{cat.name}</Text>
                <Text style={styles.gridHindi}>{cat.name_hindi}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.75)', marginBottom: Spacing.md },
  searchRow: { flexDirection: 'row', gap: Spacing.sm },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: FontSize.base, color: Colors.text },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  categoriesSection: { paddingVertical: Spacing.md },
  categoriesScroll: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  allChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  allChipActive: { backgroundColor: Colors.dark, borderColor: Colors.dark },
  allChipText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '600' },
  allChipTextActive: { color: Colors.white },
  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catChipText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '500' },
  catChipTextActive: { color: Colors.white, fontWeight: '600' },
  filterPanel: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  filterTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  sortChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  sortChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sortChipText: { fontSize: FontSize.sm, color: Colors.text },
  sortChipTextActive: { color: Colors.white, fontWeight: '600' },
  resultsSection: { paddingHorizontal: Spacing.md, marginBottom: Spacing.lg },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  resultsTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text },
  resultsCount: { fontSize: FontSize.sm, color: Colors.textSecondary },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  emptySub: { fontSize: FontSize.sm, color: Colors.textSecondary },
  workersList: {},
  allCategoriesSection: { paddingHorizontal: Spacing.md, marginBottom: Spacing.xxl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  gridItem: {
    width: '30%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    ...Shadow.sm,
  },
  gridIconBg: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  gridCount: { fontSize: FontSize.md, fontWeight: '800' },
  gridName: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  gridHindi: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },
});
