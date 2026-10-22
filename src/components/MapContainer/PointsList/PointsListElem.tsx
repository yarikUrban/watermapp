import { MapPoint, MapPointTypes } from "@/entities/points";
import React from "react";
import { ChevronRight } from "lucide-react";
import { WaterStatusBadge } from "@/components/ui/WaterStatusBadge";
type Props = {
  item: MapPoint;
  onPress: (p: MapPoint) => void;
};

const PointsListElem = ({ item, onPress }: Props) => {
  return (
    <div
      onClick={() => {
        onPress(item);
      }}
      className="w-full border-t-1 border-b-0 border-l-0 border-r-0 border-border-primary py-4 px-5 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <div className="flex w-full items-center justify-between gap-2  rounded-md ">
        <p className="truncate">{item?.title}</p>
        <div className=" rounded-md ">
          <ChevronRight size={16} className=" text-icon-primary" />
        </div>
      </div>

      <div>
        <WaterStatusBadge
          status={item.type === "poison" ? "warning" : "normal"}
        />
      </div>
    </div>
  );
};

export default PointsListElem;
