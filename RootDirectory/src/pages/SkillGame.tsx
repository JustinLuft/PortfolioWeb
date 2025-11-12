import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Environment, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import { Code, Globe, Database, Cpu, Layers, BarChart3, Server } from "lucide-react";
import * as THREE from "three";

// ============ CUSTOMIZATION SETTINGS ============
const SETTINGS = {
  CAR_SPEED: 0.03,           // Adjust car forward speed
  CAR_TURN_SPEED: 0.03,      // Adjust car turning speed
  CAR_REVERSE_SPEED: 0.6,    // Multiplier for reverse speed (0.6 = 60% of forward)
  CUBE_TEXT_SIZE: "text-blg", // Tailwind text size: text-xs, text-sm, text-base, text-lg, etc.
  CUBE_TEXT_DISTANCE: 12,     // Lower = bigger text (distance factor)
  THEME_COLOR: "#00FFD1",    // Main theme color
};
// ================================================

const skills: { title: string }[] = [
  { title: "Java" }, { title: "Python" }, { title: "C" }, { title: "React" },
  { title: "Next.js" }, { title: "Node.js" }, { title: "PostgreSQL" }, { title: "MySQL" },
  { title: "Algorithms" }, { title: "Data Structures" }, { title: "Agile" },
  { title: "Power BI" }, { title: "Teamwork" },
];

// Physics Ball - Smooth + Rolling
const Ball: React.FC<{ pos: [number, number, number]; skill: { title: string }; carPos: THREE.Vector3 }> = ({ pos, skill, carPos }) => {
  const ref = useRef<THREE.Mesh>(null);
  const vel = useRef(new THREE.Vector3(0, 0, 0));
  const tempVec = useRef(new THREE.Vector3());
  const radius = 0.6; // sphere radius for rolling

  useFrame(() => {
    if (!ref.current) return;
    const ball = ref.current;

// ----- Collision with car -----
const dist = ball.position.distanceTo(carPos);
if (dist < 1.8) {
  const pushDir = tempVec.current.subVectors(ball.position, carPos).normalize();
  
  // Compute car speed contribution
  const carVelocity = new THREE.Vector3(); // you can pass actual car velocity here if needed
  // For now we just boost the push
  const pushStrength = Math.min((1.8 - dist) * 0.5, 0.5); // much stronger than 0.05
  vel.current.add(pushDir.multiplyScalar(pushStrength));
  
  vel.current.add(carVelocity.clone().multiplyScalar(0.3));
}


    // ----- Gravity -----
    vel.current.y -= 0.015;

    // ----- Damping -----
    vel.current.multiplyScalar(0.98);

    // ----- Update position -----
    ball.position.add(vel.current);

    // ----- Bounce -----
    if (ball.position.y < radius) {
      ball.position.y = radius;
      vel.current.y = Math.abs(vel.current.y) * 0.6;

      // Reduce horizontal velocity on bounce
      vel.current.x *= 0.80;
      vel.current.z *= 0.80;

      // Clamp tiny velocities to 0
      if (Math.abs(vel.current.x) < 0.001) vel.current.x = 0;
      if (Math.abs(vel.current.z) < 0.001) vel.current.z = 0;
    }

    // ----- Boundaries -----
    if (Math.abs(ball.position.x) > 22) {
      ball.position.x = Math.sign(ball.position.x) * 22;
      vel.current.x = Math.abs(vel.current.x) > 0.01 ? -vel.current.x * 0.5 : 0;
    }
    if (Math.abs(ball.position.z) > 22) {
      ball.position.z = Math.sign(ball.position.z) * 22;
      vel.current.z = Math.abs(vel.current.z) > 0.01 ? -vel.current.z * 0.5 : 0;
    }

    // ----- Rolling rotation -----
    const horizontalVel = vel.current.clone();
    horizontalVel.y = 0; // only horizontal motion
    if (horizontalVel.length() > 0.0001) {
      const distance = horizontalVel.length();
      const axis = new THREE.Vector3(horizontalVel.z, 0, -horizontalVel.x).normalize(); // perpendicular axis
      const angle = distance / radius; // radians to roll distance
      ball.rotateOnAxis(axis, angle);
    }
  });

  return (
    <mesh ref={ref} position={pos} castShadow receiveShadow>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={SETTINGS.THEME_COLOR}
        metalness={0.8}
        roughness={0.2}
        emissive={SETTINGS.THEME_COLOR}
        emissiveIntensity={0.3}
      />
      <Html distanceFactor={SETTINGS.CUBE_TEXT_DISTANCE} center>
        <div
          className={`bg-black/80 px-4 py-2 rounded-lg ${SETTINGS.CUBE_TEXT_SIZE} font-bold whitespace-nowrap pointer-events-none border border-[#00FFD1]/30 shadow-lg`}
          style={{ color: SETTINGS.THEME_COLOR }}
        >
          {skill.title}
        </div>
      </Html>
    </mesh>
  );
};



