import React, { FC, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Letter3DProps {
  char: string;
  index: number;
  isReady: boolean;
  mousePosition: { x: number; y: number };
  interactionRadius?: number;
  letterSpacing?: number;
}

const Letter3D: FC<Letter3DProps> = ({
  char,
  index,
  isReady,
  mousePosition,
  interactionRadius = 500,
  letterSpacing = 3,
}) => {
  const letterRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [responsiveSpacing, setResponsiveSpacing] = useState(letterSpacing);

  // Responsive letter spacing for mobile
  useEffect(() => {
    const updateSpacing = () => {
      if (window.innerWidth < 768) {
        setResponsiveSpacing(letterSpacing + 8);
      } else {
        setResponsiveSpacing(letterSpacing);
      }
    };
    updateSpacing();
    window.addEventListener('resize', updateSpacing);
    return () => window.removeEventListener('resize', updateSpacing);
  }, [letterSpacing]);

  // Tilt calculation based on mouse
  useEffect(() => {
    if (!letterRef.current) return;

    const rect = letterRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = mousePosition.x - centerX;
    const deltaY = mousePosition.y - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const maxTilt = 50;
    const influence = Math.max(0, 1 - distance / interactionRadius);
    setTilt({
      x: (deltaY / interactionRadius) * maxTilt * influence,
      y: -(deltaX / interactionRadius) * maxTilt * influence,
    });
  }, [mousePosition, interactionRadius]);

  const displayChar = char === ' ' ? '\u00A0' : char;
  const depth = 40; // number of extrusion layers

  // Function to generate pink extrusion colors (back to front gradient)
  const getLayerColor = (layer: number, totalLayers: number) => {
    const ratio = layer / totalLayers;
    const r = Math.floor(200 + 55 * ratio); // 200 -> 255
    const g = Math.floor(10 + 40 * ratio);  // 10 -> 50
    const b = Math.floor(120 + 40 * ratio); // 120 -> 160
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <motion.div
      ref={letterRef}
      className="letter-3d-container"
      style={{ 
        marginLeft: index === 0 ? 0 : `${responsiveSpacing}px`,
        marginRight: 0 
      }}
      initial={{ opacity: 0, z: -100, rotateY: -90 }}
      animate={{ opacity: isReady ? 1 : 0, z: 0, rotateY: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      <motion.div
        className="letter-3d"
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        {/* Pink extrusion layers - positioned BEHIND the front face */}
        {Array.from({ length: depth }).map((_, i) => {
          // Position layers from back (-depth/2) to middle (0)
          const zPos = -depth / 2 + i;
          const opacity = 0.3 + (i / depth) * 0.5;
          return (
            <div
              key={i}
              className="letter-extrusion"
              style={{
                transform: `translateZ(${zPos}px)`,
                color: getLayerColor(i, depth),
                opacity: opacity,
              }}
            >
              {displayChar}
            </div>
          );
        })}

        {/* Cyan front face - positioned AHEAD of all extrusion layers */}
        <div 
          className="letter-face letter-front"
          style={{
            transform: `translateZ(${depth / 2 + 5}px)`, // Position well ahead of extrusions
          }}
        >
          {displayChar}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Letter3D;