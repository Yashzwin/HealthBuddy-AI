import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const SimpleTabsContext = createContext(null);

export const SimpleTabs = ({ defaultValue, value, onValueChange, children, className }) => {
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;

  const setValue = (next) => {
    if (value === undefined) setInternal(next);
    if (onValueChange) onValueChange(next);
  };

  return (
    <SimpleTabsContext.Provider value={{ value: current, setValue }}>
      <div className={cn('w-full', className)}>{children}</div>
    </SimpleTabsContext.Provider>
  );
};

export const SimpleTabsList = ({ children, className }) => {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-auto items-center justify-start gap-1 rounded-2xl border border-border/60 bg-card/70 p-1.5 backdrop-blur',
        className
      )}
    >
      {children}
    </div>
  );
};

export const SimpleTabsTrigger = ({ value, children, className }) => {
  const ctx = useContext(SimpleTabsContext);
  const active = ctx?.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => ctx?.setValue(value)}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-medium transition-all',
        active
          ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow'
          : 'text-foreground/70 hover:bg-muted hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  );
};

export const SimpleTabsContent = ({ value, children, className }) => {
  const ctx = useContext(SimpleTabsContext);
  if (ctx?.value !== value) return null;
  return (
    <div role="tabpanel" className={cn('mt-2', className)}>
      {children}
    </div>
  );
};
