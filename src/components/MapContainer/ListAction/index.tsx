import { Button } from "@/components/ui/button";

type Props = {
  pointsCount: number;
  onAddPoint: () => void;
};

export const ListAction = ({ pointsCount, onAddPoint }: Props) => {
  return (
    <div className="px-5 mt-[12] mb-[12] sm:mb-0 sm:mt-[68]">
      <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center sm:gap-0">
        <h1 className="text-xl font-semibold sm:text-xl">Источники</h1>
        {Boolean(pointsCount) &&
          Number.isFinite(pointsCount) &&
          pointsCount > 0 && (
            <div className="pt-1">
              <p className="sm:text-sm text-xs text-gray-500">
                {pointsCount} мест
              </p>
            </div>
          )}
      </div>

      <div className="py-4 hidden sm:flex">
        <Button
          onClick={onAddPoint}
          className="w-full cursor-pointer bg-surface-accent py-6"
        >
          Добавить точку
        </Button>
      </div>
    </div>
  );
};
