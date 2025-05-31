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
  MousePointerClick,
  Code2,
  CalculatorIcon,
  Train
} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  name: string;
  description: string;
  skills: string[];
  githubLink: string;
  icon: React.ReactNode;
  fullDetails: {
    technologies: string[];
    challenges: string[];
  };
}

const projects: Project[] = [
  {
    id: 1,
    name: "Photo Booth Experience",
    description: "Developed a comprehensive photo booth application for College of Charleston using agile methodologies, focusing on user experience and collaborative development.",
    skills: ["Scrum", "Team Collaboration", "UI/UX Design"],
    githubLink: "https://github.com/JustinLuft/UnityProject",
    icon: <Camera className="w-8 h-8 text-primary" />,
    fullDetails: {
      technologies: ["Unity", "C", "SMTP", "Raspberry PI"],
      challenges: ["Real-time photo processing", "User experience design", "Team coordination"],
    }
  },
  {
    id: 2,
    name: "SC Bills Web Scraper",
    description: "Created a robust web scraping solution to collect, store, and enable searching of South Carolina legislative bills using advanced data extraction techniques.",
    skills: ["Web Scraping", "Python", "Data Management"],
    githubLink: "https://github.com/JustinLuft/scbillscraper",
    icon: <Server className="w-8 h-8 text-primary" />,
    fullDetails: {
      technologies: ["Python", "BeautifulSoup", "Firebase", "Pandas"],
      challenges: ["Data extraction", "Parsing complex web structures", "Data normalization"],
    }
  },
  {
    id: 3,
    name: "SubMachine App",
    description: "Designed and prototyped a fast-food ordering application as a semester-long software engineering project, emphasizing intuitive user interface and functional design.",
    skills: ["Prototype Development", "UI/UX", "Mobile Design"],
    githubLink: "https://github.com/justinluft/submachine-app",
    icon: <Database className="w-8 h-8 text-primary" />,
    fullDetails: {
      technologies: ["Figma", "JavaScript", "MySQL"],
      challenges: ["User interface design", "State management", "Prototype iteration"],
    }
  },
  {
    id: 4,
    name: "Machine Learning Engine",
    description: "Implemented a custom machine learning engine for linear regression, demonstrating deep understanding of mathematical modeling and algorithmic implementation.",
    skills: ["Machine Learning", "NumPy", "Linear Regression"],
    githubLink: "https://github.com/JustinLuft/linearregressionhw",
    icon: <Cpu className="w-8 h-8 text-primary" />,
    fullDetails: {
      technologies: ["Python", "NumPy", "Scikit-learn"],
      challenges: ["Algorithm implementation", "Mathematical modeling", "Performance optimization"],
    }
  },
  {
    id: 5,
    name: "Sorting Algorithms Benchmark",
    description: "Developed a comprehensive benchmarking tool to analyze and compare performance of various sorting algorithms, providing insights into computational efficiency.",
    skills: ["Java", "Algorithms", "Performance Analysis"],
    githubLink: "https://github.com/JustinLuft/sort-comparison-analyzer",
    icon: <Cloud className="w-8 h-8 text-primary" />,
    fullDetails: {
      technologies: ["Java", "IntelliJ", "Performance Profiling"],
      challenges: ["Algorithm complexity", "Performance measurement", "Comparative analysis"],
    }
  },
  {
    id: 6,
    name: "Concurrent Systems",
    description: "Created advanced solutions for mutual exclusion and multithreaded programming challenges, demonstrating expertise in systems-level programming and concurrency.",
    skills: ["Concurrency", "Semaphores", "Systems Programming"],
    githubLink: "https://github.com/JustinLuft/semaphore-assignment",
    icon: <Code className="w-8 h-8 text-primary" />,
    fullDetails: {
      technologies: ["C", "POSIX Threads", "Semaphores"],
      challenges: ["Deadlock prevention", "Race condition mitigation", "Synchronization"],
    }
  },
  {
  id: 7,
  name: "Python AutoClicker",
  description: "Built a customizable Python-based auto-clicker with GUI controls for automating mouse and keyboard inputs using time intervals, positions, and hotkeys.",
  skills: ["Tkinter", "Input Automation", "User Interface Design"],
  githubLink: "https://github.com/JustinLuft/autoclicker", 
  icon: <MousePointerClick className="w-8 h-8 text-primary" />,
  fullDetails: {
    technologies: ["Python", "Tkinter", "pynput", "keyboard"],
    challenges: [
      "Building a flexible and intuitive GUI",
      "Managing real-time input automation with precise timing",
      "Implementing global hotkeys across systems"],
    }
  },
  {
  id: 8,
  name: "Longest Palindromic Subsequence",
  description: "Built a dynamic programming algorithm in Java to compute the longest palindromic subsequence (LPS) in a given string using a custom table with directional pointers.",
  skills: ["Dynamic Programming", "Algorithm Design", "Java"],
  githubLink: "https://github.com/JustinLuft/LPS", 
  icon: <Code2 className="w-8 h-8 text-primary" />,
  fullDetails: {
    technologies: ["Java", "2D ArrayList", "Custom Element Class"],
    challenges: [
      "Designing a pointer-based DP table to track subsequences",
      "Reverse traversal of the table to reconstruct the solution",
      "Edge-case handling for empty or one-character inputs"
    ],
  }
},
  {
  id: 9,
  name: "Bernoulli Number Calculator",
  description: "Implemented a Java program to compute Bernoulli numbers using rational arithmetic and recursive binomial coefficient relations for accurate fractional results.",
  skills: ["Java", "Recursion", "Rational Arithmetic", "Number Theory"],
  githubLink: "https://github.com/JustinLuft/BSF",
  icon: <CalculatorIcon className="w-8 h-8 text-primary" />,
  fullDetails: {
    technologies: ["Java", "Custom Rational Class", "Recursion", "Binomial Coefficients"],
    challenges: [
      "Designing a Rational number class with full arithmetic and fraction reduction",
      "Implementing recursive computation of Bernoulli numbers using binomial coefficients",
      "Managing large integer operations and preventing overflow in factorial calculations"
    ],
  }
},
  {
  id: 10,
  name: "Multithreaded Sudoku Solver",
  description: "Enhanced a recursive Sudoku solver by implementing multithreading to parallelize the search space and accelerate solution discovery.",
  skills: ["C", "Multithreading", "Bitmasking", "Backtracking", "Recursion"],
  githubLink: "https://github.com/JustinLuft/sudokuthread",
  icon: <CalculatorIcon className="w-8 h-8 text-primary" />,
  fullDetails: {
    technologies: ["C", "POSIX Threads (pthreads)", "Bitmask Optimization", "Recursive Backtracking"],
    challenges: [
      "Implementing thread-level parallelism by branching on the most ambiguous cell choices",
      "Managing shared state and avoiding data races without sacrificing performance",
      "Ensuring correct and efficient bitmask operations for candidate numbers",
      "Synchronizing threads and cleanly handling early termination when a solution is found"
    ],
  }
},
  {
  id: 11,
  name: "Train Car Sorting Simulation",
  description: "Developed a simulation to process and sort custom train car objects (PassengerCar, CargoCar, MailCar) based on destination and class priority.",
  skills: ["Java", "Object-Oriented Programming", "Sorting Algorithms", "Simulation"],
  githubLink: "https://github.com/JustinLuft/traincarsorting",
  icon: <Train className="w-8 h-8 text-primary" />,
  fullDetails: {
    technologies: ["Java", "Custom Classes", "Comparable Interface", "Priority Sorting"],
    challenges: [
      "Designing a flexible class hierarchy for different train cars",
      "Implementing sorting logic based on destination and priority rules",
      "Ensuring type-safe and efficient handling of mixed car objects"
    ],
  }
}

];

