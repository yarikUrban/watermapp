"use client";

import { useSearchParams } from "next/navigation";
import DgisMap from "../DgisMap";
import MapOverlay from "./MapOverlay";

import { MapPoint } from "@/entities/points";
import { useSelectPoint } from "@/features/selectPoint/model/useSelectPoint";
import { MapWrapper } from "../DgisMap/MapWrapper";

export default function MapContainer({ points }: { points: MapPoint[] }) {
  const { handlePointSelected, handleClearPoint, currentPoint } =
    useSelectPoint(points);

  return (
    <div
      style={{
        borderRadius: "12px",
        overflow: "hidden",
      }}
      className="h-screen"
    >
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
