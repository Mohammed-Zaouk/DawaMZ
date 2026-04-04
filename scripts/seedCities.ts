import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { citiesByRegion } from "../data/cities";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const regionKeyToName: Record<string, string> = {
  "1": "Région Tanger-Tetouan-Al Hoceima",
  "2": "Région Oriental",
  "3": "Région Fès-Meknès",
  "4": "Région Rabat-Salé-Kénitra",
  "5": "Région Béni Mellal-Khénifra",
  "6": "Région Casablanca-Settat",
  "7": "Région Marrakech-Safi",
  "8": "Région Drâa-Tafilalet",
  "9": "Région Souss-Massa",
  "10": "Région Guelmim-Oued Noun",
  "11": "Région Laâyoune-Sakia El Hamra",
  "12": "Région Dakhla-Oued Ed-Dahab",
};

const sanitizeFileName = (fileName: string) => {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_\s]/g, "")
    .trim();
};

const uploadImage = async (imagePath: string) => {
  const fullPath = path.join(__dirname, "../assets/images/cities", imagePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`Image not found: ${fullPath}`);
    return null;
  }

  const file = fs.readFileSync(fullPath);
  const ext = path.extname(imagePath).toLowerCase();
  const contentTypeMap: Record<string, string> = {
    ".webp": "image/webp",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
  };
  const contentType = contentTypeMap[ext] ?? "image/jpeg";
  const safeFileName = sanitizeFileName(imagePath);

  const { error } = await supabase.storage
    .from("app-images")
    .upload(`cities/${safeFileName}`, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`Failed to upload ${imagePath}:`, error.message);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("app-images")
    .getPublicUrl(`cities/${safeFileName}`);

  return publicUrl;
};

async function seedCities() {
  console.log("Fetching regions from Supabase...");

  const { data: regions, error: regionError } = await supabase
    .from("regions")
    .select("id, name");

  if (regionError) throw regionError;

  const regionNameToId: Record<string, string> = {};
  regions.forEach((r) => (regionNameToId[r.name] = r.id));

  console.log("Regions fetched:", Object.keys(regionNameToId).length);

  for (const [regionKey, cities] of Object.entries(citiesByRegion)) {
    const regionName = regionKeyToName[regionKey];
    const regionId = regionNameToId[regionName];

    if (!regionId) {
      console.warn(`No region found for key ${regionKey} (${regionName})`);
      continue;
    }

    console.log(`\nSeeding cities for ${regionName}...`);

    for (const city of cities) {
      const imagePath = city.image?.toString().split("/").pop() ?? null;

      let imageUrl = null;
      if (imagePath) {
        console.log(`  Uploading image for ${city.name}...`);
        imageUrl = await uploadImage(imagePath);
      }

      const { error } = await supabase.from("cities").insert({
        name: city.name,
        name_ar: city.nameAr,
        image: imageUrl,
        region_id: regionId,
      });

      if (error) {
        console.error(`  Failed to insert ${city.name}:`, error.message);
        continue;
      }

      console.log(`  ✓ ${city.name} inserted`);
    }
  }

  console.log("\nCities seeding complete!");
}

seedCities().catch(console.error);
