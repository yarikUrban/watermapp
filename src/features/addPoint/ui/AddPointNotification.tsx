"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import type { AddPointNotification as Notification } from "../model/hooks/useAddPoint";

export function AddPointNotification({
  notification,
}: {
  notification: Notification | null;
}) {
  if (!notification) return null;

  const isSuccess = notification.type === "success";
  const Icon = isSuccess ? CircleCheck : CircleAlert;

  return (
    <div
      key={`${notification.type}-${notification.message}`}
      role={isSuccess ? "status" : "alert"}
      className={`fixed inset-x-0 top-[calc(env(safe-area-inset-top)+4rem)] z-[200] mx-auto flex w-[calc(100%-2rem)] max-w-md items-start gap-3 rounded-xl px-4 py-3 shadow-lg animate-[point-toast_3s_ease-in-out_forwards] ${
        isSuccess
          ? "bg-[#EDF5F0] text-[#276756]"
          : "bg-[#F8F0E7] text-[#a96c40]"
      }`}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{notification.message}</p>
        <p className="text-xs opacity-80">
          Точка появится на карте после одобрения администрации
        </p>
      </div>
    </div>
  );
}
