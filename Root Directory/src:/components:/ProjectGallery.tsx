import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Code, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Photo Booth Experience",
    description: "Developed a comprehensive photo booth application for College of Charleston using Scrum methodologies",
    technologies: ["Team Collaboration", "Scrum", "Software Engineering"],
    githubUrl: "https://github.com/justinluft/photobooth-project"
  },
  {
    id: 2,
    title: "SC Bills Web Scraper",
    description: "Web scraper that stores and enables searching of South Carolina legislative bills",
    technologies: ["Web Scraping", "Database", "Python"],
    githubUrl: "https://github.com/justinluft/sc-bills-scraper"
  },
  {
    id: 3,
    title: "SubMachine App",
    description: "Prototype fast food application developed over a semester-long software project",
    technologies: ["UI/UX Design", "Prototype Development", "Team Project"],
    githubUrl: "https://github.com/justinluft/submachine-app"
  },
  {
    id: 4,
    title: "Machine Learning Engine",
    description: "Built a mini machine learning engine for linear regression using NumPy",
    technologies: ["Machine Learning", "NumPy", "Linear Regression"],
    githubUrl: "https://github.com/justinluft/ml-engine"
  },
  {
    id: 5,
    title: "Sorting Algorithms Benchmark",
    description: "Implemented and benchmarked multiple classic sorting algorithms in Java",
    technologies: ["Java", "Algorithms", "Performance Analysis"],
    githubUrl: "https://github.com/justinluft/sorting-algorithms"
  },
  {
    id: 6,
    title: "Concurrent Systems",
    description: "Created solutions for mutual exclusion and multithreaded problems",
    technologies: ["Concurrency", "Semaphores", "Systems Programming"],
    githubUrl: "https://github.com/justinluft/concurrent-systems"
  }
];

export const ProjectGallery = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-press-start mb-4 text-primary">
          <Code className="inline-block mr-2 mb-1" />
          Project Showcase
        </h2>
        <p className="text-xl font-vt323 text-primary/80">
          Explore innovative projects from my academic and personal journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 flex flex-col justify-between h-full bg-background/90 rounded-xl shadow-neon">
              <div>
                <h3 className="font-press-start text-xl mb-2 text-primary">
                  {project.title}
                </h3>
                <p className="font-vt323 text-primary/80 mb-4">
                  {project.description}
                </p>
                <div className="mb-4">
                  <span className="font-press-start text-sm text-primary">
                    Technologies:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-auto">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
                  onClick={() => window.open(project.githubUrl, '_blank')}
                >
                  <Github className="w-4 h-4" /> View on GitHub
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectGallery;
```
