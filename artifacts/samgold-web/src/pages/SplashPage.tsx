import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { RadarBackground } from '@/components/RadarBackground';

export default function SplashPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      const seen = localStorage.getItem('sg_onboarding_seen');
      if (seen === '1') {
        setLocation('/login');
      } else {
        setLocation('/onboarding');
      }
    }, 3100);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center overflow-hidden">
      <RadarBackground opacity={0.05} />
      
      <div className="z-10 flex flex-col items-center justify-center flex-1 w-full">
        <div className="relative flex items-center justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 flex items-center justify-center z-10"
          >
            <span className="text-[#F5F0E8] font-bold text-3xl">SG</span>
          </motion.div>
          
          <motion.div
            className="absolute w-20 h-20 rounded-full border border-primary z-0"
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-primary font-bold text-3xl tracking-[0.2em] mb-1">SAMGOLD</h1>
          <p className="text-muted-foreground text-sm">المسح الشامل والكشف الذكي</p>
          <div className="w-40 h-px bg-primary/40 mx-auto mt-4" />
        </motion.div>
      </div>

      <div className="w-full flex flex-col items-center justify-center pb-8 z-10">
        <div className="w-2/3 h-0.5 bg-border rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground opacity-30">SAMGOLD &copy; 2025</p>
      </div>
    </div>
  );
}
