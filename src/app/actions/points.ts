import { MapPoint } from "@/entities/points";
import { createClient } from "../lib/server";

export async function getPoints(): Promise<MapPoint[]> {
  const supabase = await createClient();

  const { data } = await supabase.from("points").select("*");
  return data as MapPoint[];
}
