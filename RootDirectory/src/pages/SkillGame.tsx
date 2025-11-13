import React, { useRef, useState, useEffect, useMemo, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Environment, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// ============ SETTINGS ============
const SETTINGS = {
  CAR_SPEED: 0.03,
  CAR_TURN_SPEED: 0.05,
  CAR_REVERSE_SPEED: 0.6,
  CUBE_TEXT_SIZE: "text-base",
  CUBE_TEXT_DISTANCE: 12,
  THEME_COLOR: "#00FFD1",
  TRAIL_LENGTH: 30, // Reduced for performance
  BALL_UPDATE_FREQUENCY: 1, // Update every frame
};

// ============ SKILLS DATA ============
const skills = [
  "Java", "Python", "C", "React",
  "Next.js", "Node.js", "PostgreSQL", "MySQL",
  "Algorithms", "DataStruct", "Agile",
  "Power BI", "Teamwork",
  "TypeScript", "JavaScript", "MIPSAsm", "Prolog",
  "Firebase", "HTML/CSS/JS", "GET/POST C", "Node/Express",
  "SQLite", "FirebaseDB",
  "Multithread", "DynProg",
  "Scrum", "Waterfall", "Git",
  "PowerApps", "Excel/VBA", "SharePoint", "DashVisual",
  "Adaptable", "ProbSolve", "TeamCollab", "UI/UX Figma"
];

// ============ BALL COMPONENT ============
const Ball = memo(({ 
  pos, 
  skill, 
  carPos,
  allBalls,
  index
}: {
  pos: [number, number, number];
  skill: string;
  carPos: THREE.Vector3;
  allBalls: React.MutableRefObject<THREE.Mesh[]>;
  index: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const tempVec = useRef(new THREE.Vector3());
  const radius = 0.6;
  const frameCounter = useRef(0);

  useEffect(() => {
    if (ref.current) {
      allBalls.current[index] = ref.current;
    }
  }, [allBalls, index]);

  useFrame(() => {
    if (!ref.current) return;
    
    // Performance: Skip some physics updates
    frameCounter.current++;
    if (frameCounter.current % SETTINGS.BALL_UPDATE_FREQUENCY !== 0) return;
    
    const ball = ref.current;

    // Car collision
    const dist = ball.position.distanceTo(carPos);
    if (dist < 2.0) {
      const pushDir = tempVec.current.subVectors(ball.position, carPos).normalize();
      const overlap = 2.0 - dist;
      const pushForce = overlap * 0.8;
      vel.current.add(pushDir.multiplyScalar(pushForce));
      vel.current.y += 0.1;
    }

    // Ball-to-ball collision (optimized - only check nearby balls)
    allBalls.current.forEach((otherBall, otherIndex) => {
      if (!otherBall || otherIndex === index) return;
      
      const ballDist = ball.position.distanceTo(otherBall.position);
      const minDist = radius * 2;
      
      if (ballDist < minDist && ballDist > 0.01) {
        const collisionDir = tempVec.current.subVectors(ball.position, otherBall.position).normalize();
        const overlap = minDist - ballDist;
        ball.position.add(collisionDir.clone().multiplyScalar(overlap * 0.25));
        if (vel.current.length() > 0.01) {
          vel.current.add(collisionDir.multiplyScalar(overlap * 0.3));
        }
      }
    });

    // Physics
    vel.current.y -= 0.012;
    vel.current.multiplyScalar(0.995);
    ball.position.add(vel.current);

    // Ground collision
    if (ball.position.y < radius) {
      ball.position.y = radius;
      if (vel.current.y < -0.01) {
        vel.current.y = -vel.current.y * 0.5;
      } else {
        vel.current.y = 0;
      }
      const horizontalSpeed = Math.sqrt(vel.current.x ** 2 + vel.current.z ** 2);
      if (horizontalSpeed > 0.001) {
        vel.current.x *= 0.92;
        vel.current.z *= 0.92;
      } else {
        vel.current.x = 0;
        vel.current.z = 0;
      }
    }

    // Boundaries
    if (Math.abs(ball.position.x) > 22) {
      ball.position.x = Math.sign(ball.position.x) * 22;
      vel.current.x = -vel.current.x * 0.6;
    }
    if (Math.abs(ball.position.z) > 22) {
      ball.position.z = Math.sign(ball.position.z) * 22;
      vel.current.z = -vel.current.z * 0.6;
    }

    // Rolling rotation
    const speed = Math.sqrt(vel.current.x ** 2 + vel.current.z ** 2);
    if (speed > 0.001) {
      const axis = new THREE.Vector3(-vel.current.z, 0, vel.current.x).normalize();
      ball.rotateOnAxis(axis, speed / radius);
    }
  });

  return (
    <mesh ref={ref} position={pos} castShadow receiveShadow>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        color={SETTINGS.THEME_COLOR}
        metalness={0.8}
        roughness={0.2}
        emissive={SETTINGS.THEME_COLOR}
        emissiveIntensity={0.3}
      />
      <Html 
        distanceFactor={SETTINGS.CUBE_TEXT_DISTANCE} 
        center
        zIndexRange={[0, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`bg-black/80 px-3 py-1.5 rounded-lg ${SETTINGS.CUBE_TEXT_SIZE} font-bold whitespace-nowrap border border-[#00FFD1]/30 shadow-lg`}
          style={{ 
            color: SETTINGS.THEME_COLOR, 
            userSelect: 'none', 
            pointerEvents: 'none'
          }}
        >
          {skill}
        </div>
      </Html>
    </mesh>
  );
});

Ball.displayName = 'Ball';

// ============ TRAIL COMPONENT ============
const Trail = memo(({ positions }: { positions: THREE.Vector3[] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current && positions.length > 1) {
      const path = new THREE.CatmullRomCurve3(positions);
      const geometry = new THREE.TubeGeometry(path, Math.min(positions.length * 2, 60), 0.15, 6, false);
      if (meshRef.current.geometry) {
        meshRef.current.geometry.dispose();
      }
      meshRef.current.geometry = geometry;
    }
  }, [positions]);

  if (positions.length < 2) return null;

  return (
    <mesh ref={meshRef}>
      <tubeGeometry args={[new THREE.CatmullRomCurve3(positions), 32, 0.15, 6, false]} />
      <meshBasicMaterial
        color="#FF00FF"
        transparent
        opacity={0.6}
      />
    </mesh>
  );
});

Trail.displayName = 'Trail';

// ============ CAR COMPONENT ============
const CarPart = memo(({ pos, size, color = SETTINGS.THEME_COLOR, emissive = 0.5, opacity = 1 }: any) => (
  <mesh position={pos} castShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial 
      color={color} 
      metalness={0.9} 
      roughness={0.1} 
      emissive={color} 
      emissiveIntensity={emissive} 
      transparent={opacity < 1} 
      opacity={opacity} 
    />
  </mesh>
));

CarPart.displayName = 'CarPart';

const Wheel = memo(({ pos }: { pos: [number, number, number] }) => (
  <group position={pos}>
    <mesh rotation={[0, 0, Math.PI/2]} castShadow>
      <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
      <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
    </mesh>
    <mesh rotation={[0, 0, Math.PI/2]}>
      <cylinderGeometry args={[0.15, 0.15, 0.16, 16]} />
      <meshStandardMaterial color="#00FFD1" emissive="#00FFD1" emissiveIntensity={0.7} metalness={1} roughness={0.2} />
    </mesh>
  </group>
));

Wheel.displayName = 'Wheel';

const Car = memo(({ 
  onDebug, 
  onPosChange,
  touchControls,
  onTrailUpdate
}: {
  onDebug?: (d: string) => void;
  onPosChange: (p: THREE.Vector3) => void;
  touchControls: { w: boolean; s: boolean; a: boolean; d: boolean };
  onTrailUpdate: (pos: THREE.Vector3) => void;
}) => {
  const ref = useRef<THREE.Group>(null);
  const [keys, setKeys] = useState({ w: false, s: false, a: false, d: false });
  const vel = useRef({ x: 0, z: 0 });
  const tilt = useRef({ z: 0, x: 0 });
  const frameCount = useRef(0);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(k)) {
        e.preventDefault();
        setKeys(p => ({ ...p, [k]: true }));
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(k)) {
        e.preventDefault();
        setKeys(p => ({ ...p, [k]: false }));
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const car = ref.current;
    const angle = car.rotation.y;
    
    const activeKeys = {
      w: keys.w || touchControls.w,
      s: keys.s || touchControls.s,
      a: keys.a || touchControls.a,
      d: keys.d || touchControls.d,
    };

    if (activeKeys.a) { 
      car.rotation.y += SETTINGS.CAR_TURN_SPEED;
      tilt.current.z = Math.min(tilt.current.z + 0.02, 0.15);
    } else if (activeKeys.d) { 
      car.rotation.y -= SETTINGS.CAR_TURN_SPEED;
      tilt.current.z = Math.max(tilt.current.z - 0.02, -0.15);
    } else tilt.current.z *= 0.9;

    if (activeKeys.w) { 
      vel.current.x += Math.sin(angle) * SETTINGS.CAR_SPEED; 
      vel.current.z += Math.cos(angle) * SETTINGS.CAR_SPEED;
      tilt.current.x = Math.max(tilt.current.x - 0.01, -0.08);
    } else if (activeKeys.s) { 
      vel.current.x -= Math.sin(angle) * SETTINGS.CAR_SPEED * SETTINGS.CAR_REVERSE_SPEED; 
      vel.current.z -= Math.cos(angle) * SETTINGS.CAR_SPEED * SETTINGS.CAR_REVERSE_SPEED;
      tilt.current.x = Math.min(tilt.current.x + 0.01, 0.05);
    } else tilt.current.x *= 0.9;

    car.rotation.z = tilt.current.z;
    car.rotation.x = tilt.current.x;

    car.position.x += vel.current.x;
    car.position.z += vel.current.z;
    vel.current.x *= 0.92;
    vel.current.z *= 0.92;

    car.position.x = Math.max(-22, Math.min(22, car.position.x));
    car.position.z = Math.max(-22, Math.min(22, car.position.z));

    onPosChange(car.position);
    
    frameCount.current++;
    if (frameCount.current % 3 === 0) {
      onTrailUpdate(car.position.clone());
    }

    if (onDebug && frameCount.current % 10 === 0) {
      const spd = Math.sqrt(vel.current.x ** 2 + vel.current.z ** 2);
      onDebug(`x=${car.position.x.toFixed(1)} z=${car.position.z.toFixed(1)} | ${(spd * 100).toFixed(0)} km/h`);
    }
  });

  const wheelPositions = useMemo(() => [
    [0.6, 0, 0.8], [-0.6, 0, 0.8], [0.6, 0, -0.8], [-0.6, 0, -0.8]
  ] as [number, number, number][], []);

  return (
    <group ref={ref} position={[0, 0.3, 0]}>
      <CarPart pos={[0, 0.2, 0]} size={[1.2, 0.4, 2.5]} color="#111111" emissive={0.1} />
      <CarPart pos={[0, 0.6, -0.3]} size={[1, 0.5, 1.2]} color="#00FFD1" emissive={0.7} opacity={0.3} />
      <CarPart pos={[0, 0.35, 1.2]} size={[1.1, 0.05, 0.05]} color="#00FFD1" emissive={1} />
      <CarPart pos={[0, 0.35, -1.2]} size={[1.1, 0.05, 0.05]} color="#00FFD1" emissive={1} />
      {wheelPositions.map((p, i) => <Wheel key={i} pos={p} />)}
      <CarPart pos={[0.4, 0.2, 1.4]} size={[0.1, 0.1, 0.05]} color="#00FFFF" emissive={1} />
      <CarPart pos={[-0.4, 0.2, 1.4]} size={[0.1, 0.1, 0.05]} color="#00FFFF" emissive={1} />
      <CarPart pos={[0.4, 0.2, -1.25]} size={[0.1, 0.1, 0.05]} color="#FF00FF" emissive={1} />
      <CarPart pos={[-0.4, 0.2, -1.25]} size={[0.1, 0.1, 0.05]} color="#FF00FF" emissive={1} />
      <pointLight position={[0.4, 0.2, 1.3]} intensity={2} color={SETTINGS.THEME_COLOR} distance={5} />
      <pointLight position={[-0.4, 0.2, 1.3]} intensity={2} color={SETTINGS.THEME_COLOR} distance={5} />
    </group>
  );
});

