import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ── Slowly-panning SVG mountain landscape ── */
const HeroLandscape = ({ className = '' }) => {
  const stars = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      cx: (i * 37.7) % 800,
      cy: 10 + ((i * 23.3) % 120),
      r: 0.5 + (i % 3) * 0.4,
      delay: (i * 0.3) % 5,
      dur: 2 + (i % 3),
    })), []);

  const clouds = useMemo(() => [
    { x: 50, y: 60, scale: 1, speed: 120 },
    { x: 250, y: 40, scale: 0.7, speed: 90 },
    { x: 500, y: 70, scale: 0.9, speed: 140 },
    { x: 700, y: 45, scale: 0.6, speed: 100 },
  ], []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Gradient sky background */}
      <div className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            hsl(260 30% 12%) 0%,
            hsl(270 35% 18%) 15%,
            hsl(280 40% 25%) 30%,
            hsl(320 35% 35%) 50%,
            hsl(25 60% 55%) 70%,
            hsl(35 70% 65%) 85%,
            hsl(45 80% 75%) 100%)`
        }}
      />

      {/* SVG scene that pans slowly */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, -80, 0] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-[120%]"
          style={{ minWidth: '120%' }}
        >
          <defs>
            {/* Sunset glow */}
            <radialGradient id="sunGlow" cx="50%" cy="75%" r="35%">
              <stop offset="0%" stopColor="hsl(40 90% 75%)" stopOpacity="0.6" />
              <stop offset="40%" stopColor="hsl(30 80% 60%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(280 30% 20%)" stopOpacity="0" />
            </radialGradient>

            {/* Water reflection gradient */}
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(240 30% 30%)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="hsl(220 35% 25%)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="hsl(240 40% 15%)" stopOpacity="1" />
            </linearGradient>

            {/* Mountain gradients */}
            <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(260 25% 22%)" />
              <stop offset="100%" stopColor="hsl(260 20% 15%)" />
            </linearGradient>
            <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(250 20% 28%)" />
              <stop offset="100%" stopColor="hsl(250 18% 18%)" />
            </linearGradient>
            <linearGradient id="mtn3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(240 18% 32%)" />
              <stop offset="100%" stopColor="hsl(240 15% 22%)" />
            </linearGradient>
            <linearGradient id="mtn4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(230 25% 25%)" />
              <stop offset="100%" stopColor="hsl(230 20% 16%)" />
            </linearGradient>

            {/* Tree gradient */}
            <linearGradient id="treeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160 30% 18%)" />
              <stop offset="100%" stopColor="hsl(160 25% 10%)" />
            </linearGradient>
          </defs>

          {/* Sky glow */}
          <rect width="800" height="500" fill="url(#sunGlow)" />

          {/* Stars */}
          {stars.map((s, i) => (
            <motion.circle
              key={i}
              cx={s.cx}
              cy={s.cy}
              r={s.r}
              fill="white"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Sun / moon */}
          <motion.circle
            cx="400"
            cy="280"
            r="30"
            fill="hsl(40 80% 70%)"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx="400" cy="280" r="50" fill="hsl(40 80% 70%)" opacity="0.08" />
          <circle cx="400" cy="280" r="80" fill="hsl(40 80% 70%)" opacity="0.04" />

          {/* Clouds */}
          {clouds.map((c, i) => (
            <motion.g
              key={i}
              initial={{ x: c.x }}
              animate={{ x: [c.x, c.x + 30, c.x] }}
              transition={{ duration: c.speed, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ellipse cx="0" cy={c.y} rx={35 * c.scale} ry={8 * c.scale} fill="white" opacity="0.06" />
              <ellipse cx={-15 * c.scale} cy={c.y + 3} rx={25 * c.scale} ry={6 * c.scale} fill="white" opacity="0.04" />
              <ellipse cx={15 * c.scale} cy={c.y + 2} rx={20 * c.scale} ry={5 * c.scale} fill="white" opacity="0.05" />
            </motion.g>
          ))}

          {/* Far mountains (layer 1) */}
          <path d="M0,320 L60,240 L120,280 L200,200 L280,260 L350,220 L420,250 L500,190 L560,230 L640,210 L720,240 L800,220 L800,500 L0,500Z"
            fill="url(#mtn1)" opacity="0.7" />

          {/* Mid mountains (layer 2) */}
          <path d="M0,350 L80,280 L150,310 L230,260 L310,300 L400,270 L480,290 L560,250 L650,280 L730,260 L800,290 L800,500 L0,500Z"
            fill="url(#mtn2)" opacity="0.8" />

          {/* Close mountains (layer 3) */}
          <path d="M0,370 L70,310 L160,340 L250,290 L340,330 L430,300 L520,320 L600,290 L700,320 L800,300 L800,500 L0,500Z"
            fill="url(#mtn3)" opacity="0.9" />

          {/* Foreground hills (layer 4) */}
          <path d="M0,390 L50,350 L130,370 L220,340 L320,360 L420,335 L500,355 L580,340 L680,355 L780,345 L800,350 L800,500 L0,500Z"
            fill="url(#mtn4)" />

          {/* Tree silhouettes */}
          {[80, 120, 160, 350, 380, 620, 660, 700, 740].map((x, i) => (
            <polygon
              key={i}
              points={`${x},${375 - (i % 3) * 5} ${x - 6 - i % 3 * 2},${400 + (i % 2) * 5} ${x + 6 + i % 3 * 2},${400 + (i % 2) * 5}`}
              fill="url(#treeGrad)"
              opacity={0.8 - (i % 3) * 0.1}
            />
          ))}

          {/* Water / lake */}
          <rect x="0" y="395" width="800" height="105" fill="url(#waterGrad)" />

          {/* Water shimmer lines */}
          {[400, 410, 420, 435, 450, 465, 480].map((y, i) => (
            <motion.line
              key={i}
              x1={50 + i * 20}
              y1={y}
              x2={90 + i * 20}
              y2={y}
              stroke="white"
              strokeWidth="0.5"
              opacity="0.1"
              animate={{ opacity: [0.05, 0.15, 0.05], x1: [50 + i * 20, 55 + i * 20, 50 + i * 20], x2: [90 + i * 20, 95 + i * 20, 90 + i * 20] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
            />
          ))}

          {/* Mountain reflections in water (mirrored, faded) */}
          <g opacity="0.15" transform="translate(0,790) scale(1,-1)">
            <path d="M0,370 L70,310 L160,340 L250,290 L340,330 L430,300 L520,320 L600,290 L700,320 L800,300 L800,500 L0,500Z"
              fill="hsl(240 18% 32%)" />
          </g>
        </svg>
      </motion.div>

      {/* Ambient particles (fireflies) */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            left: `${10 + (i * 6.3) % 80}%`,
            top: `${30 + (i * 5.7) % 50}%`,
            background: i % 3 === 0 ? 'hsl(45 80% 70%)' : i % 3 === 1 ? 'hsl(180 60% 70%)' : 'hsl(280 50% 70%)',
          }}
          animate={{
            x: [0, (i % 2 === 0 ? 20 : -15), 0, (i % 2 === 0 ? -10 : 15), 0],
            y: [0, (i % 2 === 0 ? -15 : 10), 0, (i % 2 === 0 ? 10 : -20), 0],
            opacity: [0, 0.5, 0.3, 0.6, 0],
            scale: [0.5, 1, 0.8, 1.2, 0.5],
          }}
          transition={{
            duration: 8 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  );
};

export default HeroLandscape;
