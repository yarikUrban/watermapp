"use client";

import { useEffect, useRef, useState } from "react";
import { load } from "@2gis/mapgl";
import type { MapPoint } from "@/entities/points";
import { MapLoader } from "./MapLoader";
import { useAddPointContext } from "@/features/addPoint/model/AddPointContext";

type IProps = {
  points: MapPoint[];
  selectedPointId: string | null;
  handlePointPress: (point: MapPoint) => void;
};

type MapGLApi = Awaited<ReturnType<typeof load>>;
type MapInstance = InstanceType<MapGLApi["Map"]>;
type MarkerInstance = InstanceType<MapGLApi["Marker"]>;

type MarkerData = {
  marker: MarkerInstance;
  point: MapPoint;
};

const NORMAL_ICON = "/icons/mapMarker.svg";
const SELECTED_ICON = "/icons/mapMarkerPoison.svg";

const NORMAL_SIZE: [number, number] = [18, 18];
const SELECTED_SIZE: [number, number] = [24, 24];

export default function DgisMap({
  points,
  selectedPointId,
  handlePointPress,
}: IProps) {
  const { handleMapClick, isAddingPoint, values } = useAddPointContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMapClickRef = useRef(handleMapClick);

  const mapRef = useRef<MapInstance | null>(null);

  const markersRef = useRef<Map<string, MarkerData>>(new Map());
  const draftMarkerRef = useRef<MarkerInstance | null>(null);

  const previousSelectedIdRef = useRef<string | null>(null);

  const [mapgl, setMapgl] = useState<MapGLApi | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  useEffect(() => {
    handleMapClickRef.current = handleMapClick;
  }, [handleMapClick]);

  // 1. Инициализируем карту один раз.
  useEffect(() => {
    let cancelled = false;
    let createdMap: MapInstance | null = null;

    async function initMap() {
      try {
        const api = await load();

        if (cancelled || !containerRef.current) return;

        const map = new api.Map(containerRef.current, {
          center: [76.922349, 43.244024],
          zoom: 13,
          rotation: 0,
          pitch: 0,
          disablePitchByUserInteraction: true,
          disableRotationByUserInteraction: true,
          key: process.env.NEXT_PUBLIC_2GIS_MAPGL_KEY!,
        });

        map.on("click", (event) => {
          const [longitude, latitude] = event.lngLat;
          handleMapClickRef.current(longitude, latitude);
        });
        createdMap = map;
        mapRef.current = map;

        setMapgl(api);
        setIsMapReady(true);
      } catch (error) {
        console.error("Failed to initialize 2GIS map:", error);
      }
    }

    void initMap();

    return () => {
      cancelled = true;

      markersRef.current.forEach(({ marker }) => {
        marker.destroy();
      });

      markersRef.current.clear();
      draftMarkerRef.current?.destroy();
      draftMarkerRef.current = null;
      previousSelectedIdRef.current = null;

      createdMap?.destroy();

      if (mapRef.current === createdMap) {
        mapRef.current = null;
      }
    };
  }, []);

  // Show the draft marker only while adding a point with valid coordinates.
  useEffect(() => {
    const map = mapRef.current;
    if (!isMapReady || !map || !mapgl) return;

    if (!isAddingPoint) {
      draftMarkerRef.current?.hide();
      return;
    }

    const latitude = Number(values.latitude);
    const longitude = Number(values.longitude);
    if (!values.latitude || !values.longitude || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      draftMarkerRef.current?.hide();
      return;
    }

    if (!draftMarkerRef.current) {
      draftMarkerRef.current = new mapgl.Marker(map, {
        coordinates: [longitude, latitude],
        icon: SELECTED_ICON,
        size: SELECTED_SIZE,
      });
    } else {
      draftMarkerRef.current.setCoordinates([longitude, latitude]);
    }
    draftMarkerRef.current.show();
  }, [isAddingPoint, isMapReady, mapgl, values.latitude, values.longitude]);

  // 2. Создаём маркеры.
  // Этот эффект не зависит от selectedPointId.
  useEffect(() => {
    const map = mapRef.current;

    if (!isMapReady || !map || !mapgl) return;

    markersRef.current.forEach(({ marker }) => {
      marker.destroy();
    });

    markersRef.current.clear();

    for (const point of points) {
      const id = String(point.id);

      const marker = new mapgl.Marker(map, {
        coordinates: [point.longitude, point.latitude],
        icon: NORMAL_ICON,
        size: NORMAL_SIZE,
      });

      marker.on("click", () => {
        handlePointPress(point);
      });

      markersRef.current.set(id, {
        marker,
        point,
      });
    }

    map.on("styleload", () => {
      console.log("STLELOAD");
      setIsMapLoaded(true);
    });
    // Если список точек изменился, пересоздаём только
    // маркеры этого списка при следующем запуске эффекта.
    return () => {
      markersRef.current.forEach(({ marker }) => {
        marker.destroy();
      });

      markersRef.current.clear();
      previousSelectedIdRef.current = null;
    };
  }, [points, handlePointPress, isMapReady, mapgl]);

  // 3. Меняем только предыдущий и новый выбранный маркеры.
  useEffect(() => {
    if (!isMapReady) return;

    const previousId = previousSelectedIdRef.current;

    // Снимаем выделение с предыдущего маркера.
    if (previousId !== null) {
      const previousMarker = markersRef.current.get(previousId);

      previousMarker?.marker.setIcon({
        icon: NORMAL_ICON,
        size: NORMAL_SIZE,
      });
    }

    // Выделяем новый маркер.
    if (selectedPointId !== null) {
      const selectedMarker = markersRef.current.get(selectedPointId);

      selectedMarker?.marker.setIcon({
        icon: SELECTED_ICON,
        size: SELECTED_SIZE,
      });
    }

    previousSelectedIdRef.current = selectedPointId;
  }, [selectedPointId, isMapReady, points]);

  return (
    <>
      {!isMapLoaded && <MapLoader />}
      <div ref={containerRef} className="h-full w-full overflow-hidden" />
    </>
  );
}
