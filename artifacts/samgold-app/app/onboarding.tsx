import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, Easing } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SAMGOLD_COLORS } from '@/constants/colors';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'حوّل هاتفك إلى محطة ميدانية',
    description: 'يعمل بدون اتصال بالإنترنت في الحقل، مع دقة قياسية لجميع أنواع المسح',
    titleColor: SAMGOLD_COLORS.primary,
    RenderIllustration: () => {
      const floatAnim = useSharedValue(0);
      React.useEffect(() => {
        floatAnim.value = withRepeat(
          withSequence(
            withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
      }, []);

      const badgeStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: floatAnim.value }],
      }));

      return (
        <View style={styles.illustrationContainer}>
          <Svg width={200} height={300} viewBox="0 0 200 300">
            <Rect x={40} y={20} width={120} height={260} rx={20} stroke={SAMGOLD_COLORS.primary} strokeWidth={2} fill="none" />
            <Circle cx={100} cy={250} r={10} stroke={SAMGOLD_COLORS.cardBorder} strokeWidth={2} fill="none" />
            {/* Radar dots */}
            <Circle cx={100} cy={140} r={40} stroke={SAMGOLD_COLORS.primary} strokeWidth={1} strokeOpacity={0.5} fill="none" strokeDasharray="4 4" />
            <Circle cx={100} cy={140} r={60} stroke={SAMGOLD_COLORS.primary} strokeWidth={1} strokeOpacity={0.3} fill="none" strokeDasharray="4 4" />
            <Circle cx={100} cy={140} r={4} fill={SAMGOLD_COLORS.primary} />
            <Circle cx={80} cy={120} r={3} fill={SAMGOLD_COLORS.cyan} />
            <Circle cx={130} cy={160} r={3} fill={SAMGOLD_COLORS.success} />
          </Svg>
          
          <Animated.View style={[styles.floatingBadge, { top: 40, left: 0, borderColor: SAMGOLD_COLORS.cyan }, badgeStyle]}>
            <Text style={[styles.badgeText, { color: SAMGOLD_COLORS.cyan }]}>GPR</Text>
          </Animated.View>
          <Animated.View style={[styles.floatingBadge, { top: 120, right: 0, borderColor: '#F97316', animationDelay: '500ms' as any }, badgeStyle]}>
            <Text style={[styles.badgeText, { color: '#F97316' }]}>ERT</Text>
          </Animated.View>
          <Animated.View style={[styles.floatingBadge, { bottom: 60, left: 20, borderColor: SAMGOLD_COLORS.success, animationDelay: '1000ms' as any }, badgeStyle]}>
            <Text style={[styles.badgeText, { color: SAMGOLD_COLORS.success }]}>طبوغرافيا</Text>
          </Animated.View>
        </View>
      );
    }
  },
  {
    id: '2',
    title: 'الكاشف الذكي بالذكاء الاصطناعي',
    description: 'يحلل البيانات الجيوفيزيائية ويكتشف الأهداف الباطنية بدقة ٨٩٪',
    titleColor: SAMGOLD_COLORS.cyan,
    RenderIllustration: () => {
      const scanAnim = useSharedValue(0);
      React.useEffect(() => {
        scanAnim.value = withRepeat(
          withTiming(1, { duration: 3000, easing: Easing.linear }),
          -1,
          false
        );
      }, []);

      const scanLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanAnim.value * 260 }],
      }));

      return (
        <View style={styles.illustrationContainer}>
          <View style={styles.gridContainer}>
            {Array.from({ length: 25 }).map((_, i) => {
              const row = Math.floor(i / 5);
              const col = i % 5;
              const isCenter = row >= 1 && row <= 3 && col >= 1 && col <= 3;
              const color = isCenter ? (row === 2 && col === 2 ? '#EF4444' : '#F59E0B') : '#3B82F6';
              return (
                <View key={i} style={[styles.gridCell, { backgroundColor: color, opacity: isCenter ? 0.8 : 0.3 }]} />
              );
            })}
            <Animated.View style={[styles.scanLine, scanLineStyle]} />
          </View>

          <View style={styles.aiCard}>
            <Text style={styles.aiCardMain}>٨٩٪</Text>
            <Text style={styles.aiCardSub}>احتمال فراغ</Text>
            <Text style={styles.aiCardDetail}>عمق: ٤.٢ م</Text>
          </View>
        </View>
      );
    }
  },
  {
    id: '3',
    title: 'رؤية ثلاثية الأبعاد',
    description: 'اقرأ طبقات الأرض بدقة وصدّر تقارير ثلاثية الأبعاد للعملاء',
    titleColor: SAMGOLD_COLORS.success,
    RenderIllustration: () => {
      return (
        <View style={styles.illustrationContainer}>
          <View style={styles.layersContainer}>
            <View style={[styles.layer, { backgroundColor: '#9CA3B0', height: 20 }]}><Text style={styles.layerText}>سطح</Text></View>
            <View style={[styles.layer, { backgroundColor: '#D4A86A', height: 60 }]}><Text style={styles.layerText}>رمل</Text></View>
            <View style={[styles.layer, { backgroundColor: '#8B5E3C', height: 80 }]}>
               <View style={styles.voidShape} />
               <Text style={styles.layerText}>طين</Text>
            </View>
            <View style={[styles.layer, { backgroundColor: '#4B5563', height: 100 }]}><Text style={styles.layerText}>صخر</Text></View>
            <View style={[styles.layer, { backgroundColor: '#1E3A5F', height: 40 }]}><Text style={styles.layerText}>مياه</Text></View>
            
            <View style={styles.ruler}>
              {[0, 1, 2, 3, 4].map(m => (
                <Text key={m} style={styles.rulerText}>{m}م</Text>
              ))}
            </View>
          </View>
        </View>
      );
    }
  }
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // With RTL, contentOffset.x might be negative or calculated differently depending on OS.
    // Easiest is to calculate based on absolute position.
    const contentOffsetX = Math.abs(event.nativeEvent.contentOffset.x);
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex && index >= 0 && index < SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboarding_seen', 'true');
    router.replace('/login');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      // Manual RTL calculation for next slide
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      completeOnboarding();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {currentIndex < SLIDES.length - 1 ? (
          <Pressable onPress={completeOnboarding} style={styles.skipButton}>
            <Text style={styles.skipText}>تخطي</Text>
          </Pressable>
        ) : <View style={styles.skipButton} />}
        
        <View style={styles.headerLogo}>
          <LinearGradient colors={[SAMGOLD_COLORS.primaryLight, SAMGOLD_COLORS.primaryDark]} style={styles.headerLogoGradient}>
            <Text style={styles.headerLogoText}>SG</Text>
          </LinearGradient>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        inverted={true} // RTL handled natively by inverted prop
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.illustrationWrapper}>
              <item.RenderIllustration />
            </View>
            <View style={styles.textWrapper}>
              <Text style={[styles.title, { color: item.titleColor }]}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: currentIndex === index ? 24 : 8,
                  backgroundColor: currentIndex === index ? SAMGOLD_COLORS.primary : SAMGOLD_COLORS.mutedDark,
                }
              ]}
            />
          ))}
        </View>

        <Pressable onPress={handleNext} style={{ width: '100%' }}>
          <LinearGradient
            colors={[SAMGOLD_COLORS.primaryLight, SAMGOLD_COLORS.primary, SAMGOLD_COLORS.primaryDark]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {currentIndex === SLIDES.length - 1 ? 'ابدأ الآن' : 'التالي'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAMGOLD_COLORS.background,
  },
  header: {
    flexDirection: 'row', // RTL will flip this natively if forced, but we want skip on left, logo on right visually
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    height: 60,
  },
  headerLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerLogoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoText: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  skipButton: {
    padding: 8,
    minWidth: 60,
  },
  skipText: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  illustrationWrapper: {
    flex: 6,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 3,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: SAMGOLD_COLORS.muted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#000000', // Black text on gold for high contrast
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  
  // Illustrations styles
  illustrationContainer: {
    width: 280,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  floatingBadge: {
    position: 'absolute',
    backgroundColor: SAMGOLD_COLORS.card,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  gridContainer: {
    width: 200,
    height: 200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.cardBorder,
  },
  gridCell: {
    width: 38,
    height: 38,
    borderRadius: 4,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 4,
    backgroundColor: SAMGOLD_COLORS.cyan,
    shadowColor: SAMGOLD_COLORS.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  aiCard: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: SAMGOLD_COLORS.card,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.cardBorder,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  aiCardMain: {
    color: SAMGOLD_COLORS.primary,
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
  },
  aiCardSub: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  aiCardDetail: {
    color: SAMGOLD_COLORS.cyan,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 8,
  },
  layersContainer: {
    width: 220,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.cardBorder,
  },
  layer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 16, // RTL left
    position: 'relative',
  },
  layerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  voidShape: {
    position: 'absolute',
    left: 40,
    top: 20,
    width: 80,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.6)', // Purple void
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 1)',
  },
  ruler: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
  },
  rulerText: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
  }
});
