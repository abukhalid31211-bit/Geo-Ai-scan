import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { RadarBackground } from '@/components/RadarBackground';
import { FloatLabelInput } from '@/components/FloatLabelInput';
import { GoldButton } from '@/components/GoldButton';
import { Checkbox } from '@/components/ui/checkbox';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShake, setIsShake] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLocation('/app');
    }, 1500);
  };

  const onError = () => {
    setIsShake(true);
    setTimeout(() => setIsShake(false), 500);
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col justify-center overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent opacity-5 blur-3xl pointer-events-none" />
      <RadarBackground opacity={0.03} />

      <div className="w-full max-w-sm mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
            <span className="text-[#F5F0E8] font-bold text-xl">SG</span>
          </div>
          <h1 className="text-primary font-bold text-2xl tracking-widest">SAMGOLD</h1>
          <p className="text-muted-foreground text-sm mt-1">مرحباً بعودتك</p>
        </div>

        <div className={`bg-card border border-card-border rounded-2xl p-6 shadow-2xl ${isShake ? 'animate-shake' : ''}`}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
            
            <FloatLabelInput
              label="البريد الإلكتروني"
              type="email"
              {...form.register('email')}
              error={form.formState.errors.email?.message}
            />

            <FloatLabelInput
              label="كلمة المرور"
              type={showPassword ? 'text' : 'password'}
              {...form.register('password')}
              error={form.formState.errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  onCheckedChange={(checked) => form.setValue('remember', checked as boolean)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm text-foreground select-none">تذكّرني</span>
              </label>
              
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <GoldButton type="submit" loading={isLoading} className="mt-6">
              تسجيل الدخول
            </GoldButton>
          </form>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-border flex-1" />
            <span className="text-muted-foreground text-sm">أو</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <button className="w-full h-11 border border-border rounded-xl flex items-center justify-center gap-3 hover:bg-secondary transition-colors text-foreground text-sm font-medium">
            <div className="w-6 h-6 rounded-full border border-primary text-primary flex items-center justify-center font-bold text-xs">
              G
            </div>
            الدخول بحساب Google
          </button>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">ليس لديك حساب؟ </span>
            <Link href="/register" className="text-primary font-bold hover:underline">
              سجّل الآن
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
