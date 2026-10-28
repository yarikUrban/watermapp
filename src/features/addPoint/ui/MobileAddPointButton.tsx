"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

export function MobileAddPointButton({ onAddPoint }: { onAddPoint: () => void }) {
  return (
    <>
      <Button
        type="button"
        onClick={onAddPoint}
        className="fixed bottom-[3.8rem] left-1/2 z-[110] h-10 -translate-x-1/2 gap-2 rounded-full px-5  shadow-lg sm:hidden"
      >
        <CirclePlus aria-hidden="true" />
        Добавить точку
      </Button>

    </>
  );
}
