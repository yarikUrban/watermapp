"use client";
import { MapPoint } from "@/entities/points";

import PointsList from "../PointsList";
import { useMemo } from "react";
import { PointDetail } from "../PointDetail";
import { ListAction } from "../ListAction";
import { MobileAddPointButton } from "@/features/addPoint/ui/MobileAddPointButton";
import { useAddPoint } from "@/features/addPoint/model/hooks/useAddPoint";
import { AddPointForm } from "@/features/addPoint/ui/AddPointForm";
import { LoginRequiredModal } from "@/features/addPoint/ui/LoginRequiredModal";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAddPointContext } from "@/features/addPoint/model/AddPointContext";

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
  const isPointSelected = Boolean(currentPoint?.id);

  const {
    handleAddPoint,
    handleChange,
    handleClose,
    handleSubmit,
    isVisible: isAddingPoint,
    isAuthPromptVisible,
    setIsAuthPromptVisible,
    isSubmitting,
    error,
    values,
  } = useAddPoint();
  const { isSelectingLocation } = useAddPointContext();
  const pointsCount = useMemo(() => points?.length ?? 0, [points]);
  const isExpanded = isPointSelected || (isAddingPoint && !isSelectingLocation);

  // One active view per section: point details, add form, or the points list.
  const sectionContent = isPointSelected ? (
    <div className="pt-[44] ">
      <PointDetail handleClear={handleClearPoint} point={currentPoint} />
    </div>
  ) : isAddingPoint ? (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between border-b border-border-primary px-5 pt-4 sm:pt-[68] pb-3">
        <h2 className="text-lg font-semibold">Добавить точку</h2>
        <Button
          type="button"
          onClick={handleClose}
          aria-label="Закрыть форму"
          className="h-8 w-8 rounded-sm bg-gray-100 p-0 hover:bg-gray-200"
        >
          <X className="text-icon-primary" />
        </Button>
      </div>
      <div className="py-5">
        <AddPointForm
          values={values}
          error={error}
          isSubmitting={isSubmitting}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </section>
  ) : (
    <>
      <ListAction onAddPoint={handleAddPoint} pointsCount={pointsCount} />
      <PointsList points={points} handlePointPress={handlePointSelected} />
    </>
  );

  return (
    <>
      <LoginRequiredModal
        isOpen={isAuthPromptVisible}
        onClose={() => setIsAuthPromptVisible(false)}
      />
      {!isAddingPoint && <MobileAddPointButton onAddPoint={handleAddPoint} />}
      <div className="hidden sm:flex absolute top-0 right-0 bottom-0 bg-white w-[360px] z-[100] flex-col border-l border-l-border-primary">
        {sectionContent}
      </div>

      <div
        className={`sm:hidden fixed inset-x-0 bottom-0 z-[100] h-[80dvh] max-h-[calc(100dvh-1rem)] bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isExpanded ? "translate-y-0" : "translate-y-[calc(100%-3.25rem)]"
        }`}
      >
        {/* Контент: своя прокрутка, высота фиксирована родителем */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {sectionContent}
        </div>
      </div>
    </>
  );
}
