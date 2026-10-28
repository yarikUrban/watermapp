"use client";

import type { MapPoint } from "@/entities/points";
import { AddPointProvider } from "@/features/addPoint/model/AddPointContext";
import { useSelectPoint } from "@/features/selectPoint/model/useSelectPoint";
import { MapWrapper } from "../DgisMap/MapWrapper";
import MapOverlay from "./MapOverlay";

export default function MapContainer({ points }: { points: MapPoint[] }) {
  const { handlePointSelected, handleClearPoint, currentPoint } =
    useSelectPoint(points);

  return (
    <AddPointProvider>
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
    </AddPointProvider>
  );
}
