import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SAMGOLD_COLORS } from '@/constants/colors';
import { FloatLabelInput } from '@/components/FloatLabelInput';
import { StepIndicator } from '@/components/StepIndicator';

const SPECIALTIES = [
  "مهندس جيوفيزياء",
  "مهندس مدني",
  "جيولوجي",
  "تقني مسح",
  "أكاديمي / باحث",
  "أخرى"
];

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organization: '',
    specialty: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeData: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Animations
  const progressWidth = useSharedValue(33);
  const slideX = useSharedValue(0);

  const updateProgress = (newStep: number) => {
    progressWidth.value = withTiming((newStep / 3) * 100, { duration: 300 });
  };

  const nextStep = () => {
    let newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = 'الاسم مطلوب';
      if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
      else if (!formData.email.includes('@')) newErrors.email = 'بريد إلكتروني غير صالح';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    } else if (step === 2) {
      if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
      else if (formData.password.length < 8) newErrors.password = 'يجب أن تكون 8 أحرف على الأقل';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});
    
    // Animate transition
    slideX.value = withTiming(-50, { duration: 150 }, () => {
      setStep(step + 1);
      updateProgress(step + 1);
      slideX.value = 50;
      slideX.value = withSpring(0, { damping: 15 });
    });
  };

  const prevStep = () => {
    if (step === 1) {
      router.back();
      return;
    }
    
    slideX.value = withTiming(50, { duration: 150 }, () => {
      setStep(step - 1);
      updateProgress(step - 1);
      slideX.value = -50;
      slideX.value = withSpring(0, { damping: 15 });
    });
  };

  const handleRegister = () => {
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      setErrors({ terms: 'يجب الموافقة على الشروط والسياسات الأساسية' });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(app)');
    }, 1500);
  };

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, color: SAMGOLD_COLORS.cardBorder, label: '' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score, color: SAMGOLD_COLORS.error, label: 'ضعيفة' };
    if (score === 2) return { score, color: '#F59E0B', label: 'مقبولة' };
    if (score === 3) return { score, color: '#10B981', label: 'جيدة' };
    return { score, color: SAMGOLD_COLORS.success, label: 'قوية جداً' };
  };

  const pwStrength = calculatePasswordStrength(formData.password);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
    opacity: withTiming(1, { duration: 200 }),
  }));

  const renderStep1 = () => (
    <Animated.View style={[styles.stepContainer, slideAnimatedStyle]}>
      <View style={styles.stepHeader}>
        <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>
        <Text style={styles.stepTitle}>معلوماتك الأساسية</Text>
      </View>
      <Text style={styles.stepSubtitle}>ادخل بياناتك الشخصية للبدء</Text>

      <FloatLabelInput
        label="الاسم الكامل"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        leftIcon="person-outline"
        error={errors.name}
      />
      <FloatLabelInput
        label="البريد الإلكتروني"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        leftIcon="mail-outline"
        keyboardType="email-address"
        error={errors.email}
        hint="سيُستخدم لتسجيل الدخول"
      />
      <FloatLabelInput
        label="رقم الجوال (اختياري)"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        leftIcon="call-outline"
        keyboardType="numeric"
      />

      <Pressable style={styles.nextButton} onPress={nextStep}>
        <Text style={styles.nextButtonText}>التالي — بيانات الحساب</Text>
        <Ionicons name="arrow-back" size={20} color="#000" />
      </Pressable>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View style={[styles.stepContainer, slideAnimatedStyle]}>
      <View style={styles.stepHeader}>
        <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
        <Text style={styles.stepTitle}>بيانات الحساب</Text>
      </View>
      
      <FloatLabelInput
        label="كلمة المرور"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        leftIcon="lock-closed-outline"
        rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
        onRightIconPress={() => setShowPassword(!showPassword)}
        secureTextEntry={!showPassword}
        error={errors.password}
      />
      
      {/* Password Strength Indicator */}
      {formData.password.length > 0 && (
        <View style={styles.strengthContainer}>
          <View style={styles.strengthBarsRow}>
            {[1, 2, 3, 4].map((num) => (
              <View 
                key={num} 
                style={[
                  styles.strengthBar, 
                  { backgroundColor: num <= pwStrength.score ? pwStrength.color : SAMGOLD_COLORS.cardBorder }
                ]} 
              />
            ))}
          </View>
          <Text style={[styles.strengthLabel, { color: pwStrength.color }]}>{pwStrength.label}</Text>
        </View>
      )}

      <FloatLabelInput
        label="تأكيد كلمة المرور"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        leftIcon="lock-closed-outline"
        secureTextEntry={!showPassword}
        error={errors.confirmPassword}
      />

      <FloatLabelInput
        label="الجهة أو المؤسسة (اختياري)"
        value={formData.organization}
        onChangeText={(text) => setFormData({ ...formData, organization: text })}
        leftIcon="business-outline"
      />

      <Pressable style={styles.pickerButton} onPress={() => setShowSpecialtyModal(true)}>
        <Ionicons name="chevron-down" size={20} color={SAMGOLD_COLORS.muted} />
        <View style={styles.pickerContent}>
          <Text style={formData.specialty ? styles.pickerTextActive : styles.pickerText}>
            {formData.specialty || 'التخصص المهني'}
          </Text>
          <Ionicons name="briefcase-outline" size={20} color={SAMGOLD_COLORS.muted} style={{ marginLeft: 12 }} />
        </View>
      </Pressable>

      <Pressable style={styles.nextButton} onPress={nextStep}>
        <Text style={styles.nextButtonText}>التالي — الموافقة</Text>
        <Ionicons name="arrow-back" size={20} color="#000" />
      </Pressable>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={[styles.stepContainer, slideAnimatedStyle]}>
      <View style={styles.stepHeader}>
        <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
        <Text style={styles.stepTitle}>مراجعة وموافقة</Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{formData.name.charAt(0) || 'U'}</Text>
          </View>
          <View style={styles.summaryDetails}>
            <Text style={styles.summaryName}>{formData.name}</Text>
            <Text style={styles.summaryEmail}>{formData.email}</Text>
          </View>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryRow}>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>مجاني</Text>
          </View>
          <Text style={styles.summaryLabel}>الخطة المختارة:</Text>
        </View>
        
        {formData.specialty && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryValue}>{formData.specialty}</Text>
            <Text style={styles.summaryLabel}>التخصص:</Text>
          </View>
        )}
      </View>

      <View style={styles.checkboxGroup}>
        <Pressable style={styles.checkboxRow} onPress={() => setFormData({ ...formData, agreeTerms: !formData.agreeTerms })}>
          <View style={[styles.checkbox, formData.agreeTerms && styles.checkboxActive]}>
            {formData.agreeTerms && <Ionicons name="checkmark" size={14} color={SAMGOLD_COLORS.background} />}
          </View>
          <Text style={styles.checkboxText}>أوافق على <Text style={styles.linkText}>شروط الاستخدام</Text></Text>
        </Pressable>

        <Pressable style={styles.checkboxRow} onPress={() => setFormData({ ...formData, agreePrivacy: !formData.agreePrivacy })}>
          <View style={[styles.checkbox, formData.agreePrivacy && styles.checkboxActive]}>
            {formData.agreePrivacy && <Ionicons name="checkmark" size={14} color={SAMGOLD_COLORS.background} />}
          </View>
          <Text style={styles.checkboxText}>أوافق على <Text style={styles.linkText}>سياسة الخصوصية</Text></Text>
        </Pressable>

        <Pressable style={styles.checkboxRow} onPress={() => setFormData({ ...formData, agreeData: !formData.agreeData })}>
          <View style={[styles.checkbox, formData.agreeData && styles.checkboxActive]}>
            {formData.agreeData && <Ionicons name="checkmark" size={14} color={SAMGOLD_COLORS.background} />}
          </View>
          <Text style={styles.checkboxText}>أوافق على استخدام بياناتي لتحسين الخدمة</Text>
        </Pressable>
      </View>

      {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color={SAMGOLD_COLORS.cyan} />
        <Text style={styles.infoText}>ستبدأ بالخطة المجانية مع إمكانية الترقية في أي وقت من داخل التطبيق.</Text>
      </View>

      <Pressable
        style={styles.submitButtonWrapper}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <LinearGradient
          colors={[SAMGOLD_COLORS.primaryLight, SAMGOLD_COLORS.primary, SAMGOLD_COLORS.primaryDark]}
          style={styles.submitButton}
        >
          {isLoading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text style={styles.submitButtonText}>إنشاء الحساب</Text>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar Top */}
      <View style={styles.topProgressTrack}>
        <Animated.View style={[styles.topProgressBar, progressAnimatedStyle]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} /> {/* Spacer for centering */}
        <Text style={styles.headerTitle}>إنشاء حساب جديد</Text>
        <Pressable onPress={prevStep} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color={SAMGOLD_COLORS.foreground} />
        </Pressable>
      </View>

      <StepIndicator steps={['أساسية', 'حساب', 'مراجعة']} currentStep={step} />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </KeyboardAwareScrollView>

      {/* Specialty Picker Modal */}
      <Modal visible={showSpecialtyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setShowSpecialtyModal(false)}>
                <Ionicons name="close" size={24} color={SAMGOLD_COLORS.foreground} />
              </Pressable>
              <Text style={styles.modalTitle}>اختر التخصص المهني</Text>
              <View style={{ width: 24 }} />
            </View>
            <ScrollView>
              {SPECIALTIES.map((spec, index) => (
                <Pressable
                  key={index}
                  style={styles.modalOption}
                  onPress={() => {
                    setFormData({ ...formData, specialty: spec });
                    setShowSpecialtyModal(false);
                  }}
                >
                  {formData.specialty === spec && (
                    <Ionicons name="checkmark" size={20} color={SAMGOLD_COLORS.primary} />
                  )}
                  <Text style={[styles.modalOptionText, formData.specialty === spec && { color: SAMGOLD_COLORS.primary, fontFamily: 'Inter_600SemiBold' }]}>
                    {spec}
                  </Text>
                  <Feather name="briefcase" size={20} color={SAMGOLD_COLORS.muted} style={{ marginLeft: 16 }} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  headerTitle: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  stepContainer: {
    flex: 1,
    marginTop: 16,
  },
  stepHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: SAMGOLD_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12, // RTL space
  },
  badgeText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  stepTitle: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  stepSubtitle: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 32,
    marginRight: 40, // RTL alignment with title
  },
  nextButton: {
    backgroundColor: SAMGOLD_COLORS.primary,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  
  // Step 2 specific
  strengthContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -8,
    paddingHorizontal: 4,
  },
  strengthBarsRow: {
    flexDirection: 'row-reverse',
    gap: 4,
    flex: 1,
    marginLeft: 16,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    width: 60,
    textAlign: 'left', // RTL
  },
  pickerButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    backgroundColor: SAMGOLD_COLORS.background,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  pickerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  pickerText: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  pickerTextActive: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },

  // Step 3 specific
  summaryCard: {
    backgroundColor: SAMGOLD_COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.cardBorder,
  },
  summaryHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  avatarText: {
    color: SAMGOLD_COLORS.primary,
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  summaryDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  summaryName: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  summaryEmail: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: SAMGOLD_COLORS.cardBorder,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: SAMGOLD_COLORS.muted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  summaryValue: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  planBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.success,
  },
  planBadgeText: {
    color: SAMGOLD_COLORS.success,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  checkboxGroup: {
    marginBottom: 24,
    gap: 16,
  },
  checkboxRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.mutedDark,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkboxActive: {
    backgroundColor: SAMGOLD_COLORS.primary,
    borderColor: SAMGOLD_COLORS.primary,
  },
  checkboxText: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    flex: 1,
    textAlign: 'right',
  },
  linkText: {
    color: SAMGOLD_COLORS.primary,
    fontFamily: 'Inter_500Medium',
  },
  infoCard: {
    flexDirection: 'row-reverse',
    backgroundColor: '#0D2035',
    borderWidth: 1,
    borderColor: SAMGOLD_COLORS.cyan,
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  infoText: {
    flex: 1,
    color: SAMGOLD_COLORS.cyan,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginRight: 12,
    textAlign: 'right',
    lineHeight: 20,
  },
  submitButtonWrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  errorText: {
    color: SAMGOLD_COLORS.error,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 16,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: SAMGOLD_COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: SAMGOLD_COLORS.cardBorder,
  },
  modalTitle: {
    color: SAMGOLD_COLORS.foreground,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  modalOption: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: SAMGOLD_COLORS.cardBorder,
  },
  modalOptionText: {
    flex: 1,
    textAlign: 'right',
    color: SAMGOLD_COLORS.foreground,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});
