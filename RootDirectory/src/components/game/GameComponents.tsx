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

// ============ VEHICLE PHYSICS CONSTANTS ============
const VEHICLE = {
  // Engine
  MAX_SPEED: 18,
  ACCELERATION: 22,
  REVERSE_ACCEL: 10,
  ENGINE_BRAKE: 6,
  BRAKE_FORCE: 28,

  // Steering
  MAX_STEER_ANGLE: 0.45,
  STEER_SPEED: 3.5,
  STEER_RETURN: 4.0,

  // Handling
  GRIP: 8.5,
  DRIFT_FACTOR: 0.82,
  SPEED_STEER_REDUCE: 0.6,

  // Suspension
  SUSP_STIFFNESS: 120,
  SUSP_DAMPING: 14,
  SUSP_REST: 0.38,
  SUSP_TRAVEL: 0.22,
  WHEEL_RADIUS: 0.28,

  // Weight transfer
  MASS: 1.0,
  CG_HEIGHT: 0.4,
  WHEELBASE: 1.8,
  TRACK_WIDTH: 1.1,

  // Visual
  BODY_ROLL_FACTOR: 0.035,
  BODY_PITCH_FACTOR: 0.025,
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
    const dt = Math.min(delta, 0.1);

    frameCounter.current++;
    if (frameCounter.current % SETTINGS.BALL_UPDATE_FREQUENCY !== 0) return;

    const ball = ref.current;

    const dist = ball.position.distanceTo(carPos);
    if (dist < 2.0) {
      const pushDir = tempVec.current.subVectors(ball.position, carPos).normalize();
      const overlap = 2.0 - dist;
      const pushForce = overlap * 0.8 * (dt * 60);
      vel.current.addScaledVector(pushDir, pushForce);
      vel.current.y += 0.1 * (dt * 60);
    }

    allBalls.current.forEach((otherBall, otherIndex) => {
      if (!otherBall || otherIndex === index) return;
      const ballDist = ball.position.distanceTo(otherBall.position);
      const minDist = radius * 2;
      if (ballDist < minDist && ballDist > 0.01) {
        const collisionDir = tempVec.current.subVectors(ball.position, otherBall.position).normalize();
        const overlap = minDist - ballDist;
        ball.position.addScaledVector(collisionDir, overlap * 0.25);
        if (vel.current.length() > 0.01) {
          vel.current.addScaledVector(collisionDir, overlap * 0.3 * (dt * 60));
        }
      }
    });

    vel.current.y -= 0.72 * dt;
    vel.current.multiplyScalar(Math.pow(0.995, dt * 60));
    ball.position.addScaledVector(vel.current, dt * 60);

    if (ball.position.y < radius) {
      ball.position.y = radius;
      if (vel.current.y < -0.01) {
        vel.current.y = -vel.current.y * 0.5;
      } else {
        vel.current.y = 0;
      }
      const horizontalSpeed = Math.sqrt(vel.current.x ** 2 + vel.current.z ** 2);
      if (horizontalSpeed > 0.001) {
        vel.current.x *= Math.pow(0.92, dt * 60);
        vel.current.z *= Math.pow(0.92, dt * 60);
      } else {
        vel.current.x = 0;
        vel.current.z = 0;
      }
    }

    if (Math.abs(ball.position.x) > 22) {
      ball.position.x = Math.sign(ball.position.x) * 22;
      vel.current.x = -vel.current.x * 0.6;
    }
    if (Math.abs(ball.position.z) > 22) {
      ball.position.z = Math.sign(ball.position.z) * 22;
      vel.current.z = -vel.current.z * 0.6;
    }

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
      <meshBasicMaterial color="#FF00FF" transparent opacity={0.6} />
    </mesh>
  );
});

Trail.displayName = 'Trail';

