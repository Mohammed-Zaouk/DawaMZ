import { supabase } from "@/services/supabase";
import { isOpenNow } from "@/utils/isOpen";
import { calculateDistance } from "./calculateDistance";

export const findNearestOpenPharmacy = async (
  userLat: number,
  userLon: number,
) => {
  const { data: pharmacies, error } = await supabase
    .from("pharmacies")
    .select("*, cities(name, name_ar)");

  if (error || !pharmacies) {
    console.error("Failed to fetch pharmacies:", error?.message);
    return null;
  }

  const openPharmacies = pharmacies.filter((p) =>
    isOpenNow(
      p.schedule,
      p.is_on_call ?? false,
      p.duty_start,
      p.duty_end,
      p.is_night_pharmacy ?? false,
    ),
  );

  let nearest = null;
  for (const pharmacy of openPharmacies) {
    const distance = calculateDistance(
      userLat,
      userLon,
      pharmacy.latitude,
      pharmacy.longitude,
    );
    if (!nearest || distance < nearest.distance) {
      nearest = { ...pharmacy, distance };
    }
  }

  if (!nearest) return null;

  return {
    ...nearest,
    cityName: nearest.cities?.name,
    cityNameAr: nearest.cities?.name_ar,
  };
};
