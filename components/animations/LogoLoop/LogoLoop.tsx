import { useEffect, useRef, useState } from 'react';
import './LogoLoop.css';

interface LogoLoopProps {
  logos: { node: React.ReactNode; title: string }[];
  speed?: number; // animation duration in seconds for one full loop
  direction?: 'left' | 'right';
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number; // slowed down speed in seconds
  fadeOut?: boolean; // apply fade masks to edges
  scaleOnHover?: boolean; // individual logos scale up when hovered
  ariaLabel?: string;
}

export default function LogoLoop({
  logos,
  speed = 30,
  direction = 'left',
  logoHeight = 40,
  gap = 48,
  hoverSpeed = 60,
  fadeOut = true,
  scaleOnHover = true,
  ariaLabel = 'Technology stack',
}: LogoLoopProps) {
  const [isHovered, setIsHovered] = useState(false);

  const animationStyle = {
    '--loop-speed': `${isHovered ? hoverSpeed : speed}s`,
    '--loop-gap': `${gap}px`,
    '--logo-height': `${logoHeight}px`,
    '--loop-direction': direction === 'left' ? 'normal' : 'reverse',
  } as React.CSSProperties;

  return (
    <section 
      className={`logo-loop-container ${fadeOut ? 'logo-loop-fade' : ''}`}
      aria-label={ariaLabel}
      style={animationStyle}
    >
      <div 
        className="logo-loop-track"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        {/* Render 3 copies for seamless infinite looping */}
        {[0, 1, 2].map((groupIndex) => (
          <div className="logo-group" key={groupIndex}>
            {logos.map((logo, index) => (
              <div 
                key={`${logo.title}-${index}`} 
                className={`logo-item ${scaleOnHover ? 'logo-hover-scale' : ''}`}
                title={logo.title}
                aria-label={logo.title}
              >
                {logo.node}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
