import React from 'react';
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
  Train,
  Clapperboard,
  Users,
  Table,
  Globe,
  Terminal,
  Layers
} from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type Category = 'web' | 'algorithms' | 'systems' | 'tools';

export interface Project {
  id: number;
  name: string;
  description: string;
  skills: string[];
  githubLink: string;
  websiteLink?: string;
  icon: React.ReactNode;
  category: Category;
  fullDetails: {
    technologies: string[];
    challenges: string[];
  };
}

export interface CategoryInfo {
  label: string;
  fullLabel: string;
  icon: React.ReactNode;
  description: string;
}

// ============================================
// CATEGORY INFORMATION
// ============================================

export const categoryInfo: Record<Category, CategoryInfo> = {
  web: {
    label: 'Web Apps',
    fullLabel: 'Web Applications',
    icon: <Globe className="w-4 h-4" />,
    description: 'Full-stack applications, web scrapers, and interactive platforms'
  },
  algorithms: {
    label: 'Algorithms',
    fullLabel: 'Algorithms & DS',
    icon: <Layers className="w-4 h-4" />,
    description: 'Data structures, algorithmic solutions, and computational problems'
  },
  systems: {
    label: 'Systems',
    fullLabel: 'Systems Programming',
    icon: <Terminal className="w-4 h-4" />,
    description: 'Low-level programming, concurrency, and systems-level solutions'
  },
  tools: {
    label: 'Tools',
    fullLabel: 'Tools & Utilities',
    icon: <Cpu className="w-4 h-4" />,
    description: 'Desktop applications, automation tools, and utilities'
  }
};

// ============================================
// PROJECTS DATA
// ============================================

