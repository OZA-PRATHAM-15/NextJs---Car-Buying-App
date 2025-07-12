import React, { useState, useEffect } from "react";
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
import axiosInstance from "@/utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ManageUsers = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [genderCounts, setGenderCounts] = useState({
    Male: 0,
    Female: 0,
    Other: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axiosInstance.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;
        setTotalUsers(data.length || 0);

        const genderData = {
          Male: data.filter((user) => user.gender === "Male").length,
          Female: data.filter((user) => user.gender === "Female").length,
          Other: data.filter((user) => user.gender === "Other").length,
        };
        setGenderCounts(genderData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const chartData = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        label: "Users by Gender",
        data: [genderCounts.Male, genderCounts.Female, genderCounts.Other],
        backgroundColor: ["#007bff", "#dc3545", "#28a745"],
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#444",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2 style={{ marginBottom: "20px" }}>Manage Users</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(to right, #2a2a2a, #1e1e1e)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            flex: "1",
            minWidth: "200px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
          }}
        >
          <h3>Total Users</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{totalUsers}</p>
        </div>
        <div
          style={{
            background: "linear-gradient(to right, #2a2a2a, #1e1e1e)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            flex: "1",
            minWidth: "200px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
          }}
        >
          <h3>Male Users</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {genderCounts.Male}
          </p>
        </div>
        <div
          style={{
            background: "linear-gradient(to right, #2a2a2a, #1e1e1e)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            flex: "1",
            minWidth: "200px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
          }}
        >
          <h3>Female Users</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {genderCounts.Female}
          </p>
        </div>
        <div
          style={{
            background: "linear-gradient(to right, #2a2a2a, #1e1e1e)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            flex: "1",
            minWidth: "200px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
          }}
        >
          <h3>Other Users</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {genderCounts.Other}
          </p>
        </div>
      </div>
      <div
        style={{
          height: "300px",
          width: "100%",
          background: "#1a1a1a",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
        }}
      >
        <h3 style={{ marginBottom: "20px", textAlign: "center" }}>
          Gender Distribution Chart
        </h3>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ManageUsers;
