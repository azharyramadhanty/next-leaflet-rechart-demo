import React from "react";

type ProgressBarProps = {
  value: number; // Progress value (0 to 100)
  max?: number;  // Optional max value (default 100)
};

const ProgressBarGeneral: React.FC<ProgressBarProps> = ({ value, max = 100 }) => {
  const percentage = Math.min((value / max) * 100, 100); // Ensure max 100%

  return (
    <div className="w-full bg-[#CCEAFF] rounded-full h-[0.3rem]">
      <div
        className="bg-[#0096FF] h-full rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBarGeneral;