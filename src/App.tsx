/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Lenis from 'lenis';
import { ArrowUpRight, Github, Twitter, Instagram, Menu, X } from 'lucide-react';
import ParticleTypography from './components/ParticleTypography';
import AtmosphericBackground from './components/AtmosphericBackground';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { scrollY } = useScroll();
  
  // Parallax and scroll effects
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-[#dbc4af] selection:text-[#1a1a1a]">
      <AtmosphericBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 md:px-12 flex justify-between items-baseline mix-blend-difference invert pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs font-display font-bold tracking-[0.4em] uppercase"
        >
          YOUKET
        </motion.div>
        
        <div className="hidden md:flex items-center gap-12 text-[10px] tracking-[0.2em] uppercase font-medium">
          {['Vision', 'Process', 'Access'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="hover:opacity-50 transition-opacity"
            >
              {item}
            </motion.a>
          ))}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="border border-white/20 rounded-full px-6 py-2 text-[10px] tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-colors duration-500"
          >
            Explore Vision
          </motion.button>
        </div>

        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="text-background" /> : <Menu className="text-background" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[45] bg-foreground text-background flex flex-col items-center justify-center gap-8 text-4xl font-display"
        >
          {['Vision', 'Process', 'Access'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              onClick={() => setIsMenuOpen(false)}
              className="hover:italic transition-all"
            >
              {item}
            </a>
          ))}
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center pt-24 overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="container mx-auto px-6 h-[70vh] md:h-[80vh] flex flex-col items-center justify-center relative"
        >
          <ParticleTypography text="Youket" fontSize={800} color="#1a1a1a" particleSize={1.5} />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-4 text-center max-w-2xl px-6"
          >
            <h2 className="text-3xl md:text-4xl font-serif italic mb-4 opacity-80">
              Growth begins with you.
            </h2>
            <p className="text-[11px] uppercase tracking-[0.25em] font-medium max-w-sm mx-auto leading-relaxed opacity-50">
              A modern digital brand exploring momentum, creativity, and growth.
            </p>
            
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <button className="group bg-[#1A1A1A] text-[#F5F2ED] rounded-full px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase shadow-2xl hover:scale-105 transition-transform">
                Get Early Access
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#1a1a1a]/20 to-transparent" />
        </motion.div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-32 md:py-48 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.2em] text-[#6b665c] font-semibold"
          >
            Our Vision
          </motion.span>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-4xl md:text-6xl font-display font-medium leading-[1.1] tracking-super-tight text-graphite italic"
          >
            Building quietly, intentionally, and creatively to redefine how modern digital identities evolve.
          </motion.h3>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12 grid md:grid-cols-2 gap-12 text-[#6b665c] text-lg leading-relaxed"
          >
            <p>
              We believe momentum is harvested in moments of stillness. Youket isn't just a platform; it's a philosophy of deliberate growth.
            </p>
            <p>
              By focusing on the purity of interaction and the elegance of function, we create spaces where creativity isn't just possible—it's inevitable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="process" className="py-32 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#6b665c] font-bold mb-4 opacity-70">What we're building</h4>
              <h2 className="text-4xl md:text-5xl font-display font-light tracking-[-0.04em]">Essential tools for modern growth.</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Digital Presence", desc: "Defining aesthetic boundaries through code and light." },
              { title: "Creative Growth", desc: "Sustainable systems for modern high-performance creators." },
              { title: "Modern Experience", desc: "Interaction that feels like atmosphere rather than UI." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group p-8 min-h-[220px] flex flex-col justify-between bento-card transition-all duration-700"
              >
                <div className="w-6 h-[1px] bg-[#1a1a1a]/30 group-hover:w-12 transition-all duration-500" />
                <div>
                  <h5 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-2 opacity-90">{feature.title}</h5>
                  <p className="text-[12px] text-[#6b665c] leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="access" className="py-48 px-6 text-center overflow-hidden relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto relative z-10"
        >
          <h2 className="text-5xl md:text-8xl font-display font-medium tracking-super-tight mb-12">
            Built for what's <span className="italic">next.</span>
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-[#1a1a1a] text-[#f5f2ed] rounded-full text-lg font-medium hover:bg-[#333333] transition-colors"
          >
            Join the Journey
          </motion.button>
        </motion.div>
        
        {/* Decorative background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#dbc4af]/10 rounded-full blur-[100px] -z-10" />
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#1a1a1a]/5 mx-6 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-medium opacity-40">
        <div>© 2024 Youket Studio — Built for what's next</div>
        
        <div className="flex gap-12">
          {['Twitter', 'Instagram', 'Github'].map((social) => (
            <a key={social} href="#" className="hover:opacity-100 transition-opacity tracking-[0.4em]">{social}</a>
          ))}
        </div>

        <div className="flex gap-12">
          {['Privacy', 'Terms', 'Connect'].map((link) => (
            <a key={link} href="#" className="hover:opacity-100 transition-opacity">{link}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
