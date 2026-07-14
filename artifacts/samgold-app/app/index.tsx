import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo-google-fonts/inter'; // Feather isn't in inter, use @expo/vector-icons
import { Ionicons } from '@expo/vector-icons';
import { SAMGOLD_COLORS } from '@/constants/colors';
import { RadarBackground } from '@/components/RadarBackground';

export default function SplashScreen() {
  const logoScale = useSharedValue(0);
  const pulseOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const titleY = useSharedValue(20);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const lineWidth = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // 3. Logo scales from 0 to 1 with spring at t=300ms
    setTimeout(() => {
      logoScale.value = withSpring(1, { damping: 12, stiffness: 90 });
    }, 300);

    // 4. Pulse ring loop
    pulseScale.value = withRepeat(
      withTiming(2, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 200 }),
        withTiming(0, { duration: 1800, easing: Easing.out(Easing.ease) })
      ),
      -1,
      false
    );

    // 5. "SAMGOLD" text slides up + fades in at t=800ms
    setTimeout(() => {
      titleY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) });
      titleOpacity.value = withTiming(1, { duration: 600 });
    }, 800);

    // 6. Subtitle + thin line at t=1200ms
    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, { duration: 800 });
      lineWidth.value = withTiming(40, { duration: 800, easing: Easing.out(Easing.ease) });
    }, 1200);

    // 7. Progress bar fills RTL from t=500ms to t=2800ms
    setTimeout(() => {
      progressWidth.value = withTiming(100, { duration: 2300, easing: Easing.inOut(Easing.ease) });
    }, 500);

    // 9. Navigation check at t=3000ms
    const timer = setTimeout(async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('onboarding_seen');
        if (hasSeenOnboarding === 'true') {
          router.replace('/login');
        } else {
          router.replace('/onboarding');
        }
      } catch (e) {
        router.replace('/onboarding');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titleY.value }],
    opacity: titleOpacity.value,
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const lineAnimatedStyle = useAnimatedStyle(() => ({
    width: `${lineWidth.value}%`,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View style={styles.container}>
      <RadarBackground opacity={0.1} />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.pulseRing, pulseAnimatedStyle]} />
          <Animated.View style={[styles.logoBox, logoAnimatedStyle]}>
            <LinearGradient
              colors={[SAMGOLD_COLORS.primaryLight, SAMGOLD_COLORS.primary, SAMGOLD_COLORS.primaryDark]}
              style={styles.logoGradient}
            >
              <Text style={styles.logoText}>SG</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        <Animated.View style={[styles.textContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>SAMGOLD</Text>
        </Animated.View>

        <Animated.View style={[styles.subtitleContainer, subtitleAnimatedStyle]}>
          <Text style={styles.subtitle}>المسح الشامل والكشف الذكي</Text>
          <Animated.View style={[styles.separatorLine, lineAnimatedStyle]} />
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
        </View>
        <Text style={styles.copyright}>SAMGOLD © 2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAMGOLD_COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: SAMGOLD_COLORS.primary,
    backgroundColor: 'transparent',
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: SAMGOLD_COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 2,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: SAMGOLD_COLORS.primary,
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 8,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 12,
  },
  separatorLine: {
    height: 1,
    backgroundColor: SAMGOLD_COLORS.primary,
  },
  footer: {
    width: '100%',
    paddingBottom: 40,
    alignItems: 'center',
    paddingHorizontal: '15%',
  },
  progressTrack: {
    width: '100%',
    height: 2,
    backgroundColor: SAMGOLD_COLORS.cardBorder,
    marginBottom: 20,
    flexDirection: 'row-reverse', // Fill RTL
  },
  progressBar: {
    height: '100%',
    backgroundColor: SAMGOLD_COLORS.primary,
  },
  copyright: {
    color: SAMGOLD_COLORS.mutedDark,
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 1,
  },
});
