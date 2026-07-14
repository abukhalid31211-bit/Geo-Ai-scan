import { motion } from 'framer-motion';

export function RadarBackground({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
      <motion.svg
        viewBox="0 0 800 800"
        className="w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw] max-w-none opacity-100"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <g stroke="hsl(var(--primary))" strokeOpacity={opacity} strokeWidth="1" fill="none">
          <circle cx="400" cy="400" r="80" />
          <circle cx="400" cy="400" r="160" />
          <circle cx="400" cy="400" r="240" />
          <circle cx="400" cy="400" r="320" />
          <circle cx="400" cy="400" r="400" />
          
          <line x1="400" y1="0" x2="400" y2="800" />
          <line x1="0" y1="400" x2="800" y2="400" />
          <line x1="117" y1="117" x2="683" y2="683" />
          <line x1="117" y1="683" x2="683" y2="117" />
          
          <circle cx="400" cy="400" r="4" fill="hsl(var(--primary))" fillOpacity={opacity * 2} />
        </g>
      </motion.svg>
    </div>
  );
}
