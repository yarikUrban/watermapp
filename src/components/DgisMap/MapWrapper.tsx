import { MapPoint } from "@/entities/points";
import React from "react";
import DgisMap from ".";

type Props = {
  points: MapPoint[];
  selectedPointId: string | null;
  handlePointPress: (point: MapPoint) => void;
};

export const MapWrapper = ({
  points,
  selectedPointId,
  handlePointPress,
}: Props) => {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-gray-100 sm:bottom-0 sm:left-0 sm:right-[360px] sm:top-[58px] sm:h-auto sm:w-auto">
      <DgisMap
        selectedPointId={selectedPointId}
        points={points}
        handlePointPress={handlePointPress}
      />
    </div>
  );
};
