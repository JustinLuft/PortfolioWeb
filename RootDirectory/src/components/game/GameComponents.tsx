import React, { useRef, useState, useEffect, useMemo, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Environment, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

// ============================================================================
// FILE 1: GAME COMPONENTS (Ball, Trail, Car, Camera, Environment)
// ============================================================================

// ============ SETTINGS ============
const SETTINGS = {
  CAR_SPEED: 0.03,
  CAR_TURN_SPEED: 0.05,
  CAR_REVERSE_SPEED: 0.6,
  CUBE_TEXT_SIZE: "text-lg",
  CUBE_TEXT_DISTANCE: 15,
  THEME_COLOR: "#00FFD1",
  TRAIL_LENGTH: 30,
  BALL_UPDATE_FREQUENCY: 1,
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
  const radius = 0.7;
  const frameCounter = useRef(0);

  useEffect(() => {
    if (ref.current) {
      allBalls.current[index] = ref.current;
    }
  }, [allBalls, index]);

  useFrame((_, delta) => {
    if (!ref.current) return;

    // Clamp delta to avoid spiral of death on tab re-focus
    const dt = Math.min(delta, 0.1);

    frameCounter.current++;
    if (frameCounter.current % SETTINGS.BALL_UPDATE_FREQUENCY !== 0) return;

    const ball = ref.current;

    // Car collision
    const dist = ball.position.distanceTo(carPos);
    if (dist < 2.0) {
      const pushDir = tempVec.current.subVectors(ball.position, carPos).normalize();
      const overlap = 2.0 - dist;
      // Scale impulse by dt*60 so it feels the same at 60 fps
      const pushForce = overlap * 0.8 * (dt * 60);
      vel.current.addScaledVector(pushDir, pushForce);
      vel.current.y += 0.1 * (dt * 60);
    }

    // Ball-to-ball collision
    allBalls.current.forEach((otherBall, otherIndex) => {
      if (!otherBall || otherIndex === index) return;

      const ballDist = ball.position.distanceTo(otherBall.position);
      const minDist = radius * 2;

      if (ballDist < minDist && ballDist > 0.01) {
        const collisionDir = tempVec.current
          .subVectors(ball.position, otherBall.position)
          .normalize();
        const overlap = minDist - ballDist;
        ball.position.addScaledVector(collisionDir, overlap * 0.25);
        if (vel.current.length() > 0.01) {
          vel.current.addScaledVector(collisionDir, overlap * 0.3 * (dt * 60));
        }
      }
    });

    // Gravity — tuned at 60fps: 0.012 per frame → 0.012*60 = 0.72 units/s²
    vel.current.y -= 0.72 * dt;

    // Exponential friction (air)
    const airFriction = Math.pow(0.995, dt * 60);
    vel.current.multiplyScalar(airFriction);

    ball.position.addScaledVector(vel.current, dt * 60);

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
        // Ground friction — tuned at 60fps: 0.92 per frame
        const groundFriction = Math.pow(0.92, dt * 60);
        vel.current.x *= groundFriction;
        vel.current.z *= groundFriction;
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
      ball.rotateOnAxis(axis, (speed / radius) * dt * 60);
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
          style={{ color: SETTINGS.THEME_COLOR, userSelect: 'none', pointerEvents: 'none' }}
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

  useFrame((_, delta) => {
    if (!ref.current) return;

    const dt = Math.min(delta, 0.1);
    const car = ref.current;
    const angle = car.rotation.y;

    const activeKeys = {
      w: keys.w || touchControls.w,
      s: keys.s || touchControls.s,
      a: keys.a || touchControls.a,
      d: keys.d || touchControls.d,
    };

    // Turn speed tuned at 60fps: 0.05 rad/frame → 3 rad/s
    const turnAmount = 3.0 * dt;

    if (activeKeys.a) {
      car.rotation.y += turnAmount;
      tilt.current.z = Math.min(tilt.current.z + 0.02 * dt * 60, 0.15);
    } else if (activeKeys.d) {
      car.rotation.y -= turnAmount;
      tilt.current.z = Math.max(tilt.current.z - 0.02 * dt * 60, -0.15);
    } else {
      // Exponential decay: base 0.9^(dt*60)
      tilt.current.z *= Math.pow(0.9, dt * 60);
    }

    // Acceleration tuned at 60fps: 0.03 per frame → 1.8 units/s²
    const accel = 1.8 * dt;
    const reverseAccel = accel * SETTINGS.CAR_REVERSE_SPEED;

    if (activeKeys.w) {
      vel.current.x += Math.sin(angle) * accel;
      vel.current.z += Math.cos(angle) * accel;
      tilt.current.x = Math.max(tilt.current.x - 0.01 * dt * 60, -0.08);
    } else if (activeKeys.s) {
      vel.current.x -= Math.sin(angle) * reverseAccel;
      vel.current.z -= Math.cos(angle) * reverseAccel;
      tilt.current.x = Math.min(tilt.current.x + 0.01 * dt * 60, 0.05);
    } else {
      tilt.current.x *= Math.pow(0.9, dt * 60);
    }

    car.rotation.z = tilt.current.z;
    car.rotation.x = tilt.current.x;

    // Exponential velocity decay — 0.92 per frame at 60fps
    const friction = Math.pow(0.92, dt * 60);
    vel.current.x *= friction;
    vel.current.z *= friction;

    car.position.x += vel.current.x * dt * 60;
    car.position.z += vel.current.z * dt * 60;

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
  // k=3 gives ~95% convergence in 1 second, matching the original lerp(0.05) at 60fps
  const k = 3;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const smoothing = 1 - Math.exp(-k * dt);

    const desired = new THREE.Vector3(target.x, target.y + 12, target.z - 18);
    state.camera.position.lerp(desired, smoothing);
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

export {
  Ball,
  Trail,
  Car,
  CameraFollow,
  GameEnvironment,
  SETTINGS,
  skills
};
