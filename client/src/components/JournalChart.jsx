// src/components/JournalChart.jsx
import React from "react";
import ReactApexChart from "react-apexcharts";

const JournalChart = ({ labels = [], series = [] }) => {
  const chartOptions = {
    chart: { id: "mental-score", toolbar: { show: false } },
    xaxis: { categories: labels },
    yaxis: { min: 0, max: 100 },
    stroke: { curve: "smooth" },
    markers: { size: 4 },
    tooltip: { enabled: true },
  };

  const chartSeries = [
    {
      name: "Mental Score",
      data: series,
    },
  ];

  return (
    <div>
      <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={260} />
    </div>
  );
};

export default JournalChart;