Car.displayName = 'Car';

// ============ CAMERA FOLLOW ============
const CameraFollow = memo(({ target }: { target: THREE.Vector3 }) => {
  useFrame((state) => {
    state.camera.position.lerp(new THREE.Vector3(target.x, target.y + 12, target.z - 18), 0.05);
    state.camera.lookAt(target.x, target.y + 1, target.z);
  });
  return null;
});

CameraFollow.displayName = 'CameraFollow';

// ============ ENVIRONMENT ============
const GameEnvironment = memo(() => {
  const wallPositions = useMemo(() => [
    [0, 1, 25, 0], [0, 1, -25, 0], [25, 1, 0, Math.PI/2], [-25, 1, 0, Math.PI/2]
  ], []);
  
  const pillarPositions = useMemo(() => [
    [24, 2, 24], [-24, 2, 24], [24, 2, -24], [-24, 2, -24]
  ] as [number, number, number][], []);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>
      <gridHelper args={[50, 50, SETTINGS.THEME_COLOR, '#004d44']} position={[0, 0.01, 0]} />
      
      {wallPositions.map((w, i) => (
        <mesh key={i} position={[w[0], w[1], w[2]]} rotation={[0, w[3], 0]}>
          <boxGeometry args={[50, 2, 0.5]} />
          <meshStandardMaterial 
            color={SETTINGS.THEME_COLOR} 
            emissive={SETTINGS.THEME_COLOR} 
            emissiveIntensity={0.5} 
            metalness={0.9} 
            roughness={0.1} 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      ))}
      
      {pillarPositions.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
          <meshStandardMaterial 
            color={SETTINGS.THEME_COLOR} 
            emissive={SETTINGS.THEME_COLOR} 
            emissiveIntensity={0.8} 
            metalness={1} 
            roughness={0} 
          />
        </mesh>
      ))}
      
      <Stars radius={100} depth={50} count={800} factor={4} saturation={0} fade speed={1} />
    </>
  );
});

GameEnvironment.displayName = 'GameEnvironment';

// ============ SCENE ============
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
        <ambientLight intensity={0.2} />
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