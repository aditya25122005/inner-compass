import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const API_URL = "http://localhost:8000/api/journal";

const Journal = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoodSelect = (selectedMood) => setMood(selectedMood);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!entry.trim() || !mood) {
      setMessage("Please write an entry and select a mood.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await axios.post(
        API_URL,
        { text: entry, mood, userId: user?._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Journal entry saved successfully! 🎉");
      setEntry("");
      setMood("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "An error occurred while saving. Please check your server."
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E8FF] via-[#F7F5FF] to-[#E4F0FF] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 relative overflow-hidden border border-purple-100 animate-fadeIn">

        {/* Decorative Background Soft Pattern */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1503676260728-1c00da094a0b")',
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Write Your Journal ✍️
          </h1>
          <p className="text-gray-500 mb-8">
            Your private space to express your thoughts and reflect on your
            emotions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Textarea */}
            <textarea
              className="w-full p-5 rounded-2xl border border-gray-300 shadow-sm bg-white text-gray-700 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all resize-none"
              rows="7"
              placeholder="How are you feeling today? Write freely..."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              disabled={isSubmitting}
            ></textarea>

            {/* Mood Selector */}
            <div>
              <p className="font-medium text-gray-700 mb-3 text-lg">
                Select your mood
              </p>
              <div className="flex gap-3">
                <MoodButton mood="happy" label="😊" currentMood={mood} onClick={handleMoodSelect} />
                <MoodButton mood="calm" label="😌" currentMood={mood} onClick={handleMoodSelect} />
                <MoodButton mood="sad" label="😢" currentMood={mood} onClick={handleMoodSelect} />
                <MoodButton mood="angry" label="😡" currentMood={mood} onClick={handleMoodSelect} />
                <MoodButton mood="anxious" label="😥" currentMood={mood} onClick={handleMoodSelect} />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !entry.trim() || !mood}
              className={`w-full py-3 text-lg font-semibold rounded-xl shadow-md transition-all flex items-center justify-center ${
                isSubmitting || !entry.trim() || !mood
                  ? "bg-purple-300 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white hover:scale-[1.02]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Save Journal Entry"
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <p
              className={`mt-5 text-center font-medium ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;

/* ---------------- MOOD BUTTON ---------------- */
const MoodButton = ({ mood, label, currentMood, onClick }) => {
  const active = currentMood === mood;

  const moodColors = {
    happy: "bg-yellow-300",
    calm: "bg-green-300",
    sad: "bg-blue-300",
    angry: "bg-red-400",
    anxious: "bg-orange-300",
  };

  return (
    <button
      type="button"
      onClick={() => onClick(mood)}
      className={`w-14 h-14 flex items-center justify-center text-3xl rounded-full 
      shadow-md transition-transform duration-200 
      ${
        active
          ? `${moodColors[mood]} scale-125 ring-4 ring-white`
          : "bg-gray-200 hover:scale-110"
      }
      `}
    >
      {label}
    </button>
  );
};
