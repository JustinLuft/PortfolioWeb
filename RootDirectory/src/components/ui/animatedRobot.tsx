import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface AnimatedRobotProps {
  isSpeaking: boolean;
  perspective: 'first' | 'third';
  detailLevel: 'low' | 'normal' | 'high';
  outputStyle: 'normal' | 'bullets' | 'text';
  isAngry?: boolean;
  isTyping?: boolean;
  skipEntrance?: boolean;
}

export const AnimatedRobot: React.FC<AnimatedRobotProps> = ({
  isSpeaking,
  perspective,
  detailLevel,
  outputStyle,
  isAngry = false,
  isTyping = false,
  skipEntrance = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const robotPartsRef = useRef<{
    head?: THREE.Group;
    body?: THREE.Group;
    leftArm?: THREE.Group;
    rightArm?: THREE.Group;
    antenna?: THREE.Group;
    leftEye?: THREE.Mesh;
    rightEye?: THREE.Mesh;
    leftEyePupil?: THREE.Mesh;
    rightEyePupil?: THREE.Mesh;
    mouth?: THREE.Mesh;
    chestPanel?: THREE.Group;
    chestLights?: THREE.Mesh[];
  }>({});
  const animationFrameRef = useRef<number>();
  const timeRef = useRef(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const headTargetRef = useRef({ x: 0, y: 0 });
  const entranceProgressRef = useRef(1); // Start at 1 (completed) by default
  const hasStartedEntranceRef = useRef(false);

  // One-time entrance trigger on first component mount ever
  useEffect(() => {
    if (!hasStartedEntranceRef.current) {
      hasStartedEntranceRef.current = true;
      entranceProgressRef.current = skipEntrance ? 1 : 0; // Skip entrance if prop is true
    }
  }, [skipEntrance]); // Empty dependency array - only runs once

  // Track mouse position relative to the robot's container
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mountRef.current) return;
      
      // Get the robot container's position and size
      const rect = mountRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to robot center
      // Normalize to -1 to 1 range based on distance from center
      const maxDistance = 150; // pixels from center that count as "far" - reduced for better sensitivity
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      mousePositionRef.current = {
        x: Math.max(-1, Math.min(1, deltaX / maxDistance)),
        y: Math.max(-1, Math.min(1, -deltaY / maxDistance)), // Negative because screen Y is inverted
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Get colors based on settings
  const getRobotColors = () => {
    const baseColor = perspective === 'first' ? 0xff1493 : 0x00ffd1; // Hot pink for first, cyan for third
    const accentColor = 
      outputStyle === 'bullets' ? 0x00ff00 : 
      outputStyle === 'text' ? 0xff6b00 : 
      0xff4db8; // Green for bullets, orange for text, pink for normal
    
    return { baseColor, accentColor };
  };

  // Get scale based on detail level
  const getScale = () => {
    if (detailLevel === 'low') return 0.8;
    if (detailLevel === 'high') return 1.3;
    return 1.0; // normal
  };

  // Get camera distance based on detail level to prevent clipping
  const getCameraDistance = () => {
    if (detailLevel === 'low') return 8;
    if (detailLevel === 'high') return 10; // Move camera back for larger robot
    return 8; // normal
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const colors = getRobotColors();
    const scale = getScale();
    const cameraDistance = getCameraDistance();

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, cameraDistance);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(5, 10, 7);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(colors.accentColor, 0.3);
    fillLight.position.set(-5, 0, 5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(colors.baseColor, 1, 20);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Materials
    const headMaterial = new THREE.MeshPhongMaterial({
      color: colors.baseColor,
      shininess: 100,
      specular: 0xffffff,
    });

    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: colors.baseColor,
      shininess: 80,
      specular: 0xffffff,
    });

    const accentMaterial = new THREE.MeshPhongMaterial({
      color: colors.accentColor,
      emissive: colors.accentColor,
      emissiveIntensity: 0.5,
      shininess: 100,
    });

    const eyeMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      shininess: 100,
    });

    // Create Robot Head
    const head = new THREE.Group();
    robotPartsRef.current.head = head;

    // Head geometry - rounded box
    const headGeometry = new THREE.BoxGeometry(2, 2, 1.8);
    const edges = new THREE.EdgesGeometry(headGeometry);
    const headMesh = new THREE.Mesh(headGeometry, headMaterial);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    
    headGeometry.computeVertexNormals();
    
    const headOutline = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
    );
    
    head.add(headMesh);
    head.add(headOutline);

    // Slightly reduce overall head size for better proportions
    head.scale.set(0.92, 0.92, 0.92);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.5, 0.3, 0.9);
    leftEye.castShadow = true;
    robotPartsRef.current.leftEye = leftEye;
    head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.5, 0.3, 0.9);
    rightEye.castShadow = true;
    robotPartsRef.current.rightEye = rightEye;
    head.add(rightEye);

    // Eye pupils (accent color)
    const pupilGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const leftPupil = new THREE.Mesh(pupilGeometry, accentMaterial);
    leftPupil.position.set(-0.5, 0.3, 1.1);
    robotPartsRef.current.leftEyePupil = leftPupil;
    head.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeometry, accentMaterial);
    rightPupil.position.set(0.5, 0.3, 1.1);
    robotPartsRef.current.rightEyePupil = rightPupil;
    head.add(rightPupil);

    // Mouth
    const mouthGeometry = new THREE.CapsuleGeometry(0.05, 0.5, 4, 8);
    const mouth = new THREE.Mesh(mouthGeometry, eyeMaterial);
    mouth.position.set(0, -0.4, 0.9);
    mouth.rotation.z = Math.PI / 2;
    robotPartsRef.current.mouth = mouth;
    head.add(mouth);

    // Antenna
    const antenna = new THREE.Group();
    const antennaStick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8),
      bodyMaterial
    );
    antennaStick.position.y = 0.4;
    antenna.add(antennaStick);

    const antennaBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      accentMaterial
    );
    antennaBall.position.y = 0.8;
    antenna.add(antennaBall);

    antenna.position.set(0, 1, 0);
    robotPartsRef.current.antenna = antenna;
    head.add(antenna);

    // Cheek LEDs
    const cheekGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const leftCheek = new THREE.Mesh(cheekGeometry, accentMaterial);
    leftCheek.position.set(-0.8, 0, 0.8);
    head.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeometry, accentMaterial);
    rightCheek.position.set(0.8, 0, 0.8);
    head.add(rightCheek);

    head.position.y = 1.5;
    scene.add(head);

    // Create Robot Body
    const body = new THREE.Group();
    robotPartsRef.current.body = body;

    const bodyGeometry = new THREE.BoxGeometry(2.2, 2, 1.5);
    const bodyEdges = new THREE.EdgesGeometry(bodyGeometry);
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    
    const bodyOutline = new THREE.LineSegments(
      bodyEdges,
      new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
    );
    
    body.add(bodyMesh);
    body.add(bodyOutline);

    // Chest Panel - Dynamic based on output style
    const chestPanel = new THREE.Group();
    robotPartsRef.current.chestPanel = chestPanel;
    robotPartsRef.current.chestLights = [];

    if (outputStyle === 'bullets') {
      // Three vertical dots
      for (let i = 0; i < 3; i++) {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          accentMaterial
        );
        dot.position.set(0, 0.4 - i * 0.3, 0.76);
        chestPanel.add(dot);
        robotPartsRef.current.chestLights!.push(dot);
      }
    } else if (outputStyle === 'text') {
      // Three horizontal lines
      for (let i = 0; i < 3; i++) {
        const line = new THREE.Mesh(
          new THREE.BoxGeometry(0.6 - i * 0.1, 0.08, 0.05),
          accentMaterial
        );
        line.position.set(0, 0.3 - i * 0.25, 0.76);
        chestPanel.add(line);
        robotPartsRef.current.chestLights!.push(line);
      }
    } else {
      // Normal - three horizontal dots
      for (let i = 0; i < 3; i++) {
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16),
          i === 0 ? accentMaterial : eyeMaterial
        );
        dot.position.set(-0.3 + i * 0.3, 0.5, 0.76);
        chestPanel.add(dot);
        if (i === 0) robotPartsRef.current.chestLights!.push(dot);
      }
    }

    body.add(chestPanel);
    body.position.y = -0.5;
    scene.add(body);

    // Create Arms
    const leftArm = new THREE.Group();
    robotPartsRef.current.leftArm = leftArm;
    
    const armGeometry = new THREE.CapsuleGeometry(0.2, 1.2, 4, 8);
    const leftArmMesh = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArmMesh.castShadow = true;
    leftArm.add(leftArmMesh);
    
    const leftArmOutline = new THREE.LineSegments(
      new THREE.EdgesGeometry(armGeometry),
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    leftArm.add(leftArmOutline);
    
    leftArm.position.set(-1.3, -0.3, 0);
    leftArm.rotation.z = 0.2;
    scene.add(leftArm);

    const rightArm = new THREE.Group();
    robotPartsRef.current.rightArm = rightArm;
    
    const rightArmMesh = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArmMesh.castShadow = true;
    rightArm.add(rightArmMesh);
    
    const rightArmOutline = new THREE.LineSegments(
      new THREE.EdgesGeometry(armGeometry),
      new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    rightArm.add(rightArmOutline);
    
    rightArm.position.set(1.3, -0.3, 0);
    rightArm.rotation.z = -0.2;
    scene.add(rightArm);

    // Apply initial scale
    scene.scale.set(scale, scale, scale);

    // Set initial camera position
    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      
      // Entrance animation - only if entrance progress is not complete
      if (entranceProgressRef.current < 1) {
        entranceProgressRef.current += 0.016 / 2.5; // 2.5 second duration
        entranceProgressRef.current = Math.min(entranceProgressRef.current, 1);

        // Smooth easing function
        const easeOutCubic = (x: number): number => {
          return 1 - Math.pow(1 - x, 3);
        };

        const progress = easeOutCubic(entranceProgressRef.current);
        
        // Simple zoom in entrance
        camera.position.z = cameraDistance + (1 - progress) * 5;
        camera.lookAt(0, 0, 0);

        // Scale entrance
        const scaleValue = progress * scale;
        scene.scale.set(scaleValue, scaleValue, scaleValue);
        
        // Entrance visual affects camera/scale only (head stays controlled by cursor)
      } else if (entranceProgressRef.current >= 1) {
        // Normal idle animation after entrance is complete
        if (robotPartsRef.current.head) {
          // Head follows cursor - ONLY thing that controls head rotation
          const targetRotationY = mousePositionRef.current.x * 1;
          const targetRotationX = mousePositionRef.current.y * -1;
          
          // Clamp rotations to prevent face from turning away completely
          const clampedRotationY = Math.max(-0.6, Math.min(0.6, targetRotationY));
          const clampedRotationX = Math.max(-0.3, Math.min(0.4, targetRotationX));
          
          // Update head target from cursor only
          headTargetRef.current.x = clampedRotationX;
          headTargetRef.current.y = clampedRotationY;
        } 
        if (robotPartsRef.current.antenna) {
          robotPartsRef.current.antenna.rotation.z = Math.sin(timeRef.current * 3) * 0.1;
        }

        // Breathing effect
        if (robotPartsRef.current.body) {
          const breathe = 1 + Math.sin(timeRef.current * 1.5) * 0.02;
          robotPartsRef.current.body.scale.set(breathe, breathe, breathe);
        }

        // Anger animation
        if (isAngry) {
          // (Head rotation is controlled only by cursor; keep other anger effects elsewhere)
          
          // Turn eyes red and make them glow
          if (robotPartsRef.current.leftEye) {
            (robotPartsRef.current.leftEye.material as THREE.MeshPhongMaterial).color.setHex(0xff0000);
            (robotPartsRef.current.leftEye.material as THREE.MeshPhongMaterial).emissive.setHex(0xff0000);
            (robotPartsRef.current.leftEye.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.8;
          }
          if (robotPartsRef.current.rightEye) {
            (robotPartsRef.current.rightEye.material as THREE.MeshPhongMaterial).color.setHex(0xff0000);
            (robotPartsRef.current.rightEye.material as THREE.MeshPhongMaterial).emissive.setHex(0xff0000);
            (robotPartsRef.current.rightEye.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.8;
          }
          
          // Frown mouth
          if (robotPartsRef.current.mouth) {
            robotPartsRef.current.mouth.rotation.z = Math.PI / 2 + 0.3;
          }
          
          // Aggressive arm pose
          if (robotPartsRef.current.leftArm) {
            robotPartsRef.current.leftArm.rotation.z = 0.8 + Math.sin(timeRef.current * 10) * 0.1;
          }
          if (robotPartsRef.current.rightArm) {
            robotPartsRef.current.rightArm.rotation.z = -0.8 - Math.sin(timeRef.current * 10) * 0.1;
          }
        } else {
          // Reset to normal
          if (robotPartsRef.current.leftEye) {
            (robotPartsRef.current.leftEye.material as THREE.MeshPhongMaterial).color.setHex(0x000000);
            (robotPartsRef.current.leftEye.material as THREE.MeshPhongMaterial).emissive.setHex(0x000000);
            (robotPartsRef.current.leftEye.material as THREE.MeshPhongMaterial).emissiveIntensity = 0;
          }
          if (robotPartsRef.current.rightEye) {
            (robotPartsRef.current.rightEye.material as THREE.MeshPhongMaterial).color.setHex(0x000000);
            (robotPartsRef.current.rightEye.material as THREE.MeshPhongMaterial).emissive.setHex(0x000000);
            (robotPartsRef.current.rightEye.material as THREE.MeshPhongMaterial).emissiveIntensity = 0;
          }
          
          if (robotPartsRef.current.mouth) {
            robotPartsRef.current.mouth.rotation.z = Math.PI / 2;
          }
        }

        // Typing animation - when AI is typing out response
        if (isTyping && !isAngry) {
          // Fingers tapping animation - rapid arm movement
          if (robotPartsRef.current.leftArm) {
            robotPartsRef.current.leftArm.rotation.z = 0.5 + Math.sin(timeRef.current * 20) * 0.15;
          }
          if (robotPartsRef.current.rightArm) {
            robotPartsRef.current.rightArm.rotation.z = -0.5 - Math.sin(timeRef.current * 20 + Math.PI) * 0.15;
          }

          // Fast chest lights pulsing - showing processing
          if (robotPartsRef.current.chestLights) {
            robotPartsRef.current.chestLights.forEach((light, i) => {
              const pulse = 1 + Math.sin(timeRef.current * 12 + i * 0.5) * 0.4;
              light.scale.set(pulse, pulse, pulse);
            });
          }

          // Concentrated blinking - eyes narrowed
          if (robotPartsRef.current.leftEye) {
            robotPartsRef.current.leftEye.scale.y = 0.7;
          }
          if (robotPartsRef.current.rightEye) {
            robotPartsRef.current.rightEye.scale.y = 0.7;
          }

          // Antenna wiggling - processing indicator
          if (robotPartsRef.current.antenna) {
            robotPartsRef.current.antenna.rotation.z = Math.sin(timeRef.current * 10) * 0.2;
          }
          
          // Quiet mouth movement during typing
          if (robotPartsRef.current.mouth) {
            const mouthOpen = 1 + Math.sin(timeRef.current * 5) * 0.15;
            robotPartsRef.current.mouth.scale.set(1, mouthOpen, 1);
          }
        }
        // Speaking animation - when AI is speaking (user sent message)
        else if (isSpeaking && !isAngry) {
          if (robotPartsRef.current.mouth) {
            // Smooth mouth movement using interpolation for a more natural cadence
            const targetMouth = 1 + Math.sin(timeRef.current * 10) * 0.18; // smaller amplitude
            robotPartsRef.current.mouth.scale.y += (targetMouth - robotPartsRef.current.mouth.scale.y) * 0.12;
            robotPartsRef.current.mouth.scale.x += (1 - robotPartsRef.current.mouth.scale.x) * 0.06;
            robotPartsRef.current.mouth.scale.z += (1 - robotPartsRef.current.mouth.scale.z) * 0.06;
          }

          // Arm waving - expressive gestures with slightly smoother interpolation
          if (robotPartsRef.current.leftArm) {
            const targetLeftArm = 0.2 + Math.sin(timeRef.current * 5) * 0.28;
            robotPartsRef.current.leftArm.rotation.z += (targetLeftArm - robotPartsRef.current.leftArm.rotation.z) * 0.12;
          }
          if (robotPartsRef.current.rightArm) {
            const targetRightArm = -0.2 - Math.sin(timeRef.current * 5) * 0.28;
            robotPartsRef.current.rightArm.rotation.z += (targetRightArm - robotPartsRef.current.rightArm.rotation.z) * 0.12;
          }

          // Chest lights pulsing - normal speaking rhythm
          if (robotPartsRef.current.chestLights) {
            robotPartsRef.current.chestLights.forEach((light, i) => {
              const pulse = 1 + Math.sin(timeRef.current * 8 + i) * 0.3;
              light.scale.set(pulse, pulse, pulse);
            });
          }

          // Eye bounce - enthusiastic (interpolated for smoothness)
          if (robotPartsRef.current.leftEye) {
            const leftEyeTargetY = 0.3 + Math.sin(timeRef.current * 10) * 0.1;
            robotPartsRef.current.leftEye.position.y += (leftEyeTargetY - robotPartsRef.current.leftEye.position.y) * 0.12;
          }
          if (robotPartsRef.current.rightEye) {
            const rightEyeTargetY = 0.3 + Math.sin(timeRef.current * 10 + 0.5) * 0.1;
            robotPartsRef.current.rightEye.position.y += (rightEyeTargetY - robotPartsRef.current.rightEye.position.y) * 0.12;
          }

          // Body subtle bob while speaking for emphasis
          if (robotPartsRef.current.body) {
            const targetBodyY = -0.5 + Math.sin(timeRef.current * 1.5) * 0.03;
            robotPartsRef.current.body.position.y += (targetBodyY - robotPartsRef.current.body.position.y) * 0.08;
          }
        } else if (!isAngry) {
          // Reset to idle
          if (robotPartsRef.current.mouth) {
            robotPartsRef.current.mouth.scale.set(1, 1, 1);
          }
          if (robotPartsRef.current.leftArm) {
            robotPartsRef.current.leftArm.rotation.z += (0.2 - robotPartsRef.current.leftArm.rotation.z) * 0.1;
          }
          if (robotPartsRef.current.rightArm) {
            robotPartsRef.current.rightArm.rotation.z += (-0.2 - robotPartsRef.current.rightArm.rotation.z) * 0.1;
          }
          // Reset chest lights
          if (robotPartsRef.current.chestLights) {
            robotPartsRef.current.chestLights.forEach((light) => {
              light.scale.set(1, 1, 1);
            });
          }
        }

        // Eye blink (not when angry or typing)
        if (!isAngry && !isTyping && Math.sin(timeRef.current * 2) > 0.95) {
          if (robotPartsRef.current.leftEye) {
            robotPartsRef.current.leftEye.scale.y = 0.1;
          }
          if (robotPartsRef.current.rightEye) {
            robotPartsRef.current.rightEye.scale.y = 0.1;
          }
        } else if (!isTyping) {
          if (robotPartsRef.current.leftEye) {
            robotPartsRef.current.leftEye.scale.y = 1;
          }
          if (robotPartsRef.current.rightEye) {
            robotPartsRef.current.rightEye.scale.y = 1;
          }
        }
      }

      // Apply head target (cursor-only control) last so nothing else overrides it
      if (robotPartsRef.current.head) {
        const tx = headTargetRef.current.x;
        const ty = headTargetRef.current.y;
        robotPartsRef.current.head.rotation.x = tx;
        robotPartsRef.current.head.rotation.y = ty;
        const downwardAdjustmentFinal = Math.max(0, -tx * 0.3);
        robotPartsRef.current.head.position.y = 1.5 + downwardAdjustmentFinal + Math.sin(timeRef.current * 2) * 0.05;
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [perspective, detailLevel, outputStyle, isSpeaking, isAngry, isTyping]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '180px',
        height: '200px',
        position: 'relative',
      }}
    />
  );
};

export default AnimatedRobot;