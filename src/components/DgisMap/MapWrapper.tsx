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
    <div className="w-full h-full max-w-[calc(100%-360px)] mt-[58px] bg-gray-100">
      <DgisMap
        selectedPointId={selectedPointId}
        points={points}
        handlePointPress={handlePointPress}
      />
    </div>
  );
};
