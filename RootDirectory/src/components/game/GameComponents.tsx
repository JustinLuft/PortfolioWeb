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
  MAX_SPEED: 18,
  ACCELERATION: 22,
  REVERSE_ACCEL: 10,
  ENGINE_BRAKE: 6,
  BRAKE_FORCE: 28,
  MAX_STEER_ANGLE: 0.45,
  STEER_SPEED: 3.5,
  STEER_RETURN: 4.0,
  GRIP: 8.5,
  DRIFT_FACTOR: 0.82,
  SPEED_STEER_REDUCE: 0.6,
  SUSP_STIFFNESS: 120,
  SUSP_DAMPING: 14,
  SUSP_TRAVEL: 0.22,
  WHEEL_RADIUS: 0.28,
  MASS: 1.0,
  CG_HEIGHT: 0.4,
  WHEELBASE: 1.8,
  TRACK_WIDTH: 1.1,
  BODY_ROLL_FACTOR: 0.038,
  // Pitch: positive = nose dips (acceleration), negative = nose lifts (braking)
  BODY_PITCH_ACCEL: 0.055,   // nose lifts under acceleration (squat)
  BODY_PITCH_BRAKE: 0.08,    // nose dips under braking (dive)
};

// ── Body dimensions (single source of truth) ──────────────────────────────
// Half-widths so window/pillar positions can reference them exactly
const B = {
  bodyHalfW:  0.82,   // half of total body width 1.64
  bodyHalfH:  0.135,  // half of lower body height 0.27
  bodyY:      0.285,  // lower body center Y
  roofY:      0.755,  // roof center Y
  roofHalfW:  0.66,   // half of roof width 1.32
  cabinFwdZ:  0.65,   // front of cabin (A-pillar base Z)
  cabinRearZ: -0.82,  // rear of cabin (C-pillar base Z)
  pillarX:    0.635,  // X of A/C pillars (inset from body edge)
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
  pos, skill, carPos, allBalls, index
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
    if (ref.current) allBalls.current[index] = ref.current;
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
      vel.current.addScaledVector(pushDir, overlap * 0.8 * (dt * 60));
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
        if (vel.current.length() > 0.01)
          vel.current.addScaledVector(collisionDir, overlap * 0.3 * (dt * 60));
      }
    });

    vel.current.y -= 0.72 * dt;
    vel.current.multiplyScalar(Math.pow(0.995, dt * 60));
    ball.position.addScaledVector(vel.current, dt * 60);

    if (ball.position.y < radius) {
      ball.position.y = radius;
      vel.current.y = vel.current.y < -0.01 ? -vel.current.y * 0.5 : 0;
      const hs = Math.sqrt(vel.current.x ** 2 + vel.current.z ** 2);
      if (hs > 0.001) {
        vel.current.x *= Math.pow(0.92, dt * 60);
        vel.current.z *= Math.pow(0.92, dt * 60);
      } else { vel.current.x = 0; vel.current.z = 0; }
    }

    if (Math.abs(ball.position.x) > 22) { ball.position.x = Math.sign(ball.position.x) * 22; vel.current.x *= -0.6; }
    if (Math.abs(ball.position.z) > 22) { ball.position.z = Math.sign(ball.position.z) * 22; vel.current.z *= -0.6; }

    const speed = Math.sqrt(vel.current.x ** 2 + vel.current.z ** 2);
    if (speed > 0.001) {
      const axis = new THREE.Vector3(-vel.current.z, 0, vel.current.x).normalize();
      ball.rotateOnAxis(axis, (speed / radius) * dt * 60);
    }
  });

  return (
    <mesh ref={ref} position={pos} castShadow receiveShadow>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial color={SETTINGS.THEME_COLOR} metalness={0.8} roughness={0.2}
        emissive={SETTINGS.THEME_COLOR} emissiveIntensity={0.3} />
      <Html distanceFactor={SETTINGS.CUBE_TEXT_DISTANCE} center zIndexRange={[0, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`bg-black/80 px-3 py-1.5 rounded-lg ${SETTINGS.CUBE_TEXT_SIZE} font-bold whitespace-nowrap border border-[#00FFD1]/30 shadow-lg`}
          style={{ color: SETTINGS.THEME_COLOR, userSelect: 'none', pointerEvents: 'none' }}>
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
      if (meshRef.current.geometry) meshRef.current.geometry.dispose();
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

// ============ WHEEL ASSEMBLY ============
const WheelAssembly = memo(({
  position, steerAngle = 0, suspOffset = 0, spin = 0, isFront = false, side = 1,
}: {
  position: [number, number, number];
  steerAngle?: number;
  suspOffset?: number;
  spin?: number;
  isFront?: boolean;
  side?: number;
}) => {
  const T = SETTINGS.THEME_COLOR;
  const WR = VEHICLE.WHEEL_RADIUS;

  return (
    <group position={[position[0], position[1] + suspOffset * 0.5, position[2]]}>
      <group rotation={[0, isFront ? steerAngle : 0, 0]}>
        {/* Suspension strut */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.36, 6]} />
          <meshStandardMaterial color="#1a1a2e" metalness={1} roughness={0.15} />
        </mesh>
        {/* Coilover spring */}
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

        {/* Wheel spin group */}
        <group rotation={[spin, 0, 0]}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <torusGeometry args={[WR, 0.115, 14, 28]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.05} roughness={0.95} />
          </mesh>
          {/* Rim barrel */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[WR - 0.02, WR - 0.02, 0.16, 20]} />
            <meshStandardMaterial color="#0d0d1a" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* 5 spokes */}
          {[0, 1, 2, 3, 4].map(i => {
            const angle = (i / 5) * Math.PI * 2;
            return (
              <mesh key={i}
                position={[0, Math.sin(angle) * (WR * 0.48), Math.cos(angle) * (WR * 0.48)]}
                rotation={[angle, Math.PI / 2, 0]}>
                <boxGeometry args={[0.13, 0.038, WR * 0.82]} />
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
              <mesh key={i}
                position={[0.09, Math.sin(angle) * 0.13, Math.cos(angle) * 0.13]}
                rotation={[0, 0, Math.PI / 2]}>
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
  rollAngle, pitchAngle, steerAngle, wheelSpin, suspOffsets, speed,
  isAccel, isBrake, isReversing,
}: {
  rollAngle: number;
  pitchAngle: number;
  steerAngle: number;
  wheelSpin: number;
  suspOffsets: [number, number, number, number];
  speed: number;
  isAccel: boolean;
  isBrake: boolean;
  isReversing: boolean;
}) => {
  const T = SETTINGS.THEME_COLOR;
  const isMoving = Math.abs(speed) > 0.5;

  // ── Light states ──────────────────────────────────────────────────────────
  // Running lights: always on (dim)
  // Brake lights: bright red/magenta when braking or in reverse and slowing
  // Reverse lights: white, only when reversing (speed < 0)
  const brakeLightIntensity  = isBrake ? 4.0 : 1.0;      // dim running / bright braking
  const brakeLightEmissive   = isBrake ? 3.5 : 0.7;
  const reverseLightEmissive = isReversing ? 2.5 : 0.0;
  const reverseLightIntensity = isReversing ? 2.5 : 0.0;
  const headlightIntensity   = isMoving ? 4.0 : 2.0;

  // ── Window geometry (flush inside body) ───────────────────────────────────
  // Body outer X = B.bodyHalfW = 0.82
  // Side windows sit at X = ±0.819 (just barely inside body surface)
  const sideWinX = B.bodyHalfW - 0.003;
  // Windshield: angled, fitted between A-pillar tops
  // A-pillar base: z=0.65, top~z=0.38; roof front edge ~z=0.38
  // Windshield center z ~ 0.52, angled forward
  const wsFwdZ   =  0.71;   // bottom of windshield (dashboard line)
  const wsRearZ  =  0.36;   // top of windshield (roof edge)
  const wsY      =  0.585;  // center Y
  const wsAngle  =  0.52;   // ~30° rake
  // Rear window similarly
  const rwFwdZ   = -0.36;
  const rwRearZ  = -0.90;
  const rwY      =  0.575;
  const rwAngle  = -0.46;

  return (
    <group rotation={[pitchAngle, 0, rollAngle]}>

      {/* ── CHASSIS FLOOR ── */}
      <mesh position={[0, 0.05, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.64, 0.09, 3.55]} />
        <meshStandardMaterial color="#06060f" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Side sills (neon strips) */}
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i} position={[s * B.bodyHalfW, 0.14, 0.05]}>
          <boxGeometry args={[0.072, 0.11, 3.28]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.45} metalness={1} roughness={0.05} />
        </mesh>
      ))}

      {/* ── LOWER BODY ── */}
      <mesh position={[0, B.bodyY, 0.05]} castShadow>
        <boxGeometry args={[B.bodyHalfW * 2, 0.27, 3.46]} />
        <meshStandardMaterial color="#090913" metalness={0.96} roughness={0.08} />
      </mesh>

      {/* Door crease line (inset, flush with body) */}
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i} position={[s * (B.bodyHalfW - 0.01), 0.29, 0.18]}>
          <boxGeometry args={[0.008, 0.038, 1.18]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.35} metalness={1} roughness={0} />
        </mesh>
      ))}

      {/* ── CABIN ── */}
      {/* Roof */}
      <mesh position={[0, B.roofY, -0.08]} castShadow>
        <boxGeometry args={[B.roofHalfW * 2, 0.072, 1.52]} />
        <meshStandardMaterial color="#07070f" metalness={0.96} roughness={0.04} />
      </mesh>

      {/* A-pillars */}
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i} position={[s * B.pillarX, 0.565, B.cabinFwdZ]} rotation={[0.38, 0, s * 0.07]}>
          <boxGeometry args={[0.052, 0.43, 0.052]} />
          <meshStandardMaterial color="#090913" metalness={0.92} roughness={0.15} />
        </mesh>
      ))}

      {/* C-pillars */}
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i} position={[s * B.pillarX, 0.555, B.cabinRearZ]} rotation={[-0.3, 0, s * 0.055]}>
          <boxGeometry args={[0.052, 0.41, 0.052]} />
          <meshStandardMaterial color="#090913" metalness={0.92} roughness={0.15} />
        </mesh>
      ))}

      {/* ── WINDOWS (all inset, no protrusion) ── */}

      {/* Windshield — angled plane flush between A-pillar tops */}
      <mesh position={[0, wsY, (wsFwdZ + wsRearZ) / 2]} rotation={[wsAngle, 0, 0]}>
        {/* Width set to just fit between pillars: (B.pillarX - half pillar width)*2 */}
        <planeGeometry args={[(B.pillarX - 0.026) * 2, 0.48]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.06}
          metalness={0.05} roughness={0.0} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, rwY, (rwFwdZ + rwRearZ) / 2]} rotation={[rwAngle, 0, 0]}>
        <planeGeometry args={[(B.pillarX - 0.026) * 2, 0.44]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.04}
          metalness={0.05} roughness={0.0} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Side windows — flush at body outer surface, inset from body half-width */}
      {([-1, 1] as const).map((s, i) => (
        <mesh key={i}
          position={[s * sideWinX, 0.60, 0.02]}
          rotation={[0, s * Math.PI / 2, 0]}>
          {/* Height fits between sill top and roof bottom; length between A and C pillars */}
          <planeGeometry args={[0.96, 0.25]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.05}
            metalness={0.0} roughness={0.0} transparent opacity={0.13} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* ── HOOD ── */}
      <mesh position={[0, 0.452, 1.38]} rotation={[-0.055, 0, 0]} castShadow>
        <boxGeometry args={[1.60, 0.062, 0.84]} />
        <meshStandardMaterial color="#090913" metalness={0.96} roughness={0.07} />
      </mesh>
      {/* Hood center power bulge */}
      <mesh position={[0, 0.496, 1.30]} rotation={[-0.055, 0, 0]}>
        <boxGeometry args={[0.26, 0.028, 0.62]} />
        <meshStandardMaterial color="#0b0b16" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Hood vent slats */}
      {[-0.38, -0.18, 0.18, 0.38].map((x, i) => (
        <mesh key={i} position={[x, 0.506, 1.24]}>
          <boxGeometry args={[0.086, 0.016, 0.26]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.75} metalness={1} roughness={0} />
        </mesh>
      ))}

      {/* ── FRONT BUMPER ── */}
      <mesh position={[0, 0.19, 1.82]} castShadow>
        <boxGeometry args={[1.60, 0.20, 0.13]} />
        <meshStandardMaterial color="#07070f" metalness={0.92} roughness={0.25} />
      </mesh>
      {/* Front splitter */}
      <mesh position={[0, 0.08, 1.872]}>
        <boxGeometry args={[1.48, 0.052, 0.10]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.55} metalness={1} roughness={0} />
      </mesh>
      {/* Bumper canards */}
      {[-0.52, -0.26, 0, 0.26, 0.52].map((x, i) => (
        <mesh key={i} position={[x, 0.11, 1.865]}>
          <boxGeometry args={[0.038, 0.058, 0.048]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.4} metalness={1} roughness={0} />
        </mesh>
      ))}
      {/* Front grille */}
      <mesh position={[0, 0.225, 1.83]}>
        <boxGeometry args={[0.88, 0.095, 0.038]} />
        <meshStandardMaterial color="#03030a" metalness={0.5} roughness={0.5} />
      </mesh>
      {[-0.33, -0.11, 0.11, 0.33].map((x, i) => (
        <mesh key={i} position={[x, 0.225, 1.838]}>
          <boxGeometry args={[0.022, 0.085, 0.018]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.5} metalness={1} roughness={0} />
        </mesh>
      ))}

      {/* ── HEADLIGHTS ── */}
      {([-1, 1] as const).map((s, i) => (
        <group key={i} position={[s * 0.60, 0.315, 1.796]}>
          {/* Housing (inset into bumper, z doesn't protrude) */}
          <mesh>
            <boxGeometry args={[0.30, 0.125, 0.055]} />
            <meshStandardMaterial color="#04040c" metalness={0.92} roughness={0.1} />
          </mesh>
          {/* DRL strip */}
          <mesh position={[0, 0.038, 0.032]}>
            <boxGeometry args={[0.26, 0.020, 0.012]} />
            <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={2.8} metalness={1} roughness={0} />
          </mesh>
          {/* Amber indicator */}
          <mesh position={[0, -0.026, 0.032]}>
            <boxGeometry args={[0.18, 0.016, 0.012]} />
            <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={1.6} metalness={1} roughness={0} />
          </mesh>
          {/* Lens */}
          <mesh position={[0, 0.01, 0.032]}>
            <boxGeometry args={[0.26, 0.086, 0.012]} />
            <meshStandardMaterial color="#99eeff" emissive="#aaffff" emissiveIntensity={0.35} transparent opacity={0.60} />
          </mesh>
          <pointLight position={[0, 0, 0.38]} intensity={headlightIntensity} color="#c8f8ff" distance={11} castShadow />
        </group>
      ))}

      {/* ── TRUNK DECK ── */}
      <mesh position={[0, 0.458, -1.24]} castShadow>
        <boxGeometry args={[1.60, 0.060, 0.52]} />
        <meshStandardMaterial color="#090913" metalness={0.96} roughness={0.07} />
      </mesh>

      {/* ── REAR BUMPER ── */}
      <mesh position={[0, 0.19, -1.82]} castShadow>
        <boxGeometry args={[1.60, 0.20, 0.13]} />
        <meshStandardMaterial color="#07070f" metalness={0.92} roughness={0.25} />
      </mesh>
      {/* Rear diffuser */}
      <mesh position={[0, 0.078, -1.872]}>
        <boxGeometry args={[1.34, 0.050, 0.10]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.45} metalness={1} roughness={0} />
      </mesh>
      {[-0.48, -0.24, 0, 0.24, 0.48].map((x, i) => (
        <mesh key={i} position={[x, 0.098, -1.865]}>
          <boxGeometry args={[0.038, 0.056, 0.055]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.5} metalness={1} roughness={0} />
        </mesh>
      ))}

      {/* ── TAIL LIGHTS ── */}
      {([-1, 1] as const).map((s, i) => (
        <group key={i} position={[s * 0.605, 0.30, -1.828]}>
          {/* Housing */}
          <mesh>
            <boxGeometry args={[0.272, 0.095, 0.052]} />
            <meshStandardMaterial color="#04040c" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Running / brake strip — magenta. Dim when running, bright when braking */}
          <mesh position={[0, 0.01, -0.033]}>
            <boxGeometry args={[0.23, 0.032, 0.012]} />
            <meshStandardMaterial
              color="#FF00FF" emissive="#FF00FF"
              emissiveIntensity={brakeLightEmissive}
              metalness={1} roughness={0} />
          </mesh>
          {/* Reverse light — white, only when going backward */}
          <mesh position={[0, -0.026, -0.033]}>
            <boxGeometry args={[0.12, 0.020, 0.012]} />
            <meshStandardMaterial
              color="#ffffff" emissive="#ffffff"
              emissiveIntensity={reverseLightEmissive}
              metalness={1} roughness={0} />
          </mesh>
          {/* Lens overlay */}
          <mesh position={[0, 0.01, -0.033]}>
            <boxGeometry args={[0.25, 0.086, 0.012]} />
            <meshStandardMaterial color="#ff44ff" emissive="#ff44ff"
              emissiveIntensity={isBrake ? 0.6 : 0.15} transparent opacity={0.55} />
          </mesh>
          {/* Brake point light — only visible when braking or running (dim) */}
          <pointLight
            position={[0, 0, -0.18]}
            intensity={brakeLightIntensity}
            color="#FF00FF"
            distance={isBrake ? 6 : 3} />
          {/* Reverse point light — only when reversing */}
          {isReversing && (
            <pointLight position={[0, 0, -0.18]} intensity={reverseLightIntensity} color="#ffffff" distance={4} />
          )}
        </group>
      ))}

      {/* Center high-mount brake bar */}
      <mesh position={[0, 0.315, -1.838]}>
        <boxGeometry args={[0.82, 0.018, 0.012]} />
        <meshStandardMaterial color="#FF00FF" emissive="#FF00FF"
          emissiveIntensity={brakeLightEmissive * 0.8} metalness={1} roughness={0} />
      </mesh>

      {/* ── ROOF SPOILER ── */}
      <mesh position={[0, 0.812, -0.82]}>
        <boxGeometry args={[1.22, 0.050, 0.22]} />
        <meshStandardMaterial color="#07070f" metalness={0.96} roughness={0.08} />
      </mesh>
      {[-0.44, 0.44].map((x, i) => (
        <mesh key={i} position={[x, 0.772, -0.82]}>
          <boxGeometry args={[0.042, 0.095, 0.052]} />
          <meshStandardMaterial color={T} emissive={T} emissiveIntensity={0.6} metalness={1} roughness={0} />
        </mesh>
      ))}
      {/* Spoiler LED lip */}
      <mesh position={[0, 0.84, -0.715]}>
        <boxGeometry args={[1.05, 0.010, 0.008]} />
        <meshStandardMaterial color={T} emissive={T} emissiveIntensity={1.6} metalness={1} roughness={0} />
      </mesh>

      {/* ── EXHAUST PIPES ── */}
      {[-0.28, 0.28].map((x, i) => (
        <group key={i} position={[x, 0.10, -1.885]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.046, 0.056, 0.13, 10]} />
            <meshStandardMaterial color="#111122" metalness={1} roughness={0.15} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.030, 0.030, 0.07, 10]} />
            <meshStandardMaterial color="#ff4400" emissive="#ff4400"
              emissiveIntensity={isMoving ? 1.6 : 0.25} metalness={0} roughness={1} transparent opacity={0.7} />
          </mesh>
          {isMoving && <pointLight position={[0, -0.11, 0]} intensity={0.7} color="#ff4400" distance={1.2} />}
        </group>
      ))}

      {/* ── UNDERBODY NEON ── */}
      <pointLight position={[0, -0.08, 0.6]}  intensity={1.4} color={T} distance={4} />
      <pointLight position={[0, -0.08, -0.7]} intensity={1.2} color={T} distance={4} />
      <pointLight position={[-0.68, -0.04, 0]} intensity={0.8} color={T} distance={2.5} />
      <pointLight position={[ 0.68, -0.04, 0]} intensity={0.8} color={T} distance={2.5} />

      {/* ── WHEEL ASSEMBLIES ── */}
      <WheelAssembly position={[-VEHICLE.TRACK_WIDTH, -0.02,  VEHICLE.WHEELBASE * 0.52]}
        steerAngle={steerAngle} suspOffset={suspOffsets[0]} spin={wheelSpin} isFront side={1} />
      <WheelAssembly position={[ VEHICLE.TRACK_WIDTH, -0.02,  VEHICLE.WHEELBASE * 0.52]}
        steerAngle={steerAngle} suspOffset={suspOffsets[1]} spin={wheelSpin} isFront side={-1} />
      <WheelAssembly position={[-VEHICLE.TRACK_WIDTH, -0.02, -VEHICLE.WHEELBASE * 0.48]}
        suspOffset={suspOffsets[2]} spin={wheelSpin} side={1} />
      <WheelAssembly position={[ VEHICLE.TRACK_WIDTH, -0.02, -VEHICLE.WHEELBASE * 0.48]}
        suspOffset={suspOffsets[3]} spin={wheelSpin} side={-1} />
    </group>
  );
});
CarBody.displayName = 'CarBody';

