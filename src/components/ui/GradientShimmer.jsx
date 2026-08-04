"use client";

import React, { useMemo } from "react";

/* -------------------------------------------------------------------------- */
/*  Built-in presets                                                           */
/* -------------------------------------------------------------------------- */

export const gradientPresets = {
  sunrise: [
    { color: "#FF66C4", position: 0 },
    { color: "#EC008C", position: 0.2 },
    { color: "#FFFFFF", position: 0.5 },
    { color: "#06B6D4", position: 0.8 },
    { color: "#8B5CF6", position: 1 },
  ],
  bubble: [
    { color: "#F5EBD9", position: 0 },
    { color: "#F2D4DB", position: 0.25 },
    { color: "#FFFFFF", position: 0.5 },
    { color: "#CCBAE3", position: 0.75 },
    { color: "#78B0FF", position: 1 },
  ],
  peach: [
    { color: "#D9F5FA", position: 0 },
    { color: "#FCD9D6", position: 0.3 },
    { color: "#FFFFFF", position: 0.5 },
    { color: "#FCBAC9", position: 0.7 },
    { color: "#F0B3F5", position: 1 },
  ],
  tonic: [
    { color: "#E3EDF0", position: 0 },
    { color: "#E8EBB8", position: 0.3 },
    { color: "#FFFFFF", position: 0.5 },
    { color: "#E8B078", position: 0.7 },
    { color: "#F29682", position: 1 },
  ],
  mint: [
    { color: "#DECEE8", position: 0 },
    { color: "#7DC0FB", position: 0.3 },
    { color: "#FFFFFF", position: 0.5 },
    { color: "#00C7A6", position: 0.8 },
    { color: "#06B6D4", position: 1 },
  ],
  spring: [
    { color: "#F7D5C5", position: 0 },
    { color: "#46A8C0", position: 0.4 },
    { color: "#FFFFFF", position: 0.6 },
    { color: "#43AE7D", position: 1 },
  ],
  twilight: [
    { color: "#E3CCE6", position: 0 },
    { color: "#4E8CD5", position: 0.3 },
    { color: "#FFFFFF", position: 0.5 },
    { color: "#6068C2", position: 0.8 },
    { color: "#EC008C", position: 1 },
  ],
  bay: [
    { color: "#DBE3D0", position: 0 },
    { color: "#8DB8A7", position: 0.3 },
    { color: "#FFFFFF", position: 0.5 },
    { color: "#2D8E9A", position: 0.8 },
    { color: "#262C81", position: 1 },
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
  
  // Continuous repeating seamless gradient loop
  const fullStops = [
    colorList[0],
    ...colorList,
    "#FFFFFF",
    "#FFFFFF",
    ...colorList.slice().reverse(),
    colorList[0]
  ].join(", ");

  return `linear-gradient(${angle}deg, ${fullStops})`;
}

export function GradientShimmer({
  children,
  gradient = "sunrise",
  duration = 2.5,
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
    animation: `gs-shimmer ${duration}s linear infinite`,
    ...style,
  };

  return (
    <>
      <style>{`
        @keyframes gs-shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
      <Component className={className} style={mergedStyle} {...restProps}>
        {children}
      </Component>
    </>
  );
}

export default GradientShimmer;
