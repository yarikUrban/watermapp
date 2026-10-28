"use server";

import { createClient } from "@/app/lib/server";

export type PointImage = {
  id: number;
  url: string;
};

export async function getPointImages(pointId: number): Promise<PointImage[]> {
  const supabase = await createClient();
  const { data: imageRows, error } = await supabase
    .from("point_images")
    .select("id, storage_path")
    .eq("point_id", pointId)
    .order("sort_order", { ascending: true });

  if (error || !imageRows?.length) return [];

  const images = await Promise.all(
    imageRows.map(async ({ id, storage_path }) => {
      const { data, error: urlError } = await supabase.storage
        .from("point_images")
        .createSignedUrl(storage_path, 60 * 60);

      if (urlError || !data?.signedUrl) return null;
      return { id, url: data.signedUrl };
    }),
  );

  return images.filter((image): image is PointImage => image !== null);
}
