"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

export function MobileAddPointButton({ onAddPoint, isExpanded }: {
  onAddPoint: () => void;
  isExpanded: boolean;
}) {
  return (
    <>
      <Button
        type="button"
        onClick={onAddPoint}
        className={`fixed bottom-[8.6rem] left-1/2 z-[90] h-10 -translate-x-1/2 gap-2 rounded-full px-5 shadow-lg transition-opacity duration-200 sm:hidden ${isExpanded ? "pointer-events-none opacity-0" : "opacity-100 delay-300"}`}
      >
        <CirclePlus aria-hidden="true" />
        Добавить точку
      </Button>
    </>
  );
}




