import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { ChevronRight, Mail, Lock, KeyRound, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatLabelInput } from '@/components/FloatLabelInput';
import { GoldButton } from '@/components/GoldButton';

type Phase = 'email' | 'otp' | 'newPassword' | 'success';

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<Phase>('email');
  
  // State for email phase
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // State for OTP phase
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(120);

  // State for password phase
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [phase, countdown]);

  const progressMap = {
    email: '25%',
    otp: '50%',
    newPassword: '75%',
    success: '100%',
  };

  const goBack = () => {
    if (phase === 'email') setLocation('/login');
    if (phase === 'otp') setPhase('email');
    if (phase === 'newPassword') setPhase('otp');
  };

  const handleEmailSubmit = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('الرجاء إدخال بريد إلكتروني صالح');
      return;
    }
    setEmailError('');
    setPhase('otp');
    setCountdown(120);
    setOtp(['', '', '', '', '', '']);
    setOtpError(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError(false);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = () => {
    const code = otp.join('');
    if (code === '000000') {
      setOtpError(true);
      return;
    }
    setPhase('newPassword');
  };

  const isPasswordValid = {
    length: password.length >= 8,
    number: /\d/.test(password),
    upper: /[A-Z]/.test(password),
  };
  const allValid = Object.values(isPasswordValid).every(Boolean);

  const handlePasswordSubmit = () => {
    if (allValid && password === confirmPassword) {
      setPhase('success');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {phase !== 'success' && (
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md">
          <div className="h-0.5 w-full bg-border">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: progressMap[phase] }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex items-center p-4 max-w-sm mx-auto">
            <button onClick={goBack} className="p-2 -mr-2 text-foreground hover:bg-secondary rounded-full transition-colors absolute">
              <ChevronRight size={24} />
            </button>
            <h1 className="font-bold flex-1 text-center">
              {phase === 'email' && 'استعادة الحساب'}
              {phase === 'otp' && 'رمز التحقق'}
              {phase === 'newPassword' && 'كلمة مرور جديدة'}
            </h1>
          </div>
        </header>
      )}

      <div className="flex-1 w-full max-w-sm mx-auto px-4 py-8 relative">
        <AnimatePresence mode="wait">
          {phase === 'email' && (
            <motion.div
              key="email"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-card border border-primary/30 flex items-center justify-center">
                <Mail className="text-primary size-8" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">أدخل بريدك الإلكتروني</h2>
                <p className="text-sm text-muted-foreground mt-2">سنرسل لك رمز تحقق مكون من 6 أرقام لاستعادة حسابك.</p>
              </div>

              <div className="space-y-4">
                <FloatLabelInput
                  label="البريد الإلكتروني"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  autoFocus
                />
                <GoldButton onClick={handleEmailSubmit}>إرسال الرمز</GoldButton>
              </div>

              <div className="text-center">
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </motion.div>
          )}

          {phase === 'otp' && (
            <motion.div
              key="otp"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-card border border-primary/30 flex items-center justify-center">
                <Lock className="text-primary size-8" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">رمز التحقق</h2>
                <p className="text-sm text-primary mt-2">تم إرسال الرمز إلى<br/>{email}</p>
              </div>

              <div className="flex justify-center gap-2 rtl:flex-row-reverse" dir="ltr">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-11 h-14 text-center text-xl font-bold bg-card border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-foreground outline-none transition-all ${
                      otpError ? 'border-destructive focus:border-destructive animate-shake' : 'border-border'
                    }`}
                  />
                ))}
              </div>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    إعادة الإرسال بعد {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </p>
                ) : (
                  <button onClick={() => setCountdown(120)} className="text-sm text-accent underline">
                    إعادة إرسال الرمز
                  </button>
                )}
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 flex gap-3 items-start">
                <Info className="text-accent shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-accent">تحقق من مجلد البريد غير المرغوب فيه إذا لم تجد الرسالة.</p>
              </div>

              <GoldButton 
                onClick={handleOtpSubmit} 
                disabled={otp.some(d => !d)}
              >
                التحقق من الرمز
              </GoldButton>
            </motion.div>
          )}

          {phase === 'newPassword' && (
            <motion.div
              key="newPassword"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-card border border-primary/30 flex items-center justify-center">
                <KeyRound className="text-primary size-8" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">كلمة مرور جديدة</h2>
                <p className="text-sm text-muted-foreground mt-2">اختر كلمة مرور قوية لتأمين حسابك.</p>
              </div>

              <div className="space-y-4">
                <FloatLabelInput
                  label="كلمة المرور الجديدة"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  rightElement={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1 text-muted-foreground">
                      {showPassword ? <Lock size={18} /> : <KeyRound size={18} />}
                    </button>
                  }
                />
                
                <FloatLabelInput
                  label="تأكيد كلمة المرور"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={confirmPassword && password !== confirmPassword ? "كلمات المرور غير متطابقة" : undefined}
                />
              </div>

              <div className="bg-secondary rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  {isPasswordValid.length ? <Check className="text-primary" size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-primary/50 ml-1 mr-0.5" />}
                  <span className={isPasswordValid.length ? "text-foreground" : "text-muted-foreground"}>٨ أحرف على الأقل</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {isPasswordValid.number ? <Check className="text-primary" size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-primary/50 ml-1 mr-0.5" />}
                  <span className={isPasswordValid.number ? "text-foreground" : "text-muted-foreground"}>رقم واحد على الأقل</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {isPasswordValid.upper ? <Check className="text-primary" size={16} /> : <div className="w-1.5 h-1.5 rounded-full bg-primary/50 ml-1 mr-0.5" />}
                  <span className={isPasswordValid.upper ? "text-foreground" : "text-muted-foreground"}>حرف كبير واحد على الأقل</span>
                </div>
              </div>

              <GoldButton 
                onClick={handlePasswordSubmit}
                disabled={!allValid || password !== confirmPassword}
              >
                حفظ كلمة المرور
              </GoldButton>
            </motion.div>
          )}

          {phase === 'success' && (
            <motion.div
              key="success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-full flex flex-col items-center justify-center space-y-6 pt-12"
            >
              <div className="relative">
                <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center relative z-10">
                  <Check className="text-white size-14" />
                </div>
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border-2 border-green-500 z-0"
                />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">تمّت العملية بنجاح!</h2>
                <p className="text-sm text-muted-foreground mt-2">يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة</p>
              </div>

              <div className="w-full pt-6">
                <GoldButton onClick={() => setLocation('/login')}>تسجيل الدخول</GoldButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
