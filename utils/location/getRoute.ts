import * as Location from "expo-location";
import { useState } from "react";

export type Coord = {
  latitude: number;
  longitude: number;
};

export type OSRMStatus =
  | "idle"
  | "requesting_permission"
  | "fetching"
  | "success"
  | "no_route"
  | "permission_denied"
  | "error";

export type UseOSRMReturn = {
  routeCoords: Coord[];
  status: OSRMStatus;
  clearRoute: () => void;
  fetchRoute: (destination: Coord) => Promise<void>;
};

/**
 * useOSRM
 * ─────────────────────────────────────────────────────────────
 * Reusable hook for fetching a driving route from the user's
 * current location to a destination using the free OSRM API.
 *
 * Usage:
 *   const { routeCoords, status, fetchRoute, clearRoute } = useOSRM();
 *
 *   // Fetch route
 *   await fetchRoute({ latitude: 34.123, longitude: -5.456 });
 *
 *   // Clear route
 *   clearRoute();
 *
 * Status values:
 *   "idle"                → no route, nothing happening
 *   "requesting_permission" → asking user for location access
 *   "fetching"            → calling OSRM API
 *   "success"             → route loaded, routeCoords populated
 *   "no_route"            → OSRM returned no results
 *   "permission_denied"   → user denied location access
 *   "error"               → network or unexpected error
 */
export function useOSRM(): UseOSRMReturn {
  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);
  const [status, setStatus] = useState<OSRMStatus>("idle");

  const clearRoute = () => {
    setRouteCoords([]);
    setStatus("idle");
  };

  const fetchRoute = async (destination: Coord) => {
    setRouteCoords([]);

    // ── Step 1: Check / request location permission ──────────────
    setStatus("requesting_permission");

    const { status: existingStatus } =
      await Location.getForegroundPermissionsAsync();

    if (existingStatus !== "granted") {
      const { status: requestedStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (requestedStatus !== "granted") {
        setStatus("permission_denied");
        return;
      }
    }

    // ── Step 2: Get user's current position ───────────────────────
    setStatus("fetching");

    let userLocation: Location.LocationObject;
    try {
      userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
    } catch {
      setStatus("error");
      return;
    }

    const { latitude: userLat, longitude: userLng } = userLocation.coords;

    // ── Step 3: Call OSRM free routing API ────────────────────────
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/` +
          `${userLng},${userLat};${destination.longitude},${destination.latitude}` +
          `?overview=full&geometries=geojson`,
        { signal: AbortSignal.timeout(10000) }, // 10s timeout
      );

      if (!response.ok) {
        setStatus("error");
        return;
      }

      const data = await response.json();

      if (data.code !== "Ok" || !data.routes?.length) {
        setStatus("no_route");
        return;
      }

      // GeoJSON coords are [lng, lat] — flip for react-native-maps
      const coords: Coord[] = data.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng }),
      );

      setRouteCoords(coords);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return { routeCoords, status, fetchRoute, clearRoute };
}
