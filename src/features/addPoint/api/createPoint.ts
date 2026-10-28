"use server";

import { createClient } from "@/app/lib/server";
import type { AddPointFormValues } from "../model/AddPointContext";

type CreatePointInput = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  hydrolyzable: boolean;
};

type CreatePointResult = { success: true } | { success: false; error: string };

export async function createPoint(
  point: CreatePointInput,
): Promise<CreatePointResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Войдите, чтобы добавить точку." };
  }

  const { error } = await supabase.from("point_requests").insert({
    latitude: point?.latitude,
    longitude: point?.longitude,
    title: point?.title,
    description: point?.description,
    hydrolyzed: point?.hydrolyzable,
  });

  if (error) {
    return {
      success: false,
      error: "Не удалось добавить точку. Попробуйте ещё раз.",
    };
  }

  return { success: true };
}
