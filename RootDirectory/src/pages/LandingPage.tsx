import React, { FC, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, FileText, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TiltingName from '@/components/ui/TiltingName';

const LandingPage: FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const hasRun = useRef(false);
  const [flashResume, setFlashResume] = useState(false);

  const terminalWelcomeSequence = [
    "> Deploying Vite + React build to Vercel",
    "> Initializing TypeScript environment",
    "> Verifying build integrity",
    "> Loading portfolio modules",
    "> Compiling interactive UI renderer",
    ">>> DEPLOYMENT ONLINE <<<",
    "> Production: https://justinluftportfolio.vercel.app/",
    `> Build Time: ${new Date().toLocaleTimeString()}`,
    "> Network Status: Secure",
    "> Awaiting user interaction..."
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isSystemReady) return; // only start flashing after system ready

    const interval = setInterval(() => {
      setFlashResume(true); // start flash
      const timeout = setTimeout(() => setFlashResume(false), 4000); // end flash 

      return () => clearTimeout(timeout); // clean up timeout if needed
    }, 10000); // toggle every 10s

    return () => clearInterval(interval);
  }, [isSystemReady]);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    terminalWelcomeSequence.forEach((line, index) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line]);
        if (index === terminalWelcomeSequence.length - 1) setTimeout(() => setIsSystemReady(true), 300);
      }, 250 * (index + 1));
    });
  }, []);

  const downloadResume = () => {
    const a = document.createElement('a');
    a.href = '/JustinLuftResume.pdf';
    a.download = 'Justin_Luft_Resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setResumeModalOpen(false);
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendResume = async () => {
    if (!email) {
      setStatusType('error');
      setStatusMessage('Please enter your email.');
      return;
    }

    if (!validateEmail(email)) {
      setStatusType('error');
      setStatusMessage('Invalid email format.');
      return;
    }

    setSending(true);
    setStatusMessage('');
    try {
      const res = await fetch('/api/sendResume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusType('success');
        setStatusMessage('Resume sent successfully!');
        setEmail('');
        setIsEmailMode(false);
      } else {
        setStatusType('error');
        setStatusMessage(data.error || 'Error sending resume.');
      }
    } catch (err) {
      console.error(err);
      setStatusType('error');
      setStatusMessage('Unexpected error sending resume.');
    } finally {
      setSending(false);
    }
  };

  const socialLinks = [
    { icon: <Linkedin className="mr-2 w-5 h-5" />, label: "LinkedIn", url: "http://www.linkedin.com/in/justinnl" },
    { icon: <Github className="mr-2 w-5 h-5" />, label: "GitHub", url: "https://github.com/JustinLuft" },
    { icon: <FileText className="mr-2 w-5 h-5" />, label: "Resume", action: () => { setResumeModalOpen(true); setIsEmailMode(false); } }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Terminal Background */}
      <div className="absolute inset-0 bg-black/90 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 font-mono text-xs md:text-sm text-green-400 p-4 overflow-y-auto break-words">
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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
          <div className="absolute inset-0 opacity-10 bg-grid-subtle" />
          <div className="scanline absolute inset-0" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <TiltingName 
          name="JUSTIN LUFT" 
          isReady={isSystemReady}
          size="md"
          interactionRadius={300}
          letterSpacing={-16}
        />

        <motion.p
          className="text-lg md:text-2xl font-vt323 text-primary mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isSystemReady ? 1 : 0 }}
          transition={{ delay: 0.3 }}
        >
          Computer Scientist
        </motion.p>

        {isSystemReady && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
              {socialLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={link.label === "Resume" ? {
                    boxShadow: flashResume
                      ? '0 0 20px rgba(255,0,128,1), 0 0 30px rgba(255,0,128,0.7)'
                      : '0 0 10px rgba(255,0,128,0.3), 0 0 15px rgba(0, 0, 0, 0.2)'
                  } : {}}
                  transition={link.label === "Resume" ? { duration: .5, ease: 'easeInOut', repeat: 0, repeatType: 'mirror' } : {}}
                >
                  <Button
                    variant="outline"
                    className="font-press-start text-primary border-primary text-xs md:text-base px-3 py-2 hover:bg-primary/20 hover:text-primary neon-border"
                    onClick={() => link.action ? link.action() : window.open(link.url, '_blank')}
                  >
                    {link.icon}
                    {link.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Resume Modal */}
        <AnimatePresence>
          {resumeModalOpen && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-background p-6 md:p-8 border-2 border-primary shadow-2xl w-80 md:w-96 flex flex-col gap-4 relative"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setResumeModalOpen(false);
                    setIsEmailMode(false);
                    setEmail('');
                    setStatusMessage('');
                    setStatusType('');
                  }}
                  className="absolute top-3 right-3 text-pink-500 font-bold text-xl hover:text-pink-400"
                >
                  &times;
                </button>

                <h2 className="font-press-start text-primary text-xl md:text-2xl text-center mb-2">
                  Get My Resume
                </h2>

                {/* Status Message */}
                {statusMessage && (
                  <p className={`text-center font-press-start ${statusType === 'error' ? 'text-pink-500' : 'text-primary'} text-sm`}>
                    {statusMessage}
                  </p>
                )}

                {/* Only show buttons if resume not yet sent */}
                {statusType !== 'success' && !isEmailMode && (
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      className="flex-1 font-press-start text-primary border-primary text-xs md:text-base px-3 py-2 hover:bg-primary/20 hover:text-primary neon-border"
                      onClick={downloadResume}
                    >
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 font-press-start text-primary border-primary text-xs md:text-base px-3 py-2 hover:bg-primary/20 hover:text-primary neon-border"
                      onClick={() => { setIsEmailMode(true); setStatusMessage(''); setStatusType(''); }}
                    >
                      Email Me
                    </Button>
                  </div>
                )}

                {/* Email Mode */}
                {isEmailMode && (
                  <div className="flex flex-col gap-3 mt-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="p-3 border border-primary bg-black/80 text-primary placeholder:text-primary font-vt323 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-[0_0_10px_rgba(0,123,255,0.5)] rounded-none"
                    />
                    <Button
                      variant="outline"
                      className="font-press-start text-primary border-primary text-xs md:text-base px-3 py-2 hover:bg-primary/20 hover:text-primary neon-border"
                      onClick={sendResume}
                      disabled={sending}
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </Button>

                    <Button
                      variant="ghost"
                      className="font-press-start text-sm text-primary hover:text-primary/80"
                      onClick={() => { setIsEmailMode(false); setStatusMessage(''); setStatusType(''); }}
                    >
                      Back
                    </Button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Mouse Pointer */}
        <motion.div
          className="pointer-events-none fixed top-0 left-0 w-6 h-6 rounded-full bg-primary/50 mix-blend-screen"
          animate={{ x: mousePosition.x - 12, y: mousePosition.y - 12 }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  );
};

export default LandingPage;