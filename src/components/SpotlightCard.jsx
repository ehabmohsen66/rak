import React, { useRef, useState } from 'react';

export const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(236, 0, 140, 0.25)',
  borderColor = 'rgba(236, 0, 140, 0.4)',
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl glass-card transition-all duration-300 ${
        isHovered ? 'shadow-card-hover -translate-y-1' : ''
      } ${className}`}
      style={{
        borderColor: isHovered ? borderColor : undefined,
      }}
      {...props}
    >
      {/* Interactive Cursor Radial Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />

      {/* Subtle Specular Ambient Highlight */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />

      {/* Card Contents */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};

export default SpotlightCard;
