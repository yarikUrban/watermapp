import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import React from "react";

type Props = {
  handleClear: () => void;
};
export const ListAction = ({ handleClear }: Props) => {
  const { user } = useAuth();
  if (!user) {
    return <div className="px-5 mt-[12] mb-[12] sm:mb-0 sm:mt-[56]"></div>;
  }
  return (
    <div className="px-5 mt-[12] mb-[12] sm:mb-0 sm:mt-[68]">
      <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center sm:gap-0">
        <h1 className=" font-semibold text-xl sm:text-2xl">Источники</h1>
        <div className="pt-1">
          <p className="sm:text-sm text-xs text-gray-500">64 мест</p>
        </div>
      </div>

      <div className="py-4 hidden sm:flex">
        <Button className={"w-full py-6 bg-surface-accent cursor-pointer  "}>
          Добавить точку
        </Button>
      </div>
    </div>
  );
};
