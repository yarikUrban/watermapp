"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useAddPoint } from "../model/hooks/useAddPoint";
import { useAddPointContext } from "../model/AddPointContext";
import { ImagePlus, MapPin, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_IMAGE_TYPES_LABEL,
} from "../model/imageTypes";
function maskCoordinate(value: string) {
  const normalizedValue = value.replace(/,/g, ".");
  const isNegative = normalizedValue.trimStart().startsWith("-");
  const separatorIndex = normalizedValue.indexOf(".");
  const integerSource =
    separatorIndex === -1
      ? normalizedValue
      : normalizedValue.slice(0, separatorIndex);
  const integerDigits = integerSource.replace(/\D/g, "");
  const hasSeparator =
    (separatorIndex !== -1 && integerDigits.length > 0) ||
    integerDigits.length > 2;
  const integer = integerDigits.slice(0, 2);

  if (!hasSeparator) {
    return `${isNegative ? "-" : ""}${integer}`;
  }

  const fractionSource =
    separatorIndex === -1
      ? integerDigits.slice(2)
      : normalizedValue.slice(separatorIndex + 1);
  const fraction = fractionSource.replace(/\D/g, "").slice(0, 8);

  return `${isNegative ? "-" : ""}${integer}.${fraction}`;
}

type AddPointFormProps = Pick<
  ReturnType<typeof useAddPoint>,
  "values" | "error" | "isSubmitting" | "handleChange" | "handleSubmit"
>;

