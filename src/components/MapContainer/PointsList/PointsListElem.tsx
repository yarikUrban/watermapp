import { MapPoint } from "@/entities/points";
import React from "react";
import { MapPin } from "lucide-react";
import { WaterStatusBadge } from "@/components/ui/WaterStatusBadge";
type Props = {
  item: MapPoint;
  onPress: (p: MapPoint) => void;
};

const PointsListElem = ({ item, onPress }: Props) => (
  <button
    type="button"
    onClick={() => onPress(item)}
    className="group mx-3 mb-2 flex w-[calc(100%-1.5rem)] items-center gap-3 rounded-2xl border border-[#edf0ed] bg-white px-3.5 py-3.5 text-left shadow-[0_2px_8px_rgba(24,48,34,.025)] transition-all duration-[300ms] ease-[cubic-bezier(.22,1,.36,1)] cursor-pointer hover:border-[#dce9df] hover:bg-[#fbfdfb] hover:shadow-[0_4px_12px_rgba(24,48,34,.07)] sm:mx-4 sm:w-[calc(100%-2rem)] sm:px-4"
  >
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f1] text-[#53806a] transition-colors group-hover:bg-[#e5f1e9] group-hover:text-[#19735f]">
      <MapPin size={18} strokeWidth={1.8} />
    </span>
    <span className="min-w-0 flex-1">
      <span className="mb-1 block truncate text-sm font-medium tracking-[-.01em] text-[#28382e]">
        {item?.title}
      </span>
      <WaterStatusBadge hydrolyzed={item.hydrolyzed} />
    </span>
  </button>
);

export default PointsListElem;