// ============ CAR PHYSICS CONTROLLER ============
const Car = memo(({
  onDebug, onPosChange, touchControls, onTrailUpdate
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
    suspPos: [0, 0, 0, 0] as [number, number, number, number],
    suspVel: [0, 0, 0, 0] as [number, number, number, number],
    bodyRoll: 0,
    bodyPitch: 0,
    // Smooth inputs for tilt
    accelInput: 0,
    brakeInput: 0,
  });

  const frameCount = useRef(0);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['w','a','s','d'].includes(k)) { e.preventDefault(); setKeys(p => ({ ...p, [k]: true })); }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['w','a','s','d'].includes(k)) { e.preventDefault(); setKeys(p => ({ ...p, [k]: false })); }
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

    // ── STEERING ──────────────────────────────────────────────────────────
    const speed = Math.sqrt(p.vx * p.vx + p.vz * p.vz);
    const speedFactor = Math.max(0.3, 1 - (speed / VEHICLE.MAX_SPEED) * VEHICLE.SPEED_STEER_REDUCE);
    const targetSteer = activeA ?  VEHICLE.MAX_STEER_ANGLE * speedFactor
                      : activeD ? -VEHICLE.MAX_STEER_ANGLE * speedFactor : 0;
    const steerRate = targetSteer !== 0 ? VEHICLE.STEER_SPEED : VEHICLE.STEER_RETURN;
    p.steerAngle += (targetSteer - p.steerAngle) * steerRate * dt;
    p.steerAngle = Math.max(-VEHICLE.MAX_STEER_ANGLE, Math.min(VEHICLE.MAX_STEER_ANGLE, p.steerAngle));

    // ── WORLD → LOCAL ──────────────────────────────────────────────────────
    const cosY = Math.cos(p.yaw), sinY = Math.sin(p.yaw);
    p.localVz = p.vx * sinY + p.vz * cosY;
    p.localVx = p.vx * cosY - p.vz * sinY;

    // ── YAW RATE ───────────────────────────────────────────────────────────
    if (Math.abs(p.localVz) > 0.2) {
      const yawRate = (p.localVz / VEHICLE.WHEELBASE) * Math.tan(p.steerAngle * 0.85);
      p.yaw += yawRate * dt;
    }

    // ── DRIVE / BRAKE ──────────────────────────────────────────────────────
    const isReversing = p.localVz < -0.15;
    if (activeW) {
      p.localVz += VEHICLE.ACCELERATION * dt;
      p.accelInput = Math.min(p.accelInput + dt * 5, 1);
      p.brakeInput  = Math.max(p.brakeInput  - dt * 8, 0);
    } else if (activeS) {
      p.brakeInput  = Math.min(p.brakeInput  + dt * 5, 1);
      p.accelInput = Math.max(p.accelInput - dt * 8, 0);
      if (p.localVz > 0.1) p.localVz -= VEHICLE.BRAKE_FORCE * dt;
      else                  p.localVz -= VEHICLE.REVERSE_ACCEL * dt;
    } else {
      p.localVz  *= Math.pow(0.78, dt * 60);
      p.accelInput = Math.max(p.accelInput - dt * 4, 0);
      p.brakeInput  = Math.max(p.brakeInput  - dt * 4, 0);
    }

    p.localVz = Math.max(-VEHICLE.MAX_SPEED * 0.5, Math.min(VEHICLE.MAX_SPEED, p.localVz));

    // ── LATERAL GRIP ───────────────────────────────────────────────────────
    p.localVx *= Math.pow(VEHICLE.DRIFT_FACTOR, dt * 60);

    // ── LOCAL → WORLD ──────────────────────────────────────────────────────
    p.vx = p.localVz * sinY + p.localVx * cosY;
    p.vz = p.localVz * cosY - p.localVx * sinY;

    // ── POSITION ───────────────────────────────────────────────────────────
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

    // ── SUSPENSION ─────────────────────────────────────────────────────────
    const accelG   = activeW ? 1 : activeS ? -0.7 : 0;
    const lateralG = p.localVx * 2.5;
    const cornerLoad = [
      -lateralG * 0.5 + accelG * 0.35,
       lateralG * 0.5 + accelG * 0.35,
      -lateralG * 0.5 - accelG * 0.35,
       lateralG * 0.5 - accelG * 0.35,
    ];
    for (let i = 0; i < 4; i++) {
      const targetC = cornerLoad[i] * 0.04;
      const restore  = VEHICLE.SUSP_STIFFNESS * (targetC - p.suspPos[i]);
      const damp     = VEHICLE.SUSP_DAMPING   * p.suspVel[i];
      p.suspVel[i] += (restore - damp) * dt;
      p.suspPos[i] += p.suspVel[i] * dt;
      p.suspPos[i]  = Math.max(-VEHICLE.SUSP_TRAVEL, Math.min(VEHICLE.SUSP_TRAVEL, p.suspPos[i]));
    }

    // ── BODY ROLL ──────────────────────────────────────────────────────────
    // Roll INTO corners: positive localVx = sliding right → body rolls left (negative Z)
    const targetRoll = -p.localVx * VEHICLE.BODY_ROLL_FACTOR * Math.min(speed / 4, 1);
    p.bodyRoll += (targetRoll - p.bodyRoll) * (1 - Math.exp(-8 * dt));

    // ── BODY PITCH (nose dip / squat) ──────────────────────────────────────
    // Under acceleration: rear squats, nose lifts → positive pitch (nose up)
    // Under braking:      weight transfers forward → nose dips → negative pitch
    // We scale by speed so you only feel it while actually moving
    const speedScale = Math.min(speed / 6, 1);
    const targetPitch =
        p.accelInput * VEHICLE.BODY_PITCH_ACCEL * speedScale   // nose up
      - p.brakeInput * VEHICLE.BODY_PITCH_BRAKE * speedScale;  // nose dips
    p.bodyPitch += (targetPitch - p.bodyPitch) * (1 - Math.exp(-10 * dt));

    // ── WHEEL SPIN ─────────────────────────────────────────────────────────
    p.wheelSpin -= (p.localVz / VEHICLE.WHEEL_RADIUS) * dt;

    // ── RIDE HEIGHT ────────────────────────────────────────────────────────
    const avgSusp = (p.suspPos[0] + p.suspPos[1] + p.suspPos[2] + p.suspPos[3]) / 4;
    groupRef.current.position.y = 0.32 + avgSusp * 0.4;

    onPosChange(groupRef.current.position);

    frameCount.current++;
    if (frameCount.current % 3 === 0) onTrailUpdate(groupRef.current.position.clone());
    if (onDebug && frameCount.current % 10 === 0)
      onDebug(`spd=${speed.toFixed(1)} steer=${(p.steerAngle * 57.3).toFixed(1)}° slip=${p.localVx.toFixed(2)}`);
  });

  const p = physics.current;
  const isReversing = p.localVz < -0.15;
  const isBraking   = (keys.s || touchControls.s) && p.localVz > 0.1;

  return (
    <group ref={groupRef} position={[0, 0.32, 0]}>
      <CarBody
        rollAngle={p.bodyRoll}
        pitchAngle={p.bodyPitch}
        steerAngle={p.steerAngle}
        wheelSpin={p.wheelSpin}
        suspOffsets={p.suspPos}
        speed={p.localVz}
        isAccel={keys.w || touchControls.w}
        isBrake={isBraking}
        isReversing={isReversing}
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
          <meshStandardMaterial color={SETTINGS.THEME_COLOR} emissive={SETTINGS.THEME_COLOR}
            emissiveIntensity={0.5} metalness={0.9} roughness={0.1} transparent opacity={0.3} />
        </mesh>
      ))}
      {pillarPositions.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
          <meshStandardMaterial color={SETTINGS.THEME_COLOR} emissive={SETTINGS.THEME_COLOR}
            emissiveIntensity={0.8} metalness={1} roughness={0} />
        </mesh>
      ))}
      <Stars radius={100} depth={50} count={800} factor={4} saturation={0} fade speed={1} />
    </>
  );
});
GameEnvironment.displayName = 'GameEnvironment';

export { Ball, Trail, Car, CameraFollow, GameEnvironment, SETTINGS, skills };
