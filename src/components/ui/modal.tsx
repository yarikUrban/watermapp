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
      className="m-auto backdrop:bg-black/50 p-0 rounded-2xl shadow-xl w-[calc(100%-2rem)] max-w-md max-h-[90vh] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 open:animate-in open:fade-in zoom-in-95 duration-200"
    >
      <div className="flex flex-col max-h-[90vh] py-6">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-xl font-semibold px-6">{title}</h2>
          <button
            onClick={onClose}
            className="absolute right-[18] text-zinc-400 w-6 h-6 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}