// ============ WHEEL ASSEMBLY (with suspension travel + spin + steer) ============
const WheelAssembly = memo(({
  position,
  steerAngle = 0,
  suspOffset = 0,
  spin = 0,
  isFront = false,
  side = 1, // 1 = left, -1 = right
}: {
  position: [number, number, number];
  steerAngle?: number;
  suspOffset?: number;
  spin?: number;
  isFront?: boolean;
  side?: number;
}) => {
  const T = SETTINGS.THEME_COLOR;

  return (
    <group position={[position[0], position[1] + suspOffset * 0.5, position[2]]}>
      {/* Steering yaw pivot */}
      <group rotation={[0, isFront ? steerAngle : 0, 0]}>

        {/* Suspension strut */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.36, 6]} />
          <meshStandardMaterial color="#1a1a2e" metalness={1} roughness={0.15} />
        </mesh>
        {/* Coilover spring visual */}
        <mesh position={[0, 0.16, 0]}>
          <torusGeometry args={[0.055, 0.012, 6, 14, Math.PI * 4]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.4} metalness={1} roughness={0.1} />
        </mesh>

        {/* Brake caliper */}
        <mesh position={[side * 0.13, 0.02, 0.04]}>
          <boxGeometry args={[0.055, 0.11, 0.13]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.7} metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Brake rotor */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.21, 0.21, 0.025, 20]} />
          <meshStandardMaterial color="#222233" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Wheel hub spin group */}
        <group rotation={[spin, 0, 0]}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[VEHICLE.WHEEL_RADIUS, 0.115, 14, 28]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.05} roughness={0.95} />
          </mesh>
          {/* Rim barrel */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[VEHICLE.WHEEL_RADIUS - 0.02, VEHICLE.WHEEL_RADIUS - 0.02, 0.16, 20]} />
            <meshStandardMaterial color="#0d0d1a" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* 5 spokes */}
          {[0, 1, 2, 3, 4].map(i => {
            const angle = (i / 5) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[
                  0,
                  Math.sin(angle) * (VEHICLE.WHEEL_RADIUS * 0.48),
                  Math.cos(angle) * (VEHICLE.WHEEL_RADIUS * 0.48),
                ]}
                rotation={[angle, Math.PI / 2, 0]}
              >
                <boxGeometry args={[0.13, 0.038, VEHICLE.WHEEL_RADIUS * 0.82]} />
                <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.55} metalness={1} roughness={0.05} />
              </mesh>
            );
          })}
          {/* Center cap */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 0.18, 10]} />
            <meshStandardMaterial color={T} emissive={T} emissiveIntensity={1.2} metalness={1} roughness={0} />
          </mesh>
          {/* Lug nuts */}
          {[0, 1, 2, 3, 4].map(i => {
            const angle = (i / 5) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[
                  0.09,
                  Math.sin(angle) * 0.13,
                  Math.cos(angle) * 0.13,
                ]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.016, 0.016, 0.03, 6]} />
                <meshStandardMaterial color="#ccccdd" metalness={1} roughness={0.1} />
              </mesh>
            );
          })}
        </group>
      </group>
    </group>
  );
});

WheelAssembly.displayName = 'WheelAssembly';

