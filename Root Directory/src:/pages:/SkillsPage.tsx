import React from 'react';
import { Code, Server, Database, Cpu, Cloud, Layers, Lock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const SkillsPage: React.FC = () => {
  const skillCategories = [
    { 
      title: "Programming Languages",
      skills: [
        { name: "TypeScript", level: "Advanced" },
        { name: "Python", level: "Advanced" },
        { name: "Java", level: "Intermediate" },
        { name: "C", level: "Intermediate" }
      ],
      icon: <Code className="w-12 h-12 text-primary" />
    },
    { 
      title: "Web Technologies",
      skills: [
        { name: "React", level: "Advanced" },
        { name: "Next.js", level: "Advanced" },
        { name: "Node.js", level: "Intermediate" },
        { name: "GraphQL", level: "Intermediate" }
      ],
      icon: <Globe className="w-12 h-12 text-primary" />
    },
    { 
      title: "Databases & Backend",
      skills: [
        { name: "PostgreSQL", level: "Advanced" },
        { name: "MongoDB", level: "Intermediate" },
        { name: "Firebase", level: "Intermediate" },
        { name: "Redis", level: "Basic" }
      ],
      icon: <Database className="w-12 h-12 text-primary" />
    },
    { 
      title: "DevOps & Cloud",
      skills: [
        { name: "Docker", level: "Advanced" },
        { name: "AWS", level: "Intermediate" },
        { name: "CI/CD", level: "Intermediate" },
        { name: "Kubernetes", level: "Basic" }
      ],
      icon: <Cloud className="w-12 h-12 text-primary" />
    },
    { 
      title: "Tools & Frameworks",
      skills: [
        { name: "Git", level: "Advanced" },
        { name: "Tailwind CSS", level: "Advanced" },
        { name: "Framer Motion", level: "Intermediate" },
        { name: "Cypress", level: "Intermediate" }
      ],
      icon: <Layers className="w-12 h-12 text-primary" />
    },
    { 
      title: "Soft Skills",
      skills: [
        { name: "Agile Methodology", level: "Advanced" },
        { name: "Problem Solving", level: "Advanced" },
        { name: "Team Collaboration", level: "Advanced" },
        { name: "Technical Communication", level: "Advanced" }
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
            Tech Arsenal
          </h1>
          <p className="text-xl font-vt323 text-primary/80 max-w-2xl mx-auto">
            A comprehensive showcase of technical skills and expertise, honed through academic and professional experiences
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
