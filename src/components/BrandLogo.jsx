import React from 'react';

export const BrandLogo = ({ className = "h-11 w-auto", variant = "white" }) => {
  const logoSrc = variant === "dark" ? "/RAK4CREATIVE-LOGO.png" : "/RAK4CREATIVE-LOGO-WHITE.png";

  return (
    <div className={`inline-flex items-center select-none cursor-pointer group ${className}`}>
      <img 
        src={logoSrc} 
        alt="RAK 4 CREATIVE Logo" 
        className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] drop-shadow-[0_2px_10px_rgba(236,0,140,0.25)]"
      />
    </div>
  );
};

export default BrandLogo;
