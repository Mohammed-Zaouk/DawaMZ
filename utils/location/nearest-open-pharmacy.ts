import { supabase } from "@/services/supabase";
import { calculateDistance } from "./calculateDistance";

export const findNearestOpenPharmacy = async (
  userLat: number,
  userLon: number,
) => {
  const { data: pharmacies, error } = await supabase
    .from("pharmacies")
    .select("*, cities(name, name_ar)")
    .eq("open", true);

  if (error || !pharmacies) {
    console.error("Failed to fetch pharmacies:", error?.message);
    return null;
  }

  let nearbypharmacy = null;

  for (const pharmacy of pharmacies) {
    const distance = calculateDistance(
      userLat,
      userLon,
      pharmacy.latitude,
      pharmacy.longitude,
    );

    if (!nearbypharmacy || distance < nearbypharmacy.distance) {
      nearbypharmacy = { ...pharmacy, distance };
    }
  }

  if (!nearbypharmacy) return null;

  return {
    ...nearbypharmacy,
    cityName: nearbypharmacy.cities?.name,
    cityNameAr: nearbypharmacy.cities?.name_ar,
  };
};