export const projects: Project[] = [
  // ==========================================
  // WEB APPLICATIONS
  // ==========================================
  {
    id: 3,
    name: "NoteCore",
    description: "Full-stack note-taking app with secure authentication, real-time sync indicators, and PDF export functionality.",
    skills: ["React", "Node.js", "Express.js", "PostgreSQL", "Tailwind CSS"],
    githubLink: "https://github.com/JustinLuft/notecore",
    websiteLink: "https://notecore.vercel.app/",
    icon: <Cloud className="w-5 h-5" />,
    category: 'web',
    fullDetails: {
      technologies: ["React", "Vite", "Tailwind CSS", "Node.js", "Express.js", "PostgreSQL", "Render", "Vercel"],
      challenges: [
        "Designing modular backend architecture with Express controllers",
        "Implementing user authentication and secure CRUD operations",
        "Building responsive and dynamic React components with live sync states"
      ],
    }
  },
  {
    id: 4,
    name: "CinemaCache",
    description: "React-based app for managing movie collections and generating customized recommendation prompts.",
    skills: ["React", "TypeScript", "Firebase", "Firestore"],
    githubLink: "https://github.com/JustinLuft/CinemaCache",
    websiteLink: "https://cinema-cache.vercel.app/", 
    icon: <Clapperboard className="w-5 h-5" />,
    category: 'web',
    fullDetails: {
      technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS", "Vite"],
      challenges: ["Real-time data fetching", "User authentication and security", "Dynamic prompt generation"],
    }
  },
  {
    id: 5,
    name: "BuildCarolina Graduate Showcase",
    description: "Responsive web application showcasing BuildCarolina graduates, built during CharlestonHacks hackathon.",
    skills: ["TypeScript", "React.js", "Tailwind CSS", "Firebase"],
    githubLink: "https://github.com/JustinLuft/GradShowcase",
    websiteLink: "https://grad-showcase.vercel.app/",
    icon: <Users className="w-5 h-5" />,
    category: 'web',
    fullDetails: {
      technologies: ["TypeScript", "React.js", "Tailwind CSS", "Vite", "Firebase", "Framer Motion"],
      challenges: [
        "Building during a fixed one-month hackathon timeline",
        "Creating admin and graduate user flows",
        "Implementing fast search and filter features"
      ],
    }
  },
  {
    id: 2,
    name: "SC Bills Web Scraper",
    description: "Robust web scraping solution for collecting and searching South Carolina legislative bills.",
    skills: ["Web Scraping", "Python", "Data Management"],
    githubLink: "https://github.com/JustinLuft/scbillscraper",
    websiteLink: "https://billtracker-website-8czsp93cr-justinlufts-projects.vercel.app/",
    icon: <Server className="w-5 h-5" />,
    category: 'web',
    fullDetails: {
      technologies: ["Python", "BeautifulSoup", "Firebase", "Pandas"],
      challenges: ["Data extraction", "Parsing complex web structures", "Data normalization"],
    }
  },
  {
    id: 13,
    name: "SubMachine App",
    description: "Fast-food ordering application prototype with intuitive UI, developed as semester-long project.",
    skills: ["Prototype Development", "UI/UX", "Mobile Design"],
    githubLink: "https://github.com/justinluft/submachine-app",
    icon: <Database className="w-5 h-5" />,
    category: 'web',
    fullDetails: {
      technologies: ["Figma", "JavaScript", "MySQL"],
      challenges: ["User interface design", "State management", "Prototype iteration"],
    }
  },
  {
    id: 7,
    name: "SpotLight: Spotify Stats Dashboard 🎵",
    description: "A modern, interactive dashboard to explore your Spotify listening habits. Visualize your top tracks and top artists through Spotify API integration.",
    skills: ["Next.js", "React", "Node.js", "Spotify API", "CSS"],
    githubLink: "https://github.com/JustinLuft/spotifyapi",
    websiteLink: "https://spotifyapi-omega.vercel.app/",
    icon: <Globe className="w-5 h-5" />,
    category: 'web',
    fullDetails: {
      technologies: ["Next.js", "React", "Node.js", "Spotify API", "OAuth 2.0", "CSS", "Particle.js"],
      challenges: [
        "Implementing Spotify OAuth 2.0 login flow securely",
        "Fetching and caching real-time user data from Spotify API",
        "Designing a responsive, visually engaging cyberpunk/art-deco UI",
        "Adding particle effects and radial glow with noise texture",
        "Creating interactive visualizations for top tracks and top artists"
      ]
    }
  },

  // ==========================================
  // ALGORITHMS & DATA STRUCTURES
  // ==========================================
  {
    id: 9,
    name: "Longest Palindromic Subsequence",
    description: "Dynamic programming algorithm computing longest palindromic subsequence with custom table structure.",
    skills: ["Dynamic Programming", "Algorithm Design", "Java"],
    githubLink: "https://github.com/JustinLuft/LPS",
    icon: <Code2 className="w-5 h-5" />,
    category: 'algorithms',
    fullDetails: {
      technologies: ["Java", "2D ArrayList", "Custom Element Class"],
      challenges: [
        "Designing pointer-based DP table to track subsequences",
        "Reverse traversal of table to reconstruct solution",
        "Edge-case handling for empty inputs"
      ],
    }
  },
  {
    id: 10,
    name: "Bernoulli Number Calculator",
    description: "Java program computing Bernoulli numbers using rational arithmetic and recursive relations.",
    skills: ["Java", "Recursion", "Rational Arithmetic", "Number Theory"],
    githubLink: "https://github.com/JustinLuft/BSF",
    icon: <Code className="w-5 h-5" />,
    category: 'algorithms',
    fullDetails: {
      technologies: ["Java", "Custom Rational Class", "Recursion", "Binomial Coefficients"],
      challenges: [
        "Designing Rational class with full arithmetic and fraction reduction",
        "Implementing recursive computation with binomial coefficients",
        "Managing large integer operations"
      ],
    }
  },
  {
    id: 12,
    name: "Train Car Sorting Simulation",
    description: "Simulation processing and sorting custom train car objects based on destination and priority.",
    skills: ["Java", "OOP", "Sorting Algorithms", "Simulation"],
    githubLink: "https://github.com/JustinLuft/traincarsorting",
    icon: <Train className="w-5 h-5" />,
    category: 'algorithms',
    fullDetails: {
      technologies: ["Java", "Custom Classes", "Comparable Interface", "Priority Sorting"],
      challenges: [
        "Designing flexible class hierarchy for different train cars",
        "Implementing sorting logic based on destination and priority",
        "Type-safe handling of mixed car objects"
      ],
    }
  },
  {
    id: 15,
    name: "Sorting Algorithms Benchmark",
    description: "Comprehensive benchmarking tool analyzing performance of various sorting algorithms.",
    skills: ["Java", "Algorithms", "Performance Analysis"],
    githubLink: "https://github.com/JustinLuft/sort-comparison-analyzer",
    icon: <Layers className="w-5 h-5" />,
    category: 'algorithms',
    fullDetails: {
      technologies: ["Java", "IntelliJ", "Performance Profiling"],
      challenges: ["Algorithm complexity", "Performance measurement", "Comparative analysis"],
    }
  },
  {
    id: 14,
    name: "Machine Learning Engine",
    description: "Custom machine learning engine for linear regression with mathematical modeling.",
    skills: ["Machine Learning", "NumPy", "Linear Regression"],
    githubLink: "https://github.com/JustinLuft/linearregressionhw",
    icon: <Cpu className="w-5 h-5" />,
    category: 'algorithms',
    fullDetails: {
      technologies: ["Python", "NumPy", "Scikit-learn"],
      challenges: ["Algorithm implementation", "Mathematical modeling", "Performance optimization"],
    }
  },

  // ==========================================
  // SYSTEMS & CONCURRENCY
  // ==========================================
  {
    id: 11,
    name: "Concurrent Systems",
    description: "Advanced solutions for mutual exclusion and multithreaded programming challenges.",
    skills: ["Concurrency", "Semaphores", "Systems Programming"],
    githubLink: "https://github.com/JustinLuft/semaphore-assignment",
    icon: <Code className="w-5 h-5" />,
    category: 'systems',
    fullDetails: {
      technologies: ["C", "POSIX Threads", "Semaphores"],
      challenges: ["Deadlock prevention", "Race condition mitigation", "Synchronization"],
    }
  },
  {
    id: 16,
    name: "Multithreaded Sudoku Solver",
    description: "Enhanced recursive Sudoku solver with multithreading to parallelize search space.",
    skills: ["C", "Multithreading", "Bitmasking", "Backtracking"],
    githubLink: "https://github.com/JustinLuft/sudokuthread",
    icon: <Code2 className="w-5 h-5" />,
    category: 'systems',
    fullDetails: {
      technologies: ["C", "POSIX Threads", "Bitmask Optimization", "Recursive Backtracking"],
      challenges: [
        "Implementing thread-level parallelism by branching on ambiguous cells",
        "Managing shared state and avoiding data races",
        "Synchronizing threads and handling early termination"
      ],
    }
  },

  // ==========================================
  // TOOLS & UTILITIES
  // ==========================================
  {
    id: 1,
    name: "Photo Booth Experience",
    description: "Comprehensive photo booth application using agile methodologies and collaborative development.",
    skills: ["Scrum", "Team Collaboration", "UI/UX Design"],
    githubLink: "https://github.com/JustinLuft/UnityProject",
    icon: <Camera className="w-5 h-5" />,
    category: 'tools',
    fullDetails: {
      technologies: ["Unity", "C#", "SMTP", "Raspberry PI"],
      challenges: ["Real-time photo processing", "User experience design", "Team coordination"],
    }
  },
  {
  id: 7,
  name: "Mercedes-Benz Power BI Heatmap Visual",
  description: "A custom Power BI visual that displays production defect data as an interactive heatmap for Mercedes-Benz.",
  skills: ["Power BI", "Data Visualization", "TypeScript", "GitHub Actions"],
  githubLink: "https://github.com/JustinLuft/VanDefectHeatmap", 
  icon: <Table className="w-5 h-5" />,
  category: 'tools',
  fullDetails: {
    technologies: ["Power BI", "TypeScript", "HTML5 Canvas", "D3.js"],
    challenges: [
      "Density-based heatmap rendering optimization",
      "Custom visual configuration in Power BI",
      "Balancing performance and visual accuracy",
      "Integration with automated GitHub Action builds"
    ],
  }
},
  {
    id: 8,
    name: "Python AutoClicker",
    description: "Customizable auto-clicker with GUI controls for automating mouse and keyboard inputs.",
    skills: ["Tkinter", "Input Automation", "UI Design"],
    githubLink: "https://github.com/JustinLuft/autoclicker",
    icon: <MousePointerClick className="w-5 h-5" />,
    category: 'tools',
    fullDetails: {
      technologies: ["Python", "Tkinter", "pynput", "keyboard"],
      challenges: [
        "Building flexible and intuitive GUI",
        "Managing real-time input automation with precise timing",
        "Implementing global hotkeys across systems"
      ],
    }
  },
  {
    id: 6,
    name: "WP Prop Firm Comparison Plugin",
    description: "WordPress plugin with email capture and filterable comparison table of prop trading firm data.",
    skills: ["WordPress", "PHP", "Web Scraping", "JavaScript"],
    githubLink: "https://github.com/JustinLuft/wppropscraper2",
    icon: <Table className="w-5 h-5" />,
    category: 'tools',
    fullDetails: {
      technologies: ["PHP", "JavaScript", "WordPress", "BeautifulSoup", "Firecrawl API"],
      challenges: [
        "Gating access with email submission form",
        "Parsing and storing structured comparison data",
        "Building responsive UI within WordPress shortcode architecture"
      ]
    }
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all projects for a specific category
 */
export const getProjectsByCategory = (category: Category): Project[] => {
  return projects.filter(p => p.category === category);
};

/**
 * Get a project by its ID
 */
export const getProjectById = (id: number): Project | undefined => {
  return projects.find(p => p.id === id);
};

/**
 * Get the first project for a given category
 */
export const getFirstProjectByCategory = (category: Category): Project | undefined => {
  return projects.find(p => p.category === category);
};

/**
 * Get total project count
 */
export const getTotalProjectCount = (): number => {
  return projects.length;
};

/**
 * Get project count by category
 */
export const getProjectCountByCategory = (category: Category): number => {
  return projects.filter(p => p.category === category).length;
};