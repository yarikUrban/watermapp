export enum MapPointTypes {
  POISON = "poison",
  NORMAL = "normal",
}

export type MapPoint = {
  latitude: number;
  longitude: number;
  title: string;
  id: number;
  type: MapPointTypes;
};
