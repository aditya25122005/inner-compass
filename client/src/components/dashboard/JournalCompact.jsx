import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Loader2, ArrowRight } from 'lucide-react';
import { journalAPI } from '../../services/api.js';

const MoodIcon = ({ mood }) => {
    const icons = {
        happy: '😊',
        calm: '😌',
        sad: '😢',
        angry: '😡',
        anxious: '😥',
    };
    return (
        <span className="text-2xl leading-none" role="img" aria-label={mood}>
            {icons[mood] || '😐'}
        </span>
    );
};

const JournalCompact = () => {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadJournalEntries = async () => {
            setIsLoading(true);
            try {
                const data = await journalAPI.getAllEntries();

                // 🔥 FIXED: handle array & paginated response
                if (Array.isArray(data)) {
                    setEntries(data);
                } else if (Array.isArray(data.entries)) {
                    setEntries(data.entries);
                } else {
                    setEntries([]);
                }

            } catch (error) {
                console.error("Failed to load journal entries:", error);
                setEntries([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadJournalEntries();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-full py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                    <span className="ml-3 text-gray-500">Loading...</span>
                </div>
            );
        }

        const latest = entries.slice(0, 3);

        if (latest.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center text-center py-6">
                    <BookOpen className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-lg font-semibold text-gray-700">No Entries Yet</p>
                    <p className="text-sm text-gray-500">Start journaling to see history here.</p>
                </div>
            );
        }

        return (
            <div className="space-y-3 animate-fade-in">
                {latest.map((entry, index) => (
                    <div
                        key={index}
                        className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition duration-200"
                    >
                        <MoodIcon mood={entry.mood} />
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-800 truncate">
                                {entry.text.length > 50
                                    ? entry.text.substring(0, 50) + "..."
                                    : entry.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(entry.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}

                {entries.length > 3 && (
                    <p className="text-xs text-center text-gray-500 pt-2">
                        +{entries.length - 3} more entries
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">

            {/* Header */}
            <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl shadow-md">
                    <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">Digital Journal</h3>
                    <p className="text-sm text-gray-500">Latest Reflections</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                {renderContent()}
            </div>

            {/* Footer buttons */}
            <div className="mt-4 border-t border-gray-100 pt-3 flex items-center justify-between">

                <Link
                    to="/journal"
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                    Write New
                </Link>

                <Link
                    to="/journal-history"
                    className="text-purple-600 hover:text-purple-800 font-medium text-sm flex items-center group"
                >
                    View All
                    <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default JournalCompact;
