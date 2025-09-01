import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/journal");
        const data = await response.json();

        // Process data to count entries per day
        const countsByDate = data.reduce((acc, entry) => {
          const date = new Date(entry.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Prepare data for Chart.js
        const labels = Object.keys(countsByDate);
        const dataPoints = Object.values(countsByDate);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Journal Entries Over Time",
              data: dataPoints,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
              fill: false,
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
        setLoading(false);
      }
    };

    fetchJournalEntries();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="container mt-5">
      <div className="card shadow-sm p-4">
        <h2 className="card-title text-center mb-4">Your Wellness Dashboard</h2>
        {loading ? (
          <p className="text-center">Loading your data...</p>
        ) : chartData.labels.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p className="text-center">
            No journal entries to display yet. Start by adding one!
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