// ============ DETAILED CAR BODY ============
const CarBody = memo(({
  rollAngle,
  pitchAngle,
  steerAngle,
  wheelSpin,
  suspOffsets,
  speed,
}: {
  rollAngle: number;
  pitchAngle: number;
  steerAngle: number;
  wheelSpin: number;
  suspOffsets: [number, number, number, number];
  speed: number;
}) => {
  const T = SETTINGS.THEME_COLOR;
  const isMoving = Math.abs(speed) > 0.5;

  return (
    <group rotation={[pitchAngle, 0, rollAngle]}>

      {/* ── CHASSIS FLOOR ── */}
      <mesh position={[0, 0.05, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.68, 0.09, 3.55]} />
        <meshStandardMaterial color="#06060f" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Side sills */}
      <mesh position={[-0.83, 0.14, 0.05]}>
        <boxGeometry args={[0.075, 0.11, 3.3]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.45} metalness={1} roughness={0.05} />
      </mesh>
      <mesh position={[0.83, 0.14, 0.05]}>
        <boxGeometry args={[0.075, 0.11, 3.3]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.45} metalness={1} roughness={0.05} />
      </mesh>

      {/* ── LOWER BODY ── */}
      <mesh position={[0, 0.285, 0.05]} castShadow>
        <boxGeometry args={[1.7, 0.27, 3.48]} />
        <meshStandardMaterial color="#090913" metalness={0.96} roughness={0.08} />
      </mesh>

      {/* Door crease lines */}
      <mesh position={[-0.855, 0.28, 0.18]}>
        <boxGeometry args={[0.012, 0.04, 1.2]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.3} metalness={1} roughness={0} />
      </mesh>
      <mesh position={[0.855, 0.28, 0.18]}>
        <boxGeometry args={[0.012, 0.04, 1.2]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.3} metalness={1} roughness={0} />
      </mesh>

      {/* ── CABIN / GREENHOUSE ── */}
      {/* Roof panel */}
      <mesh position={[0, 0.755, -0.08]} castShadow>
        <boxGeometry args={[1.38, 0.075, 1.55]} />
        <meshStandardMaterial color="#07070f" metalness={0.96} roughness={0.04} />
      </mesh>

      {/* A-pillars */}
      <mesh position={[-0.655, 0.565, 0.63]} rotation={[0.38, 0, 0.07]}>
        <boxGeometry args={[0.055, 0.44, 0.055]} />
        <meshStandardMaterial color="#090913" metalness={0.92} roughness={0.15} />
      </mesh>
      <mesh position={[0.655, 0.565, 0.63]} rotation={[0.38, 0, -0.07]}>
        <boxGeometry args={[0.055, 0.44, 0.055]} />
        <meshStandardMaterial color="#090913" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* C-pillars */}
      <mesh position={[-0.635, 0.56, -0.8]} rotation={[-0.3, 0, 0.055]}>
        <boxGeometry args={[0.055, 0.42, 0.055]} />
        <meshStandardMaterial color="#090913" metalness={0.92} roughness={0.15} />
      </mesh>
      <mesh position={[0.635, 0.56, -0.8]} rotation={[-0.3, 0, -0.055]}>
        <boxGeometry args={[0.055, 0.42, 0.055]} />
        <meshStandardMaterial color="#090913" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.585, 0.73]} rotation={[0.5, 0, 0]}>
        <planeGeometry args={[1.26, 0.5]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.07} metalness={0} roughness={0} transparent opacity={0.16} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.58, -0.93]} rotation={[-0.44, 0, 0]}>
        <planeGeometry args={[1.24, 0.46]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.04} metalness={0} roughness={0} transparent opacity={0.13} />
      </mesh>

      {/* Side windows */}
      <mesh position={[-0.872, 0.6, 0.02]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.05, 0.27]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.05} metalness={0} roughness={0} transparent opacity={0.11} />
      </mesh>
      <mesh position={[0.872, 0.6, 0.02]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.05, 0.27]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.05} metalness={0} roughness={0} transparent opacity={0.11} />
      </mesh>

      {/* ── HOOD ── */}
      <mesh position={[0, 0.45, 1.38]} rotation={[-0.055, 0, 0]} castShadow>
        <boxGeometry args={[1.62, 0.065, 0.86]} />
        <meshStandardMaterial color="#090913" metalness={0.96} roughness={0.07} />
      </mesh>

      {/* Hood power bulge */}
      <mesh position={[0, 0.495, 1.3]} rotation={[-0.055, 0, 0]}>
        <boxGeometry args={[0.28, 0.03, 0.65]} />
        <meshStandardMaterial color="#0a0a15" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Hood vent slats */}
      {[-0.38, -0.18, 0.18, 0.38].map((x, i) => (
        <mesh key={i} position={[x, 0.505, 1.24]}>
          <boxGeometry args={[0.09, 0.018, 0.28]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.75} metalness={1} roughness={0} />
        </mesh>
      ))}

      {/* ── FRONT BUMPER ── */}
      <mesh position={[0, 0.19, 1.825]} castShadow>
        <boxGeometry args={[1.62, 0.21, 0.13]} />
        <meshStandardMaterial color="#07070f" metalness={0.92} roughness={0.25} />
      </mesh>

      {/* Front lower splitter */}
      <mesh position={[0, 0.08, 1.875]}>
        <boxGeometry args={[1.5, 0.055, 0.1]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.55} metalness={1} roughness={0} />
      </mesh>

      {/* Bumper lip fins */}
      {[-0.55, -0.28, 0, 0.28, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.11, 1.87]}>
          <boxGeometry args={[0.04, 0.06, 0.05]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.4} metalness={1} roughness={0} />
        </mesh>
      ))}

      {/* Front grille opening */}
      <mesh position={[0, 0.22, 1.835]}>
        <boxGeometry args={[0.9, 0.1, 0.04]} />
        <meshStandardMaterial color="#03030a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Grille bars */}
      {[-0.36, -0.12, 0.12, 0.36].map((x, i) => (
        <mesh key={i} position={[x, 0.22, 1.84]}>
          <boxGeometry args={[0.025, 0.09, 0.02]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.5} metalness={1} roughness={0} />
        </mesh>
      ))}

      {/* ── HEADLIGHTS ── */}
      {/* Headlight housings */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 0.615, 0.31, 1.8]}>
          {/* Housing */}
          <mesh>
            <boxGeometry args={[0.31, 0.13, 0.06]} />
            <meshStandardMaterial color="#04040c" metalness={0.92} roughness={0.1} />
          </mesh>
          {/* DRL strip */}
          <mesh position={[0, 0.04, 0.04]}>
            <boxGeometry args={[0.27, 0.022, 0.015]} />
            <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={2.5} metalness={1} roughness={0} />
          </mesh>
          {/* Lower indicator strip */}
          <mesh position={[0, -0.028, 0.04]}>
            <boxGeometry args={[0.2, 0.018, 0.015]} />
            <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={1.5} metalness={1} roughness={0} />
          </mesh>
          {/* Main lens */}
          <mesh position={[0, 0.01, 0.04]}>
            <boxGeometry args={[0.27, 0.09, 0.015]} />
            <meshStandardMaterial color="#99eeff" emissive="#aaffff" emissiveIntensity={0.4} transparent opacity={0.65} />
          </mesh>
          {/* Light */}
          <pointLight position={[0, 0, 0.35]} intensity={isMoving ? 3.5 : 1.8} color="#c8f8ff" distance={10} castShadow />
        </group>
      ))}

      {/* ── TRUNK / REAR DECK ── */}
      <mesh position={[0, 0.46, -1.25]} castShadow>
        <boxGeometry args={[1.62, 0.065, 0.55]} />
        <meshStandardMaterial color="#090913" metalness={0.96} roughness={0.07} />
      </mesh>

      {/* ── REAR BUMPER ── */}
      <mesh position={[0, 0.19, -1.83]} castShadow>
        <boxGeometry args={[1.62, 0.21, 0.13]} />
        <meshStandardMaterial color="#07070f" metalness={0.92} roughness={0.25} />
      </mesh>

      {/* Rear diffuser */}
      <mesh position={[0, 0.08, -1.88]}>
        <boxGeometry args={[1.38, 0.055, 0.1]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.45} metalness={1} roughness={0} />
      </mesh>
      {/* Diffuser fins */}
      {[-0.5, -0.25, 0, 0.25, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0.1, -1.87]}>
          <boxGeometry args={[0.04, 0.06, 0.06]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.5} metalness={1} roughness={0} />
        </mesh>
      ))}

      {/* ── TAIL LIGHTS ── */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 0.62, 0.3, -1.84]}>
          {/* Housing */}
          <mesh>
            <boxGeometry args={[0.28, 0.1, 0.055]} />
            <meshStandardMaterial color="#04040c" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Main strip */}
          <mesh position={[0, 0.0, -0.035]}>
            <boxGeometry args={[0.24, 0.035, 0.015]} />
            <meshStandardMaterial color="#FF00FF" emissive="#FF00FF" emissiveIntensity={3.0} metalness={1} roughness={0} />
          </mesh>
          {/* Reverse light */}
          <mesh position={[0, -0.03, -0.035]}>
            <boxGeometry args={[0.12, 0.022, 0.015]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={speed < -0.3 ? 2.0 : 0.1} metalness={1} roughness={0} />
          </mesh>
          {/* Lens */}
          <mesh position={[0, 0.0, -0.035]}>
            <boxGeometry args={[0.26, 0.09, 0.015]} />
            <meshStandardMaterial color="#ff44ff" emissive="#ff44ff" emissiveIntensity={0.3} transparent opacity={0.6} />
          </mesh>
          <pointLight position={[0, 0, -0.2]} intensity={1.8} color="#FF00FF" distance={4.5} />
        </group>
      ))}

      {/* Center brake bar */}
      <mesh position={[0, 0.31, -1.845]}>
        <boxGeometry args={[0.85, 0.02, 0.015]} />
        <meshStandardMaterial color="#FF00FF" emissive="#FF00FF" emissiveIntensity={2.0} metalness={1} roughness={0} />
      </mesh>

      {/* ── ROOF SPOILER ── */}
      <mesh position={[0, 0.815, -0.83]}>
        <boxGeometry args={[1.26, 0.055, 0.24]} />
        <meshStandardMaterial color="#07070f" metalness={0.96} roughness={0.08} />
      </mesh>
      {[-0.46, 0.46].map((x, i) => (
        <mesh key={i} position={[x, 0.775, -0.84]}>
          <boxGeometry args={[0.045, 0.1, 0.055]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.6} metalness={1} roughness={0} />
        </mesh>
      ))}
      {/* Spoiler lip LED */}
      <mesh position={[0, 0.845, -0.72]}>
        <boxGeometry args={[1.1, 0.012, 0.01]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={1.5} metalness={1} roughness={0} />
      </mesh>

      {/* ── EXHAUST PIPES ── */}
      {[-0.3, 0.3].map((x, i) => (
        <group key={i} position={[x, 0.1, -1.9]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.048, 0.058, 0.14, 10]} />
            <meshStandardMaterial color="#111122" metalness={1} roughness={0.15} />
          </mesh>
          {/* Inner glow */}
          <mesh>
            <cylinderGeometry args={[0.032, 0.032, 0.08, 10]} />
            <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={isMoving ? 1.5 : 0.3} metalness={0} roughness={1} transparent opacity={0.7} />
          </mesh>
          {isMoving && <pointLight position={[0, -0.12, 0]} intensity={0.7} color="#ff4400" distance={1.2} />}
        </group>
      ))}

      {/* ── UNDERBODY NEON ── */}
      <pointLight position={[0, -0.08, 0.6]} intensity={1.4} color={T} distance={4} />
      <pointLight position={[0, -0.08, -0.7]} intensity={1.2} color={T} distance={4} />
      <pointLight position={[-0.7, -0.04, 0]} intensity={0.8} color={T} distance={2.5} />
      <pointLight position={[0.7, -0.04, 0]} intensity={0.8} color={T} distance={2.5} />

      {/* ── WHEEL ASSEMBLIES ── */}
      {/* FL */}
      <WheelAssembly
        position={[-VEHICLE.TRACK_WIDTH, -0.02, VEHICLE.WHEELBASE * 0.52]}
        steerAngle={steerAngle}
        suspOffset={suspOffsets[0]}
        spin={wheelSpin}
        isFront side={1}
      />
      {/* FR */}
      <WheelAssembly
        position={[VEHICLE.TRACK_WIDTH, -0.02, VEHICLE.WHEELBASE * 0.52]}
        steerAngle={steerAngle}
        suspOffset={suspOffsets[1]}
        spin={wheelSpin}
        isFront side={-1}
      />
      {/* RL */}
      <WheelAssembly
        position={[-VEHICLE.TRACK_WIDTH, -0.02, -VEHICLE.WHEELBASE * 0.48]}
        suspOffset={suspOffsets[2]}
        spin={wheelSpin}
        side={1}
      />
      {/* RR */}
      <WheelAssembly
        position={[VEHICLE.TRACK_WIDTH, -0.02, -VEHICLE.WHEELBASE * 0.48]}
        suspOffset={suspOffsets[3]}
        spin={wheelSpin}
        side={-1}
      />
    </group>
  );
});

