import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { GoldButton } from '@/components/GoldButton';

const slides = [
  {
    id: 0,
    title: 'حوّل هاتفك إلى محطة ميدانية',
    description: 'يعمل بدون اتصال بالإنترنت في الحقل، مع دقة قياسية لجميع أنواع المسح',
    titleColor: 'text-primary',
  },
  {
    id: 1,
    title: 'الكاشف الذكي بالذكاء الاصطناعي',
    description: 'يحلل البيانات الجيوفيزيائية ويكتشف الأهداف الباطنية بدقة ٨٩٪',
    titleColor: 'text-accent',
  },
  {
    id: 2,
    title: 'رؤية ثلاثية الأبعاد',
    description: 'اقرأ طبقات الأرض بدقة وصدّر تقارير ثلاثية الأبعاد للعملاء',
    titleColor: 'text-green-400',
  }
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();

  const handleNext = () => {
    if (currentSlide < 2) {
      setCurrentSlide(prev => prev + 1);
    } else {
      localStorage.setItem('sg_onboarding_seen', '1');
      setLocation('/login');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('sg_onboarding_seen', '1');
    setLocation('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 z-20">
        <div className="text-primary font-bold">SG</div>
        {currentSlide < 2 && (
          <button 
            onClick={handleSkip}
            className="text-sm text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
            data-testid="button-skip"
          >
            تخطي
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-24 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: -100, opacity: 0 }} // RTL: coming from right
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-sm mx-auto"
          >
            {/* Slide Illustrations */}
            <div className="h-56 mb-8 flex items-center justify-center relative">
              {currentSlide === 0 && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-24 h-48 border-2 border-primary rounded-3xl relative flex items-center justify-center overflow-hidden">
                    <div className="absolute top-2 w-8 h-1 bg-primary/30 rounded-full" />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full border border-primary/50 opacity-20" />
                      <div className="w-12 h-12 rounded-full border border-primary/50 opacity-40 absolute" />
                      <div className="w-16 h-16 rounded-full border border-primary/50 opacity-60 absolute" />
                    </div>
                  </div>
                  
                  <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-2 top-10 bg-[#141A2E] border border-cyan-500/30 px-3 py-1 rounded-full shadow-lg">
                    <span className="text-cyan-400 text-xs font-bold">GPR</span>
                  </motion.div>
                  <motion.div animate={{ y: [6, -6, 6] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="absolute -left-4 top-20 bg-[#141A2E] border border-orange-500/30 px-3 py-1 rounded-full shadow-lg">
                    <span className="text-orange-500 text-xs font-bold">ERT</span>
                  </motion.div>
                  <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute right-4 bottom-10 bg-[#141A2E] border border-green-500/30 px-3 py-1 rounded-full shadow-lg">
                    <span className="text-green-500 text-xs font-bold">طبوغرافيا</span>
                  </motion.div>
                </div>
              )}

              {currentSlide === 1 && (
                <div className="relative w-full h-full flex items-center justify-center flex-col">
                  <div className="grid grid-cols-5 gap-1 p-2 rounded-xl border border-border bg-card w-40 h-40 overflow-hidden relative">
                    {Array.from({ length: 25 }).map((_, i) => {
                      const row = Math.floor(i / 5);
                      const col = i % 5;
                      const distToCenter = Math.abs(row - 2) + Math.abs(col - 2);
                      const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-cyan-500', 'bg-blue-600'];
                      return (
                        <div key={i} className={`rounded-sm opacity-80 ${colors[Math.min(distToCenter, 4)]}`} />
                      );
                    })}
                    <motion.div
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-8 bg-gradient-to-b from-transparent to-accent/40 border-b-2 border-accent"
                    />
                  </div>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -right-4 bottom-4 bg-card border border-border p-3 rounded-xl shadow-2xl z-10 text-center"
                  >
                    <div className="text-primary text-3xl font-bold">٨٩٪</div>
                    <div className="text-xs text-muted-foreground mt-1">احتمال فراغ</div>
                    <div className="text-xs text-accent mt-1">عمق: ٤.٢ م</div>
                  </motion.div>
                </div>
              )}

              {currentSlide === 2 && (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                  <div className="w-full flex">
                    <div className="flex-1 flex flex-col gap-1 w-full pl-4">
                      <div className="w-full h-6 rounded-md bg-gray-500/20 border border-gray-500/30" />
                      <div className="w-full h-10 rounded-md bg-[#D4A86A]/20 border border-[#D4A86A]/30" />
                      <div className="w-full h-12 rounded-md bg-[#8B5E3C]/20 border border-[#8B5E3C]/30 relative flex items-center justify-center">
                        <motion.div 
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-16 h-6 bg-purple-500/50 rounded-full blur-sm"
                        />
                      </div>
                      <div className="w-full h-8 rounded-md bg-gray-800 border border-gray-700" />
                      <div className="w-full h-6 rounded-md bg-[#1E3A5F]/40 border border-[#1E3A5F]" />
                    </div>
                    <div className="w-6 border-r border-border flex flex-col justify-between py-1 items-end pr-2 text-[10px] text-muted-foreground">
                      <span>1m</span>
                      <span>2m</span>
                      <span>3m</span>
                      <span>4m</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-6">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#D4A86A]/50"/> <span className="text-[10px] text-muted-foreground">رمل</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#8B5E3C]/50"/> <span className="text-[10px] text-muted-foreground">طين</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-500/50"/> <span className="text-[10px] text-muted-foreground">فراغ</span></div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <h2 className={`text-2xl font-bold mb-3 ${slides[currentSlide].titleColor}`}>
                {slides[currentSlide].title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-20">
        <div className="max-w-sm mx-auto flex flex-col items-center gap-6">
          {/* Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((idx) => (
              <div 
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-6 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          <GoldButton 
            onClick={handleNext}
            className="w-full"
            data-testid="button-next"
          >
            {currentSlide < 2 ? 'التالي' : 'ابدأ الآن'}
          </GoldButton>
        </div>
      </div>
    </div>
  );
}
