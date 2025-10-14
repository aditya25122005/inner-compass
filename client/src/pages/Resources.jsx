import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2, PhoneCall, MapPin, AlertTriangle, Search, Filter, Compass, HeartPulse } from 'lucide-react';
const mockResources = [
    { _id: 'res1', name: 'City Wellness Center (Mock)', type: 'Clinic', address: 'Default: New Delhi', contact: '011-23456789' },
    { _id: 'res2', name: 'Dr. Priya Sharma (Mock)', type: 'Therapist', address: 'Default: Connaught Place', contact: '9876543210' },
];

const Resources = () => {
    const { token } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [isCrisis, setIsCrisis] = useState(false);

    // Default map coordinates
    const DEFAULT_LAT = 28.6139;
    const DEFAULT_LNG = 77.2090;

    const fetchResources = async (lat, lng) => {
        setLoading(true);
        try {
            
            const response = await axios.get(`http://localhost:8000/api/resources/nearby?lat=${lat}&lng=${lng}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            setResources(response.data.data || mockResources);
            setLoading(false);
        } catch (err) {
            setResources(mockResources); 
            setError("Failed to fetch resources list from API. Displaying mock data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            setError("Please log in to access resources.");
            setLoading(false);
            return;
        }
        
        // --- GEOLOCATION LOGIC ---
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    fetchResources(latitude, longitude); 
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    setError("Location access denied. Using default center for map.");
                    
                    fetchResources(DEFAULT_LAT, DEFAULT_LNG);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser. Using default location.");
            fetchResources(DEFAULT_LAT, DEFAULT_LNG);
        }
    }, [token]); 

    // Determine map center
    const centerMap = userLocation || { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${centerMap.lng - 0.05}%2C${centerMap.lat - 0.03}%2C${centerMap.lng + 0.05}%2C${centerMap.lat + 0.03}&layer=mapnik&marker=${centerMap.lat}%2C${centerMap.lng}`;

    if (loading) {
        return <div className="text-center p-8 text-xl flex justify-center items-center h-screen"><Loader2 className="animate-spin mr-3" /> Loading resources...</div>;
    }
    
    // JSX LAYOUT
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            
            {/* CRITICAL HOTLINE BAR */}
            <div className={`w-full bg-indigo-600 text-white p-3 flex justify-between items-center transition-colors duration-300`}>
                <div className='flex items-center'>
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    <span className='font-semibold'>CRISIS HOTLINE: 1800-HELPNOW</span>
                </div>
                <button className='px-3 py-1 bg-white text-red-600 rounded-full text-sm font-bold hover:bg-gray-100'>
                    <PhoneCall className="w-4 h-4 inline mr-1" /> Call Now
                </button>
            </div>

            <div className="max-w-7xl mx-auto w-full p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                    <Compass className="w-7 h-7 mr-3 text-indigo-600" /> Professional Support Finder
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[75vh]">
                    
                    {/* --- Right Column: Keyless Map Display --- */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                         <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            marginHeight="0" 
                            marginWidth="0" 
                            src={mapUrl}
                            style={{ border: 'none', minHeight: '500px' }}
                            title="Nearby Resources Map"
                        ></iframe>
                        {userLocation && (
                            <p className="text-xs text-center text-gray-600 p-2">Map centered on your current location ({centerMap.lat.toFixed(3)}, {centerMap.lng.toFixed(3)})</p>
                        )}
                        
                    </div>

                    {/* --- Left Column: Resource List --- */}
                    <div className="lg:col-span-1 flex flex-col space-y-4">
                        
                        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                <Search className="w-5 h-5 mr-2" /> Search & Filter
                            </h3>
                            <input type="text" placeholder="Search resources..." className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3" />
                            <select className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700">
                                <option>Filter by Type...</option>
                                <option>Therapist/Counselor</option>
                            </select>
                        </div>
                        
                        <div className="flex-1 bg-white p-4 rounded-xl shadow-md border border-gray-200 overflow-y-auto space-y-3">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                <HeartPulse className="w-5 h-5 mr-2 text-red-500" /> Resource Listings
                            </h3>
                            
                            {resources.length === 0 ? (
                                <p className="text-gray-500 italic">No resources found in your database.</p>
                            ) : (
                                resources.map(resource => (
                                    <div key={resource._id} className="p-3 border border-gray-100 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer">
                                        <p className="font-semibold text-gray-800">{resource.name}</p>
                                        <p className="text-indigo-600 text-sm">Type: {resource.type}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                                            <span>{resource.address}</span>
                                            <a href={`tel:${resource.contact}`} className="flex items-center text-blue-500 hover:underline">
                                                <PhoneCall className='w-3 h-3 mr-1' /> Contact
                                            </a>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resources;
