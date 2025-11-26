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


//new categories can be added, the the cube will have to be modified as right now it can only handle 4
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
    description:
      "A secure full-stack note platform featuring authentication, real-time sync indicators, and PDF export. Designed for reliability and seamless cross-device use.",
    skills: ["React", "Node.js", "Express.js", "PostgreSQL", "Tailwind CSS"],
    githubLink: "https://github.com/JustinLuft/notecore",
    websiteLink: "https://notecore.vercel.app/",
    icon: <Cloud className="w-5 h-5" />,
    category: "web",
    fullDetails: {
      technologies: [
        "React",
        "Vite",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
        "PostgreSQL",
        "Render",
        "Vercel"
      ],
      challenges: [
        "Designed a modular Express architecture enabling secure user authentication and clean route separation.",
        "Implemented reliable CRUD operations with PostgreSQL, focusing on data consistency and error tolerance.",
        "Developed a real-time sync UX pattern to show unsaved changes and prevent accidental data loss."
      ]
    }
  },
  {
    id: 4,
    name: "CinemaCache",
    description:
      "A personalized movie catalog and recommendation-prompt generator powered by Firebase and real-time data sync.",
    skills: ["React", "TypeScript", "Firebase", "Firestore"],
    githubLink: "https://github.com/JustinLuft/CinemaCache",
    websiteLink: "https://cinema-cache.vercel.app/",
    icon: <Clapperboard className="w-5 h-5" />,
    category: "web",
    fullDetails: {
      technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS", "Vite"],
      challenges: [
        "Built a responsive React experience with real-time Firestore reads and updates.",
        "Implemented Firebase Auth workflows with secure client-side routing.",
        "Generated dynamic recommendation prompts based on user-selected metadata."
      ]
    }
  },
  {
    id: 5,
    name: "BuildCarolina Graduate Showcase",
    description:
      "A full responsive platform built for the BuildCarolina hackathon, enabling browsing, filtering, and managing graduate profiles.",
    skills: ["TypeScript", "React.js", "Tailwind CSS", "Firebase"],
    githubLink: "https://github.com/JustinLuft/GradShowcase",
    websiteLink: "https://grad-showcase.vercel.app/",
    icon: <Users className="w-5 h-5" />,
    category: "web",
    fullDetails: {
      technologies: [
        "TypeScript",
        "React.js",
        "Tailwind CSS",
        "Vite",
        "Firebase",
        "Framer Motion"
      ],
      challenges: [
        "Delivered the entire platform within a fixed hackathon timeline, balancing speed with maintainability.",
        "Built parallel admin and graduate user flows with secure Firebase authentication.",
        "Implemented fast search/filter logic to handle growing datasets efficiently."
      ]
    }
  },
  {
  id: 4,
  name: "AI Task Summarizer",
  description:
    "A lightweight AI-powered tool that transforms long or cluttered task descriptions into clean, actionable summaries. Designed to boost productivity and workflow clarity.",
  skills: ["React", "Vite", "Tailwind CSS", "Firebase", "JavaScript"],
  githubLink: "https://github.com/JustinLuft/AI-task-summarizer",
  websiteLink: "https://ai-task-summarizer.vercel.app/",
  icon: <Sparkles className="w-5 h-5" />,
  category: "web",
  fullDetails: {
    technologies: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Firebase",
      "JavaScript",
      "Vercel"
    ],
    challenges: [
      "Built an AI-powered summarization module to automatically condense long task descriptions.",
      "Implemented real-time task storage and syncing using Firebase.",
      "Designed a modular frontend structure with reusable React components and TailwindCSS for a clean, responsive UI."
    ]
  }
},

  {
    id: 2,
    name: "SC Bills Web Scraper",
    description:
      "An end-to-end scraping and indexing pipeline that collects and structures South Carolina legislative bill data.",
    skills: ["Web Scraping", "Python", "Data Management"],
    githubLink: "https://github.com/JustinLuft/scbillscraper",
    websiteLink:
      "https://billtracker-website-8czsp93cr-justinlufts-projects.vercel.app/",
    icon: <Server className="w-5 h-5" />,
    category: "web",
    fullDetails: {
      technologies: ["Python", "BeautifulSoup", "Firebase", "Pandas"],
      challenges: [
        "Parsed complex and inconsistent HTML structures to extract reliable legislative records.",
        "Normalized scraped data into consistent schema formats for downstream querying.",
        "Built a web-facing interface enabling keyword lookup and bill detail retrieval."
      ]
    }
  },
  {
    id: 13,
    name: "SubMachine App",
    description:
      "A mobile-first fast-food ordering prototype focused on smooth UX and straightforward customer navigation.",
    skills: ["Prototype Development", "UI/UX", "Mobile Design"],
    githubLink: "https://github.com/justinluft/submachine-app",
    icon: <Database className="w-5 h-5" />,
    category: "web",
    fullDetails: {
      technologies: ["Figma", "JavaScript", "MySQL"],
      challenges: [
        "Designed a clean ordering flow emphasizing simplicity and low-friction user decisions.",
        "Managed application state and screen transitions based on menu interactions.",
        "Iterated UI designs based on user feedback from prototype testing."
      ]
    }
  },
  {
    id: 7,
    name: "SpotLight: Spotify Stats Dashboard",
    description:
      "A modern dashboard that visualizes top tracks, artists, and listening patterns using Spotify's OAuth and analytics APIs.",
    skills: ["Next.js", "React", "Node.js", "Spotify API", "CSS"],
    githubLink: "https://github.com/JustinLuft/spotifyapi",
    websiteLink: "https://spotifyapi-omega.vercel.app/",
    icon: <Globe className="w-5 h-5" />,
    category: "web",
    fullDetails: {
      technologies: [
        "Next.js",
        "React",
        "Node.js",
        "Spotify API",
        "OAuth 2.0",
        "CSS",
        "Particle.js"
      ],
      challenges: [
        "Implemented a secure OAuth 2.0 login with Spotify to retrieve user-specific analytics.",
        "Optimized API requests and caching to avoid rate limits and improve responsiveness.",
        "Designed a custom cyberpunk-style UI with glow effects, particle animations, and dynamic charts."
      ]
    }
  },

  // ==========================================
  // ALGORITHMS & DATA STRUCTURES
  // ==========================================
  {
    id: 9,
    name: "Longest Palindromic Subsequence",
    description:
      "A dynamic programming solution for computing palindromic subsequences, including reconstruction logic.",
    skills: ["Dynamic Programming", "Algorithm Design", "Java"],
    githubLink: "https://github.com/JustinLuft/LPS",
    icon: <Code2 className="w-5 h-5" />,
    category: "algorithms",
    fullDetails: {
      technologies: ["Java", "2D ArrayList", "Custom Classes"],
      challenges: [
        "Built a pointer-driven DP table to track optimal subsequence decisions.",
        "Designed a reconstruction algorithm to trace results back through the DP matrix.",
        "Handled edge cases and empty inputs without degrading performance."
      ]
    }
  },
  {
    id: 10,
    name: "Bernoulli Number Calculator",
    description:
      "A Java-based numerical engine that computes Bernoulli numbers using rational arithmetic and recurrence identities.",
    skills: ["Java", "Recursion", "Rational Arithmetic", "Number Theory"],
    githubLink: "https://github.com/JustinLuft/BSF",
    icon: <Code className="w-5 h-5" />,
    category: "algorithms",
    fullDetails: {
      technologies: ["Java", "Custom Rational Class", "Recursion"],
      challenges: [
        "Developed a complete Rational class supporting accurate fraction operations.",
        "Implemented recursive Bernoulli computation using binomial coefficient expansions.",
        "Ensured numerical stability for large integer operations."
      ]
    }
  },
  {
    id: 12,
    name: "Train Car Sorting Simulation",
    description:
      "A simulation framework that organizes custom train-car objects by priority and destination.",
    skills: ["Java", "OOP", "Sorting Algorithms", "Simulation"],
    githubLink: "https://github.com/JustinLuft/traincarsorting",
    icon: <Train className="w-5 h-5" />,
    category: "algorithms",
    fullDetails: {
      technologies: ["Java", "Custom Classes", "Comparable"],
      challenges: [
        "Created a flexible class hierarchy supporting multiple train-car types.",
        "Implemented deterministic sorting logic using Comparable and custom comparators.",
        "Processed mixed-type collections with full type safety."
      ]
    }
  },
  {
    id: 15,
    name: "Sorting Algorithms Benchmark",
    description:
      "A Java-based benchmarking suite comparing performance across multiple sorting algorithms.",
    skills: ["Java", "Algorithms", "Performance Analysis"],
    githubLink: "https://github.com/JustinLuft/sort-comparison-analyzer",
    icon: <Layers className="w-5 h-5" />,
    category: "algorithms",
    fullDetails: {
      technologies: ["Java", "IntelliJ", "Profiling Tools"],
      challenges: [
        "Measured algorithmic performance using controlled test environments.",
        "Analyzed time complexity patterns across varied input sizes.",
        "Built extensible architecture to easily add new sorting algorithms."
      ]
    }
  },
  {
    id: 14,
    name: "Machine Learning Engine",
    description:
      "A custom linear regression engine built from scratch using NumPy and mathematical modeling.",
    skills: ["Machine Learning", "NumPy", "Linear Regression"],
    githubLink: "https://github.com/JustinLuft/linearregressionhw",
    icon: <Cpu className="w-5 h-5" />,
    category: "algorithms",
    fullDetails: {
      technologies: ["Python", "NumPy", "Scikit-learn"],
      challenges: [
        "Implemented gradient-based linear regression from first principles.",
        "Validated model correctness against scikit-learn outputs.",
        "Optimized matrix operations for faster convergence."
      ]
    }
  },

  // ==========================================
  // SYSTEMS & CONCURRENCY
  // ==========================================
  {
    id: 11,
    name: "Concurrent Systems",
    description:
      "Thread-safe concurrency solutions implementing mutual exclusion, synchronization, and deadlock prevention.",
    skills: ["Concurrency", "Semaphores", "Systems Programming"],
    githubLink: "https://github.com/JustinLuft/semaphore-assignment",
    icon: <Code className="w-5 h-5" />,
    category: "systems",
    fullDetails: {
      technologies: ["C", "POSIX Threads", "Semaphores"],
      challenges: [
        "Implemented semaphore-driven synchronization across parallel operations.",
        "Eliminated race conditions using strict ordering and mutual exclusion primitives.",
        "Developed deadlock-free concurrent patterns with predictable behavior."
      ]
    }
  },
  {
    id: 16,
    name: "Multithreaded Sudoku Solver",
    description:
      "A parallelized Sudoku solving engine that uses branching heuristics and POSIX threads to accelerate search time.",
    skills: ["C", "Multithreading", "Bitmasking", "Backtracking"],
    githubLink: "https://github.com/JustinLuft/sudokuthread",
    icon: <Code2 className="w-5 h-5" />,
    category: "systems",
    fullDetails: {
      technologies: ["C", "POSIX Threads", "Bitmask Optimization"],
      challenges: [
        "Parallelized the backtracking search by spawning threads at constraint-heavy branches.",
        "Eliminated data races using thread-safe state management and clear ownership rules.",
        "Integrated bitmasking to significantly reduce the computation required per cell."
      ]
    }
  },

  // ==========================================
  // TOOLS & UTILITIES
  // ==========================================
  {
    id: 1,
    name: "Photo Booth Experience",
    description:
      "A fully interactive photo booth system built with Unity, Raspberry Pi hardware, and real-time image processing.",
    skills: ["Scrum", "Team Collaboration", "UI/UX Design"],
    githubLink: "https://github.com/JustinLuft/UnityProject",
    icon: <Camera className="w-5 h-5" />,
    category: "tools",
    fullDetails: {
      technologies: ["Unity", "C#", "SMTP", "Raspberry Pi"],
      challenges: [
        "Built real-time image capture and processing pipelines inside Unity.",
        "Designed the complete touchscreen UI/UX for a frictionless user experience.",
        "Managed multi-developer collaboration using Scrum methodologies."
      ]
    }
  },
  {
    id: 7,
    name: "Mercedes-Benz Power BI Heatmap Visual",
    description:
      "A custom enterprise Power BI visual used at Mercedes-Benz to analyze production-line defect patterns through an interactive heatmap.",
    skills: ["Power BI", "Data Visualization", "TypeScript", "GitHub Actions"],
    githubLink: "https://github.com/JustinLuft/VanDefectHeatmap",
    icon: <Table className="w-5 h-5" />,
    category: "tools",
    fullDetails: {
      technologies: ["Power BI", "TypeScript", "HTML Canvas", "D3.js"],
      challenges: [
        "Optimized high-density heatmap rendering for thousands of datapoints.",
        "Configured complete Power BI capabilities including formatting, filters, and user-defined parameters.",
        "Integrated automated build/deployment workflows using GitHub Actions."
      ]
    }
  },
  {
    id: 8,
    name: "Python AutoClicker",
    description:
      "A customizable automation tool with a clean GUI for controlling mouse/keyboard macros.",
    skills: ["Tkinter", "Input Automation", "UI Design"],
    githubLink: "https://github.com/JustinLuft/autoclicker",
    icon: <MousePointerClick className="w-5 h-5" />,
    category: "tools",
    fullDetails: {
      technologies: ["Python", "Tkinter", "pynput", "keyboard"],
      challenges: [
        "Designed an intuitive GUI for configuring timing, modes, and automation behavior.",
        "Executed high-precision input automation using low-level control libraries.",
        "Added global hotkeys with reliable cross-platform support."
      ]
    }
  },
  {
    id: 6,
    name: "WP Prop Firm Comparison Plugin",
    description:
      "A WordPress plugin that scrapes, structures, and displays prop-trading firm data with a filterable comparison table.",
    skills: ["WordPress", "PHP", "Web Scraping", "JavaScript"],
    githubLink: "https://github.com/JustinLuft/wppropscraper2",
    icon: <Table className="w-5 h-5" />,
    category: "tools",
    fullDetails: {
      technologies: ["PHP", "JavaScript", "WordPress", "BeautifulSoup", "Firecrawl API"],
      challenges: [
        "Developed a gated content system requiring email submission before access.",
        "Scraped and normalized pricing/feature data from multiple firm sites.",
        "Built a WordPress-native UI with shortcode integration and responsive filtering."
      ]
    }
  }
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
