import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
  ScrollView, Animated, Image,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, FontSize, Spacing, Radius } from '@/lib/theme';
import { ChevronRight, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: 'Find Local Workers',
    titleHindi: 'नज़दीकी कारीगर खोजें',
    subtitle: 'Plumber, Electrician, Painter aur 12+ categories mein trusted workers dhundhein apne area mein.',
    image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?w=600',
    color: Colors.primary,
  },
  {
    id: 2,
    title: 'Easy Booking',
    titleHindi: 'आसान बुकिंग',
    subtitle: 'Worker ka profile dekho, ratings check karo, aur ek click mein book kar lo. Fast aur reliable!',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=600',
    color: Colors.accent,
  },
  {
    id: 3,
    title: 'Work & Earn',
    titleHindi: 'काम करो, कमाओ',
    subtitle: 'Kaarigar ho? Register karo aur hazaron customers se directly connect ho. Apna business badhaao!',
    image: 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?w=600',
    color: '#F59E0B',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => router.replace('/(auth)/login');

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {SLIDES.map((slide, index) => (
          <View key={slide.id} style={[styles.slide]}>
            <View style={[styles.imageContainer, { backgroundColor: slide.color + '15' }]}>
              <Image source={{ uri: slide.image }} style={styles.slideImage} resizeMode="cover" />
              <View style={[styles.imageOverlay, { backgroundColor: slide.color + '30' }]} />
            </View>
            <View style={styles.content}>
              <Text style={[styles.slideTitle, { color: slide.color }]}>{slide.title}</Text>
              <Text style={styles.slideTitleHindi}>{slide.titleHindi}</Text>
              <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
                index === currentIndex && { backgroundColor: SLIDES[currentIndex].color },
              ]}
            />
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            style={[styles.nextBtn, { backgroundColor: SLIDES[currentIndex].color }]}
            activeOpacity={0.85}
          >
            {currentIndex === SLIDES.length - 1 ? (
              <>
                <Text style={styles.nextText}>Get Started</Text>
                <ArrowRight size={18} color={Colors.white} />
              </>
            ) : (
              <>
                <Text style={styles.nextText}>Next</Text>
                <ChevronRight size={18} color={Colors.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  slide: { width, flex: 1 },
  imageContainer: {
    height: '55%',
    overflow: 'hidden',
    position: 'relative',
  },
  slideImage: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  slideTitle: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    marginBottom: 4,
  },
  slideTitleHindi: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  slideSubtitle: {
    fontSize: FontSize.base,
    color: Colors.gray600,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 48,
    paddingTop: Spacing.md,
    backgroundColor: Colors.white,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray300,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  skipText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    gap: 8,
  },
  nextText: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.white,
  },
});
