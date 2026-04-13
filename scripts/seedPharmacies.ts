import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { pharmaciesByCity } from "../data/pharmacies/pharmacies";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const cityKeyToName: Record<string, string> = {
  "1": "Tangier",
  "2": "Tetouan",
  "3": "Ksar El Kebir",
  "4": "Larache",
  "5": "Al Hoceima",
  "6": "Fnideq",
  "7": "Martil",
  "8": "Ouazzane",
  "9": "Chefchaouen",
  "10": "M'diq",
  "11": "Assilah",
  "12": "Beni Bouayach",
  "13": "Oujda",
  "14": "Nador",
  "15": "Berkane",
  "16": "Taourirt",
  "17": "Guercif",
  "18": "Beni Ansar",
  "19": "Al Aaroui",
  "20": "El Aioun Sidi Mellouk",
  "21": "Bouarfa",
  "22": "Ahfir",
  "23": "Fes",
  "24": "Meknes",
  "25": "Taza",
  "26": "Sefrou",
  "27": "Azrou",
  "28": "Ifrane",
  "29": "El Hajeb",
  "30": "Ain Taoujdate",
  "31": "Rabat",
  "32": "Sale",
  "33": "Kenitra",
  "34": "Temara",
  "35": "Khemisset",
  "36": "Sidi Slimane",
  "37": "Tifelt",
  "38": "Sidi Kacem",
  "39": "Souk El Arbaa",
  "40": "Skhirat",
  "41": "Ain El Aouda",
  "42": "Ain Attig",
  "43": "Khouribga",
  "44": "Beni Mellal",
  "45": "Khenifra",
  "46": "Fquih Ben Salah",
  "47": "Oued Zem",
  "48": "Azilal",
  "49": "Bejaad",
  "50": "Demnate",
  "51": "Casablanca",
  "52": "Mohammedia",
  "53": "El Jadida",
  "54": "Settat",
  "55": "Berrechid",
  "56": "Dar Bouazza",
  "57": "Bouskoura",
  "58": "Benslimane",
  "59": "Sidi Bennour",
  "60": "Azemmour",
  "61": "Ben Ahmed",
  "62": "Bouznika",
  "63": "Ain Harrouda",
  "64": "Marrakech",
  "65": "Safi",
  "66": "El Kelaa",
  "67": "Ben Guerir",
  "68": "Essaouira",
  "69": "Youssoufia",
  "70": "Ait Ourir",
  "71": "Chichaoua",
  "72": "Errachidia",
  "73": "Ouarzazate",
  "74": "Midelt",
  "75": "Zagora",
  "76": "Arfoud",
  "77": "Er-Rich",
  "78": "Agadir",
  "79": "Ait Melloul",
  "80": "Inezgane",
  "81": "Dcheira",
  "82": "Oulad Teima",
  "83": "Taroudant",
  "84": "Tiznit",
  "85": "Drargua",
  "86": "Biougra",
  "87": "Aourir",
  "88": "Ait Amira",
  "89": "Guelmim",
  "90": "Tan-Tan",
  "91": "Sidi Ifni",
  "92": "Assa",
  "93": "Laayoune",
  "94": "Smara",
  "95": "Boujdour",
  "96": "Tarfaya",
  "97": "Dakhla",
  "98": "Aousserd",
  "99": "Bir Gandouz",
};

async function seedPharmacies() {
  console.log("Fetching cities from Supabase...");

  const { data: cities, error: cityError } = await supabase
    .from("cities")
    .select("id, name");

  if (cityError) throw cityError;

  const cityNameTold: Record<string, string> = {};
  cities.forEach((r) => (cityNameTold[r.name] = r.id));

  console.log("Regions fetched:", Object.keys(cityNameTold).length);

  for (const [cityKey, pharmacies] of Object.entries(pharmaciesByCity)) {
    const cityName = cityKeyToName[cityKey];
    const cityId = cityNameTold[cityName];

    if (!cityId) {
      console.warn(`No city found for key ${cityKey} (${cityName})`);
      continue;
    }

    console.log(`\nSeeding cities for ${cityName}...`);

    for (const pharamacy of pharmacies) {
      const { error } = await supabase.from("pharmacies").insert({
        name: pharamacy.name,
        name_ar: pharamacy.nameAr,
        address: pharamacy.address,
        address_ar: pharamacy.addressAr,
        phone: pharamacy.phone,
        latitude: pharamacy.latitude,
        longitude: pharamacy.longitude,
        open: pharamacy.open,
        rating: pharamacy.rating ?? null,
        is_night_pharmacy: pharamacy.isNightPharmacy ?? false,
        is_on_call: pharamacy.isOnCall ?? false,
        duty_start: pharamacy.dutyStart,
        duty_end: pharamacy.dutyEnd,
        schedule: pharamacy.schedule,
        city_id: cityId,
      });
      if (error) {
        console.error(`  Failed to insert ${pharamacy.name}:`, error.message);
        continue;
      }
      console.log(`  ✓ ${pharamacy.name} inserted`);
    }
  }
  console.log("\nPharmacies seeding complete!");
}

seedPharmacies().catch(console.error);
