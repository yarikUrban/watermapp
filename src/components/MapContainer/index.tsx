"use client";

import MapOverlay from "./MapOverlay";

import type { MapPoint } from "@/entities/points";
import { useSelectPoint } from "@/features/selectPoint/model/useSelectPoint";
import { MapWrapper } from "../DgisMap/MapWrapper";

export default function MapContainer({ points }: { points: MapPoint[] }) {
  const { handlePointSelected, handleClearPoint, currentPoint } =
    useSelectPoint(points);

  return (
    <div className="relative h-dvh min-h-dvh w-full overflow-hidden sm:h-screen sm:min-h-0">
      <MapWrapper
        selectedPointId={String(currentPoint?.id) ?? null}
        points={points}
        handlePointPress={handlePointSelected}
      />
      <MapOverlay
        currentPoint={currentPoint}
        points={points}
        handlePointSelected={handlePointSelected}
        handleClearPoint={handleClearPoint}
      />
    </div>
  );
}
