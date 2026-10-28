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

      {point?.hydrolyzed && (
        <div className="p-5">
          <p className="text-sm text-gray-600">{point?.hydrolyzed}</p>
        </div>
      )}
    </div>
  );
};
