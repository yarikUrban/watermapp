import React from "react";
import { Check, CircleAlert } from "lucide-react";

type Props = {
  hydrolyzed: boolean;
};

export const WaterStatusBadge = ({ hydrolyzed }: Props) => {
  const label = hydrolyzed ? "Гидролизуется" : "Не гидролизуется";
  return (
    <div
      className={`w-fit px-2 py-1 flex items-center justify-center gap-1 rounded-sm ${
        hydrolyzed ? "bg-[#EDF5F0]" : "bg-[#F8F0E7]"
      }`}
    >
      <p
        className={`text-xs font-medium ${
          hydrolyzed ? "text-text-accent" : "text-text-warning"
        }`}
      >
        {label}
      </p>
    </div>
  );
};
