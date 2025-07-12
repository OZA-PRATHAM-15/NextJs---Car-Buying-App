"use client";

import { FaDollarSign, FaGasPump, FaCogs, FaRedo } from "react-icons/fa";
import { useState } from "react";

const SidebarFilter = ({ filters, setFilters, resetFilters }) => {
  const [tempFilters, setTempFilters] = useState({ ...filters });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters({ ...tempFilters, [name]: value });
  };

  const applyFilters = () => {
    setFilters(tempFilters);
  };
  const handleReset = () => {
    setTempFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      fuel: "",
      transmission: "",
    });
    resetFilters();
  };

  return (
    <div style={sidebarStyle}>
      <h2 style={sidebarTitle}>Filters</h2>
      <div style={filterGroup}>
        <label style={filterLabel}>
          <FaDollarSign /> Price Range:
        </label>
        <input
          type="number"
          name="minPrice"
          placeholder="Min"
          value={tempFilters.minPrice}
          onChange={handleFilterChange}
          style={filterInput}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max"
          value={tempFilters.maxPrice}
          onChange={handleFilterChange}
          style={filterInput}
        />
      </div>
      <div style={filterGroup}>
        <label style={filterLabel}>
          <FaGasPump /> Fuel Type:
        </label>
        <select
          name="fuel"
          value={tempFilters.fuel}
          onChange={handleFilterChange}
          style={filterInput}
        >
          <option value="">All</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
        </select>
      </div>
      <div style={filterGroup}>
        <label style={filterLabel}>
          <FaCogs /> Transmission:
        </label>
        <select
          name="transmission"
          value={tempFilters.transmission}
          onChange={handleFilterChange}
          style={filterInput}
        >
          <option value="">All</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>
      <button onClick={applyFilters} style={applyButton}>
        Apply Filters
      </button>
      <button onClick={handleReset} style={resetButton}>
        <FaRedo style={{ marginRight: "5px" }} /> Reset Filters
      </button>
    </div>
  );
};

const sidebarStyle = {
  width: "250px",
  padding: "20px",
  backgroundColor: "#111",
  color: "#fff",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
};

const sidebarTitle = {
  fontSize: "1.5rem",
  marginBottom: "20px",
  fontWeight: "bold",
  textAlign: "center",
  borderBottom: "2px solid #444",
  paddingBottom: "10px",
};

const filterGroup = {
  marginBottom: "20px",
};

const filterLabel = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "10px",
  fontWeight: "600",
};

const filterInput = {
  width: "100%",
  padding: "8px",
  borderRadius: "5px",
  border: "none",
  marginBottom: "10px",
  backgroundColor: "#1a1a1a",
  color: "#fff",
  outline: "none",
};

const resetButton = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#e63946",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const applyButton = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#28a745",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
  marginBottom: "10px",
};

export default SidebarFilter;
