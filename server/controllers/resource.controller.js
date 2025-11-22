import asyncHandler from "express-async-handler";
import axios from "axios";

// -----------------------------
// ⭐ SIMPLE CACHE (in-memory)
// -----------------------------
const cache = {}; // { "lat-lng-radius": {success, count, data} }

// -----------------------------
// ⭐ Overpass Query Builder
// -----------------------------
const overpassQuery = (lat, lng, radius) => `
[out:json];
(
  node["amenity"~"hospital|clinic|police|pharmacy"](around:${radius},${lat},${lng});
  node["healthcare"](around:${radius},${lat},${lng});
  node["shop"="chemist"](around:${radius},${lat},${lng});
  node["leisure"="yoga"](around:${radius},${lat},${lng});
);
out center;
`;

// -----------------------------
// ⭐ Distance function
// -----------------------------
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// -----------------------------
// ⭐ Map Overpass Elements → Resource Object
// -----------------------------
const mapToResource = (el, userLat, userLng) => ({
  _id: el.id,
  name: el.tags.name || "Unnamed Resource",
  type:
    el.tags.amenity ||
    el.tags.healthcare ||
    el.tags.shop ||
    el.tags.leisure ||
    "Unknown",
  address:
    el.tags["addr:full"] ||
    `${el.tags["addr:street"] || ""} ${el.tags["addr:city"] || ""}`.trim() ||
    "Address not available",
  contact: el.tags.phone || el.tags["contact:phone"] || "N/A",
  location: {
    lat: el.lat,
    lng: el.lon,
  },
  distanceKm: getDistance(userLat, userLng, el.lat, el.lon).toFixed(2),
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${el.lat},${el.lon}`,
});

// -----------------------------
// ⭐ Retry Wrapper for Overpass API
// -----------------------------
async function fetchOverpass(query, retries = 3) {
  try {
    return await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" }, timeout: 12000 }
    );
  } catch (err) {
    if (retries > 0) {
      console.log("🔁 Retrying Overpass... attempts left:", retries);
      return fetchOverpass(query, retries - 1);
    }
    throw err;
  }
}

// -----------------------------
// ⭐ MAIN CONTROLLER
// -----------------------------
export const getNearbyResources = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 3000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: "lat & lng are required",
    });
  }

  // -------------------------
  // ⭐ CACHE CHECK
  // -------------------------
  const cacheKey = `${lat}-${lng}-${radius}`;
  if (cache[cacheKey]) {
    console.log("⚡ Serving from CACHE:", cacheKey);
    return res.status(200).json(cache[cacheKey]);
  }

  try {
    console.log("🌍 Fetching Overpass fresh:", cacheKey);

    const query = overpassQuery(lat, lng, radius);
    const response = await fetchOverpass(query);

    const elements = response.data?.elements || [];
    let results = elements.map((el) =>
      mapToResource(el, Number(lat), Number(lng))
    );

    results = results.sort(
      (a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm)
    );

    const apiResponse = {
      success: true,
      count: results.length,
      data: results,
    };

    // -------------------------
    // ⭐ SAVE TO CACHE
    // -------------------------
    cache[cacheKey] = apiResponse;

    return res.status(200).json(apiResponse);
  } catch (err) {
    console.error("❌ Overpass API Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Nearby resources currently unavailable. Try again later.",
      data: [],
    });
  }
});
