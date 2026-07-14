import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SAMGOLD_COLORS } from '@/constants/colors';
import { FloatLabelInput } from '@/components/FloatLabelInput';
import { RadarBackground } from '@/components/RadarBackground';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const cardShake = useSharedValue(0);
  const logoScale = useSharedValue(0);

  React.useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 90 });
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cardShake.value }],
  }));

  const handleLogin = () => {
    setError('');
    
    if (!email || !password) {
      setError('يرجى تعبئة جميع الحقول');
      cardShake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(app)');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background decorations */}
      <View style={styles.glowTopRight}>
        <LinearGradient
          colors={['rgba(212, 175, 55, 0.15)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>
      <View style={styles.glowBottomLeft}>
        <LinearGradient
          colors={['rgba(0, 180, 216, 0.15)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      <RadarBackground opacity={0.04} size={500} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
            <LinearGradient
              colors={[SAMGOLD_COLORS.primaryLight, SAMGOLD_COLORS.primary, SAMGOLD_COLORS.primaryDark]}
              style={styles.logoGradient}
            >
              <Text style={styles.logoText}>SG</Text>
            </LinearGradient>
          </Animated.View>
          <Text style={styles.welcomeText}>مرحباً بعودتك</Text>
          <Text style={styles.brandText}>SAMGOLD</Text>
        </View>

        <Animated.View style={[styles.formCard, cardAnimatedStyle]}>
          <FloatLabelInput
            label="البريد الإلكتروني"
            value={email}
            onChangeText={setEmail}
            leftIcon="mail-outline"
            keyboardType="email-address"
            error={error && !email ? 'البريد الإلكتروني مطلوب' : ''}
          />

          <FloatLabelInput
            label="كلمة المرور"
            value={password}
            onChangeText={setPassword}
            leftIcon="lock-closed-outline"
            rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
            onRightIconPress={() => setShowPassword(!showPassword)}
            secureTextEntry={!showPassword}
            error={error && !password ? 'كلمة المرور مطلوبة' : ''}
          />

          {error && email && password ? (
            <Text style={styles.generalError}>{error}</Text>
          ) : null}

          <View style={styles.optionsRow}>
            <Pressable style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <Ionicons name="checkmark" size={14} color={SAMGOLD_COLORS.background} />}
              </View>
              <Text style={styles.checkboxLabel}>تذكّرني</Text>
            </Pressable>
            
            <Pressable onPress={() => router.push('/forgot-password')}>
              <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.loginButtonWrapper, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[SAMGOLD_COLORS.primaryLight, SAMGOLD_COLORS.primary, SAMGOLD_COLORS.primaryDark]}
              style={styles.loginButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>أو</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={styles.googleButton}>
          <View style={styles.googleIconWrapper}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.googleButtonText}>الدخول بحساب Google</Text>
        </Pressable>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>ليس لديك حساب؟ </Text>
          <Pressable onPress={() => router.push('/register')}>
            <Text style={styles.registerLink}>سجّل الآن</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAMGOLD_COLORS.background,
  },
  glowTopRight: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  glowBottomLeft: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 16,
  },
  logoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  welcomeText: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  brandText: {
    color: SAMGOLD_COLORS.primary,
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 4,
  },
  formCard: {
    backgroundColor: SAMGOLD_COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.cardBorder,
    padding: 24,
    marginBottom: 32,
  },
  optionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.mutedDark,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8, // RTL space
  },
  checkboxActive: {
    backgroundColor: SAMGOLD_COLORS.primary,
    borderColor: SAMGOLD_COLORS.primary,
  },
  checkboxLabel: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  forgotPasswordText: {
    color: SAMGOLD_COLORS.primary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  loginButtonWrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  generalError: {
    color: SAMGOLD_COLORS.error,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: SAMGOLD_COLORS.cardBorder,
  },
  dividerText: {
    color: SAMGOLD_COLORS.muted,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  googleButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.cardBorder,
    borderRadius: 12,
    marginBottom: 32,
  },
  googleIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  googleIconText: {
    color: SAMGOLD_COLORS.primary,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  googleButtonText: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  registerContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
  },
  registerText: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  registerLink: {
    color: SAMGOLD_COLORS.primary,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
