import { Link } from 'wouter';
import { RadarBackground } from '@/components/RadarBackground';

export default function AppPage() {
  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center overflow-hidden">
      <RadarBackground opacity={0.05} />
      
      <div className="z-10 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
          <span className="text-[#F5F0E8] font-bold text-3xl">SG</span>
        </div>
        
        <h1 className="text-primary font-bold text-3xl tracking-[0.2em] mb-2">SAMGOLD</h1>
        <p className="text-muted-foreground mb-12">مرحباً بك في المنصة</p>
        
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground underline transition-colors">
          تسجيل الخروج
        </Link>
      </div>
    </div>
  );
}