// Cyberpunk Car Component
const Car: React.FC<{ onDebug?: (d: string) => void; onPosChange: (p: THREE.Vector3) => void }> = ({ onDebug, onPosChange }) => {
  const ref = useRef<THREE.Group>(null);
  const [keys, setKeys] = useState({ w: false, s: false, a: false, d: false });
  const vel = useRef({ x: 0, z: 0 });
  const tilt = useRef({ z: 0, x: 0 });

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

    // Turning with tilt
    if (keys.a) { 
      car.rotation.y += SETTINGS.CAR_TURN_SPEED;
      tilt.current.z = Math.min(tilt.current.z + 0.02, 0.15);
    } else if (keys.d) { 
      car.rotation.y -= SETTINGS.CAR_TURN_SPEED;
      tilt.current.z = Math.max(tilt.current.z - 0.02, -0.15);
    } else tilt.current.z *= 0.9;

    // Forward/backward with pitch
    if (keys.w) { 
      vel.current.x += Math.sin(angle) * SETTINGS.CAR_SPEED; 
      vel.current.z += Math.cos(angle) * SETTINGS.CAR_SPEED;
      tilt.current.x = Math.max(tilt.current.x - 0.01, -0.08);
    } else if (keys.s) { 
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

    if (onDebug) {
      const spd = Math.sqrt(vel.current.x ** 2 + vel.current.z ** 2);
      onDebug(`Position: x=${car.position.x.toFixed(2)}, z=${car.position.z.toFixed(2)}
Rotation: ${(car.rotation.y * (180/Math.PI)).toFixed(0)}°
Speed: ${(spd * 100).toFixed(1)} km/h
Keys: W=${keys.w}, S=${keys.s}, A=${keys.a}, D=${keys.d}`);
    }
  });

  // Reusable part
  const CarPart = ({ pos, size, color = SETTINGS.THEME_COLOR, emissive = 0.5, opacity = 1 }: any) => (
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
  );

  // Wheels
  const Wheel = ({ pos }: { pos: [number, number, number] }) => (
    <group position={pos}>
      <mesh rotation={[0, 0, Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.16, 32]} />
        <meshStandardMaterial color="#00FFD1" emissive="#00FFD1" emissiveIntensity={0.7} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );

  return (
    <group ref={ref} position={[0, 0.3, 0]}>
      {/* Body */}
      <CarPart pos={[0, 0.2, 0]} size={[1.2, 0.4, 2.5]} color="#111111" emissive={0.1} />
      {/* Glass cabin */}
      <CarPart pos={[0, 0.6, -0.3]} size={[1, 0.5, 1.2]} color="#00FFD1" emissive={0.7} opacity={0.3} />
      {/* Neon accent lines */}
      <CarPart pos={[0, 0.35, 1.2]} size={[1.1, 0.05, 0.05]} color="#00FFD1" emissive={1} />
      <CarPart pos={[0, 0.35, -1.2]} size={[1.1, 0.05, 0.05]} color="#00FFD1" emissive={1} />
      {/* Wheels */}
      {[[0.6, 0, 0.8], [-0.6, 0, 0.8], [0.6, 0, -0.8], [-0.6, 0, -0.8]].map((p, i) => <Wheel key={i} pos={p as [number, number, number]} />)}
      {/* Headlights */}
      <CarPart pos={[0.4, 0.2, 1.4]} size={[0.1, 0.1, 0.05]} color="#00FFFF" emissive={1} />
      <CarPart pos={[-0.4, 0.2, 1.4]} size={[0.1, 0.1, 0.05]} color="#00FFFF" emissive={1} />
      {/* Taillights */}
      <CarPart pos={[0.4, 0.2, -1.25]} size={[0.1, 0.1, 0.05]} color="#FF00FF" emissive={1} />
      <CarPart pos={[-0.4, 0.2, -1.25]} size={[0.1, 0.1, 0.05]} color="#FF00FF" emissive={1} />
      {/* Ambient glow */}
      <pointLight position={[0.4, 0.2, 1.3]} intensity={2} color={SETTINGS.THEME_COLOR} distance={5} />
      <pointLight position={[-0.4, 0.2, 1.3]} intensity={2} color={SETTINGS.THEME_COLOR} distance={5} />
    </group>
  );
};


