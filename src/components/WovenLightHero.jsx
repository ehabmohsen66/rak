import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useIsMobile } from '../lib/useMobileDetect';

// --- Three.js Canvas Component ---
const WovenCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5.8;
    
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    // --- Woven Silk Particle Mesh ---
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const geometry = new THREE.BufferGeometry();
    const torusKnot = new THREE.TorusKnotGeometry(1.35, 0.45, 120, 24);

    // Primary RAK Magenta and Pinkish HSL palette colors
    const magentaColor = new THREE.Color('#E6007E');
    const accentColor = new THREE.Color('#FF2A96');
    const lightPinkColor = new THREE.Color('#FF85C0');

    for (let i = 0; i < particleCount; i++) {
      const vertexIndex = i % torusKnot.attributes.position.count;
      const x = torusKnot.attributes.position.getX(vertexIndex);
      const y = torusKnot.attributes.position.getY(vertexIndex);
      const z = torusKnot.attributes.position.getZ(vertexIndex);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Rich Pinkish / Magenta color palette
      const rand = Math.random();
      const color = new THREE.Color();
      if (rand < 0.55) {
        color.copy(magentaColor);
      } else if (rand < 0.85) {
        color.copy(accentColor);
      } else {
        color.copy(lightPinkColor);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      velocities[i * 3] = 0;
      velocities[i * 3 + 1] = 0;
      velocities[i * 3 + 2] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.75,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      const mx = mouse.x * 3.5;
      const my = mouse.y * 3.5;

      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const cx = positions[ix];
        const cy = positions[iy];
        const cz = positions[iz];

        const ox = originalPositions[ix];
        const oy = originalPositions[iy];
        const oz = originalPositions[iz];

        let vx = velocities[ix];
        let vy = velocities[iy];
        let vz = velocities[iz];

        const dx = cx - mx;
        const dy = cy - my;
        const dz = cz;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 2.56 && distSq > 0.0001) {
          const dist = Math.sqrt(distSq);
          const force = (1.6 - dist) * 0.012;
          const invDist = 1 / dist;
          vx += (dx * invDist) * force;
          vy += (dy * invDist) * force;
          vz += (dz * invDist) * force;
        }

        // Return to original position
        vx += (ox - cx) * 0.0012;
        vy += (oy - cy) * 0.0012;
        vz += (oz - cz) * 0.0012;
        
        // Damping
        vx *= 0.94;
        vy *= 0.94;
        vz *= 0.94;

        positions[ix] = cx + vx;
        positions[iy] = cy + vy;
        positions[iz] = cz + vz;
        
        velocities[ix] = vx;
        velocities[iy] = vy;
        velocities[iz] = vz;
      }
      geometry.attributes.position.needsUpdate = true;

      points.rotation.y = elapsedTime * 0.08;
      points.rotation.x = Math.sin(elapsedTime * 0.05) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

