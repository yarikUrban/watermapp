"use server";

import { createClient } from "@/app/lib/server";
import type { AddPointFormValues } from "../model/hooks/useAddPoint";

type CreatePointInput = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
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
    latitude: 50,
    longitude: 55,
    title: "title",
  });

  if (error) {
    console.log("ERRRO:", error);
    return {
      success: false,
      error: "Не удалось добавить точку. Попробуйте ещё раз.",
    };
  }

  return { success: true };
}
