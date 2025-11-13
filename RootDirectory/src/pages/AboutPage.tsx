import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { 
  User, 
  Linkedin, 
  Github, 
  Briefcase, 
  Award, 
  MapPin, 
  Mail,
  Sparkles
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AboutPage: React.FC = () => {
  const personalInfo = {
    name: "Justin Luft",
    title: "Software Engineer | Full-Stack Developer",
    location: "Charleston, SC",
    email: "j.n.luft@icloud.com",
    summary: "Computer Science Major with expertise in algorithms, software development, and UI/UX design. Skilled in multiple programming languages and frameworks. Passionate about collaborative, interactive projects and continuous learning.",
  };

  const educationExperience = [
    {
      institution: "College of Charleston, SC",
      degree: "B.S. in Computer Science",
      period: "Aug 2021 - May 2025",
      highlights: [
        "Software Engineering (CSCI 362)",
        "Advanced Algorithms (CSCI 310)",
        "Database Concepts (CSCI 431)",
        "User Interface Development (CSCI 380)"
      ]
    }
  ];

  const professionalExperience = [
    {
      company: "College of Charleston",
      role: "Capstone Project Developer",
      period: "Spring 2024",
      responsibilities: [
        "Developed a full-stack photo booth application with team collaboration",
        "Managed 5 sprints using Agile Scrum",
        "Implemented user input handling, media processing, and automated email delivery",
        "Utilized GitHub for version control and collaborative development"
      ]
    },
    {
      company: "Mercedes-Benz Charleston, SC",
      role: "PS Digitalization | TypeScript, SQL, DAX, PowerBI, Agile Processes",
      period: "Aug 2025 – Present",
      responsibilities: [
        "Engineered software solutions that optimized plant workflows using lean principles",
        "Built interactive Power BI dashboards with TypeScript visuals, version-controlled via GitHub",
        "Collaborated on SQL-based data models and reporting workflows to support data visualization and tracking"
      ]
    }
  ];

  const socialLinks = [
    { icon: <Linkedin className="w-10 h-10" />, url: "https://www.linkedin.com/in/justin-luft-ab2aa9224/", label: "LinkedIn" },
    { icon: <Github className="w-10 h-10" />, url: "https://github.com/justinluft", label: "GitHub" }
  ];

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/JustinLuftResume.pdf';
    link.download = 'Justin_Luft_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Floating animation for icons
  const FloatingIcon: React.FC<{children: React.ReactNode, delay?: number}> = ({children, delay = 0}) => (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );

  // Reusable TiltCard for 3D hover + edge glow
  const TiltCard: React.FC<{children: React.ReactNode, delay?: number}> = ({children, delay = 0}) => {
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const shadowX = useMotionValue(0);
    const shadowY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    const rotateXSpring = useSpring(rotateX, { damping: 20, stiffness: 120 });
    const rotateYSpring = useSpring(rotateY, { damping: 20, stiffness: 120 });
    const shadowXSpring = useSpring(shadowX, { damping: 20, stiffness: 120 });
    const shadowYSpring = useSpring(shadowY, { damping: 20, stiffness: 120 });

    const boxShadow = useTransform(
      [shadowXSpring, shadowYSpring],
      ([x, y]) => `${x}px ${y}px 20px rgba(0, 255, 209, 0.5)`
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - (rect.left + rect.width / 2);
      const offsetY = e.clientY - (rect.top + rect.height / 2);

      // Tilt toward cursor (max 15deg)
      rotateX.set((-offsetY / (rect.height / 2)) * 15);
      rotateY.set((offsetX / (rect.width / 2)) * 15);

      // Shadow offset (max 10px)
      shadowX.set((offsetX / (rect.width / 2)) * 10);
      shadowY.set((offsetY / (rect.height / 2)) * 10);
      
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
      shadowX.set(0);
      shadowY.set(0);
      setIsHovered(false);
    };

    return (
      <motion.div
        style={{ 
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          perspective: 600
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
      >
        <motion.div style={{ boxShadow }}>
          {children}
        </motion.div>
      </motion.div>
    );
  };

  // Animated text characters
  const AnimatedText: React.FC<{text: string, delay?: number, className?: string, style?: React.CSSProperties}> = ({text, delay = 0, className = "", style}) => {
    const characters = text.split("");
    return (
      <div className={className} style={style}>
        {characters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + index * 0.03, duration: 0.5, ease: "easeOut" }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0B0C10] to-[#1A1E23] opacity-90" />
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
        <div className="scanline absolute inset-0 pointer-events-none z-10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 relative z-20 space-y-12">
        {/* Header with animated title */}
        <motion.div 
          className="text-center relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 -z-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur-3xl rounded-full" />
          </motion.div>
          
          <AnimatedText 
            text="About Me" 
            delay={0.2}
            className="font-press-start text-primary mb-4 block"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          />
          <motion.p 
            className="font-vt323 text-primary/80 max-w-4xl mx-auto leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 3vw, 1.75rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Overview | Education | Experience
          </motion.p>
        </motion.div>

        {/* Personal Info */}
        <TiltCard delay={0.2}>
          <Card className="bg-background/80 backdrop-blur-sm border border-primary/20 p-4 sm:p-6 md:p-8 w-full max-w-full mx-auto relative overflow-hidden group">
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6">
                <FloatingIcon delay={0}>
                  <User className="w-12 h-12 md:w-16 md:h-16 text-primary mb-3 md:mb-0 md:mr-6" />
                </FloatingIcon>
                <div>
                  <motion.h2 
                    className="font-press-start text-primary"
                    style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {personalInfo.name}
                  </motion.h2>
                  <motion.p 
                    className="font-press-start text-primary/80"
                    style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {personalInfo.title}
                  </motion.p>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4 font-vt323 text-primary/90">
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <MapPin className="mr-2 text-primary" />{personalInfo.location}
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Mail className="mr-2 text-primary" />{personalInfo.email}
                </motion.div>
                <motion.p 
                  className="mt-3"
                  style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)', lineHeight: 1.5 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  {personalInfo.summary}
                </motion.p>
              </div>
              <motion.div 
                className="mt-6 flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {socialLinks.map((link, index) => (
                  <motion.a 
                    key={link.label} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.3, rotate: 10 }} 
                    whileTap={{ scale: 0.9 }}
                    className="text-primary hover:text-secondary transition-transform duration-300"
                  >
                    {link.icon}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="outline" 
                    onClick={downloadResume} 
                    className="font-press-start text-primary border-primary hover:bg-primary/20 px-4 py-2 text-base sm:text-lg md:text-xl flex items-center gap-2 neon-border hover:shadow-neon transition-all duration-300"
                  >
                    <Briefcase className="w-5 h-5" /> Download Resume
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </Card>
        </TiltCard>

        {/* Education */}
        <TiltCard delay={0.4}>
          <Card className="bg-background/80 backdrop-blur-sm border border-primary/20 p-4 sm:p-6 md:p-8 w-full max-w-full mx-auto relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6">
                <FloatingIcon delay={0.2}>
                  <Award className="w-12 h-12 md:w-16 md:h-16 text-primary mb-3 md:mb-0 md:mr-6" />
                </FloatingIcon>
                <motion.h2 
                  className="font-press-start text-primary"
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Education
                </motion.h2>
              </div>
              {educationExperience.map((edu, idx) => (
                <motion.div 
                  key={edu.institution} 
                  className="font-vt323 text-primary/90 mb-5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
                >
                  <h3 className="font-press-start text-primary" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2rem)' }}>{edu.institution}</h3>
                  <p className="text-primary/70" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>{edu.period}</p>
                  <p style={{ fontSize: 'clamp(1.1rem, 3.2vw, 1.6rem)' }}>{edu.degree}</p>
                  <ul className="list-disc list-inside mt-2" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)' }}>
                    {edu.highlights.map((h, hidx) => (
                      <motion.li 
                        key={h}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + hidx * 0.05, duration: 0.4 }}
                      >
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </Card>
        </TiltCard>

        {/* Professional Experience */}
        <TiltCard delay={0.6}>
          <Card className="bg-background/80 backdrop-blur-sm border border-primary/20 p-4 sm:p-6 md:p-8 w-full max-w-full mx-auto relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6">
                <FloatingIcon delay={0.4}>
                  <Briefcase className="w-12 h-12 md:w-16 md:h-16 text-primary mb-3 md:mb-0 md:mr-6" />
                </FloatingIcon>
                <motion.h2 
                  className="font-press-start text-primary"
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  Professional Experience
                </motion.h2>
              </div>
              {professionalExperience.map((exp, idx) => (
                <motion.div 
                  key={exp.company} 
                  className="font-vt323 text-primary/90 mb-5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
                >
                  <h3 className="font-press-start text-primary" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2rem)' }}>{exp.company}</h3>
                  <p className="text-primary/70" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>{exp.period}</p>
                  <p style={{ fontSize: 'clamp(1.1rem, 3.2vw, 1.6rem)' }}>{exp.role}</p>
                  <ul className="list-disc list-inside mt-2" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)' }}>
                    {exp.responsibilities.map((r, ridx) => (
                      <motion.li 
                        key={r}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + ridx * 0.05, duration: 0.4 }}
                      >
                        {r}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </Card>
        </TiltCard>
      </div>
    </div>
  );
};

export default AboutPage;
