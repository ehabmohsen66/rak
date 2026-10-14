import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function WebGLShader({ className = "" }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const { current: refs } = sceneRef;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Brand-aligned Fuchsia (#EC008C), Rose (#C80074), and Crisp White silk light waves
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

        // Base deep obsidian charcoal (#07080B)
        vec3 baseBg = vec3(0.027, 0.031, 0.043);
        vec3 rakMagenta = vec3(0.925, 0.0, 0.549);   // #EC008C
        vec3 rakRose    = vec3(0.784, 0.0, 0.455);   // #C80074
        vec3 rakLight   = vec3(1.0, 0.55, 0.82);     // Soft luminous pink-white
        vec3 pureWhite  = vec3(1.0, 1.0, 1.0);

        // Multi-layered flowing silk ribbons across the full canvas
        float w1 = sin(p.x * 1.35 + time * 0.85 + cos(p.x * 0.7 - time * 0.4) * 0.45) * 0.38;
        float w2 = sin(p.x * 1.85 - time * 0.65 + sin(p.x * 0.9 + time * 0.5) * 0.35) * 0.44 - 0.12;
        float w3 = cos(p.x * 1.10 + time * 0.55) * 0.32 + 0.15;

        float d1 = abs(p.y - w1);
        float d2 = abs(p.y - w2);
        float d3 = abs(p.y - w3);

        // Soft glowing silk bands + crisp core filament
        float ribbon1 = 0.028 / (d1 + 0.065);
        float core1   = 0.004 / (d1 * d1 + 0.008);

        float ribbon2 = 0.024 / (d2 + 0.075);
        float ribbon3 = 0.018 / (d3 + 0.095);

        // Ambient radial brand aura
        float radialGlow = exp(-length(p * vec2(0.65, 1.15)) * 1.45) * 0.32;

        vec3 col = baseBg;
        col += rakMagenta * (ribbon1 * 0.65 + radialGlow);
        col += rakRose * (ribbon2 * 0.55 + ribbon3 * 0.45);
        col += mix(rakLight, pureWhite, 0.6) * (core1 * 0.22);

        // Smooth tone mapping so highlights stay rich fuchsia & white without harsh clipping
        col = col / (1.0 + col * 0.35);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    let resizeObserver;

    const initScene = () => {
      refs.scene = new THREE.Scene();
      refs.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      refs.renderer.setClearColor(new THREE.Color(0x07080b), 1);

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

      const parentWidth = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      const parentHeight = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

      refs.uniforms = {
        resolution: { value: [parentWidth, parentHeight] },
        time: { value: 0.0 },
      };

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ];

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", positions);

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      });

      refs.mesh = new THREE.Mesh(geometry, material);
      refs.scene.add(refs.mesh);

      handleResize();
    };

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.012;
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
      refs.animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms || !canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth || window.innerWidth;
      const height = canvas.parentElement.clientHeight || window.innerHeight;
      refs.renderer.setSize(width, height, false);
      refs.uniforms.resolution.value = [width, height];
    };

    initScene();
    animate();
    window.addEventListener("resize", handleResize);
    if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh);
        refs.mesh.geometry.dispose();
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose();
        }
      }
      refs.renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full block pointer-events-none z-0 ${className}`}
    />
  );
}

export default WebGLShader;
