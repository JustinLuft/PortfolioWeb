import { FC, useEffect, useState } from 'react';
import { Power, Terminal, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const LandingPage: FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEnterSystem = () => {
    navigate('/projects');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg" />

      {/* Scanline Effect */}
      <div className="scanline" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main Title with Glitch Effect */}
        <motion.h1 
          className="text-4xl md:text-6xl font-press-start text-primary text-center mb-8 text-glitch"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          JUSTIN LUFT
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-xl md:text-2xl font-vt323 text-primary mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Software Engineer | Full Stack Developer
        </motion.p>

        {/* Icon Container */}
        <div className="flex gap-8 mb-12">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="neon-text p-4"
          >
            <Terminal size={32} />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="neon-text p-4"
          >
            <Code size={32} />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="neon-text p-4"
          >
            <Power size={32} />
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button 
            variant="outline" 
            className="font-press-start text-primary border-primary hover:bg-primary/20 hover:text-primary neon-border"
            onClick={handleEnterSystem}
          >
            ENTER SYSTEM
          </Button>
        </motion.div>

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-[-1]">
          <img 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f"
            alt="Cyberpunk Background"
            className="object-cover w-full h-full opacity-20"
          />
        </div>

        {/* Mouse Trail Effect */}
        <motion.div
          className="pointer-events-none fixed top-0 left-0 w-6 h-6 rounded-full bg-primary/50 mix-blend-screen"
          animate={{
            x: mousePosition.x - 12,
            y: mousePosition.y - 12,
          }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  );
};

export default LandingPage;
```
