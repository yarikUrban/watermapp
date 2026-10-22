import { Map } from "lucide-react";
import React from "react";

export const MapLoader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="h-10 w-10 rounded-full bg-brand animate-pulse">
        <Map size={62} className="text-icon-primary" />
      </div>
    </div>
  );
};
