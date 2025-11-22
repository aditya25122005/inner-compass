import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import API from "../services/api.js";

import {
    User,
    Mail,
    Calendar,
    Upload,
    Loader2,
    ArrowLeft,
    UserCircle2,
    BadgeInfo,
} from 'lucide-react';

const ProfilePage = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: "", age: "", sex: "" });
    const [profileImgUrl, setProfileImgUrl] = useState(
        "https://placehold.co/200x200/4F46E5/FFFFFF?text=User"
    );
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Load user details
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                age: user.age || "",
                sex: user.sex || "",
            });

            setProfileImgUrl(
                user.profileImageUrl ||
                "https://placehold.co/200x200/4F46E5/FFFFFF?text=User"
            );
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // =============================
    // 📸 IMAGE UPLOAD
    // =============================
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setMessage("Uploading Image...");
        const payload = new FormData();
        payload.append("profileImage", file);

        try {
            const response = await API.post("/auth/profile/image", payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const imgUrl = response.data.profileImageUrl;
            setProfileImgUrl(imgUrl);

            login({ ...user, profileImageUrl: imgUrl }, localStorage.getItem("accessToken"));
            setMessage("Profile Picture Updated!");
        } catch (error) {
            console.log(error);
            setMessage("Image upload failed.");
        }
    };

    // =============================
    // ✏ UPDATE PROFILE
    // =============================
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await API.put("/auth/profile", formData);
            login({ ...user, ...response.data.user }, localStorage.getItem("accessToken"));
            setIsEditing(false);
            setMessage("Profile updated successfully!");
        } catch (error) {
            console.log(error);
            setMessage("Update failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // 🌐 VIEW MODE
    // =============================
    const ViewMode = () => (
        <div className="space-y-5">

            <div className="flex items-center space-x-3 text-gray-700">
                <User className="w-5 h-5 text-indigo-600" />
                <span className="font-medium w-24">Name:</span>
                <span className="text-gray-900">{user?.name}</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
                <Mail className="w-5 h-5 text-indigo-600" />
                <span className="font-medium w-24">Email:</span>
                <span className="text-gray-900">{user?.email}</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <span className="font-medium w-24">Age:</span>
                <span className="text-gray-900">{user?.age}</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-700">
                <UserCircle2 className="w-5 h-5 text-indigo-600" />
                <span className="font-medium w-24">Sex:</span>
                <span className="capitalize text-gray-900">{user?.sex}</span>
            </div>

            <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
                Edit Profile
            </button>
        </div>
    );

    // =============================
    // ✏ EDIT MODE
    // =============================
    const EditMode = () => (
        <form onSubmit={handleProfileUpdate} className="space-y-4">

            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Full Name"
            />

            <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Age"
            />

            <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>

            <div className="flex space-x-4 pt-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                </button>

                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition shadow"
                >
                    Cancel
                </button>
            </div>
        </form>
    );

    // =============================
    // 🌟 MAIN RETURN (with Better UI)
    // =============================
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

            {/* BACK BUTTON */}
            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center mb-6 text-indigo-600 hover:text-indigo-800 transition"
            >
                <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
            </button>

            {/* CARD */}
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-10 border border-gray-200">

                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <BadgeInfo className="w-7 h-7 text-indigo-600" />
                    Profile Settings
                </h1>

                <div className="flex flex-col md:flex-row gap-10">

                    {/* LEFT */}
                    <div className="w-full md:w-1/3 flex flex-col items-center">

                        {/* Avatar */}
                        <div className="relative w-36 h-36 mb-4">
                            <img
                                src={profileImgUrl}
                                className="w-full h-full rounded-full object-cover shadow-xl border-4 border-indigo-500"
                            />

                            {/* Upload Button */}
                            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow cursor-pointer hover:bg-indigo-700 transition">
                                <Upload className="w-4 h-4" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>

                        {/* Username */}
                        <p className="text-gray-600 mb-3 text-sm">{user?.username}</p>

                        {/* Status message */}
                        {message && <p className="text-sm text-indigo-600">{message}</p>}
                    </div>

                    {/* RIGHT */}
                    <div className="w-full md:w-2/3">

                        <h2 className="text-xl font-semibold text-gray-800 mb-5">
                            Personal Information
                        </h2>

                        {isEditing ? <EditMode /> : <ViewMode />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