// --- Main Hero Component ---
export const WovenLightHero = ({ onOpenPlanner }) => {
  const isMobile = useIsMobile();
  const textControls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {

    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08 + 0.3,
        duration: 1.0,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }));

    buttonControls.start({
      opacity: 1,
      y: 0,
      transition: { delay: 1.6, duration: 0.8 }
    });

  }, [textControls, buttonControls]);

  const headline = "WOVEN BY LIGHT";
  
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-rak-slate-950 text-white selection:bg-rak-magenta selection:text-white border-b border-rak-slate-800/80 -mt-16 pt-28">
      
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rak-magenta/15 rounded-full blur-[160px] pointer-events-none z-0"></div>

      {/* Interactive Woven Particle Canvas or Mobile Fallback */}
      {isMobile ? (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-rak-magenta/20 via-rak-slate-950 to-rak-cyan/10" />
          <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-rak-magenta/15 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-rak-cyan/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      ) : (
        <WovenCanvas />
      )}

      {/* Main Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6 my-auto py-16 md:py-24">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 bg-rak-slate-900/90 border border-rak-magenta/40 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-magenta-sm"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>Enterprise Case Studies & ROI</span>
        </motion.div>

        {/* Animated Headline with All Pinkish / Magenta Theme */}
        <h1 
          className="text-5xl sm:text-7xl md:text-8xl font-black text-rak-magenta tracking-tight uppercase leading-tight" 
          style={{ 
            fontFamily: "'Playfair Display', serif", 
            textShadow: '0 0 35px #E6007E, 0 0 70px rgba(230, 0, 126, 0.5)' 
          }}
        >
          {headline.split(" ").map((word, i) => (
            <span key={i} className="inline-block">
              {word.split("").map((char, j) => (
                <motion.span 
                  key={j} 
                  custom={i * 5 + j} 
                  initial={{ opacity: 0, y: 40 }} 
                  animate={textControls} 
                  style={{ display: 'inline-block' }}
                  className="text-rak-magenta drop-shadow-lg"
                >
                  {char}
                </motion.span>
              ))}
              {i < headline.split(" ").length - 1 && <span>&nbsp;</span>}
            </span>
          ))}
        </h1>

        {/* High-Contrast Description inside Dark Glass Container */}
        <motion.div
          custom={headline.length}
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          className="mx-auto max-w-2xl p-4 sm:p-6 bg-rak-slate-950/85 border border-rak-slate-800/90 rounded-3xl backdrop-blur-xl shadow-2xl space-y-2 relative z-20"
        >
          <p 
            className="text-base sm:text-lg text-white font-medium leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            An interactive tapestry of light, digital engineering, and enterprise transformation. Explore complete operational case studies from blueprint to quantitative ROI.
          </p>
        </motion.div>

        {/* CTA Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={buttonControls} className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={onOpenPlanner}
            className="px-8 py-4 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-glow transition-all flex items-center space-x-2 hover:scale-105 cursor-pointer" 
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span>Explore The Weave</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>

      </div>

      {/* Bottom Features Showcase Bar - Matches About & Work Hero Structure */}
      <div className="relative z-20 bg-rak-slate-900 border-t border-rak-slate-800 text-white rounded-t-[2.5rem] md:rounded-t-[3.5rem] px-6 py-10 md:px-10 md:py-14 shadow-2xl mt-auto w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* Card 1 */}
          <div className="bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative border border-rak-slate-800 hover:border-rak-magenta/50 transition-all">
            <h3 className="text-lg md:text-xl uppercase leading-tight mb-2 font-black text-white">
              QUANTITATIVE<br/>ROI
            </h3>
            <p className="text-[10px] md:text-xs text-rak-slate-400 font-medium mb-4">
              Proven business metrics, conversion growth, and market expansion benchmarks
            </p>
            <div className="mt-auto px-4 py-1.5 bg-rak-magenta/20 border border-rak-magenta/40 text-rak-magenta rounded-full text-[10px] font-bold uppercase tracking-wider">
              100% Measured Data
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative border border-rak-slate-800 hover:border-rak-magenta/50 transition-all">
            <h3 className="text-lg md:text-xl uppercase leading-tight mb-2 font-black text-white">
              BLUEPRINT TO<br/>DEPLOYMENT
            </h3>
            <p className="text-[10px] md:text-xs text-rak-slate-400 font-medium mb-4">
              Full enterprise architecture, technical specs, and operational execution
            </p>
            <div className="mt-auto px-4 py-1.5 bg-rak-cyan/20 border border-rak-cyan/40 text-rak-cyan rounded-full text-[10px] font-bold uppercase tracking-wider">
              360° Case Analysis
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative border border-rak-slate-800 hover:border-rak-magenta/50 transition-all">
            <h3 className="text-lg md:text-xl uppercase leading-tight mb-2 font-black text-white">
              INDUSTRY<br/>TRANSFORMATION
            </h3>
            <p className="text-[10px] md:text-xs text-rak-slate-400 font-medium mb-4">
              Scaling Fortune 500 & high-growth brands to category leadership
            </p>
            <div className="mt-auto px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Enterprise Level
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WovenLightHero;
