"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  getPointImages,
  type PointImage,
} from "@/entities/points/api/getPointImages";
import { WaterStatusBadge } from "@/components/ui/WaterStatusBadge";
import { MapPoint } from "@/entities/points";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  point: MapPoint;
  handleClear: () => void;
};

type PointImageThumbnailProps = {
  image: PointImage;
  alt: string;
  onClick: () => void;
};

const PointImageThumbnail = ({
  image,
  alt,
  onClick,
}: PointImageThumbnailProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <button
      type="button"
      aria-label="Показать изображение на весь экран"
      className={`relative block h-[100px] shrink-0 overflow-hidden rounded-lg border border-border-primary bg-gray-100 sm:h-[120px] ${isLoaded ? "w-auto" : "w-[100px] sm:w-[120px]"}`}
      onClick={onClick}
    >
      {!isLoaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-gray-200"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`relative block h-full w-auto max-w-none object-contain transition-opacity duration-200 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      />
    </button>
  );
};

export const PointDetail = ({ point, handleClear }: Props) => {
  const [imageResult, setImageResult] = useState<{
    pointId: number;
    images: PointImage[];
  } | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<PointImage | null>(
    null,
  );
  const areImagesLoading = imageResult?.pointId !== point.id;
  const images = imageResult?.pointId === point.id ? imageResult.images : [];

  useEffect(() => {
    let isCurrentPoint = true;

    getPointImages(point.id)
      .then((pointImages) => {
        if (isCurrentPoint) {
          setImageResult({ pointId: point.id, images: pointImages });
        }
      })
      .catch(() => {
        if (isCurrentPoint) setImageResult({ pointId: point.id, images: [] });
      });

    return () => {
      isCurrentPoint = false;
    };
  }, [point.id]);

  useEffect(() => {
    if (!fullscreenImage) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreenImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenImage]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-b-border-primary py-3 sm:py-6 px-3 sm:px-5 flex">
        <div className="flex flex-col w-full">
          <h1 className="font-semibold text-lg sm:text-lg">{point?.title}</h1>
          <div className="pt-1 sm:pt-2">
            <WaterStatusBadge hydrolyzed={point.hydrolyzed} />
          </div>
        </div>
        <Button
          onClick={handleClear}
          className="bg-gray-100 w-8 h-8 rounded-sm hover:bg-gray-200 cursor-pointer active:bg-gray-300"
        >
          <X className="text-icon-primary" />
        </Button>
      </div>

      {(areImagesLoading || images.length > 0) && (
        <ul className="flex w-full gap-2 overflow-x-auto px-5 py-4 scrollbar-hide">
          {areImagesLoading
            ? Array.from({ length: 3 }, (_, index) => (
                <li
                  key={`image-placeholder-${index}`}
                  aria-hidden="true"
                  className="size-[100px] shrink-0 animate-pulse rounded-lg bg-gray-200 sm:size-[120px]"
                />
              ))
            : images.map((image, index) => (
                <li key={image.id} className="shrink-0">
                  <PointImageThumbnail
                    image={image}
                    alt={`${point.title}, изображение ${index + 1}`}
                    onClick={() => setFullscreenImage(image)}
                  />
                </li>
              ))}
        </ul>
      )}

      {point.description && (
        <div className="px-5 pb-5">
          <p className="whitespace-pre-wrap text-sm text-gray-600">
            {point.description}
          </p>
        </div>
      )}

      {fullscreenImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр изображения"
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-3 sm:p-6"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              type="button"
              aria-label="Закрыть изображение"
              className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
              onClick={() => setFullscreenImage(null)}
            >
              <X aria-hidden="true" />
            </button>
            <div
              className="flex h-full w-full items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fullscreenImage.url}
                alt={`${point.title}, полноразмерное изображение`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>,
          document.body,
        )}

    </div>
  );
};
