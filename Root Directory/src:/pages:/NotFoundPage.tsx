import React, { useEffect } from 'react';
import { useLocation, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      `%c404 ERROR: SYSTEM BREACH DETECTED %c
  Unauthorized Access Attempt: ${location.pathname}
  Timestamp: ${new Date().toLocaleString()}
  Status: BLOCKED`,
      'color: red; font-weight: bold; background: black; padding: 4px;',
      'color: yellow;'
    );
  }, [location.pathname]);

  const glitchVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const glitchTextVariants = {
    initial: { 
      opacity: 0,
      x: -20,
      textShadow: '0 0 0 transparent'
    },
    animate: { 
      opacity: 1, 
      x: 0,
      textShadow: [
        '2px 2px 0px rgba(255,0,0,0.5)',
        '2px -2px 0px rgba(0,255,255,0.5)',
        '0 0 5px rgba(255,255,255,0.2)'
      ],
      transition: {
        duration: 0.3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0B0C10] to-[#1A1E23] opacity-90" />
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
        
        {/* Scanline Effect */}
        <div className="scanline absolute inset-0 pointer-events-none" />
        
        {/* Glitch Particle Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-2 h-2 bg-primary rounded-full animate-ping" style={{ top: '20%', left: '30%' }} />
          <div className="absolute w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ bottom: '15%', right: '25%' }} />
        </div>
      </div>

      {/* Content Container */}
      <motion.div 
        initial="initial"
        animate="animate"
        variants={glitchVariants}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
      >
        <motion.div 
          variants={glitchTextVariants} 
          className="text-center"
        >
          <motion.h1 
            className="text-[8rem] font-press-start text-primary mb-4 relative"
          >
            404
            <AlertTriangle 
              className="absolute -top-10 -right-10 text-secondary animate-pulse" 
              size={48} 
            />
          </motion.h1>
          
          <motion.h2 
            variants={glitchTextVariants}
            className="text-3xl font-press-start text-primary mb-6"
          >
            SYSTEM BREACH DETECTED
          </motion.h2>
          
          <motion.p 
            variants={glitchTextVariants}
            className="text-xl font-vt323 text-primary/80 mb-8 max-w-md mx-auto"
          >
            Unauthorized route access. The requested path 
            <span className="text-secondary ml-2 italic">
              {location.pathname}
            </span> 
            is not recognized by the system.
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          variants={glitchVariants}
          className="flex space-x-4"
        >
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2" /> Reload System
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-secondary text-secondary hover:bg-secondary/10"
            as={Link}
            to="/"
          >
            <Home className="mr-2" /> Return to Home
          </Button>
        </motion.div>
      </motion.div>

      {/* Terminal-like Error Log */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <pre className="bg-black/70 text-green-400 p-2 rounded font-mono text-xs overflow-x-auto">
          {`> ERROR: ROUTE NOT FOUND
  Path: ${location.pathname}
  Timestamp: ${new Date().toLocaleString()}
  Status: 404 - SYSTEM BLOCKED`}
        </pre>
      </div>
    </div>
  );
};

export default NotFound;
