import { Button } from "@/components/ui/button";
import { Droplets, MapPin, Plus } from "lucide-react";

type Props = {
  pointsCount: number;
  onAddPoint: () => void;
};

export const ListAction = ({ pointsCount, onAddPoint }: Props) => {
  return (
    <section className="px-5 pt-5 pb-4 sm:px-6 sm:pt-8 sm:pb-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8f3ed] text-[#19735f]">
          <Droplets size={21} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[.17em] text-[#769184]">
            Карта воды
          </p>
          <h1 className="text-[22px] font-semibold leading-tight tracking-[-.045em] text-[#1c3026]">
            Источники
          </h1>
        </div>
        <span className="rounded-full border border-[#e6ede7] bg-[#f8faf8] px-2.5 py-1 text-xs font-medium text-[#66776c]">
          {pointsCount} мест
        </span>
      </div>
      {/* <div className="mb-5 flex items-start gap-2 rounded-2xl bg-[#f3f7f3] px-3.5 py-3 text-[13px] leading-5 text-[#6f7c72]">
        <MapPin size={16} className="mt-0.5 shrink-0 text-[#39836a]" />
        <p>Найдите ближайший источник чистой воды</p>
      </div> */}
      <Button
        onClick={onAddPoint}
        className="hidden h-12 w-full cursor-pointer gap-2 rounded-xl bg-[#19735f] text-sm font-medium text-white shadow-[0_5px_14px_rgba(25,115,95,.18)] hover:bg-[#145e4e] hover:shadow-[0_8px_20px_rgba(25,115,95,.24)] sm:flex"
      >
        <Plus size={18} /> Добавить источник
      </Button>
      <div className="mb-1 flex items-center justify-between px-0.5 sm:mt-6">
        <span className="text-xs font-semibold uppercase tracking-[.12em] text-[#859188]">
          На карте
        </span>
        <span className="text-xs text-[#98a39b]">Выберите точку</span>
      </div>
    </section>
  );
};
