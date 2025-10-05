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
        <span className="text-xl leading-none" role="img" aria-label={mood}>
            {icons[mood] || '😐'}
        </span>
    );
};

const JournalCompact = () => {
    const [entries, setEntries] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const loadJournalEntries = async () => {
            setIsLoading(true);
            try {
                const data = await journalAPI.getAllEntries();
                setEntries(data);
            } catch (error) {
                console.error("Failed to load journal entries for dashboard:", error);
                setEntries([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadJournalEntries();
    }, []);

    const renderContent = () => {
        if (isLoading || entries === null) {
            return (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                    <span className="ml-3 text-gray-500">Loading Journal...</span>
                </div>
            );
        }

        const latestEntries = entries.slice(0, 3);

        if (latestEntries.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center py-4">
                    <BookOpen className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-lg font-semibold text-gray-700">No Entries Yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start your reflection journey now.</p>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {latestEntries.map((entry, index) => (
                    <div 
                        key={index} 
                        className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                        <MoodIcon mood={entry.mood} />
                        <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                                {entry.text.substring(0, 50)}...
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
            <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg">
                    <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Digital Journal</h3>
                    <p className="text-sm text-gray-500">Latest Reflections</p>
                </div>
            </div>
            
            <div className="flex-1 min-h-0 overflow-y-auto">
                {renderContent()}
            </div>

            {/* Link to full Journal Page */}
            <Link
                to="/journal"
                className="mt-4 flex items-center justify-center py-2 text-purple-600 text-sm font-medium border-t border-gray-100 group hover:text-purple-700 transition-colors"
            >
                <span>Write New / View All</span>
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
        </div>
    );
};

export default JournalCompact;
