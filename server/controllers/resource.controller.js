import asyncHandler from 'express-async-handler';

const MOCK_RESOURCES = [
    {
        _id: 'res1',
        name: 'City Wellness Center',
        type: 'Clinic',
        address: '123 Civil Lines, New Delhi',
        contact: '011-23456789',
        // Coordinates for New Delhi (Example)
        location: { type: 'Point', coordinates: [77.2090, 28.6139] } 
    },
    {
        _id: 'res2',
        name: 'Dr. Priya Sharma, Psychologist',
        type: 'Therapist',
        address: '45 Connaught Place, New Delhi',
        contact: '9876543210',
        location: { type: 'Point', coordinates: [77.2100, 28.6200] } 
    },
    {
        _id: 'res3',
        name: 'Anxiety Support Group',
        type: 'Support Group',
        address: 'Online & Local Meetup',
        contact: '9988776655',
        location: { type: 'Point', coordinates: [77.1900, 28.6050] } 
    }
];

// @desc    Get nearby mental health resources (doctors, centers, groups)
// @route   GET /api/resources/nearby
// @access  Private (Requires authentication/token)
const getNearbyResources = asyncHandler(async (req, res) => {
    // FUTURE: In a real scenario, we would read the user's current location (lat/lng) 
    //         from req.query and use MongoDB's Geospatial query here, or call the Google Places API.

    // For now, we return the MOCK data to fix the frontend 404 error
    res.status(200).json({
        data: MOCK_RESOURCES,
        message: 'Successfully loaded nearby resources (MOCK data).'
    });
});

export { getNearbyResources };