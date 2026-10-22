import { MapPoint } from "@/entities/points";
import { createClient } from "../lib/server";

const points = [
  {
    id: 1,
    title: "Свято-Вознесенский кафедральный собор",
    coords: [76.95316, 43.2588],
  },
  { id: 2, title: "Монумент Независимости", coords: [76.94547, 43.23703] },
  { id: 3, title: "Парк Первого Президента", coords: [76.887843, 43.18213] },
  {
    id: 4,
    title: "Центральный парк культуры и отдыха им. Горького",
    coords: [76.968619, 43.261911],
  },
  { id: 5, title: "Памятник Абаю Кунанбаеву", coords: [76.957501, 43.243108] },
  {
    id: 6,
    title: "Памятник Чокану Валиханову",
    coords: [76.952935, 43.247305],
  },
  { id: 7, title: "Гора Кок-Тобе", coords: [76.97553, 43.2331] },
  { id: 8, title: "Высокогорный каток Медеу", coords: [77.05757, 43.15944] },
  { id: 9, title: "Алматинская телебашня", coords: [76.976111, 43.228889] },
  { id: 10, title: "Алматинский зоопарк", coords: [76.97673, 43.26378] },
  {
    id: 11,
    title: "Железнодорожный вокзал Алматы-1",
    coords: [76.94897, 43.34098],
  },
  {
    id: 12,
    title: "Железнодорожный вокзал Алматы-2",
    coords: [76.939096, 43.273735],
  },
  { id: 13, title: "Площадь Республики", coords: [76.94547, 43.23703] },
  {
    id: 14,
    title: "Парк имени 28 гвардейцев-панфиловцев",
    coords: [76.955298, 43.259003],
  },
  { id: 15, title: "Аллея влюбленных", coords: [76.936631, 43.264702] },
  { id: 16, title: "Площадь Абая", coords: [76.960833, 43.2425] },
  { id: 17, title: "Памятник Мукану Тулебаеву", coords: [76.95, 43.242778] },
  { id: 18, title: "Музей академика Сатпаева", coords: [76.95323, 43.24532] },
  {
    id: 19,
    title: "Памятник Джамбулу Джабаеву",
    coords: [76.951944, 43.248333],
  },
  {
    id: 20,
    title: "Памятник группе The Beatles",
    coords: [76.931076, 43.273706],
  },
];

// export async function createTestPoints() {
//   const supabase = await createClient();

//   // for...of + await — гарантирует последовательное выполнение
//   for (const elem of points) {
//     const { error } = await supabase.from("points").insert({
//       latitude: elem.coords[1],
//       longitude: elem.coords[0],
//       title: elem.title,
//     });

//     if (error) {
//       console.error(`Ошибка при вставке "${elem.title}":`, error.message);
//       // Можно прервать, чтобы не засорять базу частичными данными
//       // throw error;
//     } else {
//       console.log(`✅ Вставлено: ${elem.title}`);
//     }
//   }
// }
export async function getPoints(): Promise<MapPoint[]> {
  const supabase = await createClient();

  const { data } = await supabase.from("points").select("*");
  return data as MapPoint[];
}
