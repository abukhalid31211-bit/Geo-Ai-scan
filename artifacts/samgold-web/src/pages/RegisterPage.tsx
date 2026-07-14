import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { ChevronRight, User, Mail, Phone, Eye, EyeOff, Building, Check, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FloatLabelInput } from '@/components/FloatLabelInput';
import { GoldButton } from '@/components/GoldButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const step1Schema = z.object({
  fullName: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  phone: z.string().optional(),
});

const step2Schema = z.object({
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  confirmPassword: z.string(),
  institution: z.string().optional(),
  specialty: z.string().min(1, 'الرجاء اختيار التخصص'),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"]
});

const step3Schema = z.object({
  terms: z.literal(true, { errorMap: () => ({ message: "يجب الموافقة على الشروط" }) }),
  privacy: z.literal(true, { errorMap: () => ({ message: "يجب الموافقة على الخصوصية" }) }),
  analytics: z.boolean().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data>>({});
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema), defaultValues: { specialty: '' } });
  const form3 = useForm<Step3Data>({ 
    resolver: zodResolver(step3Schema),
    defaultValues: { terms: undefined, privacy: undefined, analytics: true }
  });

  const goBack = () => {
    if (step === 1) setLocation('/login');
    else setStep(prev => (prev - 1) as 1 | 2 | 3);
  };

  const onStep1Submit = (data: Step1Data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(2);
  };

  const onStep2Submit = (data: Step2Data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  const onStep3Submit = (data: Step3Data) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLocation('/app');
    }, 1500);
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-muted' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/\d/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score === 1) return { score, label: 'ضعيفة', color: 'bg-red-500' };
    if (score === 2) return { score, label: 'مقبولة', color: 'bg-orange-500' };
    if (score === 3) return { score, label: 'جيدة', color: 'bg-amber-500' };
    return { score: 4, label: 'قوية جداً', color: 'bg-green-500' };
  };

  const currentPass = form2.watch('password');
  const passStrength = getPasswordStrength(currentPass);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4 max-w-sm mx-auto">
          <button onClick={goBack} className="p-2 -mr-2 text-foreground hover:bg-secondary rounded-full transition-colors">
            <ChevronRight size={24} />
          </button>
          <h1 className="font-bold">إنشاء حساب جديد</h1>
          <span className="text-sm text-muted-foreground font-mono">{step} / 3</span>
        </div>
        <div className="h-0.5 w-full bg-border">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      {/* Step Indicators */}
      <div className="max-w-sm mx-auto w-full px-8 py-6 relative z-10">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border -z-10 translate-y-[-50%]" />
          {[1, 2, 3].map((s) => {
            const isActive = step === s;
            const isDone = step > s;
            return (
              <div 
                key={s} 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isActive ? 'bg-primary text-card shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 
                  isDone ? 'bg-primary/20 border border-primary text-primary' : 
                  'bg-secondary border border-border text-muted-foreground'
                }`}
              >
                {isDone ? <Check size={16} /> : s}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-sm mx-auto px-4 pb-12 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="bg-card border border-card-border rounded-2xl p-6"
            >
              <div className="mb-6">
                <div className="w-8 h-8 bg-primary/20 text-primary font-bold rounded-lg flex items-center justify-center mb-3">١</div>
                <h2 className="text-xl font-bold text-foreground">معلوماتك الأساسية</h2>
                <p className="text-sm text-muted-foreground mt-1">دعنا نتعرف عليك لبناء ملفك الشخصي</p>
              </div>

              <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-4">
                <FloatLabelInput
                  label="الاسم الكامل"
                  {...form1.register('fullName')}
                  leftIcon={<User size={18} />}
                  error={form1.formState.errors.fullName?.message}
                />
                
                <div>
                  <FloatLabelInput
                    label="البريد الإلكتروني"
                    type="email"
                    {...form1.register('email')}
                    leftIcon={<Mail size={18} />}
                    error={form1.formState.errors.email?.message}
                  />
                  {!form1.formState.errors.email && <p className="text-xs text-muted-foreground mt-1 px-1">سيُستخدم للدخول إلى حسابك</p>}
                </div>
                
                <FloatLabelInput
                  label="رقم الجوال (اختياري)"
                  type="tel"
                  {...form1.register('phone')}
                  leftIcon={<Phone size={18} />}
                />
                
                <GoldButton type="submit" className="mt-6">التالي — بيانات الحساب</GoldButton>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="bg-card border border-card-border rounded-2xl p-6"
            >
              <div className="mb-6">
                <div className="w-8 h-8 bg-primary/20 text-primary font-bold rounded-lg flex items-center justify-center mb-3">٢</div>
                <h2 className="text-xl font-bold text-foreground">بيانات الحساب</h2>
                <p className="text-sm text-muted-foreground mt-1">تأمين حسابك وتحديد تخصصك</p>
              </div>

              <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-4">
                <div>
                  <FloatLabelInput
                    label="كلمة المرور"
                    type={showPassword ? 'text' : 'password'}
                    {...form2.register('password')}
                    error={form2.formState.errors.password?.message}
                    rightElement={
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />
                  {currentPass && (
                    <div className="mt-2">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map(s => (
                          <div key={s} className={`flex-1 rounded-full ${s <= passStrength.score ? passStrength.color : 'bg-muted'}`} />
                        ))}
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground">{passStrength.label}</p>
                    </div>
                  )}
                </div>

                <FloatLabelInput
                  label="تأكيد كلمة المرور"
                  type={showConfirm ? 'text' : 'password'}
                  {...form2.register('confirmPassword')}
                  error={form2.formState.errors.confirmPassword?.message}
                  rightElement={
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="p-1 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                <FloatLabelInput
                  label="الجهة أو المؤسسة (اختياري)"
                  {...form2.register('institution')}
                  leftIcon={<Building size={18} />}
                />

                <div className="space-y-1">
                  <Controller
                    name="specialty"
                    control={form2.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`h-[54px] rounded-xl border ${form2.formState.errors.specialty ? 'border-destructive focus:ring-destructive/30' : 'border-border focus:border-primary focus:ring-primary/30'} bg-transparent`}>
                          <SelectValue placeholder="اختر التخصص..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-popover-border rounded-xl">
                          <SelectItem value="مهندس جيوفيزياء">مهندس جيوفيزياء</SelectItem>
                          <SelectItem value="مهندس مدني">مهندس مدني</SelectItem>
                          <SelectItem value="جيولوجي">جيولوجي</SelectItem>
                          <SelectItem value="تقني مسح">تقني مسح</SelectItem>
                          <SelectItem value="أكاديمي / باحث">أكاديمي / باحث</SelectItem>
                          <SelectItem value="أخرى">أخرى</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form2.formState.errors.specialty && <p className="text-xs text-destructive px-1">{form2.formState.errors.specialty.message}</p>}
                </div>
                
                <GoldButton type="submit" className="mt-6">التالي — الموافقة</GoldButton>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="bg-card border border-card-border rounded-2xl p-6"
            >
              <div className="mb-6">
                <div className="w-8 h-8 bg-primary/20 text-primary font-bold rounded-lg flex items-center justify-center mb-3">٣</div>
                <h2 className="text-xl font-bold text-foreground">مراجعة وموافقة</h2>
                <p className="text-sm text-muted-foreground mt-1">خطوة أخيرة لإتمام التسجيل</p>
              </div>

              <div className="bg-secondary rounded-xl p-4 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  {formData.fullName?.charAt(0) || 'S'}
                </div>
                <div>
                  <h3 className="font-bold">{formData.fullName}</h3>
                  <p className="text-xs text-muted-foreground">{formData.email}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-background px-2 py-0.5 rounded text-muted-foreground">{formData.specialty}</span>
                    <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded">مجاني</span>
                  </div>
                </div>
              </div>

              <form onSubmit={form3.handleSubmit(onStep3Submit)} className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Controller
                      name="terms"
                      control={form3.control}
                      render={({ field }) => (
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      )}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">أوافق على شروط الاستخدام</span>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Controller
                      name="privacy"
                      control={form3.control}
                      render={({ field }) => (
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      )}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors">أوافق على سياسة الخصوصية</span>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Controller
                      name="analytics"
                      control={form3.control}
                      render={({ field }) => (
                        <Checkbox 
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      )}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <span className="text-sm text-muted-foreground">أوافق على استخدام بياناتي لتحسين الخدمة</span>
                    </div>
                  </label>
                </div>
                
                {(form3.formState.errors.terms || form3.formState.errors.privacy) && (
                  <p className="text-xs text-destructive px-1">الرجاء الموافقة على الشروط والخصوصية للمتابعة</p>
                )}

                <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 flex gap-3 items-start mt-6">
                  <Info className="text-accent shrink-0 mt-0.5" size={16} />
                  <p className="text-sm text-accent">ستبدأ بالخطة المجانية مع إمكانية الترقية في أي وقت من داخل التطبيق.</p>
                </div>

                <GoldButton type="submit" loading={isLoading} className="mt-6">إنشاء الحساب</GoldButton>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
