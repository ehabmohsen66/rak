import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const Spline = lazy(() => import('@splinetool/react-spline'));

// Error Boundary to catch Spline CDN buffer/CORS errors without crashing page
class SplineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("Spline scene buffer error caught gracefully. Rendering 3D Robot Canvas:", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Native 3D AI Robot Canvas Fallback (100% offline reliable, mouse tracking, 60 FPS)
function Fallback3DRobot({ className }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xe6007e, 2.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2.0, 10);
    pointLight.position.set(-4, -2, 3);
    scene.add(pointLight);

    // Robot Main Group
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // Head
    const headGroup = new THREE.Group();
    const headGeo = new THREE.BoxGeometry(1.6, 1.3, 1.3);
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.2,
      metalness: 0.9,
    });
    const headMesh = new THREE.Mesh(headGeo, darkMat);
    headGroup.add(headMesh);

    // Visor (Glowing Neon Pink Strip)
    const visorGeo = new THREE.BoxGeometry(1.4, 0.25, 0.1);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0xe6007e });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.1, 0.66);
    headGroup.add(visor);

    // Glowing Eyes
    const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.35, 0.1, 0.7);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.35, 0.1, 0.7);
    headGroup.add(leftEye);
    headGroup.add(rightEye);

    // Ears / Antennas
    const earGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const earMat = new THREE.MeshStandardMaterial({ color: 0xe6007e, metalness: 0.8 });
    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.rotation.z = Math.PI / 2;
    leftEar.position.set(-0.95, 0.1, 0);
    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.rotation.z = Math.PI / 2;
    rightEar.position.set(0.95, 0.1, 0);
    headGroup.add(leftEar);
    headGroup.add(rightEar);

    headGroup.position.y = 1.1;
    robotGroup.add(headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
    const neck = new THREE.Mesh(neckGeo, darkMat);
    neck.position.y = 0.35;
    robotGroup.add(neck);

    // Chest / Torso
    const chestGeo = new THREE.BoxGeometry(2.2, 1.8, 1.4);
    const chest = new THREE.Mesh(chestGeo, darkMat);
    chest.position.y = -0.75;
    robotGroup.add(chest);

    // Chest Reactor Arc
    const reactorGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32);
    const reactorMat = new THREE.MeshBasicMaterial({ color: 0xe6007e });
    const reactor = new THREE.Mesh(reactorGeo, reactorMat);
    reactor.rotation.x = Math.PI / 2;
    reactor.position.set(0, -0.6, 0.71);
    robotGroup.add(reactor);

    // Floating Orbiting Torus Rings
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xe6007e, wireframe: true });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    robotGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.8, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    robotGroup.add(ring2);

    // Floating Dust Particles
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 12;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.03, color: 0xe6007e, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 2;
      targetMouseY = y * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Head Tracking
      headGroup.rotation.y += (targetMouseX * 0.6 - headGroup.rotation.y) * 0.08;
      headGroup.rotation.x += (-targetMouseY * 0.4 - headGroup.rotation.x) * 0.08;

      // Floating Bobbing
      robotGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;

      // Rings Rotation
      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.x = elapsedTime * 0.3;
      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full relative cursor-grab active:cursor-grabbing ${className}`} />;
}

export function InteractiveRobotSpline({ 
  scene = "https://prod.spline.design/6Wq1Q7YGyM-mab6X/scene.splinecode", 
  className = "" 
}) {
  return (
    <SplineErrorBoundary fallback={<Fallback3DRobot className={className} />}>
      <Suspense
        fallback={
          <div className={`w-full h-full flex items-center justify-center bg-rak-slate-900 text-white ${className}`}>
            <svg className="animate-spin h-6 w-6 text-rak-magenta mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
            </svg>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className} 
        />
      </Suspense>
    </SplineErrorBoundary>
  );
}

export default InteractiveRobotSpline;