CarBody.displayName = 'CarBody';

// ============ CAR PHYSICS CONTROLLER ============
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
  const groupRef = useRef<THREE.Group>(null);
  const [keys, setKeys] = useState({ w: false, s: false, a: false, d: false });

  const physics = useRef({
    vx: 0, vz: 0,
    localVx: 0, localVz: 0,
    yaw: 0,
    steerAngle: 0,
    wheelSpin: 0,
    suspPos:   [0, 0, 0, 0] as [number, number, number, number],
    suspVel:   [0, 0, 0, 0] as [number, number, number, number],
    bodyRoll: 0,
    bodyPitch: 0,
  });

  const frameCount = useRef(0);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(k)) { e.preventDefault(); setKeys(p => ({ ...p, [k]: true })); }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(k)) { e.preventDefault(); setKeys(p => ({ ...p, [k]: false })); }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.1);
    const p = physics.current;

    const activeW = keys.w || touchControls.w;
    const activeS = keys.s || touchControls.s;
    const activeA = keys.a || touchControls.a;
    const activeD = keys.d || touchControls.d;

    // ── STEERING ──
    const speed = Math.sqrt(p.vx * p.vx + p.vz * p.vz);
    const speedFactor = Math.max(0.3, 1 - (speed / VEHICLE.MAX_SPEED) * VEHICLE.SPEED_STEER_REDUCE);
    const targetSteer = activeA ?  VEHICLE.MAX_STEER_ANGLE * speedFactor
                      : activeD ? -VEHICLE.MAX_STEER_ANGLE * speedFactor
                      : 0;
    const steerDelta = targetSteer - p.steerAngle;
    const steerRate = targetSteer !== 0 ? VEHICLE.STEER_SPEED : VEHICLE.STEER_RETURN;
    p.steerAngle += steerDelta * steerRate * dt;
    p.steerAngle = Math.max(-VEHICLE.MAX_STEER_ANGLE, Math.min(VEHICLE.MAX_STEER_ANGLE, p.steerAngle));

    // ── WORLD → LOCAL ──
    const cosY = Math.cos(p.yaw);
    const sinY = Math.sin(p.yaw);
    p.localVz = p.vx * sinY + p.vz * cosY;   // forward
    p.localVx = p.vx * cosY - p.vz * sinY;   // lateral

    // ── YAW RATE (slip angle steering) ──
    if (Math.abs(p.localVz) > 0.2) {
      const yawRate = (p.localVz / VEHICLE.WHEELBASE) * Math.tan(p.steerAngle * 0.85);
      p.yaw += yawRate * dt;
    }

    // ── DRIVE / BRAKE ──
    if (activeW) {
      p.localVz += VEHICLE.ACCELERATION * dt;
    } else if (activeS) {
      if (p.localVz > 0.1) {
        p.localVz -= VEHICLE.BRAKE_FORCE * dt;
      } else {
        p.localVz -= VEHICLE.REVERSE_ACCEL * dt;
      }
    } else {
      p.localVz *= Math.pow(0.78, dt * 60);
    }

    p.localVz = Math.max(-VEHICLE.MAX_SPEED * 0.5, Math.min(VEHICLE.MAX_SPEED, p.localVz));

    // ── LATERAL GRIP ──
    p.localVx *= Math.pow(VEHICLE.DRIFT_FACTOR, dt * 60);

    // ── LOCAL → WORLD ──
    p.vx = p.localVz * sinY + p.localVx * cosY;
    p.vz = p.localVz * cosY - p.localVx * sinY;

    // ── POSITION ──
    groupRef.current.position.x += p.vx * dt;
    groupRef.current.position.z += p.vz * dt;

    if (Math.abs(groupRef.current.position.x) > 22) {
      groupRef.current.position.x = Math.sign(groupRef.current.position.x) * 22;
      p.vx *= -0.3; p.localVx *= -0.3;
    }
    if (Math.abs(groupRef.current.position.z) > 22) {
      groupRef.current.position.z = Math.sign(groupRef.current.position.z) * 22;
      p.vz *= -0.3; p.localVz *= -0.3;
    }

    groupRef.current.rotation.y = p.yaw;

    // ── SUSPENSION (4-corner spring-damper) ──
    const accelG   = activeW ? 1 : activeS ? -0.7 : 0;
    const lateralG = p.localVx * 2.5;

    // Per-corner target compression from weight transfer
    const cornerLoad = [
      -lateralG * 0.5 + accelG * 0.35,
       lateralG * 0.5 + accelG * 0.35,
      -lateralG * 0.5 - accelG * 0.35,
       lateralG * 0.5 - accelG * 0.35,
    ];

    for (let i = 0; i < 4; i++) {
      const targetCompression = cornerLoad[i] * 0.04;
      const restoreForce = VEHICLE.SUSP_STIFFNESS * (targetCompression - p.suspPos[i]);
      const dampForce    = VEHICLE.SUSP_DAMPING   * p.suspVel[i];
      p.suspVel[i] += (restoreForce - dampForce) * dt;
      p.suspPos[i] += p.suspVel[i] * dt;
      p.suspPos[i]  = Math.max(-VEHICLE.SUSP_TRAVEL, Math.min(VEHICLE.SUSP_TRAVEL, p.suspPos[i]));
    }

    // ── BODY ROLL / PITCH ──
    const targetRoll  = -p.localVx * VEHICLE.BODY_ROLL_FACTOR * Math.min(speed / 4, 1);
    const targetPitch = -p.localVz * 0.002;
    p.bodyRoll  += (targetRoll  - p.bodyRoll)  * (1 - Math.exp(-8  * dt));
    p.bodyPitch += (targetPitch - p.bodyPitch) * (1 - Math.exp(-10 * dt));

    // ── WHEEL SPIN ──
    p.wheelSpin -= (p.localVz / VEHICLE.WHEEL_RADIUS) * dt;

    // ── BODY RIDE HEIGHT ──
    const avgSusp = (p.suspPos[0] + p.suspPos[1] + p.suspPos[2] + p.suspPos[3]) / 4;
    groupRef.current.position.y = 0.32 + avgSusp * 0.4;

    onPosChange(groupRef.current.position);

    frameCount.current++;
    if (frameCount.current % 3 === 0) {
      onTrailUpdate(groupRef.current.position.clone());
    }

    if (onDebug && frameCount.current % 10 === 0) {
      onDebug(`spd=${speed.toFixed(1)} steer=${(p.steerAngle * 57.3).toFixed(1)}° slip=${p.localVx.toFixed(2)}`);
    }
  });

  const p = physics.current;

  return (
    <group ref={groupRef} position={[0, 0.32, 0]}>
      <CarBody
        rollAngle={p.bodyRoll}
        pitchAngle={p.bodyPitch}
        steerAngle={p.steerAngle}
        wheelSpin={p.wheelSpin}
        suspOffsets={p.suspPos}
        speed={p.localVz}
      />
    </group>
  );
});

Car.displayName = 'Car';

// ============ CAMERA FOLLOW ============
const CameraFollow = memo(({ target }: { target: THREE.Vector3 }) => {
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
    [0, 1, 25, 0], [0, 1, -25, 0], [25, 1, 0, Math.PI / 2], [-25, 1, 0, Math.PI / 2]
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
