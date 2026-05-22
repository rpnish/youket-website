import React from 'react';
import { motion } from 'motion/react';

export default function AtmosphericBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#f5f2ed] overflow-hidden">
      {/* Subtle animated gradients */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#e8d5c4]/30 to-transparent blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-[#dbc4af]/20 to-transparent blur-[100px]"
      />

      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply transition-opacity duration-1000">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch" 
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Subtle mesh-like atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#f5f2ed_100%)] opacity-40" />
    </div>
  );
}
