import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Sparkles, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-gradient-to-br from-muted/40 via-background to-primary/5">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow">
                <Heart className="h-5 w-5" fill="currentColor" />
              </span>
              <span>HealthBuddy <span className="text-gradient-primary">AI</span></span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Personalized wellness routines and healthy habit tracking for every life stage. Build consistency, detect risks early, and protect your daily streak.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div className="col-span-2 sm:col-span-1">
              <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">Product</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link to="/dashboard" className="link-underline transition-colors hover:text-foreground">Dashboard</Link></li>
                <li><Link to="/assessment" className="link-underline transition-colors hover:text-foreground">Assessment</Link></li>
                <li><Link to="/habits" className="link-underline transition-colors hover:text-foreground">Habit Tracker</Link></li>
                <li><Link to="/coach" className="link-underline transition-colors hover:text-foreground">AI Coach</Link></li>
                <li><Link to="/impact" className="link-underline transition-colors hover:text-foreground">Public Health</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">Company</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link to="/about" className="link-underline transition-colors hover:text-foreground">About</Link></li>
                <li><Link to="/safety" className="link-underline transition-colors hover:text-foreground">Safety Policy</Link></li>
                <li><Link to="/login" className="link-underline transition-colors hover:text-foreground">Login</Link></li>
                <li><Link to="/signup" className="link-underline transition-colors hover:text-foreground">Sign up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold tracking-wide text-foreground">Trust</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Privacy-first design</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>Age-aware guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span>Not a medical device</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {year} HealthBuddy AI. Supporting wellness across all life stages.
          </p>
          <div className="flex items-center gap-2">
            <a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-card/60 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
