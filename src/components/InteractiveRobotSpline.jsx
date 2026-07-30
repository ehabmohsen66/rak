import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function InteractiveRobotSpline({ className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLightMagenta = new THREE.PointLight(0xe6007e, 4, 20);
    pointLightMagenta.position.set(3, 3, 4);
    scene.add(pointLightMagenta);

    const pointLightBlue = new THREE.PointLight(0x00f0ff, 3, 20);
    pointLightBlue.position.set(-3, -2, 4);
    scene.add(pointLightBlue);

    // --- Robot Group ---
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // --- Materials ---
    const armorMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.85,
      roughness: 0.2,
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0x374151,
      metalness: 0.95,
      roughness: 0.1,
    });

    const magentaGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0xe6007e,
      emissive: 0xe6007e,
      emissiveIntensity: 2.5,
      metalness: 0.5,
      roughness: 0.1,
    });

    const cyanGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.0,
    });

    const visorMaterial = new THREE.MeshStandardMaterial({
      color: 0x030712,
      metalness: 0.9,
      roughness: 0.05,
    });

    // 1. HEAD GROUP
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.7, 0);
    robotGroup.add(headGroup);

    // Head Main Shell
    const headGeo = new THREE.BoxGeometry(1.4, 1.1, 1.2);
    const headMesh = new THREE.Mesh(headGeo, armorMaterial);
    headGroup.add(headMesh);

    // Visor Glass
    const visorGeo = new THREE.BoxGeometry(1.25, 0.45, 0.15);
    const visorMesh = new THREE.Mesh(visorGeo, visorMaterial);
    visorMesh.position.set(0, 0.05, 0.58);
    headGroup.add(visorMesh);

    // Glowing Neon Eyes Strip (Magenta)
    const eyeLeftGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeLeft = new THREE.Mesh(eyeLeftGeo, magentaGlowMaterial);
    eyeLeft.position.set(-0.35, 0.05, 0.62);
    headGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeLeftGeo, magentaGlowMaterial);
    eyeRight.position.set(0.35, 0.05, 0.62);
    headGroup.add(eyeRight);

    // Antenna Base & Orb
    const antennaStemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 12);
    const antennaStem = new THREE.Mesh(antennaStemGeo, chromeMaterial);
    antennaStem.position.set(0, 0.8, 0);
    headGroup.add(antennaStem);

    const antennaOrbGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const antennaOrb = new THREE.Mesh(antennaOrbGeo, cyanGlowMaterial);
    antennaOrb.position.set(0, 1.05, 0);
    headGroup.add(antennaOrb);

    // Ear Bolts
    const earGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.2, 16);
    const earLeft = new THREE.Mesh(earGeo, chromeMaterial);
    earLeft.rotation.z = Math.PI / 2;
    earLeft.position.set(-0.75, 0, 0);
    headGroup.add(earLeft);

    const earRight = earLeft.clone();
    earRight.position.set(0.75, 0, 0);
    headGroup.add(earRight);

    // 2. NECK
    const neckGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.3, 16);
    const neckMesh = new THREE.Mesh(neckGeo, chromeMaterial);
    neckMesh.position.set(0, 0.05, 0);
    robotGroup.add(neckMesh);

    // 3. TORSO / CHEST
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.9, 0);
    robotGroup.add(torsoGroup);

    const chestGeo = new THREE.BoxGeometry(1.8, 1.3, 1.1);
    const chestMesh = new THREE.Mesh(chestGeo, armorMaterial);
    torsoGroup.add(chestMesh);

    // Chest Glowing Arc Reactor (Magenta)
    const reactorGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 32);
    const reactorMesh = new THREE.Mesh(reactorGeo, magentaGlowMaterial);
    reactorMesh.rotation.x = Math.PI / 2;
    reactorMesh.position.set(0, 0.15, 0.52);
    torsoGroup.add(reactorMesh);

    // Shoulders
    const shoulderGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const shoulderLeft = new THREE.Mesh(shoulderGeo, chromeMaterial);
    shoulderLeft.position.set(-1.1, 0.4, 0);
    torsoGroup.add(shoulderLeft);

    const shoulderRight = shoulderLeft.clone();
    shoulderRight.position.set(1.1, 0.4, 0);
    torsoGroup.add(shoulderRight);

    // 4. HOLOGRAPHIC ORBITING RINGS
    const ringGeo = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ringMesh1 = new THREE.Mesh(ringGeo, magentaGlowMaterial);
    ringMesh1.rotation.x = Math.PI / 3;
    robotGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, cyanGlowMaterial);
    ringMesh2.rotation.x = -Math.PI / 4;
    ringMesh2.rotation.y = Math.PI / 6;
    robotGroup.add(ringMesh2);

    // 5. AMBIENT PARTICLE FIELD
    const particleCount = 1200;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const isMagenta = Math.random() > 0.4;
      particleColors[i * 3] = isMagenta ? 0.9 : 0.0;
      particleColors[i * 3 + 1] = isMagenta ? 0.0 : 0.95;
      particleColors[i * 3 + 2] = isMagenta ? 0.49 : 1.0;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- Interactive Mouse Tracking ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.targetX = x;
      mouse.targetY = y;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- Animation Loop ---
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Lerp Mouse Tracking
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Head Mouse Tracking
      headGroup.rotation.y = mouse.x * 0.55;
      headGroup.rotation.x = -mouse.y * 0.35;

      // Robot Body Floating Breathing Animation
      robotGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
      robotGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.08;

      // Holographic Rings Spin
      ringMesh1.rotation.z = elapsedTime * 0.4;
      ringMesh2.rotation.z = -elapsedTime * 0.5;

      // Pulsate Eye / Reactor Intensity
      magentaGlowMaterial.emissiveIntensity = 2.2 + Math.sin(elapsedTime * 4) * 0.6;
      antennaOrb.position.y = 1.05 + Math.sin(elapsedTime * 3) * 0.04;

      // Particle Field Slow Spin
      particleSystem.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full min-h-[340px] cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden ${className}`} 
    />
  );
}

export default InteractiveRobotSpline;
