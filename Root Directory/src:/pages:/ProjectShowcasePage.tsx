import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Github,
  Code, 
  Server, 
  Database, 
  Cloud, 
  Cpu,
  Camera,
  Layers,
  Terminal,
  Info,
  Zap 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Project {
  id: number;
  name: string;
  description: string;
  skills: string[];
  githubLink: string;
  icon: React.ReactNode;
  images?: string[];
  technologies: string[];
  challenges: string[];
  learnings: string[];
  detailedDescription: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "Photo Booth Experience",
    description: "Developed a comprehensive photo booth application for College of Charleston using agile methodologies",
    skills: ["Scrum", "Team Collaboration", "UI/UX Design"],
    githubLink: "https://github.com/justinluft/photobooth-project",
    icon: <Camera className="w-8 h-8 text-primary" />,
    images: [
      "https://example.com/photobooth1.jpg",
      "https://example.com/photobooth2.jpg"
    ],
    technologies: ["React", "TypeScript", "Node.js", "Express"],
    challenges: [
      "Real-time photo processing",
      "User experience design",
      "Team coordination"
    ],
    learnings: [
      "Agile methodology",
      "Collaborative software development", 
      "UI/UX principles"
    ],
    detailedDescription: "A cutting-edge photo booth application developed for College of Charleston, leveraging modern web technologies and agile development practices. The project focused on creating an intuitive, user-friendly interface while implementing robust backend processing capabilities."
  },
  // Add more projects following the same structure...
];

const ProjectShowcasePage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'technologies' | 'challenges' | 'learnings'>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h3 className="font-press-start text-lg mb-2 text-primary flex items-center">
              <Info className="mr-2" /> Project Overview
            </h3>
            <p className="font-vt323 text-primary/80">{selectedProject.detailedDescription}</p>
          </div>
        );
      case 'technologies':
        return (
          <div>
            <h3 className="font-press-start text-lg mb-2 text-primary flex items-center">
              <Layers className="mr-2" /> Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedProject.technologies.map((tech, index) => (
                <span 
                  key={index} 
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        );
      case 'challenges':
        return (
          <div>
            <h3 className="font-press-start text-lg mb-2 text-primary flex items-center">
              <Terminal className="mr-2" /> Project Challenges
            </h3>
            <ul className="list-disc list-inside font-vt323 text-primary/80">
              {selectedProject.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
        );
      case 'learnings':
        return (
          <div>
            <h3 className="font-press-start text-lg mb-2 text-primary flex items-center">
              <Zap className="mr-2" /> Key Learnings
            </h3>
            <ul className="list-disc list-inside font-vt323 text-primary/80">
              {selectedProject.learnings.map((learning, index) => (
                <li key={index}>{learning}</li>
              ))}
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Cyberpunk Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0B0C10] to-[#1A1E23] opacity-90" />
        <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
        <div className="scanline absolute inset-0 pointer-events-none z-10" />
        
        {/* Subtle Particle Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-2 h-2 bg-primary rounded-full animate-bounce" style={{ top: '10%', left: '20%' }} />
          <div className="absolute w-1 h-1 bg-secondary rounded-full animate-bounce" style={{ top: '30%', right: '15%' }} />
          <div className="absolute w-3 h-3 bg-primary/50 rounded-full animate-pulse" style={{ bottom: '20%', left: '10%' }} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-press-start text-primary mb-4">
            Project Showcase
          </h1>
          <p className="text-xl font-vt323 text-primary/80 max-w-2xl mx-auto">
            Exploring innovative solutions and pushing technological boundaries
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project List */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedProject(project)}
                className={`
                  cursor-pointer p-4 rounded-lg transition-all duration-300 
                  ${selectedProject.id === project.id 
                    ? 'bg-primary/20 border border-primary' 
                    : 'bg-background/50 hover:bg-primary/10'}
                `}
              >
                <div className="flex items-center gap-4">
                  {project.icon}
                  <div>
                    <h3 className="font-press-start text-lg text-primary">
                      {project.name}
                    </h3>
                    <p className="font-vt323 text-sm text-primary/70">
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Project Details */}
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-lg p-6"
          >
            <div className="flex items-center mb-6">
              {selectedProject.icon}
              <h2 className="ml-4 font-press-start text-2xl text-primary">
                {selectedProject.name}
              </h2>
            </div>

            {/* Image Gallery (if images exist) */}
            {selectedProject.images && (
              <div className="flex space-x-2 mb-6 overflow-x-auto">
                {selectedProject.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt={`${selectedProject.name} - Image ${index + 1}`} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex mb-6 border-b border-primary/20">
              {['overview', 'technologies', 'challenges', 'learnings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`
                    font-press-start text-sm px-4 py-2 transition-colors
                    ${activeTab === tab 
                      ? 'text-secondary border-b-2 border-secondary' 
                      : 'text-primary/60 hover:text-primary'}
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mb-6 min-h-[200px]">
              {renderTabContent()}
            </div>

            {/* Project Actions */}
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
                onClick={() => window.open(selectedProject.githubLink, '_blank')}
              >
                <Github className="w-4 h-4" /> View on GitHub
              </Button>
              {/* Optional: Add Live Demo button if applicable */}
              {/* <Button 
                variant="outline" 
                className="w-full flex items-center gap-2 border-secondary text-secondary hover:bg-secondary/10"
              >
                <Eye className="w-4 h-4" /> Live Demo
              </Button> */}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcasePage;
```
