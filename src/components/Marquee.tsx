import React from 'react';
import { motion } from 'motion/react';

interface MarqueeProps {
  text: string;
  speed?: number;
  className?: string;
  direction?: 'left' | 'right';
}

export default function Marquee({ text, speed = 40, className = "", direction = 'left' }: MarqueeProps) {
  return (
    <div className={`overflow-hidden whitespace-nowrap flex py-4 ${className}`}>
      <motion.div
        animate={{ x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ 
          duration: speed, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex gap-4 items-center"
      >
        <span className="text-4xl md:text-6xl font-serif italic uppercase tracking-tighter text-white/10 mx-4">
          {text} • {text} • {text} • {text} • {text} • {text}
        </span>
        <span className="text-4xl md:text-6xl font-serif italic uppercase tracking-tighter text-white/10 mx-4">
          {text} • {text} • {text} • {text} • {text} • {text}
        </span>
      </motion.div>
    </div>
  );
}