const ProjectShowcasePage: React.FC = () => {
  const projectsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'technologies' | 'challenges'>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h3 className="font-press-start text-lg mb-2 text-primary">Project Overview</h3>
            <p className="font-vt323 text-2xl md:text-3xl text-primary/80">{selectedProject.description}</p>
          </div>
        );
      case 'technologies':
        return (
          <div>
            <h3 className="font-press-start text-lg mb-2 text-primary">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProject.fullDetails.technologies.map((tech, index) => (
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
            <h3 className="font-press-start text-lg mb-2 text-primary">Project Challenges</h3>
            <ul className="list-disc list-inside font-vt323 text-2xl md:text-3xl text-primary/80">
              {selectedProject.fullDetails.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Cyberpunk Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0B0C10] to-[#1A1E23] opacity-90" />
        <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
        <div className="scanline absolute inset-0 pointer-events-none z-10" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-press-start mb-4 text-primary">
            Project Showcase
          </h1>
          <p className="text-xl font-vt323 text-primary/80">
            Explore innovative projects that showcase technical expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Project List */}
         {/* Paginated Project List */}
            <div className="space-y-4">
              {projects
                .slice(currentPage * projectsPerPage, (currentPage + 1) * projectsPerPage)
                .map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedProject(project)}
                    className={`cursor-pointer p-4 rounded-lg transition-all duration-300 ${
                      selectedProject.id === project.id
                        ? 'bg-primary/20 border border-primary'
                        : 'bg-background/50 hover:bg-primary/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {project.icon}
                      <h3 className="font-press-start text-lg text-primary">{project.name}</h3>
                    </div>
                  </motion.div>
              ))}
            
              {/* Pagination Controls */}
              <div className="flex justify-between mt-4">
                <Button 
                    variant="outline"
                    className="font-vt323 text-primary border-primary hover:text-primary hover:border-primary hover:bg-primary/10"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  >
                    Previous
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="font-vt323 text-primary border-primary hover:text-primary hover:border-primary hover:bg-primary/10"
                    disabled={(currentPage + 1) * projectsPerPage >= projects.length}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
              </div>
            </div>

          {/* Project Details */}
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-lg p-6"
          >
            <div className="flex items-center mb-6">
              {selectedProject.icon}
              <h2 className="ml-4 font-press-start text-4xl text-primary">
                {selectedProject.name}
              </h2>
            </div>

            {/* Tab Navigation */}
            <div className="flex mb-6 border-b border-primary/20">
              {['overview', 'technologies', 'challenges'].map((tab) => (
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
            <div className="mb-6">
              {renderTabContent()}
            </div>

            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
              onClick={() => window.open(selectedProject.githubLink, '_blank')}
            >
              <Github className="w-4 h-4" /> View on GitHub
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcasePage;
