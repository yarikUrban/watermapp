"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAddPoint } from "../model/hooks/useAddPoint";
import { useAddPointContext } from "../model/AddPointContext";
import { MapPin } from "lucide-react";

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
  const { isSelectingLocation, setIsSelectingLocation } = useAddPointContext();

  return (
    <form
      className="flex flex-col gap-3 px-4 sm:gap-4 sm:px-6"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
          className="w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </Field>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full py-5" disabled={isSubmitting}>
        {isSubmitting ? "Отправка…" : "Отправить"}
      </Button>
    </form>
  );
}
