import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Droplets, Zap, Paintbrush, Hammer, Wind,
  Car, Sparkles, Navigation, BookOpen, Layers, Flame, Wrench,
  type LucideIcon
} from 'lucide-react-native';
import { Colors, FontSize, Radius, Shadow, Spacing } from '@/lib/theme';
import { Category } from '@/lib/types';

const ICON_MAP: Record<string, LucideIcon> = {
  droplets: Droplets,
  zap: Zap,
  paintbrush: Paintbrush,
  hammer: Hammer,
  wind: Wind,
  bike: Wrench,
  car: Car,
  sparkles: Sparkles,
  navigation: Navigation,
  'book-open': BookOpen,
  layers: Layers,
  flame: Flame,
};

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryCard({ category, onPress, size = 'md' }: CategoryCardProps) {
  const IconComponent = ICON_MAP[category.icon] || Wrench;
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSmall && styles.cardSm,
        isLarge && styles.cardLg,
        Shadow.sm,
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      <View style={[
        styles.iconBg,
        isSmall && styles.iconBgSm,
        { backgroundColor: category.color + '18' }
      ]}>
        <IconComponent
          size={isSmall ? 18 : isLarge ? 28 : 22}
          color={category.color}
          strokeWidth={2}
        />
      </View>
      <Text style={[styles.name, isSmall && styles.nameSm]} numberOfLines={1}>
        {category.name}
      </Text>
      {!isSmall && (
        <Text style={styles.hindi} numberOfLines={1}>{category.name_hindi}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    width: 88,
    marginRight: Spacing.sm,
  },
  cardSm: {
    width: 76,
    padding: Spacing.sm,
    borderRadius: Radius.md,
  },
  cardLg: {
    width: 100,
    padding: Spacing.md,
  },
  iconBg: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs + 2,
  },
  iconBgSm: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
  },
  name: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  nameSm: {
    fontSize: 10,
  },
  hindi: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