export function AddPointForm({
  values,
  error,
  isSubmitting,
  handleChange,
  handleSubmit,
}: AddPointFormProps) {
  const {
    isSelectingLocation,
    setIsSelectingLocation,
    images,
    setImages,
  } = useAddPointContext();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingImages, setIsDraggingImages] = useState(false);
  const [imagePreviews, setImagePreviews] = useState(images);
  const [imageTypeError, setImageTypeError] = useState<string | null>(null);

  const addImages = (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const hasUnsupportedFiles = files.some(
      (file) => !SUPPORTED_IMAGE_TYPES.has(file.type),
    );
    setImageTypeError(
      hasUnsupportedFiles
        ? `Поддерживаются только изображения: ${SUPPORTED_IMAGE_TYPES_LABEL}.`
        : null,
    );

    const nextFiles = files.filter(
      (file) =>
        SUPPORTED_IMAGE_TYPES.has(file.type) &&
        !images.some(
          ({ file: existing }) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified,
        ),
    );
    if (nextFiles.length === 0) return;
    const additions = nextFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((current) => [...current, ...additions]);
    setImagePreviews((current) => [...current, ...additions]);
  };

  const removeImage = (image: (typeof images)[number]) => {
    URL.revokeObjectURL(image.previewUrl);
    setImages((current) => current.filter((item) => item !== image));
    setImagePreviews((current) => current.filter((item) => item !== image));
  };

  return (
    <form
      className="flex flex-col gap-3 px-4 sm:gap-4 sm:px-5 scrollbar-hide"
      onSubmit={handleSubmit}
    >
      <div className="text-sm text-gray-500">
        Точка появится на карте после проверки администрации
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 scrollbar-hide">
        <Field>
          <FieldLabel htmlFor="point-latitude">Широта</FieldLabel>
          <Input
            id="point-latitude"
            name="latitude"
            type="text"
            inputMode="decimal"
            maxLength={12}
            placeholder="43.238"
            value={values.latitude}
            onChange={(event) => {
              const input = event.currentTarget;
              const rawValue = input.value;
              const cursorPosition = input.selectionStart ?? rawValue.length;
              const maskedValue = maskCoordinate(rawValue);
              const maskedCursorPosition = maskCoordinate(
                rawValue.slice(0, cursorPosition),
              ).length;

              handleChange("latitude", maskedValue);
              requestAnimationFrame(() => {
                input.setSelectionRange(
                  maskedCursorPosition,
                  maskedCursorPosition,
                );
              });
            }}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="point-longitude">Долгота</FieldLabel>
          <Input
            id="point-longitude"
            name="longitude"
            type="text"
            inputMode="decimal"
            maxLength={12}
            placeholder="76.945"
            value={values.longitude}
            onChange={(event) => {
              const input = event.currentTarget;
              const rawValue = input.value;
              const cursorPosition = input.selectionStart ?? rawValue.length;
              const maskedValue = maskCoordinate(rawValue);
              const maskedCursorPosition = maskCoordinate(
                rawValue.slice(0, cursorPosition),
              ).length;

              handleChange("longitude", maskedValue);
              requestAnimationFrame(() => {
                input.setSelectionRange(
                  maskedCursorPosition,
                  maskedCursorPosition,
                );
              });
            }}
            required
          />
        </Field>
      </div>
      <Button
        type="button"
        variant="outline"
        className={`w-full ${isSelectingLocation ? "bg-surface-accent text-white" : ""}`}
        onClick={() => setIsSelectingLocation(true)}
      >
        <MapPin aria-hidden="true" />
        Указать на карте
      </Button>

      <Field>
        <FieldLabel>Подлежит гидролизу</FieldLabel>
        <RadioGroup
          aria-label="Подлежит гидролизу"
          className="flex gap-5"
          value={values.hydrolyzable ? "true" : "false"}
          onValueChange={(value) =>
            handleChange("hydrolyzable", value === "true")
          }
        >
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <RadioGroupItem value="true" />
            Да
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <RadioGroupItem value="false" />
            Нет
          </label>
        </RadioGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="point-title">Название</FieldLabel>
        <Input
          id="point-title"
          name="title"
          placeholder="Название источника"
          value={values.title}
          onChange={(event) => handleChange("title", event.target.value)}
          maxLength={120}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="point-description">Описание</FieldLabel>
        <textarea
          id="point-description"
          name="description"
          placeholder="Дополнительная информация о точке"
          value={values.description}
          onChange={(event) => handleChange("description", event.target.value)}
          maxLength={1000}
          rows={3}
          className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </Field>

      <Field>
        <FieldLabel>Изображения</FieldLabel>
        <input
          ref={imageInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpg,image/jpeg,image/webp,image/svg+xml"
          multiple
          className="sr-only"
          tabIndex={-1}
          disabled={isSubmitting}
          onChange={(event) => {
            if (event.currentTarget.files) addImages(event.currentTarget.files);
            event.currentTarget.value = "";
          }}
        />
        <button
          type="button"
          className={`flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-5 text-center text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
            isDraggingImages
              ? "border-surface-accent bg-[#EDF5F0] text-text-accent"
              : "border-input text-muted-foreground hover:bg-muted/50"
          }`}
          disabled={isSubmitting}
          onClick={() => imageInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              imageInputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDraggingImages(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setIsDraggingImages(false);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDraggingImages(false);
            if (!isSubmitting) addImages(event.dataTransfer.files);
          }}
        >
          <ImagePlus aria-hidden="true" className="size-5" />
          <span>Перетащите изображения сюда или нажмите, чтобы выбрать</span>
          <span className="text-xs">
            Можно выбрать несколько: {SUPPORTED_IMAGE_TYPES_LABEL}
          </span>
        </button>
        {imageTypeError && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {imageTypeError}
          </p>
        )}

        {imagePreviews.length > 0 && (
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {imagePreviews.map((image) => (
              <li
                key={`${image.file.name}-${image.file.size}-${image.file.lastModified}`}
                className="group relative aspect-square overflow-hidden rounded-md border border-border-primary"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.previewUrl}
                  alt={image.file.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`Удалить изображение ${image.file.name}`}
                  className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-black/65 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                  disabled={isSubmitting}
                  onClick={() =>
                    removeImage(image)
                  }
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Field>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="absolute bottom-0 pb-6 px-4 left-0 w-full sm:hidden">
        <Button type="submit" className="w-full py-6" disabled={isSubmitting}>
          {isSubmitting ? "Отправка…" : "Отправить"}
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full py-5 hidden sm:flex"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка…" : "Отправить"}
      </Button>
    </form>
  );
}
