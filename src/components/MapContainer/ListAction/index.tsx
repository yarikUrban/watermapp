import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useAddPoint } from "@/features/addPoint/model/hooks/useAddPoint";
import { AddPointForm } from "@/features/addPoint/ui/AddPointForm";
import { useAuth } from "@/providers/AuthProvider";

type Props = {
  handleClear: () => void;
};
export const ListAction = ({ handleClear }: Props) => {
  const { user } = useAuth();
  const {
    handleAddPoint,
    handleChange,
    handleClose,
    handleSubmit,
    isVisible,
    isSubmitting,
    error,
    values,
  } = useAddPoint();

  if (!user) {
    return <div className="px-5 mt-[12] mb-[12] sm:mb-0 sm:mt-[56]"></div>;
  }
  return (
    <div className="px-5 mt-[12] mb-[12] sm:mb-0 sm:mt-[68]">
      <Modal
        isOpen={isVisible}
        onClose={handleClose}
        title="Добавить данные"
      >
        <AddPointForm
          values={values}
          error={error}
          isSubmitting={isSubmitting}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Modal>

      <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center sm:gap-0">
        <h1 className=" font-semibold text-xl sm:text-2xl">Источники</h1>
        <div className="pt-1">
          <p className="sm:text-sm text-xs text-gray-500">64 мест</p>
        </div>
      </div>

      <div className="py-4 hidden sm:flex">
        <Button
          onClick={handleAddPoint}
          className={"w-full py-6 bg-surface-accent cursor-pointer  "}
        >
          Добавить точку
        </Button>
      </div>
    </div>
  );
};