// Camera Follow
const CameraFollow: React.FC<{ target: THREE.Vector3 }> = ({ target }) => {
  useFrame((state) => {
    state.camera.position.lerp(new THREE.Vector3(target.x, target.y + 12, target.z - 18), 0.05);
    state.camera.lookAt(target.x, target.y + 1, target.z);
  });
  return null;
};

// Scene
const Scene: React.FC<{ onDebug: (d: string) => void }> = ({ onDebug }) => {
  const [carPos, setCarPos] = useState(new THREE.Vector3(0, 0, 0));
  const cubePositions = useRef(skills.map(() => [(Math.random() - 0.5) * 18, 2 + Math.random() * 3, (Math.random() - 0.5) * 18] as [number, number, number]));

  return (
    <>
      <CameraFollow target={carPos} />
      <Car onDebug={onDebug} onPosChange={setCarPos} />
      {skills.map((skill, i) => <Ball key={skill.title} pos={cubePositions.current[i]} skill={skill} carPos={carPos} />)}
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>
      <gridHelper args={[50, 50, SETTINGS.THEME_COLOR, '#004d44']} position={[0, 0.01, 0]} />
      
      {[[0, 1, 25, 0], [0, 1, -25, 0], [25, 1, 0, Math.PI/2], [-25, 1, 0, Math.PI/2]].map((w, i) => (
        <mesh key={i} position={[w[0], w[1], w[2]]} rotation={[0, w[3], 0]}>
          <boxGeometry args={[50, 2, 0.5]} />
          <meshStandardMaterial color={SETTINGS.THEME_COLOR} emissive={SETTINGS.THEME_COLOR} emissiveIntensity={0.5} metalness={0.9} roughness={0.1} transparent opacity={0.3} />
        </mesh>
      ))}
      
      {[[24, 2, 24], [-24, 2, 24], [24, 2, -24], [-24, 2, -24]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
          <meshStandardMaterial color={SETTINGS.THEME_COLOR} emissive={SETTINGS.THEME_COLOR} emissiveIntensity={0.8} metalness={1} roughness={0} />
        </mesh>
      ))}
      
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
    </>
  );
};

// Main Page
export default function SkillsPage() {
  const [debug, setDebug] = useState("");

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#001a16] to-black opacity-50" />
      
      <Canvas shadows camera={{ position: [0, 12, 18], fov: 60 }}>
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 10, 50]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 20, 10]} intensity={0.5} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-far={50} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={30} shadow-camera-bottom={-30} />
        <pointLight position={[0, 10, 0]} intensity={1} color={SETTINGS.THEME_COLOR} distance={30} />
        <Scene onDebug={setDebug} />
        <Environment preset="night" />
      </Canvas>

      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
  <motion.h1
    className="text-4xl md:text-4xl font-bold tracking-wider whitespace-nowrap"
    style={{
      color: SETTINGS.THEME_COLOR,
      textShadow: `0 0 20px ${SETTINGS.THEME_COLOR}, 0 0 20px ${SETTINGS.THEME_COLOR}`,
    }}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    DRIVE THROUGH MY SKILLS
  </motion.h1>
</div>


      <div className="absolute top-8 left-8 z-10">
        <motion.div className="bg-black/70 px-6 py-3 rounded-lg border-2 backdrop-blur-sm" style={{ color: SETTINGS.THEME_COLOR, borderColor: SETTINGS.THEME_COLOR, boxShadow: `0 0 20px rgba(0, 255, 209, 0.3)` }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
          <p className="text-sm font-bold">🎮 CONTROLS</p>
          <p className="text-xs mt-1">W/S: Drive | A/D: Turn | Ram the balls!</p>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-4 w-80 bg-black/90 font-mono text-xs p-3 rounded-lg border-2 z-10 backdrop-blur-sm"
           style={{ color: SETTINGS.THEME_COLOR, borderColor: `${SETTINGS.THEME_COLOR}80`, boxShadow: '0 0 20px rgba(0, 255, 209, 0.2)' }}>
        <div className="font-bold mb-2 flex items-center">
          <span className="animate-pulse mr-2">●</span>
          TELEMETRY_DATA
        </div>
        <pre className="whitespace-pre-wrap leading-relaxed">{debug || "Initializing systems..."}</pre>
      </div>
    </div>
  );
}