import React from 'react';

export const BrandLogo = ({ className = "h-11 w-auto", variant = "default" }) => {
  return (
    <div className={`inline-flex items-center select-none cursor-pointer group ${className}`}>
      <img 
        src="/RAK4CREATIVE-LOGO.png" 
        alt="RAK 4 CREATIVE Logo" 
        className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
};

export default BrandLogo;
