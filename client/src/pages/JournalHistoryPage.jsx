// src/pages/JournalHistoryPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { journalAPI } from "../services/api"; // adjust path if needed
import JournalChart from "../components/JournalChart";
import { Search, Loader2, ArrowLeft, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const moods = ["all", "happy", "sad", "anxious", "calm", "angry", "neutral"];

const JournalHistoryPage = () => {
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
      // res expected: { entries: [...], totalPages, page, totalCount }
      setEntries(res.entries || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch journal entries:", err);
      setError("Could not load journal entries. Make sure backend is running and you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, moodFilter, dateFrom, dateTo]);

  // When user types query, we wait and then fetch (in this snippet we'll fetch immediately on Enter)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEntries();
  };

  const handleOpenEntry = (entry) => {
    setSelectedEntry(entry);
  };

  const handleCloseModal = () => setSelectedEntry(null);

  const analytics = useMemo(() => {
    // small summary and counts for chart
    const labels = [];
    const series = [];
    entries.forEach((e) => {
      labels.push(new Date(e.createdAt).toLocaleDateString());
      // mental metric: if you stored stressLevel -> invert to mentalScore = 100 - stressLevel
      const stress = e.analysis?.stressLevel ?? null;
      const mentalScore = stress !== null ? 100 - stress : ((e.analysis?.sentimentScore ?? 0) + 1) * 50;
      series.push(Math.round(mentalScore));
    });
    return { labels, series };
  }, [entries]);

  // simple loader UI or error
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Journal History</h1>
          <p className="text-sm text-gray-500 mt-1">View past reflections, trends and AI analysis.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="px-4 py-2 rounded bg-white shadow text-sm flex items-center space-x-2">
            <ArrowLeft /> <span>Back</span>
          </Link>
        </div>
      </div>

      {/* header image (optional) */}
      <div className="rounded-xl overflow-hidden mb-6 border border-gray-200">
        <img src="/uploads/header-journal.jpg" alt="journal header" className="w-full h-40 object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Filters + list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search text / keywords..."
                  className="w-full border rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-indigo-200"
                />
                <div className="absolute left-3 top-2 text-gray-400">
                  <Search />
                </div>
              </div>
            </form>

            <div className="flex items-center space-x-2">
              <select value={moodFilter} onChange={(e) => { setMoodFilter(e.target.value); setPage(1); }} className="border px-3 py-2 rounded-lg">
                {moods.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
              </select>

              <div className="flex items-center space-x-2">
                <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }} className="border px-2 py-2 rounded-lg"/>
                <span className="text-gray-400">—</span>
                <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }} className="border px-2 py-2 rounded-lg"/>
              </div>
            </div>
          </div>

          {/* entries list */}
          <div className="bg-white border rounded-lg p-4 shadow-sm min-h-[200px]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin mr-3" /> Loading...
              </div>
            ) : error ? (
              <div className="text-red-600 p-4 bg-red-50 rounded">{error}</div>
            ) : entries.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                No journal entries found. Write a journal to see entries here.
              </div>
            ) : (
              <ul className="space-y-3">
                {entries.map(entry => (
                  <li key={entry._id} className="border rounded-lg p-3 hover:shadow cursor-pointer" onClick={() => handleOpenEntry(entry)}>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{moodEmoji(entry.mood)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">{truncate(entry.text, 160)}</h3>
                          <span className="text-xs text-gray-400">{new Date(entry.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.analysis?.emotion ? `Emotion: ${entry.analysis.emotion}` : ''} {entry.analysis?.sentimentScore !== undefined ? ` • Sentiment: ${formatSent(entry.analysis.sentimentScore)}` : ''}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* pagination */}
            {!loading && entries.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
                <div className="space-x-2">
                  <button disabled={page<=1} onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                  <button disabled={page>=totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chart + summary */}
        <div className="space-y-4">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Recent Trends</h3>
            <JournalChart labels={analytics.labels} series={analytics.series} />
            <div className="mt-3 text-sm text-gray-600">Mental score derived from latest ML stress/sentiment data (higher is better).</div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Summary</h3>
            <dl className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between"><span>Total shown</span><span>{entries.length}</span></div>
              <div className="flex justify-between"><span>Filter</span><span>{moodFilter}</span></div>
              <div className="flex justify-between"><span>Date range</span><span>{dateFrom || "—"} to {dateTo || "—"}</span></div>
            </dl>
          </div>
        </div>
      </div>

      {/* Entry Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-2xl p-6 relative shadow-lg">
            <button onClick={handleCloseModal} className="absolute right-3 top-3 text-gray-500">Close</button>
            <div className="flex items-start gap-4">
              <div className="text-3xl">{moodEmoji(selectedEntry.mood)}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{new Date(selectedEntry.createdAt).toLocaleString()}</h2>
                <p className="text-sm text-gray-600 mt-1">Mood: <strong>{selectedEntry.mood}</strong> • Emotion: <strong>{selectedEntry.analysis?.emotion}</strong></p>
                <div className="mt-4 text-gray-800 whitespace-pre-wrap">{selectedEntry.text}</div>

                <div className="mt-4">
                  <h4 className="font-semibold">AI Analysis</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    Sentiment score: {formatSent(selectedEntry.analysis?.sentimentScore)} <br />
                    Stress level: {selectedEntry.analysis?.stressLevel ?? "—"} <br />
                    Keywords: {(selectedEntry.analysis?.keywords || []).join(", ") || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n) + "..." : s;
}
function moodEmoji(m) {
  if (!m) return "😐";
  if (m === "happy") return "😊";
  if (m === "sad") return "😢";
  if (m === "anxious") return "😥";
  if (m === "calm") return "😌";
  if (m === "angry") return "😡";
  return "😐";
}
function formatSent(v) {
  if (v === undefined || v === null) return "—";
  return Number(v).toFixed(2);
}

export default JournalHistoryPage;
