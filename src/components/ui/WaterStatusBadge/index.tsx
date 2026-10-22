import React from "react";
import { Check, CircleAlert } from "lucide-react";

type Props = {
  status: "normal" | "warning";
};

export const WaterStatusBadge = ({ status = "normal" }: Props) => {
  return (
    <div
      className={`w-fit px-2 py-1 flex items-center justify-center gap-1 rounded-sm ${status === "normal" ? "bg-[#EDF5F0]" : "bg-[#F8F0E7]"}`}
    >
      <div>
        {status === "normal" ? (
          <Check className="text-icon-accent" size={16} />
        ) : (
          <CircleAlert className="text-icon-warning" size={16} />
        )}
      </div>
      <p
        className={`text-xs font-medium ${status === "normal" ? "text-text-accent" : "text-text-warning"}`}
      >
        normal
      </p>
    </div>
  );
};
