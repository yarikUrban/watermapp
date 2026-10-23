import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useAddPoint } from "@/features/addPoint/model/hooks/useAddPoint";
import { AddPointForm } from "@/features/addPoint/ui/AddPointForm";
import { LoginRequiredModal } from "@/features/addPoint/ui/LoginRequiredModal";

type Props = {
  handleClear: () => void;
};
export const ListAction = ({ handleClear }: Props) => {
  const {
    handleAddPoint,
    handleChange,
    handleClose,
    handleSubmit,
    isVisible,
    isAuthPromptVisible,
    setIsAuthPromptVisible,
    isSubmitting,
    error,
    values,
  } = useAddPoint();

  return (
    <div className="px-5 mt-[12] mb-[12] sm:mb-0 sm:mt-[68]">
      <Modal isOpen={isVisible} onClose={handleClose} title="Добавить данные">
        <AddPointForm
          values={values}
          error={error}
          isSubmitting={isSubmitting}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Modal>
      <LoginRequiredModal
        isOpen={isAuthPromptVisible}
        onClose={() => setIsAuthPromptVisible(false)}
      />

      <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center sm:gap-0">
        <h1 className="text-xl font-semibold sm:text-2xl">Источники</h1>
        <div className="pt-1">
          <p className="sm:text-sm text-xs text-gray-500">64 мест</p>
        </div>
      </div>

      <div className="py-4 hidden sm:flex">
        <Button
          onClick={handleAddPoint}
          className="w-full cursor-pointer bg-surface-accent py-6"
        >
          Добавить точку
        </Button>
      </div>
    </div>
  );
};
