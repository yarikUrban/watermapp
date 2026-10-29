import React from "react";
import PointsListElem from "./PointsListElem";
import { MapPoint } from "@/entities/points";

type Props = {
  points: MapPoint[];
  handlePointPress: (p: MapPoint) => void;
};

const PointsList = ({ points, handlePointPress }: Props) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col w-full overflow-y-auto overscroll-contain scrollbar-hide">
      {points?.map((elem) => (
        <PointsListElem key={elem.id} item={elem} onPress={handlePointPress} />
      ))}
    </div>
  );
};

export default PointsList;

