"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAddPoint } from "../model/hooks/useAddPoint";

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
  return (
    <form className="flex flex-col gap-4 px-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3 ">
        <Field>
          <FieldLabel htmlFor="point-latitude">Широта</FieldLabel>
          <Input
            id="point-latitude"
            name="latitude"
            type="number"
            step="any"
            min="-90"
            max="90"
            placeholder="43.238"
            value={values.latitude}
            onChange={(event) => handleChange("latitude", event.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="point-longitude">Долгота</FieldLabel>
          <Input
            id="point-longitude"
            name="longitude"
            type="number"
            step="any"
            min="-180"
            max="180"
            placeholder="76.945"
            value={values.longitude}
            onChange={(event) => handleChange("longitude", event.target.value)}
            required
          />
        </Field>
      </div>

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
          rows={4}
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
