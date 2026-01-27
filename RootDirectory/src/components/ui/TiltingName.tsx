import React, { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Letter3D from '@/components/ui/Letter3D';

interface TiltingNameProps {
  name: string;
  isReady: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  interactionRadius?: number; // in pixels
  letterSpacing?: number; // in pixels
}

const TiltingName: FC<TiltingNameProps> = ({ 
  name, 
  isReady, 
  className = '',
  size = 'xl',
  interactionRadius = 300,
  letterSpacing = 3,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sizeClasses = {
    'sm': 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl gap-2',
    'md': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl gap-2 md:gap-4',
    'lg': 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl gap-3 md:gap-5',
    'xl': 'text-4xl sm:text-5xl md:text-7xl lg:text-9xl gap-3 md:gap-6',
    '2xl': 'text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] gap-4 md:gap-8',
    '3xl': 'text-6xl sm:text-7xl md:text-9xl lg:text-[12rem] gap-5 md:gap-10',
  };

  return (
    <motion.div
      className={`perspective-container ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`font-press-start text-primary text-center mb-8 flex justify-center ${sizeClasses[size]}`}>
        {name.split('').map((char, index) => (
          <Letter3D
            key={index}
            char={char}
            index={index}
            isReady={isReady}
            mousePosition={mousePosition}
            interactionRadius={interactionRadius}
            letterSpacing={letterSpacing}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TiltingName;
