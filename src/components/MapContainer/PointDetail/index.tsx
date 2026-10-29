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
    <div className="h-full overflow-y-auto bg-white">
      <div className="flex border-b border-[#edf1ed] bg-gradient-to-br from-[#f6faf6] via-white to-[#edf5ef] px-5 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-8">
        <div className="flex flex-col w-full">
          <h1 className="text-xl font-semibold leading-snug tracking-[-.035em] text-[#1c3026] sm:text-2xl">{point?.title}</h1>
          <div className="pt-1 sm:pt-2">
            <WaterStatusBadge hydrolyzed={point.hydrolyzed} />
          </div>
        </div>
        <Button
          onClick={handleClear}
          type="button" aria-label="Закрыть карточку источника" className="ml-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#e7eee8] bg-white/80 text-[#687970] shadow-sm hover:bg-white hover:text-[#243b2e]"
        >
          <X className="text-icon-primary" />
        </Button>
      </div>

      {(areImagesLoading || images.length > 0) && (
        <ul className="flex w-full gap-3 overflow-x-auto px-5 py-5 scrollbar-hide sm:px-6">
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
        <div className="mx-5 mb-5 rounded-2xl border border-[#edf1ed] bg-[#f8faf8] px-4 py-4 sm:mx-6 sm:px-5">
          <p className="whitespace-pre-wrap text-[14px] leading-6 text-[#58675d]">
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

