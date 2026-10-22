import MapContainer from "@/components/MapContainer";
import { getPoints } from "../actions/points";
import { Suspense } from "react";
import { MapData } from "@/components/MapContainer/MapData";

export default function HomePage() {
  const data = getPoints();

  return (
    <main>
      <Suspense fallback={<div>loading...</div>}>
        <MapData />
      </Suspense>
    </main>
  );
}
