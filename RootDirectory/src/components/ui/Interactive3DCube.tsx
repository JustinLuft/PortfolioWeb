import React, { useState, useEffect, useRef } from 'react';

// Import category info and types from your ProjectsData
import { categoryInfo, type Category } from '../../pages/ProjectsData';

interface Interactive3DCubeProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  onScrollToProjects: () => void;
}

const Interactive3DCube: React.FC<Interactive3DCubeProps> = ({
  selectedCategory,
  onCategoryChange,
  onScrollToProjects,
}) => {
  const [cubeRotation, setCubeRotation] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const cubeRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  // Category rotation mapping
  const categories = Object.keys(categoryInfo) as Category[];
  const categoryRotations: Record<Category, { x: number; y: number }> = {} as any;
  categories.forEach((cat, index) => {
    categoryRotations[cat] = { x: 0, y: index * 90 };
  });

  // Mouse handlers
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

  const handleMouseUp = () => {
    if (!isDragging) return;

    // Normalize the Y rotation to 0-360 range
    const normalizedY = ((cubeRotation.y % 360) + 360) % 360;
    let closestCategory: Category = 'web';
    let minDiff = Infinity;

    // Find the closest category based on current rotation
    Object.entries(categoryRotations).forEach(([cat, rot]) => {
      const targetAngle = rot.y % 360;
      const diff = Math.min(
        Math.abs(normalizedY - targetAngle),
        Math.abs(normalizedY - targetAngle - 360),
        Math.abs(normalizedY - targetAngle + 360)
      );
      if (diff < minDiff) {
        minDiff = diff;
        closestCategory = cat as Category;
      }
    });

    // Only change category if it's different
    if (closestCategory !== selectedCategory) {
      onCategoryChange(closestCategory);
    }
    setIsDragging(false);
  };

  // Touch handlers
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
    handleMouseUp();
  };

  // Attach mouseup listener when dragging
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging, selectedCategory, cubeRotation.y]);

  // Cube rotation animation
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

  // Update rotation when category changes externally
  useEffect(() => {
    const newTarget = categoryRotations[selectedCategory];
    
    setTargetRotation(prev => {
      let newY = newTarget.y;
      const currentNormalized = ((prev.y % 360) + 360) % 360;
      const targetNormalized = newY % 360;
      
      // Calculate shortest path
      let deltaY = targetNormalized - currentNormalized;
      
      // Adjust for shortest rotation
      if (deltaY > 180) {
        newY = prev.y - (360 - deltaY);
      } else if (deltaY < -180) {
        newY = prev.y + (360 + deltaY);
      } else {
        newY = prev.y + deltaY;
      }

      return { x: newTarget.x, y: newY };
    });
  }, [selectedCategory]);

  return (
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
            <button
              onClick={onScrollToProjects}
              className="w-8 h-8 bg-primary/20 border border-primary hover:bg-primary/30 flex items-center justify-center transition-all hover:scale-110 group"
              aria-label="Scroll to projects"
            >
              <svg 
                className="w-4 h-4 text-primary group-hover:animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Terminal Content */}
          <div className="bg-black/50 p-6 sm:p-8">
            {/* Terminal Prompt Lines */}
            <div className="mb-1 font-vt323 text-primary/60 text-sm flex items-center gap-2 whitespace-nowrap overflow-x-auto">
              <span className="text-secondary">user@justinluftportfolio</span>
              <span>&tilde;</span>
              <span className="text-primary">$</span>
              <span className="text-primary/80">cd /users/justin/projects</span>
              <span className="animate-pulse"></span>
            </div>
            <div className="mb-4 font-vt323 text-primary/60 text-sm flex items-center gap-2">
              <span className="text-secondary">user@justinluftportfolio</span>
              <span>&tilde;</span>
              <span className="text-primary">$</span>
              <span className="text-primary/80">npm run dev</span>
              <span className="animate-pulse"></span>
            </div>

            {/* 3D Cube */}
            <div
              className="relative w-full h-64 sm:h-80 flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ perspective: '1000px' }}
            >
              <div
                ref={cubeRef}
                className="relative w-48 h-48"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg)`,
                }}
              >
                {/* Front Face - Web */}
                <div
                  className="absolute w-48 h-48 bg-gradient-to-br from-primary/40 to-primary/20 border-2 border-primary flex flex-col items-center justify-center font-press-start text-xs text-primary backdrop-blur-sm"
                  style={{ transform: 'translateZ(96px)' }}
                >
                  {categoryInfo.web.icon}
                  <span className="mt-2">{categoryInfo.web.label}</span>
                </div>

                {/* Back Face - Systems */}
                <div
                  className="absolute w-48 h-48 bg-gradient-to-br from-secondary/40 to-secondary/20 border-2 border-secondary flex flex-col items-center justify-center font-press-start text-xs text-secondary backdrop-blur-sm"
                  style={{ transform: 'rotateY(180deg) translateZ(96px)' }}
                >
                  {categoryInfo.systems.icon}
                  <span className="mt-2">{categoryInfo.systems.label}</span>
                </div>

                {/* Right Face - Tools */}
                <div
                  className="absolute w-48 h-48 bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/70 flex flex-col items-center justify-center font-press-start text-xs text-primary backdrop-blur-sm"
                  style={{ transform: 'rotateY(90deg) translateZ(96px)' }}
                >
                  {categoryInfo.tools.icon}
                  <span className="mt-2">{categoryInfo.tools.label}</span>
                </div>

                {/* Left Face - Algorithms */}
                <div
                  className="absolute w-48 h-48 bg-gradient-to-br from-secondary/30 to-secondary/10 border-2 border-secondary/70 flex flex-col items-center justify-center font-press-start text-xs text-secondary backdrop-blur-sm"
                  style={{ transform: 'rotateY(-90deg) translateZ(96px)' }}
                >
                  {categoryInfo.algorithms.icon}
                  <span className="mt-2">{categoryInfo.algorithms.label}</span>
                </div>

                {/* Top Face */}
                <div
                  className="absolute w-48 h-48 bg-gradient-to-br from-primary/50 to-primary/30 border-2 border-primary flex items-center justify-center font-press-start text-xl text-primary backdrop-blur-sm"
                  style={{ transform: 'rotateX(90deg) translateZ(96px)' }}
                >
                  ↑
                </div>

                {/* Bottom Face */}
                <div
                  className="absolute w-48 h-48 bg-gradient-to-br from-secondary/50 to-secondary/30 border-2 border-secondary flex items-center justify-center font-press-start text-xl text-secondary backdrop-blur-sm"
                  style={{ transform: 'rotateX(-90deg) translateZ(96px)' }}
                >
                  ↓
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
                <span>Use category tabs below to navigate</span>
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
  );
};

export default Interactive3DCube;