import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Linkedin, 
  Github, 
  Briefcase, 
  Award, 
  MapPin, 
  Mail, 
  Phone 
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

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Cyberpunk Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0B0C10] to-[#1A1E23] opacity-90" />
        <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
        <div className="scanline absolute inset-0 pointer-events-none z-10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 relative z-20 space-y-12 ml-2">
        {/* Page Header */}
        <motion.div className="text-center" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-press-start text-primary mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>About Me</h1>
          <p className="font-vt323 text-primary/80 max-w-4xl mx-auto leading-relaxed" style={{ fontSize: 'clamp(1rem, 3vw, 1.75rem)' }}>
            Overview | Education | Experience
          </p>
        </motion.div>

        {/* Personal Info Section */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="bg-background/80 backdrop-blur-sm border border-primary/20 p-4 sm:p-6 md:p-8 hover:shadow-neon transition-shadow duration-300 w-full max-w-full mx-auto">
            <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6">
              <User className="w-12 h-12 md:w-16 md:h-16 text-primary mb-3 md:mb-0 md:mr-6" />
              <div>
                <h2 className="font-press-start text-primary" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                  {personalInfo.name}
                </h2>
                <p className="font-press-start text-primary/80" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  {personalInfo.title}
                </p>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 font-vt323 text-primary/90">
              <div className="flex flex-wrap items-center"><MapPin className="mr-2 text-primary" />{personalInfo.location}</div>
              <div className="flex flex-wrap items-center"><Mail className="mr-2 text-primary" />{personalInfo.email}</div>
              <p className="mt-3" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)', lineHeight: 1.5 }}>
                {personalInfo.summary}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(link => (
                <motion.a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2 }} className="text-primary hover:text-secondary transition-transform duration-300">
                  {link.icon}
                </motion.a>
              ))}
              <Button variant="outline" onClick={downloadResume} className="font-press-start text-primary border-primary hover:bg-primary/20 px-4 py-2 text-base sm:text-lg md:text-xl flex items-center gap-2 neon-border hover:shadow-neon transition-all duration-300">
                <Briefcase className="w-5 h-5" /> Download Resume
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Education Section */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="bg-background/80 backdrop-blur-sm border border-primary/20 p-4 sm:p-6 md:p-8 hover:shadow-neon transition-shadow duration-300 w-full max-w-full mx-auto">
            <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6">
              <Award className="w-12 h-12 md:w-16 md:h-16 text-primary mb-3 md:mb-0 md:mr-6" />
              <h2 className="font-press-start text-primary" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>Education</h2>
            </div>
            {educationExperience.map(edu => (
              <div key={edu.institution} className="font-vt323 text-primary/90 mb-5">
                <h3 className="font-press-start text-primary" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2rem)' }}>{edu.institution}</h3>
                <p className="text-primary/70" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>{edu.period}</p>
                <p style={{ fontSize: 'clamp(1.1rem, 3.2vw, 1.6rem)' }}>{edu.degree}</p>
                <ul className="list-disc list-inside mt-2" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)' }}>
                  {edu.highlights.map(h => <li key={h}>{h}</li>)}
                </ul>
              </div>
            ))}
          </Card>
        </motion.div>

        {/* Experience Section */}
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <Card className="bg-background/80 backdrop-blur-sm border border-primary/20 p-4 sm:p-6 md:p-8 hover:shadow-neon transition-shadow duration-300 w-full max-w-full mx-auto">
            <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6">
              <Briefcase className="w-12 h-12 md:w-16 md:h-16 text-primary mb-3 md:mb-0 md:mr-6" />
              <h2 className="font-press-start text-primary" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>Professional Experience</h2>
            </div>
            {professionalExperience.map(exp => (
              <div key={exp.company} className="font-vt323 text-primary/90 mb-5">
                <h3 className="font-press-start text-primary" style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2rem)' }}>{exp.company}</h3>
                <p className="text-primary/70" style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>{exp.period}</p>
                <p style={{ fontSize: 'clamp(1.1rem, 3.2vw, 1.6rem)' }}>{exp.role}</p>
                <ul className="list-disc list-inside mt-2" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)' }}>
                  {exp.responsibilities.map(r => <li key={r}>{r}</li>)}
                </ul>
              </div>
            ))}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
