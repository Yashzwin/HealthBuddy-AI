import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const THEMES = [
  { id: 'default', label: 'Ocean', color: 'hsl(158 64% 40%)', color2: 'hsl(199 89% 48%)' },
  { id: 'sunset', label: 'Sunset', color: 'hsl(350 70% 52%)', color2: 'hsl(42 90% 55%)' },
  { id: 'aurora', label: 'Aurora', color: 'hsl(270 60% 48%)', color2: 'hsl(170 55% 42%)' },
  { id: 'midnight', label: 'Midnight', color: 'hsl(225 70% 55%)', color2: 'hsl(260 60% 55%)' },
  { id: 'forest', label: 'Forest', color: 'hsl(145 55% 35%)', color2: 'hsl(85 50% 40%)' },
  { id: 'rose', label: 'Rose', color: 'hsl(335 60% 50%)', color2: 'hsl(45 80% 50%)' },
];

const getStoredColorTheme = () => {
  try { return localStorage.getItem('hb-color-theme') || 'default'; } catch { return 'default'; }
};

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [colorTheme, setColorTheme] = useState(getStoredColorTheme);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    THEMES.forEach(t => root.classList.remove(`theme-${t.id}`));
    if (colorTheme !== 'default') root.classList.add(`theme-${colorTheme}`);
    try { localStorage.setItem('hb-color-theme', colorTheme); } catch {}
  }, [colorTheme]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-full"
        onClick={() => setOpen(o => !o)}
        aria-label="Change theme"
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className="h-4 w-4" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-elevated backdrop-blur-xl"
          >
            {/* Dark mode toggle */}
            <div className="border-b border-border/40 px-3 py-2.5">
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                <div className="ml-auto h-5 w-9 rounded-full bg-muted transition-colors" style={{ position: 'relative' }}>
                  <motion.div
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-primary"
                    animate={{ left: isDark ? 18 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>
            </div>

            {/* Color themes */}
            <div className="px-3 py-2.5">
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Color Theme</p>
              <div className="space-y-0.5">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setColorTheme(t.id); setOpen(false); }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <div className="relative h-5 w-5 shrink-0">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color2})` }}
                      />
                      {colorTheme === t.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </div>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
