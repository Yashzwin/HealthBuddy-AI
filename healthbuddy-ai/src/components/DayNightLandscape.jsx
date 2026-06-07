import React, { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DayNightLandscape – an SVG mountain scene that smoothly transitions
 * between night (moon, stars, deep purple sky) and day (sun, birds, bright sky).
 *
 * variant="full"   → hero section (fireflies, full opacity)
 * variant="subtle" → inner pages (low opacity, no fireflies, shorter)
 */
const DayNightLandscape = ({ className = '', variant = 'full' }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const stars = useMemo(() =>
    Array.from({ length: 45 }, (_, i) => ({
      cx: (i * 37.7) % 800,
      cy: 8 + ((i * 23.3) % 140),
      r: 0.4 + (i % 3) * 0.35,
      delay: (i * 0.25) % 4,
      dur: 1.8 + (i % 3) * 0.8,
    })), []);

  const clouds = useMemo(() => [
    { x: 40, y: 55, scale: 1, speed: 100 },
    { x: 220, y: 35, scale: 0.7, speed: 80 },
    { x: 480, y: 65, scale: 0.85, speed: 120 },
    { x: 680, y: 40, scale: 0.6, speed: 90 },
  ], []);

  const birds = useMemo(() => [
    { x: 120, y: 90, delay: 0, speed: 18 },
    { x: 350, y: 70, delay: 3, speed: 22 },
    { x: 580, y: 100, delay: 6, speed: 20 },
  ], []);

  const isSubtle = variant === 'subtle';

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-all duration-[2000ms] ${className}`}
      style={{ opacity: isSubtle ? 0.55 : 1 }}
    >
      {/* ── Sky gradient (transitions smoothly between night/day) ── */}
      <div
        className="absolute inset-0 transition-all duration-[2500ms] ease-in-out"
        style={{
          background: isDark
            ? `linear-gradient(180deg,
                hsl(260 30% 10%) 0%,
                hsl(270 35% 16%) 12%,
                hsl(280 40% 22%) 28%,
                hsl(310 30% 30%) 45%,
                hsl(25 55% 48%) 68%,
                hsl(35 65% 58%) 82%,
                hsl(45 75% 68%) 100%)`
            : `linear-gradient(180deg,
                hsl(200 55% 72%) 0%,
                hsl(195 50% 78%) 15%,
                hsl(190 45% 82%) 30%,
                hsl(180 40% 88%) 50%,
                hsl(160 35% 88%) 68%,
                hsl(140 30% 85%) 82%,
                hsl(120 25% 82%) 100%)`,
        }}
      />

      {/* ── SVG scene (pans slowly) ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, isSubtle ? -40 : -80, 0] }}
        transition={{ duration: isSubtle ? 45 : 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-[120%]"
          style={{ minWidth: '120%' }}
        >
          <defs>
            {/* Sky glow — changes with theme */}
            <radialGradient id="dn-skyGlow" cx="50%" cy="70%" r="40%">
              <motion.stop
                offset="0%"
                animate={{ stopColor: isDark ? 'hsl(40 85% 70%)' : 'hsl(45 95% 80%)' }}
                transition={{ duration: 2 }}
                stopOpacity={isDark ? 0.5 : 0.6}
              />
              <motion.stop
                offset="50%"
                animate={{ stopColor: isDark ? 'hsl(30 70% 50%)' : 'hsl(40 80% 70%)' }}
                transition={{ duration: 2 }}
                stopOpacity={isDark ? 0.2 : 0.3}
              />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Water gradients */}
            <linearGradient id="dn-waterDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(240 30% 28%)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="hsl(240 40% 14%)" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="dn-waterLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(195 40% 65%)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="hsl(200 35% 55%)" stopOpacity="0.9" />
            </linearGradient>

            {/* Mountain gradients — night */}
            <linearGradient id="dn-m1n" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(260 25% 20%)" />
              <stop offset="100%" stopColor="hsl(260 20% 13%)" />
            </linearGradient>
            <linearGradient id="dn-m2n" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(250 20% 26%)" />
              <stop offset="100%" stopColor="hsl(250 18% 16%)" />
            </linearGradient>
            <linearGradient id="dn-m3n" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(240 18% 30%)" />
              <stop offset="100%" stopColor="hsl(240 15% 20%)" />
            </linearGradient>
            <linearGradient id="dn-m4n" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(230 25% 23%)" />
              <stop offset="100%" stopColor="hsl(230 20% 14%)" />
            </linearGradient>

            {/* Mountain gradients — day */}
            <linearGradient id="dn-m1d" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(210 20% 60%)" />
              <stop offset="100%" stopColor="hsl(210 18% 50%)" />
            </linearGradient>
            <linearGradient id="dn-m2d" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160 18% 55%)" />
              <stop offset="100%" stopColor="hsl(160 15% 45%)" />
            </linearGradient>
            <linearGradient id="dn-m3d" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(145 20% 50%)" />
              <stop offset="100%" stopColor="hsl(145 16% 40%)" />
            </linearGradient>
            <linearGradient id="dn-m4d" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(130 22% 42%)" />
              <stop offset="100%" stopColor="hsl(130 18% 34%)" />
            </linearGradient>

            {/* Snow cap */}
            <linearGradient id="dn-snow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.9" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            {/* Tree gradient */}
            <linearGradient id="dn-treeDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160 30% 16%)" />
              <stop offset="100%" stopColor="hsl(160 25% 8%)" />
            </linearGradient>
            <linearGradient id="dn-treeLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(140 35% 30%)" />
              <stop offset="100%" stopColor="hsl(140 30% 22%)" />
            </linearGradient>

            {/* Sun glow filter */}
            <filter id="dn-sunBlur">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id="dn-moonBlur">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          {/* Sky glow */}
          <rect width="800" height="500" fill="url(#dn-skyGlow)" />

          {/* ── STARS (visible in dark, fade out in light) ── */}
          <AnimatePresence>
            {isDark && stars.map((s, i) => (
              <motion.circle
                key={`star-${i}`}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill="white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.15, 0.75, 0.15] }}
                exit={{ opacity: 0 }}
                transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </AnimatePresence>

          {/* ── MOON (dark mode) ── */}
          <motion.g
            animate={{
              opacity: isDark ? 1 : 0,
              y: isDark ? 0 : 30,
            }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          >
            <circle cx="620" cy="100" r="35" fill="hsl(210 20% 92%)" filter="url(#dn-moonBlur)" opacity="0.3" />
            <circle cx="620" cy="100" r="24" fill="hsl(210 15% 90%)" opacity="0.5" />
            <circle cx="620" cy="100" r="18" fill="hsl(220 10% 95%)" />
            {/* Moon craters */}
            <circle cx="614" cy="95" r="3" fill="hsl(215 8% 85%)" opacity="0.4" />
            <circle cx="625" cy="103" r="2" fill="hsl(215 8% 85%)" opacity="0.3" />
            <circle cx="618" cy="107" r="1.5" fill="hsl(215 8% 85%)" opacity="0.25" />
          </motion.g>

          {/* ── SUN (light mode) ── */}
          <motion.g
            animate={{
              opacity: isDark ? 0 : 1,
              y: isDark ? 40 : 0,
            }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          >
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.line
                key={`ray-${i}`}
                x1={180 + Math.cos(angle * Math.PI / 180) * 38}
                y1={110 + Math.sin(angle * Math.PI / 180) * 38}
                x2={180 + Math.cos(angle * Math.PI / 180) * 55}
                y2={110 + Math.sin(angle * Math.PI / 180) * 55}
                stroke="hsl(45 90% 65%)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
            <circle cx="180" cy="110" r="40" fill="hsl(45 95% 70%)" filter="url(#dn-sunBlur)" opacity="0.4" />
            <circle cx="180" cy="110" r="26" fill="hsl(45 90% 72%)" opacity="0.6" />
            <circle cx="180" cy="110" r="18" fill="hsl(48 95% 78%)" />
          </motion.g>

          {/* ── CLOUDS ── */}
          {clouds.map((c, i) => (
            <motion.g
              key={`cloud-${i}`}
              initial={{ x: c.x }}
              animate={{ x: [c.x, c.x + 35, c.x] }}
              transition={{ duration: c.speed, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.ellipse
                cx="0" cy={c.y}
                rx={38 * c.scale} ry={9 * c.scale}
                animate={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)' }}
                transition={{ duration: 2 }}
              />
              <motion.ellipse
                cx={-16 * c.scale} cy={c.y + 3}
                rx={26 * c.scale} ry={7 * c.scale}
                animate={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.5)' }}
                transition={{ duration: 2 }}
              />
              <motion.ellipse
                cx={16 * c.scale} cy={c.y + 2}
                rx={22 * c.scale} ry={6 * c.scale}
                animate={{ fill: isDark ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.6)' }}
                transition={{ duration: 2 }}
              />
            </motion.g>
          ))}

          {/* ── BIRDS (day mode only) ── */}
          <AnimatePresence>
            {!isDark && birds.map((b, i) => (
              <motion.g
                key={`bird-${i}`}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: [b.x - 20, b.x + 200, b.x + 400], opacity: [0, 0.7, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: b.speed, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path
                  d={`M 0,${b.y} Q 4,${b.y - 6} 8,${b.y} M 0,${b.y} Q -4,${b.y - 6} -8,${b.y}`}
                  stroke="hsl(210 30% 35%)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </motion.g>
            ))}
          </AnimatePresence>

          {/* ── MOUNTAINS (4 layers) ── */}
          <motion.path
            d="M0,320 L60,238 L120,278 L200,195 L280,258 L350,218 L420,248 L500,188 L560,228 L640,208 L720,238 L800,218 L800,500 L0,500Z"
            animate={{ fill: isDark ? 'url(#dn-m1n)' : 'url(#dn-m1d)' }}
            transition={{ duration: 2 }}
            opacity="0.7"
          />
          {/* Snow caps on far mountains */}
          <motion.g
            animate={{ opacity: isDark ? 0.15 : 0.4 }}
            transition={{ duration: 2 }}
          >
            <path d="M200,195 L195,210 L205,210Z" fill="white" />
            <path d="M500,188 L494,205 L506,205Z" fill="white" />
            <path d="M640,208 L635,222 L645,222Z" fill="white" />
          </motion.g>

          <motion.path
            d="M0,350 L80,278 L150,308 L230,258 L310,298 L400,268 L480,288 L560,248 L650,278 L730,258 L800,288 L800,500 L0,500Z"
            animate={{ fill: isDark ? 'url(#dn-m2n)' : 'url(#dn-m2d)' }}
            transition={{ duration: 2 }}
            opacity="0.8"
          />

          <motion.path
            d="M0,370 L70,308 L160,338 L250,288 L340,328 L430,298 L520,318 L600,288 L700,318 L800,298 L800,500 L0,500Z"
            animate={{ fill: isDark ? 'url(#dn-m3n)' : 'url(#dn-m3d)' }}
            transition={{ duration: 2 }}
            opacity="0.9"
          />

          <motion.path
            d="M0,390 L50,350 L130,370 L220,340 L320,360 L420,335 L500,355 L580,340 L680,355 L780,345 L800,350 L800,500 L0,500Z"
            animate={{ fill: isDark ? 'url(#dn-m4n)' : 'url(#dn-m4d)' }}
            transition={{ duration: 2 }}
          />

          {/* ── TREE SILHOUETTES ── */}
          {[80, 120, 160, 350, 380, 620, 660, 700, 740].map((x, i) => (
            <motion.polygon
              key={`tree-${i}`}
              points={`${x},${375 - (i % 3) * 5} ${x - 6 - i % 3 * 2},${400 + (i % 2) * 5} ${x + 6 + i % 3 * 2},${400 + (i % 2) * 5}`}
              animate={{ fill: isDark ? 'url(#dn-treeDark)' : 'url(#dn-treeLight)' }}
              transition={{ duration: 2 }}
              opacity={0.8 - (i % 3) * 0.1}
            />
          ))}

          {/* ── WATER / LAKE ── */}
          <motion.rect
            x="0" y="395" width="800" height="105"
            animate={{ fill: isDark ? 'url(#dn-waterDark)' : 'url(#dn-waterLight)' }}
            transition={{ duration: 2 }}
          />

          {/* Water shimmer lines */}
          {[400, 412, 424, 438, 452, 466, 480].map((y, i) => (
            <motion.line
              key={`shimmer-${i}`}
              x1={50 + i * 22}
              y1={y}
              x2={95 + i * 22}
              y2={y}
              strokeWidth="0.6"
              strokeLinecap="round"
              animate={{
                stroke: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)',
                opacity: [0.04, 0.15, 0.04],
                x1: [50 + i * 22, 56 + i * 22, 50 + i * 22],
                x2: [95 + i * 22, 101 + i * 22, 95 + i * 22],
              }}
              transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
            />
          ))}

          {/* Sun/moon reflection in water */}
          <motion.circle
            animate={{
              cx: isDark ? 620 : 180,
              cy: 420,
              r: isDark ? 12 : 14,
              fill: isDark ? 'rgba(200,210,230,0.15)' : 'rgba(255,220,100,0.2)',
            }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />

          {/* Mountain reflections in water */}
          <motion.g
            animate={{ opacity: isDark ? 0.1 : 0.15 }}
            transition={{ duration: 2 }}
            transform="translate(0,790) scale(1,-1)"
          >
            <path d="M0,370 L70,308 L160,338 L250,288 L340,328 L430,298 L520,318 L600,288 L700,318 L800,298 L800,500 L0,500Z"
              fill={isDark ? 'hsl(240 18% 30%)' : 'hsl(180 15% 55%)'} />
          </motion.g>
        </svg>
      </motion.div>

      {/* ── FIREFLIES (dark mode only, full variant only) ── */}
      {variant === 'full' && (
        <AnimatePresence>
          {isDark && Array.from({ length: 12 }, (_, i) => (
            <motion.div
              key={`fly-${i}`}
              className="absolute rounded-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.5, 0.3, 0.6, 0],
                x: [0, (i % 2 === 0 ? 18 : -14), 0, (i % 2 === 0 ? -8 : 12), 0],
                y: [0, (i % 2 === 0 ? -12 : 8), 0, (i % 2 === 0 ? 8 : -16), 0],
                scale: [0.5, 1, 0.8, 1.1, 0.5],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 7 + i * 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.6,
              }}
              style={{
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                left: `${12 + (i * 6.8) % 76}%`,
                top: `${32 + (i * 5.3) % 45}%`,
                background: i % 3 === 0 ? 'hsl(45 85% 70%)' : i % 3 === 1 ? 'hsl(180 60% 65%)' : 'hsl(280 50% 65%)',
              }}
            />
          ))}
        </AnimatePresence>
      )}

      {/* ── BUTTERFLIES (day mode only, full variant only) ── */}
      {variant === 'full' && (
        <AnimatePresence>
          {!isDark && Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={`butterfly-${i}`}
              className="absolute pointer-events-none"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{
                opacity: [0, 0.5, 0.3, 0.6, 0],
                x: [0, 30 + i * 5, -20, 15, 0],
                y: [0, -25 + i * 3, 10, -15, 0],
                rotate: [0, 15, -10, 8, 0],
                scale: [0.3, 0.8, 0.6, 0.9, 0.3],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 1.5,
              }}
              style={{
                width: 6,
                height: 6,
                left: `${15 + (i * 13) % 70}%`,
                top: `${25 + (i * 9) % 40}%`,
              }}
            >
              {/* Simple butterfly shape */}
              <svg viewBox="0 0 12 12" className="w-full h-full">
                <ellipse cx="4" cy="4" rx="3" ry="4" fill={i % 2 === 0 ? 'hsl(330 50% 65%)' : 'hsl(200 50% 65%)'} opacity="0.7" />
                <ellipse cx="8" cy="4" rx="3" ry="4" fill={i % 2 === 0 ? 'hsl(330 50% 65%)' : 'hsl(200 50% 65%)'} opacity="0.7" />
                <line x1="6" y1="1" x2="6" y2="11" stroke="hsl(0 0% 30%)" strokeWidth="0.5" opacity="0.4" />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default DayNightLandscape;
