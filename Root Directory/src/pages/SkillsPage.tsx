import React from 'react';
import { Code, Server, Database, Cpu, Cloud, Layers, Lock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const SkillsPage: React.FC = () => {
  const skillCategories = [
    { 
      title: "Programming Languages",
      skills: [
        { name: "Java", level: "Advanced" },
        { name: "Python", level: "Advanced" },
        { name: "C", level: "Intermediate" },
        { name: "MIPS Assembly", level: "Basic" },
        { name: "Prolog", level: "Basic" }
      ],
      icon: <Code className="w-12 h-12 text-primary" />
    },
    { 
      title: "Web & Software Development",
      skills: [
        { name: "React", level: "Basic" },
        { name: "Next.js", level: "Basic" },
        { name: "Firebase", level: "Intermediate" },
        { name: "HTML/CSS/JS", level: "Intermediate" },
        { name: "GET/POST Handling in C", level: "Intermediate" }
      ],
      icon: <Globe className="w-12 h-12 text-primary" />
    },
    { 
      title: "Databases",
      skills: [
        { name: "MySQL", level: "Intermediate" },
        { name: "SQLite", level: "Intermediate" },
        { name: "Firebase Realtime DB", level: "Intermediate" }
      ],
      icon: <Database className="w-12 h-12 text-primary" />
    },
    { 
      title: "Computer Science Concepts",
      skills: [
        { name: "Data Structures", level: "Advanced" },
        { name: "Algorithms", level: "Advanced" },
        { name: "Multithreading", level: "Intermediate" },
        { name: "Dynamic Programming", level: "Advanced" }
      ],
      icon: <Cpu className="w-12 h-12 text-primary" />
    },
    { 
      title: "Development Practices",
      skills: [
        { name: "Agile", level: "Advanced" },
        { name: "Scrum", level: "Advanced" },
        { name: "Waterfall", level: "Intermediate" },
        { name: "Git", level: "Intermediate" }
      ],
      icon: <Layers className="w-12 h-12 text-primary" />
    },
    { 
      title: "Soft Skills",
      skills: [
        { name: "Adaptability", level: "Advanced" },
        { name: "Problem Solving", level: "Advanced" },
        { name: "Team Collaboration", level: "Advanced" },
        { name: "UI/UX Prototyping (Figma)", level: "Intermediate" }
      ],
      icon: <Server className="w-12 h-12 text-primary" />
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Advanced": return "bg-green-500/20 text-green-400";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-400";
      case "Basic": return "bg-red-500/20 text-red-400";
      default: return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Effects */}
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
            Tech Arsenal
          </h1>
          <p className="text-xl font-vt323 text-primary/80 max-w-2xl mx-auto">
            A deep dive into my computer science toolkit—where algorithms, databases, and teamwork converge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1 
              }}
            >
              <Card className="bg-background/80 backdrop-blur-sm border border-primary/20 p-6 h-full">
                <div className="flex items-center mb-6">
                  {category.icon}
                  <h2 className="ml-4 font-press-start text-xl text-primary">
                    {category.title}
                  </h2>
                </div>
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div 
                      key={skill.name} 
                      className="flex justify-between items-center"
                    >
                      <span className="font-vt323 text-primary/90">
                        {skill.name}
                      </span>
                      <span 
                        className={`
                          px-2 py-1 rounded-full text-xs font-press-start
                          ${getLevelColor(skill.level)}
                        `}
                      >
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
