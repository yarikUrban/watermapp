"use server";

import { createClient } from "@/app/lib/server";
import { SUPPORTED_IMAGE_TYPES } from "../model/imageTypes";

type CreatePointInput = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  hydrolyzable: boolean;
};

type CreatePointResult =
  | { success: true; pointRequestId: number }
  | { success: false; error: string };

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

  const { data, error } = await supabase
    .from("point_requests")
    .insert({
      latitude: point?.latitude,
      longitude: point?.longitude,
      title: point?.title,
      description: point?.description,
      hydrolyzed: point?.hydrolyzable,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      error: "Не удалось добавить точку. Попробуйте ещё раз.",
    };
  }

  return { success: true, pointRequestId: data.id };
}

export async function uploadImage(
  formData: FormData,
  pointRequestId: number,
): Promise<string> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Файл изображения не найден.");
  }
  if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Неподдерживаемый формат изображения.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user)
    throw new Error("Войдите, чтобы загрузить изображение.");

  const fileExt =
    file.name
      .split(".")
      .pop()
      ?.replace(/[^a-zA-Z0-9]/g, "") || "img";
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `point_images/${pointRequestId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("point_images")
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  return data.path;
}

export async function savePointRequestImages(
  pointRequestId: number,
  images: { storagePath: string; sortOrder: number }[],
): Promise<void> {
  if (images.length === 0) return;

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Не удалось проверить пользователя.");

  const { error } = await supabase.from("point_request_images").insert(
    images.map(({ storagePath, sortOrder }) => ({
      point_request_id: pointRequestId,
      storage_path: storagePath,
      sort_order: sortOrder,
    })),
  );

  if (error) throw error;
}
