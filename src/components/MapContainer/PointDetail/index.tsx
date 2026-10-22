import { WaterStatusBadge } from "@/components/ui/WaterStatusBadge";
import { MapPoint } from "@/entities/points";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  point: MapPoint;
  handleClear: () => void;
};

export const PointDetail = ({ point, handleClear }: Props) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-b-border-primary py-3 sm:py-6 px-3 sm:px-5 flex">
        <div className="flex flex-col w-full">
          <h1 className="font-semibold text-lg sm:text-xl">{point?.title}</h1>
          <p className="text-gray-500 text-xs sm:text-sm">subtittle</p>
          <div className=" pt-2 sm:pt-4">
            <WaterStatusBadge status="normal" />
          </div>
        </div>
        <Button
          onClick={handleClear}
          className="bg-gray-100 w-8 h-8 rounded-sm hover:bg-gray-200 cursor-pointer active:bg-gray-300"
        >
          <X className="text-icon-primary" />
        </Button>
      </div>

      <div className="p-5">
        <p className="text-sm text-gray-600">
          Здесь может быть длинное описание точки, история, фото, отзывы и т.д.
          Всё это будет прокручиваться вместе с шапкой.
        </p>
      </div>
    </div>
  );
};
