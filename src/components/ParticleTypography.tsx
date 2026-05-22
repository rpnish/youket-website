import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface ParticleTypographyProps {
  text: string;
  fontSize?: number;
  color?: string;
  particleSize?: number;
}

export default function ParticleTypography({
  text = "Youket",
  fontSize = 150,
  color = "#1a1a1a",
  particleSize = 1.8,
}: ParticleTypographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef(new THREE.Vector2(-1000, -1000));
  const isHoveringRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Sampling Text ---
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Adjust font size based on container width and height to ensure it fits
    const widthRatio = (width / text.length) * 1.5;
    const heightRatio = height * 0.7;
    const actualFontSize = Math.min(fontSize, widthRatio, heightRatio);
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `italic 600 ${actualFontSize}px "Inter", "General Sans", "SF Pro Text", sans-serif`;
    ctx.fillText(text, width / 2, height / 2);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const particlesData: { x: number; y: number }[] = [];
    
    // High density sampling
    const step = 2; 

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];
        if (alpha > 50) { // Lower threshold for more particles
          particlesData.push({
            x: x - width / 2,
            y: -(y - height / 2)
          });
        }
      }
    }

    // --- Particle Geometry ---
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesData.length * 3);
    const originalPositions = new Float32Array(particlesData.length * 3);
    const randoms = new Float32Array(particlesData.length);

    particlesData.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = 0;

      originalPositions[i * 3] = p.x;
      originalPositions[i * 3 + 1] = p.y;
      originalPositions[i * 3 + 2] = 0;

      randoms[i] = Math.random();
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aOriginal', new THREE.BufferAttribute(originalPositions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    // --- Custom Shader Material ---
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: mouseRef.current },
        uHover: { value: 0 }, // 0 to 1
        uColor: { value: new THREE.Color(color) },
        uParticleSize: { value: particleSize * (window.devicePixelRatio || 1) }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uHover;
        uniform float uParticleSize;
        attribute vec3 aOriginal;
        attribute float aRandom;
        
        varying float vAlpha;

        void main() {
          vec3 pos = aOriginal;
          
          float dist = distance(pos.xy, uMouse);
          float radius = 120.0;
          
          // Hover effect: dissolve and disperse
          float force = 1.0 - smoothstep(0.0, radius, dist);
          
          if (uHover > 0.01) {
            // Grainy jitter
            float jitterX = (sin(uTime * 3.0 + aRandom * 15.0) * 0.5 + 0.5) * 8.0 * force * uHover;
            float jitterY = (cos(uTime * 2.5 + aRandom * 18.0) * 0.5 + 0.5) * 8.0 * force * uHover;
            
            // Disperse organically
            vec2 dir = normalize(pos.xy - uMouse);
            if (dist < 0.001) dir = vec2(0.0, 1.0); // fallback
            
            pos.x += dir.x * force * 50.0 * uHover + jitterX;
            pos.y += dir.y * force * 50.0 * uHover + jitterY;
            pos.z += force * 30.0 * uHover * aRandom;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = uParticleSize * (1.1 + sin(uTime + aRandom * 2.0) * 0.1);
          gl_Position = projectionMatrix * mvPosition;
          
          // Solid until affected by hover
          vAlpha = 1.0 - (force * 0.4 * uHover);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          // Soft square/circle hybrid for space-filling
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          
          gl_FragColor = vec4(uColor, vAlpha);
        }
      `
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Events ---
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - width / 2);
      const y = -(e.clientY - rect.top - height / 2);
      mouseRef.current.set(x, y);
      isHoveringRef.current = true;
    };

    const onMouseLeave = () => {
      isHoveringRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const rect = container.getBoundingClientRect();
        const x = (e.touches[0].clientX - rect.left - width / 2);
        const y = -(e.touches[0].clientY - rect.top - height / 2);
        mouseRef.current.set(x, y);
        isHoveringRef.current = true;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove);

    // --- Animation Loop ---
    let animationFrameId: number;
    let hoverValue = 0;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      
      const t = time * 0.001;
      material.uniforms.uTime.value = t;

      // Smoothly interpolate hover state
      const targetHover = isHoveringRef.current ? 1 : 0;
      hoverValue += (targetHover - hoverValue) * 0.08;
      material.uniforms.uHover.value = hoverValue;

      renderer.render(scene, camera);
    };
    animate(0);

    // --- Resize handler ---
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
    };
  }, [text, fontSize, color, particleSize]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full cursor-default select-none relative z-10"
      id="particle-typography-container"
    />
  );
}
