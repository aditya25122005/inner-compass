import asyncHandler from 'express-async-handler';
import axios from 'axios';

// Get Google Maps API Key from environment
const getGoogleMapsApiKey = () => {
    return process.env.GOOGLE_MAPS_API_KEY || '';
};

// Get nearby therapists and psychologists using Google Places API
const getNearbyResources = asyncHandler(async (req, res) => {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
        return res.status(400).json({
            success: false,
            message: 'Latitude and longitude are required'
        });
    }

    const apiKey = getGoogleMapsApiKey();
    
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        console.error('Google Maps API key not configured');
        return res.status(500).json({
            success: false,
            message: 'Google Maps API key not configured. Please add GOOGLE_MAPS_API_KEY to .env file'
        });
    }

    try {
        // Search for psychologists and therapists within 10km radius
        const radius = 10000; // 10km in meters
        const location = `${lat},${lng}`;
        
        // Search for mental health professionals
        const searchKeywords = [
            'psychologist',
            'therapist',
            'mental health counselor',
            'psychiatrist',
            'counseling center'
        ];

        const allResults = [];

        for (const keyword of searchKeywords) {
            const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
                params: {
                    location: location,
                    radius: radius,
                    keyword: keyword,
                    key: apiKey
                }
            });

            if (response.data.results) {
                allResults.push(...response.data.results);
            }
        }

        // Remove duplicates based on place_id
        const uniquePlaces = Array.from(
            new Map(allResults.map(place => [place.place_id, place])).values()
        );

        // Format the results
        const formattedResources = uniquePlaces.map(place => ({
            _id: place.place_id,
            name: place.name,
            type: place.types?.includes('hospital') ? 'Clinic' : 
                  place.types?.includes('doctor') ? 'Therapist' : 'Mental Health Professional',
            address: place.vicinity || place.formatted_address || 'Address not available',
            contact: place.formatted_phone_number || 'Contact not available',
            rating: place.rating || 'N/A',
            location: {
                type: 'Point',
                coordinates: [place.geometry.location.lng, place.geometry.location.lat]
            },
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            isOpen: place.opening_hours?.open_now || null
        }));

        res.status(200).json({
            success: true,
            data: formattedResources,
            count: formattedResources.length,
            message: `Found ${formattedResources.length} mental health professionals nearby`
        });

    } catch (error) {
        console.error('Google Places API Error:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch nearby resources',
            error: error.message
        });
    }
});

// Get Google Maps API configuration for frontend
const getMapConfig = asyncHandler(async (req, res) => {
    const apiKey = getGoogleMapsApiKey();
    
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        return res.status(500).json({
            success: false,
            message: 'Google Maps API key not configured'
        });
    }

    res.status(200).json({
        success: true,
        apiKey: apiKey
    });
});

export { getNearbyResources, getMapConfig };
