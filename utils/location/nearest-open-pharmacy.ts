import { pharmaciesByCity } from "@/data/pharmacies";
import { calculateDistance } from "./calculateDistance";

export const findNearestOpenPharmacy = (userLat: number, userLon: number) => {
  const allPharmacies = [];
  for (const cityId in pharmaciesByCity) {
    allPharmacies.push(...pharmaciesByCity[cityId]);
  }

  const pharmaciesWithDistance = allPharmacies.map((pharmacy) => ({
    ...pharmacy,
    distance: calculateDistance(
      userLat,
      userLon,
      pharmacy.latitude,
      pharmacy.longitude,
    ),
  }));

  const nearbyOpen = pharmaciesWithDistance
    .filter((p) => p.open)
    .sort((a, b) => a.distance - b.distance);

  return nearbyOpen[0];
};
