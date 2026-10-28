"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (!dialogElement) return;

    if (isOpen) {
      if (!dialogElement.open) dialogElement.showModal();
    } else {
      if (dialogElement.open) dialogElement.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-md rounded-2xl bg-white p-0 text-zinc-900 shadow-xl backdrop:bg-black/50 dark:bg-zinc-900 dark:text-zinc-100 sm:max-h-[90vh] sm:w-[calc(100%-2rem)] open:animate-in open:fade-in zoom-in-95 duration-200"
    >
      <div className="flex max-h-[calc(100dvh-1rem)] flex-col py-5 sm:max-h-[90vh] sm:py-6">
        <div className="mb-3 flex shrink-0 items-center justify-between sm:mb-4">
          <h2 className="px-4 text-lg font-semibold sm:px-6 sm:text-xl">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-4 top-4 flex size-8 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 sm:right-[18px] sm:top-5"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}
