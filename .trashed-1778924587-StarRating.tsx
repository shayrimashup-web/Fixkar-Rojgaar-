import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { Colors } from '@/lib/theme';

interface StarRatingProps {
  rating: number;
  size?: number;
  showEmpty?: boolean;
}

export function StarRating({ rating, size = 14, showEmpty = true }: StarRatingProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          color={star <= Math.round(rating) ? '#F59E0B' : Colors.gray300}
          fill={star <= Math.round(rating) ? '#F59E0B' : 'transparent'}
          style={{ marginRight: 1 }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
