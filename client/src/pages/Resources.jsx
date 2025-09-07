import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

// A simple marker component for the map
const Marker = ({ text }) => (
  <div className="bg-red-500 text-white rounded-full p-2 shadow-lg ring-4 ring-white" style={{ position: 'relative', transform: 'translate(-50%, -50%)' }}>
    {text}
  </div>
);

const Resources = () => {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default map location (you can change this to your location)
  const defaultProps = {
    center: {
      lat: 28.6139,
      lng: 77.2090
    },
    zoom: 11
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/resources/nearby', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResources(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch resources. Please try again later.");
        setLoading(false);
      }
    };
    fetchResources();
  }, [token]);

  if (loading) {
    return <div className="text-center p-8 text-xl">Loading resources...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Map Section */}
      <div className="w-full lg:w-2/3 h-96 lg:h-auto border-r border-gray-200">
        <GoogleMapReact
          bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          {resources.map((resource) => (
            <Marker
              key={resource._id}
              lat={resource.location.coordinates[1]}
              lng={resource.location.coordinates[0]}
              text={resource.name}
            />
          ))}
        </GoogleMapReact>
      </div>

      {/* Resources List Section */}
      <div className="w-full lg:w-1/3 p-6 bg-white overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Nearby Resources</h2>
        <p className="text-gray-600 mb-6">Find mental health professionals and centers near you.</p>
        
        {resources.length === 0 ? (
          <p className="text-gray-500 italic">No resources found in your area.</p>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource._id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{resource.name}</h3>
                <p className="text-sm text-gray-600">Type: {resource.type}</p>
                <p className="text-sm text-gray-600">Address: {resource.address}</p>
                <a href={`tel:${resource.contact}`} className="text-blue-500 hover:underline text-sm font-medium mt-2 block">
                  Contact: {resource.contact}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;