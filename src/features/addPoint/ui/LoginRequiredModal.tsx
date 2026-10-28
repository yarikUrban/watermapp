"use client";

import Link from "next/link";
import Modal from "@/components/ui/modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LoginRequiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LoginRequiredModal({
  isOpen,
  onClose,
}: LoginRequiredModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Войдите, чтобы продолжить">
      <div className="flex flex-col items-center gap-5 px-4 sm:px-6 py-2 text-center">
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          Чтобы добавить точку на карту, сначала войдите в аккаунт.
        </p>
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button
            className="w-full sm:w-auto"
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Назад
          </Button>
          <Link
            href="/login"
            className={cn(buttonVariants(), "w-full sm:w-auto sm:min-w-32")}
            onClick={onClose}
          >
            Войти
          </Link>
        </div>
      </div>
    </Modal>
  );
}
