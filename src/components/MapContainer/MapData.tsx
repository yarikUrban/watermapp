import { getPoints } from "@/app/actions/points";
import MapContainer from ".";

export async function MapData() {
  const points = await getPoints();
  return <MapContainer points={points} />;
}
