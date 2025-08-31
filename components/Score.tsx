import React from "react";

const ScoreCircle = ({ score , size = 60, strokeWidth = 10, color = "lab(59.0978% -58.6621 41.2579)", bgColor = "#374151" }: { score: number, size: number, strokeWidth: number, color: string, bgColor: string }) => {
  // Ensure score stays between 0–100
  const safeScore = Math.max(0, Math.min(100, score));

  // Circle math
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={bgColor}
        fill="transparent"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize={size / 4}
        fill={color}
        fontWeight="bold"
      >
        {safeScore}%
      </text>
    </svg>
  );
};

export default ScoreCircle;