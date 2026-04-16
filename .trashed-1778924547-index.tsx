import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, FontSize } from '@/lib/theme';
import { Wrench } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { profile, loading } = useAuth();
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const circleScale1 = useRef(new Animated.Value(0)).current;
  const circleScale2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circleScale1, { toValue: 1.4, duration: 2000, useNativeDriver: true }),
        Animated.timing(circleScale1, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(circleScale2, { toValue: 1.3, duration: 2500, useNativeDriver: true }),
        Animated.timing(circleScale2, { toValue: 1, duration: 2500, useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => {
      if (!loading) {
        if (profile) {
          navigateByRole();
        } else {
          router.replace('/onboarding');
        }
      }
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (profile) navigateByRole();
        else router.replace('/onboarding');
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [loading, profile]);

  const navigateByRole = () => {
    if (profile?.role === 'admin') router.replace('/admin');
    else if (profile?.role === 'worker') router.replace('/(worker)/dashboard');
    else router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle1, { transform: [{ scale: circleScale1 }] }]} />
      <Animated.View style={[styles.circle2, { transform: [{ scale: circleScale2 }] }]} />

      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.iconWrapper}>
          <Wrench size={44} color={Colors.white} strokeWidth={2.5} />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: textOpacity, alignItems: 'center', marginTop: 24 }}>
        <Text style={styles.appName}>Fixkar Rojgaar</Text>
        <Text style={styles.appNameHindi}>फिक्सकर रोज़गार</Text>
      </Animated.View>

      <Animated.View style={{ opacity: taglineOpacity, alignItems: 'center', marginTop: 12 }}>
        <Text style={styles.tagline}>Aapka Kaam, Hamare Kaarigar</Text>
        <Text style={styles.taglineEn}>Your Work, Our Workers</Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.loader}>
          <View style={styles.loaderTrack}>
            <Animated.View style={[styles.loaderFill]} />
          </View>
        </View>
        <Text style={styles.versionText}>v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    right: -80,
  },
  circle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.07)',
    bottom: -40,
    left: -60,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  appNameHindi: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  tagline: {
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  taglineEn: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  loader: {
    marginBottom: 16,
  },
  loaderTrack: {
    width: 120,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderFill: {
    width: '70%',
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  versionText: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.5)',
  },
});
