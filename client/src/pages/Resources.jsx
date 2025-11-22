import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import {
  Loader2,
  PhoneCall,
  Search,
  MapPin,
  Building2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

// Custom marker
const LOCAL_MARKER_IMG = "/marker.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

const customIcon = new L.Icon({
  iconUrl: LOCAL_MARKER_IMG,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -30],
});

const DEFAULT_LAT = 28.6139;
const DEFAULT_LNG = 77.209;

// ----------------------
// ⭐ Debounce Function
// ----------------------
function debounce(func, delay = 900) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

function Recenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng]);
  return null;
}

export default function ResourcesLeaflet() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [radius, setRadius] = useState(3000);

  const mapRef = useRef();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // ----------------------
  // ⭐ Fetch API (same)
  // ----------------------
  const fetchResources = async (lat, lng, rad = radius) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/resources/nearby?lat=${lat}&lng=${lng}&radius=${rad}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setResources(res.data.data || []);
    } catch (err) {
      console.log(err);
      setResources([]);
      setError("Unable to load resources");
    }
    setLoading(false);
  };

  // ----------------------
  // ⭐ Debounced version of fetchResources
  // ----------------------
  const debouncedFetch = useRef(
    debounce((lat, lng, rad) => fetchResources(lat, lng, rad), 900)
  ).current;

  // ----------------------
  // Get user location
  // ----------------------
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchResources(latitude, longitude);
        },
        () => {
          setUserLocation({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
          fetchResources(DEFAULT_LAT, DEFAULT_LNG);
        }
      );
    }
  }, []);

  // ----------------------
  // ⭐ Radius change (Debounced)
  // ----------------------
  useEffect(() => {
    if (userLocation) {
      debouncedFetch(userLocation.lat, userLocation.lng, radius);
    }
  }, [radius]);

  const filtered = resources.filter((r) => {
    if (filter !== "all" && (!r.type || !r.type.toLowerCase().includes(filter))) {
      return false;
    }
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      if (
        !r.name.toLowerCase().includes(t) &&
        !r.address.toLowerCase().includes(t)
      )
        return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg flex justify-between items-center">
        <span className="flex items-center text-lg font-semibold">
          <MapPin className="mr-2" /> Nearby Mental Health Resources
        </span>

        <a
          href="tel:1800-HELPNOW"
          className="flex items-center bg-white text-red-600 px-4 py-2 rounded shadow font-medium hover:bg-gray-50"
        >
          <PhoneCall className="mr-1" /> Emergency Hotline: 1800-HELPNOW
        </a>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">

        {/* MAP */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border">

            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin mr-2" /> Loading map...
              </div>
            ) : (
              <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
                style={{ height: "70vh", width: "100%" }}
                whenCreated={(m) => (mapRef.current = m)}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Recenter lat={userLocation.lat} lng={userLocation.lng} />

                {/* User location */}
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>Your Location</Popup>
                </Marker>

                {/* Radius */}
                <Circle
                  center={[userLocation.lat, userLocation.lng]}
                  radius={radius}
                  pathOptions={{ color: "#6366F1", opacity: 0.35 }}
                />

                {/* Resource Markers */}
                {filtered.map((r) => (
                  <Marker
                    key={r._id}
                    position={[r.location.lat, r.location.lng]}
                    icon={customIcon}
                  >
                    <Popup>
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-sm text-gray-700">Type: {r.type}</div>
                      <div className="text-xs text-gray-600 mt-1">{r.address}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Distance: {r.distanceKm} km
                      </div>

                      <div className="mt-2">
                        <a
                          href={`tel:${r.contact}`}
                          className="text-indigo-600 font-medium text-sm"
                        >
                          <PhoneCall className="inline mr-1" /> Call
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white p-5 rounded-xl shadow-lg h-[70vh] overflow-y-auto sticky top-10 border">

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <input
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Radius */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700">
              Search Radius: {(radius / 1000).toFixed(1)} km
            </label>
            <input
              type="range"
              min="1000"
              max="20000"
              step="1000"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full mt-2 accent-indigo-600"
            />
          </div>

          {/* Filter Dropdown */}
          <select
            className="border p-2 w-full rounded-lg mb-4 focus:ring-indigo-500 focus:border-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Resources</option>
            <option value="hospital">Hospital</option>
            <option value="clinic">Clinic</option>
            <option value="police">Police Station</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="yoga">Yoga</option>
          </select>

          {/* Resource List */}
          <div className="space-y-4">
            {filtered.map((r) => (
              <div
                key={r._id}
                className="p-4 border rounded-xl hover:bg-indigo-50 cursor-pointer transition shadow-sm"
                onClick={() =>
                  mapRef.current.setView([r.location.lat, r.location.lng], 15)
                }
              >
                <div className="flex items-center mb-1">
                  <Building2 className="mr-2 text-indigo-600" />
                  <h3 className="font-semibold text-indigo-700">{r.name}</h3>
                </div>

                <p className="text-sm text-gray-700 capitalize">{r.type}</p>
                <p className="text-xs text-gray-500 mt-1">{r.address}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Distance: {r.distanceKm} km
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
