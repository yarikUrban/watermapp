import { MapPoint } from "@/entities/points";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export const useSelectPoint = (points: MapPoint[]) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPointId = searchParams.get("point");

  const currentPoint = useMemo(() => {
    return points.find((e) => String(e.id) == currentPointId);
  }, [points, currentPointId]);

  const handleClearPoint = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("point"); // ← вот этого не хватало

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    window.history.replaceState(null, "", url);
  }, [searchParams, pathname]);

  const handlePointSelected = useCallback(
    (point: MapPoint) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("point", String(point.id));

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      window.history.replaceState(null, "", url);
    },
    [pathname, searchParams],
  );

  return {
    currentPoint,
    handlePointSelected,
    handleClearPoint,
  };
};
