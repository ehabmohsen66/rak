"use client";

import React, { useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*  Built-in presets                                                           */
/* -------------------------------------------------------------------------- */

export const gradientPresets = {
  sunrise: [
    { color: "#EC008C", position: 0 },
    { color: "#F43F5E", position: 0.35 },
    { color: "#FB7185", position: 0.5 },
    { color: "#D946EF", position: 0.75 },
    { color: "#EC008C", position: 1 },
  ],
  brand: [
    { color: "#EC008C", position: 0 },
    { color: "#FA4D9C", position: 0.4 },
    { color: "#FB7185", position: 0.7 },
    { color: "#EC008C", position: 1 },
  ],
  bubble: [
    { color: "#EC008C", position: 0 },
    { color: "#C084FC", position: 0.5 },
    { color: "#EC008C", position: 1 },
  ],
  peach: [
    { color: "#F43F5E", position: 0 },
    { color: "#FB923C", position: 0.5 },
    { color: "#F43F5E", position: 1 },
  ],
  tonic: [
    { color: "#EC008C", position: 0 },
    { color: "#E879F9", position: 0.5 },
    { color: "#EC008C", position: 1 },
  ],
  mint: [
    { color: "#06B6D4", position: 0 },
    { color: "#10B981", position: 0.5 },
    { color: "#06B6D4", position: 1 },
  ],
  spring: [
    { color: "#EC008C", position: 0 },
    { color: "#FB7185", position: 0.5 },
    { color: "#EC008C", position: 1 },
  ],
  twilight: [
    { color: "#8B5CF6", position: 0 },
    { color: "#EC008C", position: 0.5 },
    { color: "#8B5CF6", position: 1 },
  ],
  bay: [
    { color: "#3B82F6", position: 0 },
    { color: "#06B6D4", position: 0.5 },
    { color: "#3B82F6", position: 1 },
  ],
};

function resolveStops(gradient) {
  if (!gradient) return gradientPresets.sunrise;
  if (typeof gradient === "string")
    return gradientPresets[gradient] ?? gradientPresets.sunrise;
  return gradient;
}

export function buildBandGradient(stops, angle = 110) {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const colorList = sorted.map((s) => s.color);
  
  // Continuous smooth repeating seamless gradient loop
  const fullStops = [
    colorList[0],
    ...colorList,
    ...colorList.slice().reverse(),
    colorList[0]
  ].join(", ");

  return `linear-gradient(${angle}deg, ${fullStops})`;
}

export function GradientShimmer({
  children,
  gradient = "sunrise",
  duration = 6,
  angle = 110,
  as: Component = "span",
  className = "",
  style = {},
  ...restProps
}) {
  const stops = useMemo(() => resolveStops(gradient), [gradient]);
  const backgroundImage = useMemo(
    () => buildBandGradient(stops, angle),
    [stops, angle]
  );

  const mergedStyle = {
    display: "inline-block",
    backgroundImage,
    backgroundSize: "200% 100%",
    backgroundRepeat: "repeat-x",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    animation: `gs-shimmer ${duration}s ease-in-out infinite alternate`,
    ...style,
  };

  return (
    <>
      <style>{`
        @keyframes gs-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
      <Component className={className} style={mergedStyle} {...restProps}>
        {children}
      </Component>
    </>
  );
}

export default GradientShimmer;
