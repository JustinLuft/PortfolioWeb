import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Import all project data and types
import { 
  projects, 
  categoryInfo, 
  getProjectsByCategory,
  getFirstProjectByCategory,
  type Category,
  type Project 
} from './ProjectsData';

const ProjectShowcasePage: React.FC = () => {
  // -------------------------------
  // State
  // -------------------------------
  const [selectedCategory, setSelectedCategory] = useState<Category>('web');
  const [selectedProject, setSelectedProject] = useState<Project>(
    getFirstProjectByCategory('web') || projects[0]
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'technologies' | 'challenges'>('overview');
  const [currentPage, setCurrentPage] = useState(0);
  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // -------------------------------
  // Refs
  // -------------------------------
  const cubeRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  // -------------------------------
  // Categories & rotation mapping
  // -------------------------------
  const categories = Object.keys(categoryInfo) as Category[];

  const categoryRotations: Record<Category, { x: number; y: number }> = {} as any;
  categories.forEach((cat, index) => {
    categoryRotations[cat] = { x: 0, y: index * 90 };
  });

  // -------------------------------
  // Mouse / Drag Handlers
  // -------------------------------
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;

    setTargetRotation(prev => ({
      x: prev.x - deltaY * 0.8,
      y: prev.y + deltaX * 0.8,
    }));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e?: MouseEvent) => {
    if (!isDragging) return;

    const normalizedY = ((cubeRotation.y % 360) + 360) % 360;
    let closestCategory: Category = 'web';
    let minDiff = Infinity;

    Object.entries(categoryRotations).forEach(([cat, rot]) => {
      const diff = Math.min(
        Math.abs(normalizedY - rot.y),
        Math.abs(normalizedY - rot.y - 360),
        Math.abs(normalizedY - rot.y + 360)
      );
      if (diff < minDiff) {
        minDiff = diff;
        closestCategory = cat as Category;
      }
    });

    if (closestCategory !== selectedCategory) {
      handleCategoryChange(closestCategory);
    }
    setIsDragging(false);
  };
  // Touch Handlers (for mobile)
const handleTouchStart = (e: React.TouchEvent) => {
  setIsDragging(true);
  const touch = e.touches[0];
  lastMousePos.current = { x: touch.clientX, y: touch.clientY };
};

const handleTouchMove = (e: React.TouchEvent) => {
  if (!isDragging) return;
  const touch = e.touches[0];
  const deltaX = touch.clientX - lastMousePos.current.x;
  const deltaY = touch.clientY - lastMousePos.current.y;

  setTargetRotation(prev => ({
    x: prev.x - deltaY * 0.8,
    y: prev.y + deltaX * 0.8,
  }));

  lastMousePos.current = { x: touch.clientX, y: touch.clientY };
};

const handleTouchEnd = () => {
  handleMouseUp(); // reuse your existing snapping logic
};


  // -------------------------------
  // Attach mouseup listener when dragging
  // -------------------------------
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging, selectedCategory]);

  // -------------------------------
  // Cube rotation animation
  // -------------------------------
  useEffect(() => {
    const animate = () => {
      setCubeRotation(prev => {
        const dx = targetRotation.x - prev.x;
        const dy = targetRotation.y - prev.y;
        const ease = 0.1;

        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          return targetRotation;
        }

        return {
          x: prev.x + dx * ease,
          y: prev.y + dy * ease,
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [targetRotation]);

  // -------------------------------
  // Pagination reset when category changes
  // -------------------------------
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  // -------------------------------
  // Category change
  // -------------------------------
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
    const firstProject = getFirstProjectByCategory(category);
    if (firstProject) {
      setSelectedProject(firstProject);
      setActiveTab('overview');
    }
setTargetRotation(prev => {
  const newTarget = categoryRotations[category];

  // Calculate the shortest path for Y rotation
  let newY = newTarget.y;
  let deltaY = newY - prev.y;

  // Normalize to shortest spin direction
  if (deltaY > 180) newY -= 360;
  else if (deltaY < -180) newY += 360;

  return { x: newTarget.x, y: newY };
});
  };

  // -------------------------------
  // Pagination handlers
  // -------------------------------
  const PROJECTS_PER_PAGE = 5;
  const filteredProjects = getProjectsByCategory(selectedCategory);
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    currentPage * PROJECTS_PER_PAGE,
    (currentPage + 1) * PROJECTS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h3 className="font-press-start text-xs mb-3 text-primary">Overview</h3>
            <p className="font-vt323 text-lg md:text-xl text-primary/80 leading-relaxed">
              {selectedProject.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedProject.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-secondary/20 text-secondary px-2 py-1 rounded text-xs font-press-start"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      case 'technologies':
        return (
          <div>
            <h3 className="font-press-start text-xs mb-3 text-primary">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProject.fullDetails.technologies.map((tech, index) => (
                <span 
                  key={index} 
                  className="bg-primary/10 text-primary px-2.5 py-1.5 rounded-full text-sm font-vt323"
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
            <h3 className="font-press-start text-xs mb-3 text-primary">Challenges</h3>
            <ul className="space-y-2">
              {selectedProject.fullDetails.challenges.map((challenge, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-secondary mt-0.5 text-sm">▸</span>
                  <span className="font-vt323 text-base md:text-lg text-primary/80 leading-snug">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0B0C10] to-[#1A1E23] opacity-90" />
        <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
        <div className="scanline absolute inset-0 pointer-events-none z-10" />
      </div>

      <div className="container mx-auto px-2 py-8 sm:py-12 relative z-20 max-w-7xl">
        {/* Header */}
        <div className="mb-1 sm:mb-1 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-press-start mb-2 sm:mb-3 text-primary leading-tight">
            Project Showcase
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-vt323 text-primary/80 px-4">
            Welcome To My Project Collection
          </p>
        </div>

        {/* Terminal-Style 3D Cube Container */}
        <div className="flex justify-center mb-8 px-4">
          <div className="relative w-full max-w-2xl">
            {/* Terminal Window */}
            <div className="bg-black/90 border-2 border-primary rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
              {/* Terminal Header */}
              <div className="bg-primary/10 border-b-2 border-primary/30 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="font-press-start text-[10px] text-primary/70">
                    http://localhost:5173/
                  </span>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="bg-black/50 p-6 sm:p-8">
                {/* Terminal Prompt Line */}
                <div className="mb-1 font-vt323 text-primary/60 text-sm flex items-center gap-2 whitespace-nowrap">
                <span className="text-secondary">user@justinluftportfolio</span>
                <span>-</span>
                <span className="text-primary">$</span>
                <span className="text-primary/80">cd /users/justin/portfolio</span>
                <span className="animate-pulse"></span>
              </div>
                <div className="mb-1 font-vt323 text-primary/60 text-sm flex items-center gap-2">
                  <span className="text-secondary">user@justinluftportfolion</span>
                  <span>&tilde;</span>
                  <span className="text-primary">$</span>
                  <span className="text-primary/80">npm run</span>
                  <span className="animate-pulse"></span>
                </div>
{/* Terminal-Style 3D Cube Container */}
        <div className="flex justify-center mb-8 px-4">
          <div
            className="relative w-full max-w-2xl h-64 sm:h-80 flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ perspective: '1000px' }}
          >

            <div ref={cubeRef} className="relative w-48 h-48" style={{ transformStyle: 'preserve-3d', transform: `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg)` }}>
              {/* Front Face */}
              <div className="absolute w-48 h-48 bg-gradient-to-br from-primary/40 to-primary/20 border-2 border-primary flex flex-col items-center justify-center font-press-start text-xs text-primary backdrop-blur-sm" style={{ transform: 'translateZ(96px)' }}>
                {categoryInfo.web.icon}
                <span className="mt-2">{categoryInfo.web.label}</span>
              </div>
              {/* Back Face */}
              <div className="absolute w-48 h-48 bg-gradient-to-br from-secondary/40 to-secondary/20 border-2 border-secondary flex flex-col items-center justify-center font-press-start text-xs text-secondary backdrop-blur-sm" style={{ transform: 'rotateY(180deg) translateZ(96px)' }}>
                {categoryInfo.systems.icon}
                <span className="mt-2">{categoryInfo.systems.label}</span>
              </div>
              {/* Right Face */}
              <div className="absolute w-48 h-48 bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/70 flex flex-col items-center justify-center font-press-start text-xs text-primary backdrop-blur-sm" style={{ transform: 'rotateY(90deg) translateZ(96px)' }}>
                {categoryInfo.tools.icon}
                <span className="mt-2">{categoryInfo.tools.label}</span>
              </div>
              {/* Left Face */}
              <div className="absolute w-48 h-48 bg-gradient-to-br from-secondary/30 to-secondary/10 border-2 border-secondary/70 flex flex-col items-center justify-center font-press-start text-xs text-secondary backdrop-blur-sm" style={{ transform: 'rotateY(-90deg) translateZ(96px)' }}>
                {categoryInfo.algorithms.icon}
                <span className="mt-2">{categoryInfo.algorithms.label}</span>
              </div>
              {/* Top Face */}
              <div className="absolute w-48 h-48 bg-gradient-to-br from-primary/50 to-primary/30 border-2 border-primary flex items-center justify-center font-press-start text-xl text-primary backdrop-blur-sm" style={{ transform: 'rotateX(90deg) translateZ(96px)' }}>
                ↑
              </div>
              {/* Bottom Face */}
              <div className="absolute w-48 h-48 bg-gradient-to-br from-secondary/50 to-secondary/30 border-2 border-secondary flex items-center justify-center font-press-start text-xl text-secondary backdrop-blur-sm" style={{ transform: 'rotateX(-90deg) translateZ(96px)' }}>
                ↓
              </div>
            </div>
            {/* Glow / Ambient Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            </div>
          </div>
        </div>





                {/* Terminal Instructions */}
                <div className="mt-6 space-y-2 font-vt323 text-sm text-primary/60">
                  <div className="flex items-start gap-2">
                    <span className="text-secondary">→</span>
                    <span>Drag cube to rotate and explore categories</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-secondary">→</span>
                    <span>Click on a face to select the category</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-primary">Selected:</span>
                    <span className="bg-primary/20 border border-primary px-2 py-0.5 rounded text-primary font-press-start text-[10px]">
                      {categoryInfo[selectedCategory].label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 sm:mb-8 flex flex-wrap justify-center gap-2">
          {(Object.keys(categoryInfo) as Category[]).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`
                flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg 
                font-press-start text-xs sm:text-sm
                transition-all duration-300 border-2
                ${selectedCategory === category 
                  ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20' 
                  : 'bg-background/50 border-primary/20 text-primary/60 hover:border-primary/40 hover:text-primary'}
              `}
            >
              {categoryInfo[category].icon}
              <span>{categoryInfo[category].label}</span>
            </button>
          ))}
        </div>

        {/* Category Description - Hidden on mobile */}
        <div className="text-center mb-4 sm:mb-6 hidden sm:block">
          <p className="font-vt323 text-base sm:text-lg text-primary/70 px-4">
            {categoryInfo[selectedCategory].description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-2">
          {/* Project List */}
          <div className="lg:col-span-1 px-4 sm:px-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4 px-1 sm:px-2">
              <h2 className="font-press-start text-[10px] sm:text-xs text-primary/60">
                {filteredProjects.length} Project{filteredProjects.length !== 1 ? 's' : ''}
              </h2>
              {totalPages > 1 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className={`p-1 sm:p-1.5 rounded border transition-all ${
                      currentPage === 0
                        ? 'border-primary/20 text-primary/20 cursor-not-allowed'
                        : 'border-primary/40 text-primary/60 hover:border-primary hover:text-primary'
                    }`}
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <span className="font-press-start text-[10px] text-primary/60 min-w-[40px] sm:min-w-[50px] text-center">
                    {currentPage + 1}/{totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`p-1 sm:p-1.5 rounded border transition-all ${
                      currentPage === totalPages - 1
                        ? 'border-primary/20 text-primary/20 cursor-not-allowed'
                        : 'border-primary/40 text-primary/60 hover:border-primary hover:text-primary'
                    }`}
                  >
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <AnimatePresence mode="wait">
                {paginatedProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedProject(project);
                      setActiveTab('overview');
                    }}
                    className={`
                      cursor-pointer p-3 sm:p-4 rounded-lg transition-all duration-300
                      ${selectedProject.id === project.id
                        ? 'bg-primary/20 border-2 border-primary shadow-lg shadow-primary/10'
                        : 'bg-background/50 border-2 border-primary/10 hover:bg-primary/10 hover:border-primary/30'}
                    `}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`
                        flex-shrink-0
                        ${selectedProject.id === project.id ? 'text-primary' : 'text-primary/60'}
                      `}>
                        {project.icon}
                      </div>
                      <h3 className={`
                        font-press-start text-[10px] sm:text-xs leading-tight
                        ${selectedProject.id === project.id ? 'text-primary' : 'text-primary/80'}
                      `}>
                        {project.name}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Project Details */}
          <motion.div
            key={selectedProject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 bg-background/80 backdrop-blur-sm border-2 border-primary/20 rounded-lg p-4 sm:p-6"
          >
            {/* Project Header */}
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-primary/20">
              <div className="text-primary mt-0.5 flex-shrink-0">
                {selectedProject.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-press-start text-sm sm:text-lg md:text-xl text-primary mb-2 leading-tight break-words">
                  {selectedProject.name}
                </h2>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-primary/20 overflow-x-auto">
              {['overview', 'technologies', 'challenges'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`
                    font-press-start text-[10px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 rounded transition-all whitespace-nowrap
                    ${activeTab === tab 
                      ? 'bg-secondary/20 text-secondary border border-secondary' 
                      : 'text-primary/60 hover:text-primary hover:bg-primary/5'}
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mb-4 sm:mb-6 min-h-[180px] sm:min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/10 font-press-start text-[10px] sm:text-xs h-10 sm:h-12"
                onClick={() => window.open(selectedProject.githubLink, '_blank')}
              >
                <Github className="w-3 h-3 sm:w-4 sm:h-4" /> View Code
              </Button>
              {selectedProject.websiteLink && (
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2 border-secondary text-secondary hover:bg-secondary/10 font-press-start text-[10px] sm:text-xs h-10 sm:h-12"
                  onClick={() => window.open(selectedProject.websiteLink, '_blank')}
                >
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4" /> Live Demo
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcasePage;