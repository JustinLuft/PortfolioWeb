import React, { useState, useEffect, useRef, useMemo, memo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { motion } from "framer-motion";


// ============================================================================
// SCENE, UI COMPONENTS, AND MAIN APP
// ============================================================================


// Import all game components and constants
import {
  Ball,
  Trail,
  Car,
  CameraFollow,
  GameEnvironment,
  SETTINGS,
  skills
} from "@/components/game/GameComponents";


const Scene = memo(({ 
  onDebug,
  touchControls
}: {
  onDebug: (d: string) => void;
  touchControls: { w: boolean; s: boolean; a: boolean; d: boolean };
}) => {
  const [carPos, setCarPos] = useState(new THREE.Vector3(0, 0, 0));
  const [trailPositions, setTrailPositions] = useState<THREE.Vector3[]>([]);
  const cubePositions = useMemo(() => 
    skills.map(() => [
      (Math.random() - 0.5) * 18, 
      2 + Math.random() * 3, 
      (Math.random() - 0.5) * 18
    ] as [number, number, number]), 
  []);
  const ballRefs = useRef<THREE.Mesh[]>([]);

  const handleTrailUpdate = (pos: THREE.Vector3) => {
    setTrailPositions(prev => {
      const newTrail = [...prev, pos];
      if (newTrail.length > SETTINGS.TRAIL_LENGTH) {
        return newTrail.slice(-SETTINGS.TRAIL_LENGTH);
      }
      return newTrail;
    });
  };

  return (
    <>
      <CameraFollow target={carPos} />
      <Car 
        onDebug={onDebug} 
        onPosChange={setCarPos} 
        touchControls={touchControls} 
        onTrailUpdate={handleTrailUpdate} 
      />
      <Trail positions={trailPositions} />
      {skills.map((skill, i) => (
        <Ball 
          key={skill} 
          pos={cubePositions[i]} 
          skill={skill} 
          carPos={carPos}
          allBalls={ballRefs}
          index={i}
        />
      ))}
      <GameEnvironment />
    </>
  );
});

Scene.displayName = 'Scene';

// ============ TOUCH BUTTON ============
const TouchButton = memo(({
  label,
  onPress,
  onRelease,
  className = ""
}: {
  label: string;
  onPress: () => void;
  onRelease: () => void;
  className?: string;
}) => {
  return (
    <button
      className={`bg-black/70 backdrop-blur-sm border-2 rounded-lg font-bold text-lg active:scale-95 transition-transform select-none ${className}`}
      style={{ 
        color: SETTINGS.THEME_COLOR, 
        borderColor: SETTINGS.THEME_COLOR,
        boxShadow: `0 0 15px ${SETTINGS.THEME_COLOR}40`,
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        zIndex: 50,
      }}
      onTouchStart={(e) => { e.preventDefault(); onPress(); }}
      onTouchEnd={(e) => { e.preventDefault(); onRelease(); }}
      onTouchMove={(e) => e.preventDefault()}
      onMouseDown={onPress}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
    >
      {label}
    </button>
  );
});

TouchButton.displayName = 'TouchButton';

// ============ MAIN APP ============
export default function SkillsPage() {
  const [debug, setDebug] = useState("");
  const [touchControls, setTouchControls] = useState({ w: false, s: false, a: false, d: false });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouch = (key: 'w' | 's' | 'a' | 'd', pressed: boolean) => {
    setTouchControls(prev => ({ ...prev, [key]: pressed }));
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#001a16] to-black opacity-50" />
      
      <Canvas shadows camera={{ position: [0, 12, 18], fov: 60 }} gl={{ antialias: false }}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 50]} />
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={0.5} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        <pointLight position={[0, 10, 0]} intensity={1} color={SETTINGS.THEME_COLOR} distance={30} />
        <Scene onDebug={setDebug} touchControls={touchControls} />
        <Environment preset="night" />
      </Canvas>

      <div className="absolute top-4 md:top-8 left-1/2 transform -translate-x-1/2 text-center z-10 px-4">
        <motion.h1
          className="text-2xl md:text-4xl font-bold tracking-wider"
          style={{
            color: SETTINGS.THEME_COLOR,
            textShadow: `0 0 20px ${SETTINGS.THEME_COLOR}`,
            userSelect: 'none',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {isMobile ? "MY SKILLS" : "DRIVE THROUGH MY SKILLS"}
        </motion.h1>
      </div>

      {!isMobile && (
        <div className="absolute top-8 left-8 z-10">
          <motion.div 
            className="bg-black/70 px-4 py-2 rounded-lg border-2 backdrop-blur-sm" 
            style={{ 
              color: SETTINGS.THEME_COLOR, 
              borderColor: SETTINGS.THEME_COLOR, 
              boxShadow: `0 0 20px ${SETTINGS.THEME_COLOR}30` 
            }}
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-sm font-bold">🎮 CONTROLS</p>
            <p className="text-xs mt-1">W/S: Drive | A/D: Turn</p>
          </motion.div>
        </div>
      )}

      {isMobile && (
        <div className="absolute bottom-4 left-0 right-0 z-50 px-6 pb-2 pointer-events-none">
          <div className="flex justify-between items-end gap-8 max-w-lg mx-auto pointer-events-auto">
            <div className="relative w-44 h-44">
              <TouchButton
                label="↑"
                onPress={() => handleTouch('w', true)}
                onRelease={() => handleTouch('w', false)}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12"
              />
              <TouchButton
                label="←"
                onPress={() => handleTouch('a', true)}
                onRelease={() => handleTouch('a', false)}
                className="absolute top-1/2 left-0 -translate-y-1/2 w-12 h-12"
              />
              <TouchButton
                label="→"
                onPress={() => handleTouch('d', true)}
                onRelease={() => handleTouch('d', false)}
                className="absolute top-1/2 right-0 -translate-y-1/2 w-12 h-12"
              />
              <TouchButton
                label="↓"
                onPress={() => handleTouch('s', true)}
                onRelease={() => handleTouch('s', false)}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-[#00FFD1]/30 pointer-events-none" />
            </div>

            <div className="text-xs font-mono mb-2" style={{ color: SETTINGS.THEME_COLOR }}>
              <div className="bg-black/70 backdrop-blur-sm border border-[#00FFD1]/50 rounded-lg px-3 py-2">
                <div className="font-bold mb-1">CONTROLS</div>
                <div className="text-[10px] opacity-80">
                  ↑ Forward<br/>
                  ↓ Reverse<br/>
                  ← → Turn
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div 
        className={`absolute ${isMobile ? 'top-16 right-2 w-48 text-[10px]' : 'bottom-4 left-4 w-80 text-xs'} bg-black/90 font-mono p-2 rounded-lg border-2 z-10 backdrop-blur-sm`}
        style={{ 
          color: SETTINGS.THEME_COLOR, 
          borderColor: `${SETTINGS.THEME_COLOR}80`, 
          boxShadow: `0 0 20px ${SETTINGS.THEME_COLOR}20` 
        }}
      >
        <div className="font-bold mb-1 flex items-center">
          <span className="animate-pulse mr-1">●</span>
          TELEMETRY
        </div>
        <pre className="whitespace-pre-wrap leading-relaxed">{debug || "Init..."}</pre>
      </div>
    </div>
  );
}