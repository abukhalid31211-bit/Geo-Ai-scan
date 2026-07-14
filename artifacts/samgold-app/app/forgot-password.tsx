import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withSpring,
  Easing
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SAMGOLD_COLORS } from '@/constants/colors';
import { FloatLabelInput } from '@/components/FloatLabelInput';

type RecoverState = 'email' | 'otp' | 'newPassword' | 'success';

export default function ForgotPasswordScreen() {
  const [currentState, setCurrentState] = useState<RecoverState>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [isOtpError, setIsOtpError] = useState(false);

  const otpRefs = useRef<Array<TextInput | null>>([]);
  
  // Animations
  const progressWidth = useSharedValue(25);
  const otpShake = useSharedValue(0);
  const successScale = useSharedValue(0);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(1);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentState === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [currentState, countdown]);

  const updateState = (newState: RecoverState, progress: number) => {
    progressWidth.value = withTiming(progress, { duration: 400, easing: Easing.out(Easing.ease) });
    setCurrentState(newState);
    
    if (newState === 'success') {
      setTimeout(() => {
        successScale.value = withSpring(1, { damping: 12 });
        ringScale.value = withTiming(2, { duration: 1000 });
        ringOpacity.value = withTiming(0, { duration: 1000 });
      }, 300);
    }
  };

  const handleSendCode = () => {
    if (!email || !email.includes('@')) return;
    updateState('otp', 50);
  };

  const handleOtpChange = (text: string, index: number) => {
    setIsOtpError(false);
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto advance
    if (text && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    
    // Auto submit if all filled
    if (text && index === 5 && newOtp.every(d => d !== '')) {
      Keyboard.dismiss();
      // Simulate verification
      setTimeout(() => {
        if (newOtp.join('') === '123456') { // Mock correct OTP
          updateState('newPassword', 75);
        } else {
          setIsOtpError(true);
          otpShake.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(-10, { duration: 50 }),
            withTiming(10, { duration: 50 }),
            withTiming(0, { duration: 50 })
          );
        }
      }, 500);
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleSavePassword = () => {
    if (newPassword.length >= 8 && newPassword === confirmPassword) {
      updateState('success', 100);
    }
  };

  // Requirements checks
  const reqLength = newPassword.length >= 8;
  const reqNumber = /[0-9]/.test(newPassword);
  const reqUpper = /[A-Z]/.test(newPassword);
  const allReqsMet = reqLength && reqNumber && reqUpper && newPassword === confirmPassword && newPassword !== '';

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const otpAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: otpShake.value }],
  }));

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderEmail = () => (
    <View style={styles.contentContainer}>
      <View style={styles.iconBox}>
        <Ionicons name="mail-outline" size={32} color={SAMGOLD_COLORS.primary} />
      </View>
      <Text style={styles.title}>أدخل بريدك الإلكتروني</Text>
      <Text style={styles.description}>سنرسل لك رمز التحقق المكون من 6 أرقام على بريدك الإلكتروني</Text>

      <View style={styles.formGroup}>
        <FloatLabelInput
          label="البريد الإلكتروني"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          leftIcon="mail-outline"
        />
      </View>

      <Pressable
        style={[styles.primaryButton, !email && styles.buttonDisabled]}
        onPress={handleSendCode}
        disabled={!email}
      >
        <Text style={styles.primaryButtonText}>إرسال الرمز</Text>
      </Pressable>

      <Pressable style={styles.backLink} onPress={() => router.back()}>
        <Text style={styles.backLinkText}>العودة لتسجيل الدخول</Text>
        <Ionicons name="arrow-back" size={16} color={SAMGOLD_COLORS.muted} style={{ marginLeft: 8 }} />
      </Pressable>
    </View>
  );

  const renderOtp = () => (
    <View style={styles.contentContainer}>
      <View style={styles.iconBox}>
        <Ionicons name="lock-closed-outline" size={32} color={SAMGOLD_COLORS.primary} />
      </View>
      <Text style={styles.title}>رمز التحقق</Text>
      <Text style={styles.description}>
        تم إرسال الرمز إلى <Text style={{ color: SAMGOLD_COLORS.primary, fontFamily: 'Inter_600SemiBold' }}>{email}</Text>
      </Text>

      <Animated.View style={[styles.otpContainer, otpAnimatedStyle]}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => otpRefs.current[index] = ref}
            style={[
              styles.otpBox,
              digit ? styles.otpBoxFilled : null,
              isOtpError ? styles.otpBoxError : null
            ]}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(text) => handleOtpChange(text.replace(/[^0-9]/g, ''), index)}
            onKeyPress={(e) => handleOtpKeyPress(e, index)}
            textAlign="center"
          />
        ))}
      </Animated.View>

      <View style={styles.timerContainer}>
        {countdown > 0 ? (
          <Text style={styles.timerText}>إعادة الإرسال بعد {formatTime(countdown)}</Text>
        ) : (
          <Pressable onPress={() => { setCountdown(120); setOtp(['','','','','','']); }}>
            <Text style={styles.resendText}>إعادة إرسال الرمز</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>تحقق من مجلد البريد غير المرغوب فيه (Spam) إن لم يصل الرمز</Text>
        <Ionicons name="information-circle" size={20} color={SAMGOLD_COLORS.cyan} style={{ marginLeft: 12 }} />
      </View>

      <Pressable
        style={[styles.primaryButton, otp.some(d => d === '') && styles.buttonDisabled]}
        onPress={() => handleOtpChange('1', 5)} // Mock submit
        disabled={otp.some(d => d === '')}
      >
        <Text style={styles.primaryButtonText}>التحقق من الرمز</Text>
      </Pressable>
    </View>
  );

  const renderNewPassword = () => (
    <View style={styles.contentContainer}>
      <View style={styles.iconBox}>
        <Ionicons name="key-outline" size={32} color={SAMGOLD_COLORS.primary} />
      </View>
      <Text style={styles.title}>اختر كلمة مرور جديدة</Text>

      <View style={styles.formGroup}>
        <FloatLabelInput
          label="كلمة المرور الجديدة"
          value={newPassword}
          onChangeText={setNewPassword}
          leftIcon="lock-closed-outline"
          secureTextEntry
        />
        <FloatLabelInput
          label="تأكيد كلمة المرور"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          leftIcon="checkmark-circle-outline"
          secureTextEntry
        />
      </View>

      <View style={styles.requirementsCard}>
        <View style={styles.reqRow}>
          <Text style={[styles.reqText, reqLength && styles.reqTextMet]}>8 أحرف على الأقل</Text>
          <View style={[styles.reqDot, reqLength && styles.reqDotMet]}>
            {reqLength && <Ionicons name="checkmark" size={10} color={SAMGOLD_COLORS.background} />}
          </View>
        </View>
        <View style={styles.reqRow}>
          <Text style={[styles.reqText, reqNumber && styles.reqTextMet]}>رقم واحد على الأقل</Text>
          <View style={[styles.reqDot, reqNumber && styles.reqDotMet]}>
            {reqNumber && <Ionicons name="checkmark" size={10} color={SAMGOLD_COLORS.background} />}
          </View>
        </View>
        <View style={styles.reqRow}>
          <Text style={[styles.reqText, reqUpper && styles.reqTextMet]}>حرف كبير واحد على الأقل</Text>
          <View style={[styles.reqDot, reqUpper && styles.reqDotMet]}>
            {reqUpper && <Ionicons name="checkmark" size={10} color={SAMGOLD_COLORS.background} />}
          </View>
        </View>
      </View>

      <Pressable
        style={[styles.primaryButton, !allReqsMet && styles.buttonDisabled]}
        onPress={handleSavePassword}
        disabled={!allReqsMet}
      >
        <Text style={styles.primaryButtonText}>حفظ كلمة المرور</Text>
      </Pressable>
    </View>
  );

  const renderSuccess = () => (
    <View style={[styles.contentContainer, styles.successContainer]}>
      <View style={styles.successIconWrapper}>
        <Animated.View style={[styles.successRing, ringAnimatedStyle]} />
        <Animated.View style={[styles.successCircle, successAnimatedStyle]}>
          <LinearGradient
            colors={[SAMGOLD_COLORS.success, '#16a34a']}
            style={styles.successGradient}
          >
            <Ionicons name="checkmark" size={60} color="#fff" />
          </LinearGradient>
        </Animated.View>
      </View>

      <Text style={styles.successTitle}>تمّت العملية بنجاح!</Text>
      <Text style={styles.successDescription}>
        يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة الخاصة بك
      </Text>

      <Pressable
        style={styles.primaryButton}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.primaryButtonText}>تسجيل الدخول</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {currentState !== 'success' && (
        <>
          <View style={styles.topProgressTrack}>
            <Animated.View style={[styles.topProgressBar, progressAnimatedStyle]} />
          </View>
          <View style={styles.header}>
            <View style={{ width: 40 }} />
            <Pressable onPress={() => {
              if (currentState === 'otp') updateState('email', 25);
              else if (currentState === 'newPassword') updateState('otp', 50);
              else router.back();
            }} style={styles.backButton}>
              <Ionicons name="arrow-forward" size={24} color={SAMGOLD_COLORS.foreground} />
            </Pressable>
          </View>
        </>
      )}

      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {currentState === 'email' && renderEmail()}
        {currentState === 'otp' && renderOtp()}
        {currentState === 'newPassword' && renderNewPassword()}
        {currentState === 'success' && renderSuccess()}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAMGOLD_COLORS.background,
  },
  topProgressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: SAMGOLD_COLORS.cardBorder,
    flexDirection: 'row-reverse',
  },
  topProgressBar: {
    height: '100%',
    backgroundColor: SAMGOLD_COLORS.primary,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: SAMGOLD_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  title: {
    color: SAMGOLD_COLORS.primary,
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  formGroup: {
    width: '100%',
    marginBottom: 24,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: SAMGOLD_COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: SAMGOLD_COLORS.cardBorder,
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backLinkText: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  
  // OTP Styles
  otpContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.cardBorder,
    borderRadius: 12,
    backgroundColor: SAMGOLD_COLORS.card,
    color: SAMGOLD_COLORS.foreground,
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
  },
  otpBoxFilled: {
    borderColor: SAMGOLD_COLORS.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  otpBoxError: {
    borderColor: SAMGOLD_COLORS.error,
    color: SAMGOLD_COLORS.error,
  },
  timerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  timerText: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  resendText: {
    color: SAMGOLD_COLORS.cyan,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  infoCard: {
    flexDirection: 'row-reverse',
    backgroundColor: '#0D2035',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  infoText: {
    flex: 1,
    color: SAMGOLD_COLORS.cyan,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },

  // Requirements Card
  requirementsCard: {
    width: '100%',
    backgroundColor: SAMGOLD_COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.cardBorder,
  },
  reqRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  reqDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.mutedDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  reqDotMet: {
    backgroundColor: SAMGOLD_COLORS.primary,
    borderColor: SAMGOLD_COLORS.primary,
  },
  reqText: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  reqTextMet: {
    color: SAMGOLD_COLORS.foreground,
  },

  // Success State
  successContainer: {
    justifyContent: 'center',
    paddingBottom: '20%',
  },
  successIconWrapper: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  successRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: SAMGOLD_COLORS.success,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  successGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
  },
  successDescription: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
});