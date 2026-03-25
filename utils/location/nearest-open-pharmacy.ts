import { citiesByRegion } from "@/data/cities";
import { pharmaciesByCity } from "@/data/pharmacies";
import { calculateDistance } from "./calculateDistance";

export const findNearestOpenPharmacy = (userLat: number, userLon: number) => {
  let nearbypharmacy = null;

  for (const cityId in pharmaciesByCity) {
    for (const pharmacy of pharmaciesByCity[cityId]) {
      if (!pharmacy.open) continue;

      const distance = calculateDistance(
        userLat,
        userLon,
        pharmacy.latitude,
        pharmacy.longitude,
      );

      if (!nearbypharmacy || distance < nearbypharmacy.distance) {
        nearbypharmacy = { ...pharmacy, distance, cityId };
      }
    }
  }

  if (!nearbypharmacy) return null;

  const allCities = Object.values(citiesByRegion).flat();
  const city = allCities.find((c) => c.id === nearbypharmacy?.cityId);

  return {
    ...nearbypharmacy,
    cityName: city?.name,
    cityNameAr: city?.nameAr,
  };
};
