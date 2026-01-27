import { ReactNode } from 'react';
import { StarField } from './StarField';

interface GalaxyLayoutProps {
  children: ReactNode;
}

/**
 * Galaxy-themed layout wrapper.
 * Provides a cosmic background with animated stars.
 */
export function GalaxyLayout({ children }: GalaxyLayoutProps) {
  return (
    <div className="galaxy-layout relative min-h-screen overflow-hidden">
      {/* Galaxy background layers */}
      <div className="galaxy-bg fixed inset-0 z-0" aria-hidden="true">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0a0a1a] via-[#0d0d2b] to-[#1a0a2e]" />
        
        {/* Nebula effect 1 */}
        <div className="nebula-1 absolute inset-0 opacity-40" />
        
        {/* Nebula effect 2 */}
        <div className="nebula-2 absolute inset-0 opacity-30" />
        
        {/* Cosmic dust overlay */}
        <div className="cosmic-dust absolute inset-0 opacity-20" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Animated star field */}
      <StarField />

      {/* Shooting stars (CSS animated) */}
      <div className="shooting-stars fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="shooting-star shooting-star-1" />
        <div className="shooting-star shooting-star-2" />
        <div className="shooting-star shooting-star-3" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
}
