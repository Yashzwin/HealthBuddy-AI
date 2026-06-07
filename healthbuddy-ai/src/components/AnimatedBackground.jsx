import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const FloatingOrb = ({ delay, duration, x, y, size, color }) => (
  <motion.div
    className="absolute rounded-full blur-3xl opacity-20"
    style={{
      width: size,
      height: size,
      background: color,
      left: `${x}%`,
      top: `${y}%`,
    }}
    animate={{
      x: [0, 30, -20, 10, 0],
      y: [0, -40, 20, -10, 0],
      scale: [1, 1.1, 0.95, 1.05, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

const Particle = ({ index, total }) => {
  const style = useMemo(() => ({
    left: `${(index / total) * 100}%`,
    animationDelay: `${index * 0.5}s`,
  }), [index, total]);

  return (
    <motion.div
      className="absolute h-1 w-1 rounded-full bg-primary/30"
      style={style}
      animate={{
        y: [0, -800],
        opacity: [0, 0.6, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay: index * 0.8,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

const AnimatedBackground = ({ variant = 'default', className = '' }) => {
  const orbs = useMemo(() => [
    { delay: 0, duration: 20, x: 10, y: 20, size: '20rem', color: 'hsl(var(--primary))' },
    { delay: 2, duration: 25, x: 70, y: 60, size: '18rem', color: 'hsl(var(--secondary))' },
    { delay: 4, duration: 22, x: 40, y: 80, size: '15rem', color: 'hsl(var(--accent))' },
    { delay: 1, duration: 18, x: 85, y: 10, size: '12rem', color: 'hsl(var(--primary))' },
    { delay: 3, duration: 28, x: 20, y: 50, size: '16rem', color: 'hsl(var(--secondary))' },
  ], []);

  const particles = useMemo(() => Array.from({ length: 20 }, (_, i) => i), []);

  if (variant === 'hero') {
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-mesh-gradient bg-[length:200%_200%] animate-gradient-shift" />

        {/* Floating orbs */}
        {orbs.map((orb, i) => (
          <FloatingOrb key={i} {...orb} />
        ))}

        {/* Rising particles */}
        <div className="absolute inset-0">
          {particles.map((i) => (
            <Particle key={i} index={i} total={particles.length} />
          ))}
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-40" />

        {/* Top glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[120%] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl" />
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Subtle gradient orbs */}
        <motion.div
          className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-32 top-1/2 h-72 w-72 rounded-full bg-secondary/8 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 -bottom-20 h-60 w-60 rounded-full bg-accent/5 blur-3xl"
          animate={{ x: [0, 15, -15, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.slice(0, 3).map((orb, i) => (
        <FloatingOrb key={i} {...orb} />
      ))}
    </div>
  );
};

export default AnimatedBackground;
