import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';

import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add
} from 'three/tsl';

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

extend(THREE);

// Post Processing component with RAK Magenta Beam Effect (#EC008C -> R: 0.925, G: 0.0, B: 0.549)
const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode('output');
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    // Create the scanning effect uniform
    const uScanProgress = uniform(0);
    progressRef.current = uScanProgress;

    // Create a RAK magenta overlay that follows the scan line
    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.05);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    
    // RAK Brand Magenta: vec3(0.925, 0.0, 0.549)
    const magentaOverlay = vec3(0.925, 0.0, 0.549).mul(oneMinus(scanLine)).mul(0.4);

    // Mix original scene with magenta scanning beam
    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, magentaOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0
    );

    // Add bloom effect after scan effect
    const final = withScanEffect.add(bloomPass);

    postProcessing.outputNode = final;

    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    // Animate the scan line from top to bottom
    progressRef.current.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);

  const meshRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (rawMap && depthMap) {
      setVisible(true);
    }
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.01;

    const tDepthMap = texture(depthMap);

    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength))
    );

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);

    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));

    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);

    const depth = tDepthMap;

    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));

    // Custom Magenta dot grid mask: vec3(9.25, 0.0, 5.49)
    const mask = dot.mul(flow).mul(vec3(9.25, 0.0, 5.49));

    const final = blendScreen(tMap, mask);

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return {
      material,
      uniforms: {
        uPointer,
        uProgress,
      },
    };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    uniforms.uProgress.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    if (meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material;
      if ('opacity' in mat) {
        mat.opacity = THREE.MathUtils.lerp(
          mat.opacity,
          visible ? 1 : 0,
          0.07
        );
      }
    }
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  const scaleFactor = 0.40;
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};

export const HeroScanner = ({ 
  title = "BUILD YOUR CREATIVE FUTURE", 
  subtitle = "AI-Powered Execution & Bold Brand Strategy Under One Roof.",
  onOpenPlanner 
}) => {
  const titleWords = title.split(' ');
  const [visibleWords, setVisibleWords] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [delays, setDelays] = useState([]);
  const [subtitleDelay, setSubtitleDelay] = useState(0);

  useEffect(() => {
    setDelays(titleWords.map(() => Math.random() * 0.07));
    setSubtitleDelay(Math.random() * 0.1);
  }, [titleWords.length]);

  useEffect(() => {
    if (visibleWords < titleWords.length) {
      const timeout = setTimeout(() => setVisibleWords(visibleWords + 1), 500);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setSubtitleVisible(true), 600);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, titleWords.length]);

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-rak-charcoal-black flex items-center justify-center rounded-3xl border border-rak-slate-800/80 shadow-2xl my-4">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-rak-magenta/10 via-transparent to-rak-charcoal-black/90 pointer-events-none z-10" />

      {/* HTML Overlay Content */}
      <div className="uppercase items-center w-full absolute z-20 pointer-events-none px-6 sm:px-12 flex justify-center flex-col text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-rak-slate-900/90 border border-rak-magenta/40 text-rak-magenta rounded-full text-xs font-bold tracking-widest backdrop-blur-md mb-6 shadow-magenta-sm pointer-events-auto">
          <span>RAK 4 CREATIVE • NEXT-GEN HERO</span>
        </div>

        <div className="text-3xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight">
          <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 overflow-hidden text-white drop-shadow-md">
            {titleWords.map((word, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${index < visibleWords ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${index * 0.12 + (delays[index] || 0)}s` }}
              >
                {word === 'FUTURE' || word === 'DREAMS' ? (
                  <span className="text-gradient-magenta">{word}</span>
                ) : (
                  word
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs sm:text-base md:text-xl mt-4 max-w-2xl text-rak-slate-300 font-medium normal-case">
          <div
            className={`transition-all duration-700 ${subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${titleWords.length * 0.12 + 0.2 + subtitleDelay}s` }}
          >
            {subtitle}
          </div>
        </div>

        {onOpenPlanner && (
          <div className="mt-8 pointer-events-auto">
            <button
              onClick={onOpenPlanner}
              className="px-8 py-4 bg-rak-magenta text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-magenta-glow hover:bg-rak-magenta-dark transition-all duration-300 hover:scale-105"
            >
              Start a Project
            </button>
          </div>
        )}
      </div>

      {/* WebGPU 3D Canvas */}
      <div className="absolute inset-0 z-0 opacity-85">
        <Canvas
          flat
          gl={async (props) => {
            const renderer = new THREE.WebGPURenderer(props);
            await renderer.init();
            return renderer;
          }}
        >
          <PostProcessing fullScreenEffect={true} />
          <Scene />
        </Canvas>
      </div>
    </div>
  );
};

export default HeroScanner;
