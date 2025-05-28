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
    phone: "(646) 320-4998",
    summary: "Passionate computer science professional with a strong foundation in software development, algorithmic problem-solving, and innovative technology solutions. Experienced in creating scalable web applications and exploring cutting-edge technological challenges.",
  };

  const educationExperience = [
    {
      institution: "College of Charleston",
      degree: "B.S. Computer Science",
      period: "2020 - 2024",
      highlights: [
        "Dean's List",
        "Software Engineering Focus",
        "Advanced Algorithms Specialization"
      ]
    }
  ];

  const professionalExperience = [
    {
      company: "College of Charleston",
      role: "Capstone Project Developer",
      period: "Spring 2024",
      responsibilities: [
        "Collaborated with a team to develop a full-stack photo booth experience for the college",
        "Completed 5 two-week sprints using Agile Scrum methodologies",
        "Delivered a working solution involving user input, media processing, and automated email delivery",
        "Utilized GitHub for version control and collaborative development"
      ]
    }
  ];

  const socialLinks = [
    { 
      icon: <Linkedin className="w-6 h-6" />, 
      url: "https://www.linkedin.com/in/justin-luft-ab2aa9224/", 
      label: "LinkedIn" 
    },
    { 
      icon: <Github className="w-6 h-6" />, 
      url: "https://github.com/justinluft", 
      label: "GitHub" 
    }
  ];

  const downloadResume = () => {
    window.open('/resume.pdf', '_blank');
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Cyberpunk Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0B0C10] to-[#1A1E23] opacity-90" />
        <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
        <div className="scanline absolute inset-0 pointer-events-none z-10" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-press-start text-primary mb-4">
            About Me
          </h1>
          <p className="text-xl font-vt323 text-primary/80 max-w-2xl mx-auto">
            Profile | Education | Experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-background/80 backdrop-blur-sm border border-primary/20 p-6 h-full">
              <div className="flex items-center mb-6">
                <User className="w-12 h-12 text-primary mr-4" />
                <h2 className="font-press-start text-2xl text-primary">
                  Justin Luft
                </h2>
              </div>
              <div className="space-y-4 font-vt323 text-primary/90">
                <div className="flex items-center">
                  <MapPin className="mr-2 text-primary" />
                  <span>{personalInfo.location}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 text-primary" />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 text-primary" />
                  <span>{personalInfo.phone}</span>
                </div>
                <p className="mt-4">{personalInfo.summary}</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="text-primary hover:text-secondary"
                  >
                    {link.icon}
                  </motion.a>
                ))}
                <Button 
                  variant="outline" 
                  onClick={downloadResume}
                  className="font-press-start text-primary border-primary hover:bg-primary/20"
                >
                  <Briefcase className="mr-2 w-4 h-4" /> Download Resume
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Experience and Education */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Education Card */}
            <Card className="bg-background/80 backdrop-blur-sm border border-primary/20 p-6">
              <div className="flex items-center mb-6">
                <Award className="w-12 h-12 text-primary mr-4" />
                <h2 className="font-press-start text-2xl text-primary">
                  Education
                </h2>
              </div>
              {educationExperience.map((edu) => (
                <div key={edu.institution} className="font-vt323 text-primary/90">
                  <h3 className="text-xl font-press-start text-primary">
                    {edu.institution}
                  </h3>
                  <p className="text-sm text-primary/70 mb-2">{edu.period}</p>
                  <p>{edu.degree}</p>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    {edu.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card>

            {/* Professional Experience Card */}
            <Card className="bg-background/80 backdrop-blur-sm border border-primary/20 p-6">
              <div className="flex items-center mb-6">
                <Briefcase className="w-12 h-12 text-primary mr-4" />
                <h2 className="font-press-start text-2xl text-primary">
                  Professional Experience
                </h2>
              </div>
              {professionalExperience.map((exp) => (
                <div key={exp.company} className="font-vt323 text-primary/90">
                  <h3 className="text-xl font-press-start text-primary">
                    {exp.company}
                  </h3>
                  <p className="text-sm text-primary/70 mb-2">{exp.period}</p>
                  <p>{exp.role}</p>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    {exp.responsibilities.map((responsibility) => (
                      <li key={responsibility}>{responsibility}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
