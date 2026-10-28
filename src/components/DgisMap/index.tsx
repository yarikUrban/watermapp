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

const HYDROLYZED_ICON = "/icons/mapMarker.svg";
const NOT_HYDROLYZED_ICON = "/icons/mapMarkerPoison.svg";
const ADDING_ICON = "/icons/addingMarker.svg";

const DEFAULT_SIZE: [number, number] = [18, 18];
const SELECTED_SIZE: [number, number] = [24, 24];
const ADDING_SIZE: [number, number] = [14, 14];

const getPointIcon = (point: MapPoint) =>
  point.hydrolyzed ? HYDROLYZED_ICON : NOT_HYDROLYZED_ICON;

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
  const [styleRevision, setStyleRevision] = useState(0);
  useEffect(() => {
    handleMapClickRef.current = handleMapClick;
  }, [handleMapClick]);

  useEffect(() => {
    const map = mapRef.current;
    const container = containerRef.current;
    if (!isMapReady || !map || !container) return;

    let animationFrame = 0;
    const resizeMap = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        map.invalidateSize();
      });
    };

    const resizeObserver = new ResizeObserver(resizeMap);
    resizeObserver.observe(container);
    window.addEventListener("resize", resizeMap);
    window.addEventListener("orientationchange", resizeMap);
    resizeMap();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resizeMap);
      window.removeEventListener("orientationchange", resizeMap);
      cancelAnimationFrame(animationFrame);
    };
  }, [isMapReady]);

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
          zoomControl: false,
          rotation: 0,
          pitch: 0,
          disablePitchByUserInteraction: true,
          disableRotationByUserInteraction: true,
          key: process.env.NEXT_PUBLIC_2GIS_MAPGL_KEY!,
        });

        // Listen as soon as the map exists. Waiting for the markers effect can
        // miss styleload when the map initializes quickly (for example on return navigation).
        map.on("styleload", () => {
          setIsMapLoaded(true);
          draftMarkerRef.current?.destroy();
          draftMarkerRef.current = null;
          setStyleRevision((revision) => revision + 1);
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
    if (!isMapReady || styleRevision === 0 || !map || !mapgl) return;

    if (!isAddingPoint) {
      draftMarkerRef.current?.hide();
      return;
    }

    const latitude = Number(values.latitude);
    const longitude = Number(values.longitude);
    if (
      !values.latitude ||
      !values.longitude ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      draftMarkerRef.current?.hide();
      return;
    }

    if (!draftMarkerRef.current) {
      draftMarkerRef.current = new mapgl.Marker(map, {
        coordinates: [longitude, latitude],
        icon: ADDING_ICON,
        size: ADDING_SIZE,
      });
    } else {
      draftMarkerRef.current.setCoordinates([longitude, latitude]);
      draftMarkerRef.current.setIcon({
        icon: values.hydrolyzable ? HYDROLYZED_ICON : NOT_HYDROLYZED_ICON,
        size: SELECTED_SIZE,
      });
    }
    draftMarkerRef.current.show();
  }, [
    isAddingPoint,
    isMapReady,
    mapgl,
    styleRevision,
    values.hydrolyzable,
    values.latitude,
    values.longitude,
  ]);

  // 2. Создаём маркеры.
  // Этот эффект не зависит от selectedPointId.
  useEffect(() => {
    const map = mapRef.current;

    // MapGL emits styleload again whenever the style is replaced. Wait for
    // that event and rebuild overlays because the style reload can clear them.
    if (!isMapReady || styleRevision === 0 || !map || !mapgl) return;

    markersRef.current.forEach(({ marker }) => {
      marker.destroy();
    });

    markersRef.current.clear();

    for (const point of points) {
      const id = String(point.id);

      const marker = new mapgl.Marker(map, {
        coordinates: [point.longitude, point.latitude],
        icon: getPointIcon(point),
        size: DEFAULT_SIZE,
      });

      marker.on("click", () => {
        handlePointPress(point);
      });

      markersRef.current.set(id, {
        marker,
        point,
      });
    }

    // Если список точек изменился, пересоздаём только
    // маркеры этого списка при следующем запуске эффекта.
    return () => {
      markersRef.current.forEach(({ marker }) => {
        marker.destroy();
      });

      markersRef.current.clear();
      previousSelectedIdRef.current = null;
    };
  }, [points, handlePointPress, isMapReady, mapgl, styleRevision]);

  // 3. Меняем только предыдущий и новый выбранный маркеры.
  useEffect(() => {
    if (!isMapReady || styleRevision === 0) return;

    const previousId = previousSelectedIdRef.current;

    // Снимаем выделение с предыдущего маркера.
    if (previousId !== null) {
      const previousMarker = markersRef.current.get(previousId);

      if (previousMarker) {
        previousMarker.marker.setIcon({
          icon: getPointIcon(previousMarker.point),
          size: DEFAULT_SIZE,
        });
      }
    }

    // Выделяем новый маркер.
    if (selectedPointId !== null) {
      const selectedMarker = markersRef.current.get(selectedPointId);

      if (selectedMarker) {
        selectedMarker.marker.setIcon({
          icon: getPointIcon(selectedMarker.point),
          size: SELECTED_SIZE,
        });
      }
    }

    previousSelectedIdRef.current = selectedPointId;
  }, [selectedPointId, isMapReady, points, styleRevision]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 overflow-hidden" />
      {!isMapLoaded && (
        <div className="absolute inset-0 z-10">
          <MapLoader />
        </div>
      )}
    </div>
  );
}
