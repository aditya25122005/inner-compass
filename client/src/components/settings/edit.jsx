import React, { useState, useRef } from 'react';
import { LucidePencil, LucideUpload, LucideUser } from 'lucide-react';

const EditProfile = ({ profileImageUrl, setProfileImageUrl }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('Female');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImageUrl(e.target.result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Profile updated:', { name, age, sex, profileImageUrl });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-white">Edit Profile</h2>
      
      {/* Profile Image Section */}
      <div className="profile-image-section mb-6">
        <div className="profile-image-container">
          <div className="profile-image-wrapper">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="profile-edit-image"
              />
            ) : (
              <div className="profile-placeholder">
                <LucideUser size={40} className="text-gray-400" />
              </div>
            )}
            <button
              type="button"
              onClick={triggerImageUpload}
              className="profile-edit-btn"
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="loading-spinner-sm" />
              ) : (
                <LucidePencil size={16} />
              )}
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <p className="text-sm text-gray-400 text-center mt-2">Click the pencil to change your profile picture</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-400">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2"
            placeholder="Enter your age"
          />
        </div>
        <div>
          <label htmlFor="sex" className="block text-sm font-medium text-gray-400">Sex</label>
          <select
            id="sex"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 p-2"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
      >
        Save Profile
      </button>
    </form>
  </div>
);

export default EditProfile;