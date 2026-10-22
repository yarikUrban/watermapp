"use client";
import { MapPoint } from "@/entities/points";

import PointsList from "../PointsList";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PointDetail } from "../PointDetail";
import { ListAction } from "../ListAction";

type Props = {
  points: MapPoint[];
  handlePointSelected: (p: MapPoint) => void;
  handleClearPoint: () => void;
  currentPoint: MapPoint;
};

export default function MapOverlay({
  points,
  currentPoint,
  handlePointSelected,
  handleClearPoint,
}: Props) {
  const expanded = useMemo(() => {
    return Boolean(currentPoint?.id);
  }, [currentPoint]);

  return (
    <>
      <div className="hidden sm:flex absolute top-0 right-0 bottom-0 bg-white w-[360px] z-[100] flex-col border-l border-l-border-primary">
        {currentPoint?.id ? (
          <div className="sm:max-h-screen pt-[1] sm:pt-[50]">
            <PointDetail handleClear={handleClearPoint} point={currentPoint} />
          </div>
        ) : (
          <>
            <ListAction handleClear={handleClearPoint} />
            <PointsList
              points={points}
              handlePointPress={handlePointSelected}
            />
          </>
        )}
      </div>

      <div
        className={`sm:hidden fixed inset-x-0 bottom-0 z-[100] h-[80vh] bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          expanded ? "translate-y-0" : "translate-y-[calc(100%-52px)]"
        }`}
      >
        {/* Контент: своя прокрутка, высота фиксирована родителем */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {currentPoint?.id ? (
            <PointDetail handleClear={handleClearPoint} point={currentPoint} />
          ) : (
            <>
              <ListAction handleClear={handleClearPoint} />
              <PointsList
                points={points}
                handlePointPress={handlePointSelected}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
