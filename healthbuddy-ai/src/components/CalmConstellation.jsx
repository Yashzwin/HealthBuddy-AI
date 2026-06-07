import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * CalmConstellation – floating dots connected by soft lines with glow.
 * Inspired by aurora / neural-network aesthetics.
 */
const CalmConstellation = ({ className = '', dotCount = 30, color = 'primary' }) => {
  const [dims, setDims] = useState({ w: 800, h: 400 });
  const containerRef = React.useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: width, h: height });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const colorMap = {
    primary: { dot: 'hsl(158 70% 55%)', line: 'hsl(158 60% 50%)', glow: 'hsl(158 70% 60%)' },
    secondary: { dot: 'hsl(199 89% 60%)', line: 'hsl(199 80% 55%)', glow: 'hsl(199 89% 65%)' },
    accent: { dot: 'hsl(24 95% 60%)', line: 'hsl(24 90% 55%)', glow: 'hsl(24 95% 65%)' },
    warm: { dot: 'hsl(340 70% 60%)', line: 'hsl(340 60% 50%)', glow: 'hsl(340 70% 65%)' },
  };
  const c = colorMap[color] || colorMap.primary;

  const dots = useMemo(() =>
    Array.from({ length: dotCount }, (_, i) => ({
      x: (i * 97.3 + 37) % 100,
      y: (i * 61.7 + 23) % 100,
      r: 1.5 + (i % 4) * 0.6,
      driftX: ((i * 13) % 7) - 3,
      driftY: ((i * 17) % 7) - 3,
      dur: 10 + (i % 5) * 3,
      delay: (i * 0.4) % 6,
    })), [dotCount]);

  const lines = useMemo(() => {
    const result = [];
    const threshold = 22;
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < threshold) {
          result.push({ i, j, dist });
        }
      }
    }
    return result;
  }, [dots]);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg viewBox={`0 0 100 100`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <filter id={`constellationGlow-${color}`}>
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Lines */}
        {lines.map((l, i) => (
          <motion.line
            key={`line-${i}`}
            x1={dots[l.i].x}
            y1={dots[l.i].y}
            x2={dots[l.j].x}
            y2={dots[l.j].y}
            stroke={c.line}
            strokeWidth="0.08"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.03, 0.12, 0.03] }}
            transition={{
              duration: 6 + (i % 3),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Dots */}
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r * 0.35}
            fill={c.dot}
            filter={`url(#constellationGlow-${color})`}
            animate={{
              cx: [d.x, d.x + d.driftX * 0.6, d.x],
              cy: [d.y, d.y + d.driftY * 0.6, d.y],
              opacity: [0.3, 0.8, 0.3],
              r: [d.r * 0.3, d.r * 0.4, d.r * 0.3],
            }}
            transition={{
              duration: d.dur,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: d.delay,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export default CalmConstellation;
