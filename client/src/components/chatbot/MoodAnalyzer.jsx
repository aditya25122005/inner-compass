import React, { useState } from 'react';
import { ArrowLeft, Heart, BookOpen, Sparkles, Loader2, Send } from 'lucide-react';
import chatbotAPI from '../../services/chatbotApi';

const MoodAnalyzer = ({ onBack }) => {
  const [moodText, setMoodText] = useState('');
  const [moodAnalysis, setMoodAnalysis] = useState(null);
  const [journalPrompt, setJournalPrompt] = useState(null);
  const [journalTopic, setJournalTopic] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [error, setError] = useState(null);

  const analyzeMood = async (e) => {
    e.preventDefault();
    
    if (!moodText.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await chatbotAPI.analyzeMood(moodText);
      if (result.success) {
        setMoodAnalysis(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to analyze mood');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateJournalPrompt = async (topic = null) => {
    setIsGeneratingPrompt(true);
    setError(null);

    try {
      const result = await chatbotAPI.generateJournalPrompt(topic);
      if (result.success) {
        setJournalPrompt(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to generate journal prompt');
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleJournalPromptSubmit = (e) => {
    e.preventDefault();
    generateJournalPrompt(journalTopic.trim() || null);
  };

  const suggestedTopics = [
    'Gratitude', 'Mindfulness', 'Self-reflection', 'Goals', 'Relationships', 
    'Stress', 'Joy', 'Growth', 'Challenges', 'Dreams'
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Heart className="h-6 w-6 text-pink-600" />
          <h1 className="text-xl font-semibold text-gray-800">Mood & Reflection Tools</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Error Banner */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="text-red-500 hover:text-red-700 text-sm underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mood Analyzer */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-pink-600" />
              Mood Analysis
            </h2>
            <p className="text-gray-600 mb-4">
              Share how you're feeling, and I'll help you understand your emotional state with insights and suggestions.
            </p>

            <form onSubmit={analyzeMood} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling today?
                </label>
                <textarea
                  value={moodText}
                  onChange={(e) => setMoodText(e.target.value)}
                  placeholder="Describe your emotions, thoughts, or what's on your mind..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
                  rows="4"
                  disabled={isAnalyzing}
                />
              </div>
              
              <button
                type="submit"
                disabled={isAnalyzing || !moodText.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg hover:from-pink-600 hover:to-rose-700 focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing your mood...</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    <span>Analyze My Mood</span>
                  </>
                )}
              </button>
            </form>

            {/* Mood Analysis Results */}
            {moodAnalysis && (
              <div className="mt-6 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                <h3 className="font-medium text-pink-800 mb-2">Mood Analysis Results</h3>
                <div className="text-sm text-pink-700">
                  <p className="mb-2"><strong>Message:</strong> {moodAnalysis.message}</p>
                  <div className="bg-white p-3 rounded border">
                    <p className="whitespace-pre-wrap">{moodAnalysis.analysis}</p>
                  </div>
                  <p className="text-xs text-pink-600 mt-2">
                    Analyzed on {new Date(moodAnalysis.analyzedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Journal Prompt Generator */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Journal Prompt Generator
            </h2>
            <p className="text-gray-600 mb-4">
              Get personalized journal prompts to guide your self-reflection and emotional growth.
            </p>

            <form onSubmit={handleJournalPromptSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic (optional)
                </label>
                <input
                  type="text"
                  value={journalTopic}
                  onChange={(e) => setJournalTopic(e.target.value)}
                  placeholder="e.g., gratitude, self-care, goals..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isGeneratingPrompt}
                />
              </div>

              {/* Suggested Topics */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Quick topics:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        setJournalTopic(topic);
                        generateJournalPrompt(topic);
                      }}
                      disabled={isGeneratingPrompt}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isGeneratingPrompt}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isGeneratingPrompt ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Generating prompt...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Journal Prompt</span>
                  </>
                )}
              </button>
            </form>

            {/* Journal Prompt Results */}
            {journalPrompt && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Your Journal Prompt
                </h3>
                <div className="text-sm text-blue-700">
                  <p className="mb-2">
                    <strong>Topic:</strong> {journalPrompt.topic}
                  </p>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {journalPrompt.prompt}
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Generated on {new Date(journalPrompt.generatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-3 flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Reflection Tips
            </h3>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Take a few deep breaths before analyzing your mood or journaling
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Be honest with yourself - there are no wrong feelings
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Use journal prompts as starting points, but let your thoughts flow naturally
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Regular reflection can help you better understand your emotional patterns
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodAnalyzer;
