import { Suspense } from "react";
import { MapData } from "@/components/MapContainer/MapData";
import { MapLoader } from "@/components/DgisMap/MapLoader";

export default function HomePage() {
  return (
    <main>
      <Suspense fallback={<MapLoader />}>
        <MapData />
      </Suspense>
    </main>
  );
}
