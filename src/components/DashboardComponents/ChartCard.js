import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartCard = () => {
  const [counts, setCounts] = useState({
    totalProjects: 0,
    apps: 0,
    websites: 0,
    marketing: 0,
    staff: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);

        // Fetch project counts
        const countsRes = await fetch("https://admin-emp.onrender.com/api/counts");
        const countsData = await countsRes.json();

        // Fetch staff count
        const staffRes = await fetch("https://admin-emp.onrender.com/api/get_all_staffs");
        const staffData = await staffRes.json();

        if (countsData.success && staffData.success) {
          setCounts({
            totalProjects: countsData.totalProjects || 0,
            apps: countsData.categoryCounts?.["mobile app"] || 0,
            websites: countsData.categoryCounts?.["website"] || 0,
            marketing: countsData.categoryCounts?.["digital market"] || 0,
            staff: staffData.count || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const data = {
    labels: ["Projects", "Apps", "Websites", "Marketing", "Staff"],
    datasets: [
      {
        label: "Count",
        data: [
          counts.totalProjects,
          counts.apps,
          counts.websites,
          counts.marketing,
          counts.staff,
        ],
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#6f42c1"],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Dashboard Overview", font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true, stepSize: 1 },
    },
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h5 className="fw-semibold mb-4">Graphical Representation</h5>
        {loading ? (
          <div className="text-center text-muted">Loading chart...</div>
        ) : (
          <div style={{ height: "100%" }}>
            <Bar data={data} options={options} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;
