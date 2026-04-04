import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const regions = [
  {
    name: "Région Tanger-Tetouan-Al Hoceima",
    name_ar: "جهة طنجة - تطوان - الحسيمة",
    name_en: "Tanger-Tetouan-Al Hoceima Region",
    imagePath: "Tanger-Tetouan-Al Hoceima.webp",
  },
  {
    name: "Région Oriental",
    name_ar: "جهة الشرق",
    name_en: "Oriental Region",
    imagePath: "Oriental.webp",
  },
  {
    name: "Région Fès-Meknès",
    name_ar: "جهة فاس - مكناس",
    name_en: "Fès-Meknès Region",
    imagePath: "Fès-Meknès.webp",
  },
  {
    name: "Région Rabat-Salé-Kénitra",
    name_ar: "جهة الرباط - سلا - القنيطرة",
    name_en: "Rabat-Salé-Kénitra Region",
    imagePath: "Rabat-Salé-Kénitra.webp",
  },
  {
    name: "Région Béni Mellal-Khénifra",
    name_ar: "جهة بني ملال - خنيفرة",
    name_en: "Béni Mellal-Khénifra Region",
    imagePath: "Béni Mellal-Khénifra.webp",
  },
  {
    name: "Région Casablanca-Settat",
    name_ar: "جهة الدار البيضاء - سطات",
    name_en: "Casablanca-Settat Region",
    imagePath: "Casablanca-Settat.png",
  },
  {
    name: "Région Marrakech-Safi",
    name_ar: "جهة مراكش - آسفي",
    name_en: "Marrakech-Safi Region",
    imagePath: "Marrakech-Safi.webp",
  },
  {
    name: "Région Drâa-Tafilalet",
    name_ar: "جهة درعة - تافيلالت",
    name_en: "Drâa-Tafilalet Region",
    imagePath: "Drâa-Tafilalet.webp",
  },
  {
    name: "Région Souss-Massa",
    name_ar: "جهة سوس - ماسة",
    name_en: "Souss-Massa Region",
    imagePath: "Souss-Massa.jpg",
  },
  {
    name: "Région Guelmim-Oued Noun",
    name_ar: "جهة كلميم - واد نون",
    name_en: "Guelmim-Oued Noun Region",
    imagePath: "Guelmim-Oued Noun.jpg",
  },
  {
    name: "Région Laâyoune-Sakia El Hamra",
    name_ar: "جهة العيون - الساقية الحمراء",
    name_en: "Laâyoune-Sakia El Hamra Region",
    imagePath: "Laâyoune-Sakia El Hamra.webp",
  },
  {
    name: "Région Dakhla-Oued Ed-Dahab",
    name_ar: "جهة الداخلة - وادي الذهب",
    name_en: "Dakhla-Oued Ed-Dahab Region",
    imagePath: "Dakhla-Oued Ed-Dahab.webp",
  },
];

const sanitizeFileName = (fileName: string) => {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_\s]/g, "")
    .trim();
};

const uploadImage = async (imagePath: string) => {
  const fullPath = path.join(__dirname, "../assets/images/regions", imagePath);

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
    .upload(`regions/${safeFileName}`, file, {
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
    .getPublicUrl(`regions/${safeFileName}`);

  return publicUrl;
};

async function seedRegions() {
  console.log("Starting regions seed...");

  for (const region of regions) {
    const { imagePath, ...regionData } = region;

    console.log(`Uploading image for ${region.name}...`);
    const imageUrl = await uploadImage(imagePath);

    const { data, error } = await supabase
      .from("regions")
      .insert({
        ...regionData,
        image: imageUrl,
      })
      .select();

    if (error) {
      console.error(`Failed to insert ${region.name}:`, error.message);
      continue;
    }

    console.log(`✓ ${region.name} inserted with image: ${imageUrl}`);
  }

  console.log("Regions seeding complete!");
}

seedRegions().catch(console.error);
