import React, { useEffect, useState, useMemo } from "react";
import { journalAPI } from "../services/api";
import JournalChart from "../components/JournalChart";

// Valid Lucide Icons
import {
  Smile,
  Frown,
  AlertCircle,
  SmilePlus,
  ArrowLeft,
  Loader2,
  Search
} from "lucide-react";

import { Link } from "react-router-dom";

const moods = ["all", "happy", "sad", "anxious", "calm", "angry", "neutral"];

// ---------------- ICON FUNCTION ----------------
function moodIcon(m) {
  if (m === "happy") return <Smile className="w-6 h-6 text-yellow-500" />;
  if (m === "sad") return <Frown className="w-6 h-6 text-blue-500" />;
  if (m === "anxious") return <AlertCircle className="w-6 h-6 text-orange-500" />;
  if (m === "calm") return <SmilePlus className="w-6 h-6 text-green-500" />;
  if (m === "angry")
    return <AlertCircle className="w-6 h-6 text-red-500" />; // closest available

  return <Smile className="w-6 h-6 text-gray-400" />;
}

// ---------------------------------------------------------------------
const JournalHistory = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [error, setError] = useState(null);

  // ---------------- FETCH ENTRIES ----------------
  const fetchEntries = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit,
        q: query || undefined,
        mood: moodFilter !== "all" ? moodFilter : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const res = await journalAPI.getEntries(params);

      setEntries(res.entries || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Journal fetch error:", err);
      setError("Could not load journal entries. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [page, moodFilter, dateFrom, dateTo]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEntries();
  };

  const analytics = useMemo(() => {
    const labels = [];
    const series = [];

    entries.forEach((e) => {
      labels.push(new Date(e.createdAt).toLocaleDateString());
      const stress = e.analysis?.stressLevel ?? null;
      const score =
        stress !== null
          ? 100 - stress
          : ((e.analysis?.sentimentScore ?? 0) + 1) * 50;
      series.push(Math.round(score));
    });

    return { labels, series };
  }, [entries]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Journal History</h1>
          <p className="text-sm text-gray-500">
            View past reflections, AI insights & mental trends.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="px-4 py-2 rounded bg-white shadow text-sm flex items-center gap-2"
        >
          <ArrowLeft /> Back
        </Link>
      </div>

            {/* Banner (FIXED: Used a stable placeholder URL) */}
      <div className="rounded-xl overflow-hidden mb-6 border border-gray-200">
        <img
          src="https://placehold.co/1200x200/4c4567/FFFFFF?text=My+Wellness+Journey" // Stable placeholder URL
          alt="journal header"
          className="w-full h-40 object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search journal text..."
                  className="w-full border rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-indigo-200"
                />
                <Search className="absolute left-3 top-2 text-gray-400" />
              </div>
            </form>

            <select
              value={moodFilter}
              onChange={(e) => {
                setMoodFilter(e.target.value);
                setPage(1);
              }}
              className="border px-3 py-2 rounded-lg"
            >
              {moods.map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="border px-2 py-2 rounded-lg"
            />

            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="border px-2 py-2 rounded-lg"
            />
          </div>

          {/* Entries List */}
          <div className="bg-white border rounded-lg p-4 shadow-sm min-h-[200px]">
            {loading ? (
              <div className="text-center py-20 flex justify-center">
                <Loader2 className="animate-spin mr-2" /> Loading...
              </div>
            ) : error ? (
              <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>
            ) : entries.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No journal entries found.
              </div>
            ) : (
              <ul className="space-y-3">
                {entries.map((entry) => (
                  <li
                    key={entry._id}
                    className="border rounded-lg p-3 hover:shadow transition cursor-pointer"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex items-start gap-3">
                      <div>{moodIcon(entry.mood)}</div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-gray-900">
                            {entry.text.slice(0, 120)}...
                          </h3>
                          <span className="text-xs text-gray-400">
                            {new Date(entry.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          Emotion: {entry.analysis?.emotion} • Sentiment:{" "}
                          {(entry.analysis?.sentimentScore ?? 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Pagination */}
            {!loading && entries.length > 0 && (
              <div className="flex justify-between mt-4">
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>

                <div className="space-x-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SECTION — CHART */}
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Mental Trend</h3>
            <JournalChart labels={analytics.labels} series={analytics.series} />
            <p className="text-sm text-gray-600 mt-2">
              Higher score = better emotional stability.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-2xl p-6 rounded-lg relative shadow-lg">
            <button
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setSelectedEntry(null)}
            >
              Close
            </button>

            <h2 className="text-xl font-bold mb-3">
              {new Date(selectedEntry.createdAt).toLocaleString()}
            </h2>

            <div className="text-sm text-gray-600 mb-4">
              Mood: <strong>{selectedEntry.mood}</strong> • Emotion:{" "}
              <strong>{selectedEntry.analysis?.emotion}</strong>
            </div>

            <p className="text-gray-800 whitespace-pre-wrap mb-4">
              {selectedEntry.text}
            </p>

            <h3 className="font-semibold">AI Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">
              Sentiment Score:{" "}
              {(selectedEntry.analysis?.sentimentScore ?? 0).toFixed(2)}
              <br />
              Stress Level: {selectedEntry.analysis?.stressLevel ?? "—"}
              <br />
              Keywords:{" "}
              {selectedEntry.analysis?.keywords?.join(", ") || "None"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalHistory;
