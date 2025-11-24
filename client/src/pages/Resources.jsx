import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Loader2, PhoneCall, MapPin, AlertTriangle, Brain, ArrowLeft, Phone, X, Star } from 'lucide-react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const Resources = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [showHelplines, setShowHelplines] = useState(false);

    // Default map coordinates (New Delhi)
    const DEFAULT_LAT = 28.6139;
    const DEFAULT_LNG = 77.2090;

    const mapContainerStyle = {
        width: '100%',
        height: '100%',
        minHeight: '500px'
    };

    const mapOptions = {
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
    };

    // Helplines data
    const helplines = [
        { name: '988 Suicide & Crisis Lifeline', number: '988', description: '24/7 Crisis Support' },
        { name: 'Vandrevala Foundation', number: '9999666555', description: 'Mental Health Helpline' },
        { name: 'iCall', number: '9152987821', description: 'Psychosocial Helpline' },
        { name: 'AASRA', number: '9820466726', description: 'Suicide Prevention' },
        { name: 'Sneha India', number: '914424640050', description: '24/7 Emotional Support' },
        { name: 'Crisis Text Line', number: '741741', description: 'Text CONNECT', isSMS: true }
    ];

    useEffect(() => {
        if (!token) {
            setError("Please log in to access resources.");
            setLoading(false);
            return;
        }

        // Load Google Maps API Key
        const loadMapConfig = async () => {
            try {
                const response = await API.get('/resources/map-config');
                if (response.data.success) {
                    setGoogleMapsApiKey(response.data.apiKey);
                }
            } catch (err) {
                console.error('Failed to load map config:', err);
                setError('Failed to load map configuration');
            }
        };

        loadMapConfig();
        
        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    fetchResources(latitude, longitude); 
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    setError("Location access denied. Using default location.");
                    setUserLocation({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
                    fetchResources(DEFAULT_LAT, DEFAULT_LNG);
                }
            );
        } else {
            setError("Geolocation not supported. Using default location.");
            setUserLocation({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
            fetchResources(DEFAULT_LAT, DEFAULT_LNG);
        }
    }, [token]);

    const fetchResources = async (lat, lng) => {
        setLoading(true);
        try {
            const response = await API.get(`/resources/nearby?lat=${lat}&lng=${lng}`);
            
            if (response.data.success) {
                setResources(response.data.data || []);
            }
            setLoading(false);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.response?.data?.message || "Failed to fetch nearby resources.");
            setLoading(false);
        }
    };

    const handleCall = (number) => {
        window.location.href = `tel:${number}`;
    };

    const centerMap = userLocation || { lat: DEFAULT_LAT, lng: DEFAULT_LNG };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <p className="text-xl text-gray-700">Loading resources...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex flex-col" style={{
            background: 'linear-gradient(135deg, #E8D5F2 0%, #F5E6D3 50%, #F4DCD6 100%)'
        }}>
            
            {/* Top Navbar */}
            <div className="bg-white/80 backdrop-blur-sm shadow-md border-b border-purple-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Inner Compass</h1>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Dashboard</span>
                    </button>
                </div>
            </div>

            {/* Crisis Hotline Bar */}
            <div className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 flex justify-between items-center shadow-lg">
                <div className='flex items-center'>
                    <AlertTriangle className="w-5 h-5 mr-3 animate-pulse" />
                    <span className='font-semibold'>IN CRISIS? IMMEDIATE HELP AVAILABLE 24/7</span>
                </div>
                <button 
                    onClick={() => setShowHelplines(true)}
                    className='px-4 py-1.5 bg-white text-red-500 rounded-full text-sm font-bold hover:bg-red-50 flex items-center space-x-2 shadow-md transition-all duration-300 hover:shadow-lg'
                >
                    <Phone className="w-4 h-4" />
                    <span>View Helplines</span>
                </button>
            </div>

            <div className="max-w-7xl mx-auto w-full p-6 flex-1">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                        <MapPin className="w-7 h-7 mr-3 text-purple-600" /> 
                        Nearby Mental Health Professionals
                    </h2>
                    <p className="text-gray-700 mt-2 font-medium">Psychologists & Therapists within 10km radius</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
                    
                    {/* Google Map */}
                    <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
                        {googleMapsApiKey ? (
                            <LoadScript googleMapsApiKey={googleMapsApiKey}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={centerMap}
                                    zoom={13}
                                    options={mapOptions}
                                >
                                    {/* User Location Marker (Blue) */}
                                    {userLocation && (
                                        <Marker
                                            position={userLocation}
                                            icon={{
                                                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                            }}
                                            title="Your Location"
                                        />
                                    )}

                                    {/* Resource Markers (Green) */}
                                    {resources.map((resource) => (
                                        <Marker
                                            key={resource._id}
                                            position={{ lat: resource.lat, lng: resource.lng }}
                                            icon={{
                                                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                                            }}
                                            onClick={() => setSelectedPlace(resource)}
                                        />
                                    ))}

                                    {/* Info Window */}
                                    {selectedPlace && (
                                        <InfoWindow
                                            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                                            onCloseClick={() => setSelectedPlace(null)}
                                        >
                                            <div className="p-2">
                                                <h3 className="font-bold text-gray-800">{selectedPlace.name}</h3>
                                                <p className="text-sm text-indigo-600">{selectedPlace.type}</p>
                                                <p className="text-xs text-gray-600 mt-1">{selectedPlace.address}</p>
                                                {selectedPlace.rating && selectedPlace.rating !== 'N/A' && (
                                                    <div className="flex items-center mt-1">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                        <span className="text-xs ml-1">{selectedPlace.rating}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </InfoWindow>
                                    )}
                                </GoogleMap>
                            </LoadScript>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500">Loading map...</p>
                            </div>
                        )}
                    </div>

                    {/* Resource List */}
                    <div className="lg:col-span-1 flex flex-col space-y-4">
                        <div className="flex-1 bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-2xl border border-purple-100 overflow-y-auto">
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-purple-600" /> 
                                Found: {resources.length} Professionals
                            </h3>
                            
                            {error && (
                                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 mb-3">
                                    <p className="text-sm text-orange-800">{error}</p>
                                </div>
                            )}
                            
                            {resources.length === 0 ? (
                                <p className="text-gray-500 italic text-center mt-8">No resources found nearby.</p>
                            ) : (
                                <div className="space-y-3">
                                    {resources.map(resource => (
                                        <div 
                                            key={resource._id} 
                                            className="p-4 border border-purple-100 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer"
                                            onClick={() => setSelectedPlace(resource)}
                                        >
                                            <p className="font-semibold text-gray-800">{resource.name}</p>
                                            <p className="text-purple-600 text-sm font-medium">{resource.type}</p>
                                            <p className="text-xs text-gray-600 mt-1">{resource.address}</p>
                                            
                                            <div className="flex justify-between items-center mt-2">
                                                {resource.rating && resource.rating !== 'N/A' && (
                                                    <div className="flex items-center">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        <span className="text-sm ml-1 font-medium">{resource.rating}</span>
                                                    </div>
                                                )}
                                                {resource.contact && resource.contact !== 'Contact not available' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCall(resource.contact);
                                                        }}
                                                        className="flex items-center text-purple-600 hover:text-pink-600 text-sm font-medium transition-colors"
                                                    >
                                                        <PhoneCall className='w-4 h-4 mr-1' /> 
                                                        Call
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Helplines Modal */}
            {showHelplines && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 flex justify-between items-center rounded-t-3xl">
                            <div>
                                <h2 className="text-2xl font-bold">Crisis Helplines</h2>
                                <p className="text-sm mt-1 opacity-90">24/7 Support Available</p>
                            </div>
                            <button 
                                onClick={() => setShowHelplines(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {helplines.map((helpline, index) => (
                                <div 
                                    key={index}
                                    className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 text-lg">{helpline.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{helpline.description}</p>
                                            <p className="text-2xl font-bold text-purple-600 mt-2">
                                                {helpline.isSMS ? 'Text: ' : ''}{helpline.number}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleCall(helpline.number)}
                                            className="ml-4 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full font-semibold flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            <Phone className="w-5 h-5" />
                                            <span>Call Now</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-b-3xl border-t border-purple-200">
                            <p className="text-sm text-gray-700 text-center font-medium">
                                🔒 All calls are confidential • You are not alone • Help is available
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Resources;
