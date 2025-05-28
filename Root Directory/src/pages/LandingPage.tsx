import React, { FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, FileText, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const terminalWelcomeSequence = [
  "  >BOOTING PORTFOLIO SYSTEM v1.2.3",
  "  >Initializing core modules...",
  "  >Checking system integrity...",
  "  >Loading personal interface...",
  "  >Connecting neural networks...",
  "  >>> SYSTEM ONLINE <<<",
  "  >Welcome, User",
  `  Current Time: ${new Date().toLocaleString()}`,
  "  >Network Status: SECURE",
  "  >Ready for interaction..."
];


const LandingPage: FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isSystemReady, setIsSystemReady] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const displayTerminalLines = () => {
      terminalWelcomeSequence.forEach((line, index) => {
        setTimeout(() => {
          setTerminalLines(prev => [...prev, line]);

          if (index === terminalWelcomeSequence.length - 1) {
            setTimeout(() => setIsSystemReady(true), 300);
          }
        }, 250 * (index + 1));
      });
    };

    displayTerminalLines();
  }, []);

  const socialLinks = [
    {
      icon: <Linkedin className="mr-2 w-5 h-5" />,
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/justin-luft-ab2aa9224/"
    },
    {
      icon: <FileText className="mr-2 w-5 h-5" />,
      label: "Resume",
      url: "/resume.pdf"
    },
    {
      icon: <Github className="mr-2 w-5 h-5" />,
      label: "GitHub",
      url: "https://github.com/JustinLuft"
    }
  ];

  // Function to trigger resume download
  const downloadResume = () => {
    const a = document.createElement('a');
    a.href = '/resume.pdf'; // Make sure this file is publicly accessible
    a.download = 'Justin_Luft_Resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Terminal Background Effect */}
      <div className="absolute inset-0 bg-black/90 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 font-mono text-sm text-green-400 p-4 whitespace-pre-wrap overflow-hidden">
          {terminalLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              dangerouslySetInnerHTML={{ __html: line }}
              className="terminal-line"
            />
          ))}
        </div>

        {/* Scanline and CRT Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
          <div className="absolute inset-0 opacity-10 bg-grid-subtle" />
          <div className="scanline absolute inset-0" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-press-start text-primary text-center mb-8 text-glitch"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isSystemReady ? 1 : 0, y: isSystemReady ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          JUSTIN LUFT
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl font-vt323 text-primary mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isSystemReady ? 1 : 0 }}
          transition={{ delay: 0.3 }}
        >
          Computer Scientist
        </motion.p>

        {isSystemReady && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex gap-8 mb-12">
              {socialLinks.map((link, index) => {
                // Special case for Resume: trigger download instead of open
                if (link.label === 'Resume') {
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="outline"
                        className="font-press-start text-primary border-primary hover:bg-primary/20 hover:text-primary neon-border"
                        onClick={downloadResume}
                      >
                        {link.icon}
                        {link.label}
                      </Button>
                    </motion.div>
                  );
                }

                // Other links open normally
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="outline"
                      className="font-press-start text-primary border-primary hover:bg-primary/20 hover:text-primary neon-border"
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      {link.icon}
                      {link.label}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

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
