import { Droplets } from "lucide-react";

export const MapLoader = () => (
  <div
    role="status"
    aria-label="Загрузка карты"
    className="fixed inset-0 z-[250] flex min-h-dvh items-center justify-center bg-[#f4f7f3]"
  >
    <div className="relative flex size-16 items-center justify-center rounded-[22px] bg-white text-[#19735f] shadow-[0_8px_30px_rgba(25,75,53,.10)]">
      <span className="absolute inset-0 animate-ping rounded-[22px] bg-[#dceee3] opacity-40" />
      <Droplets className="relative animate-pulse" size={30} strokeWidth={1.7} />
    </div>
  </div>
);
