"use client";
import { useState, useEffect } from "react";
import { FaCarSide, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import AddStockModal from "./AddStockModal";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/utils/api";
import Image from "next/image";

const ManageStocks = () => {
  const [cars, setCars] = useState([]);
  const [carSummary, setCarSummary] = useState({ total: 0, types: {} });
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUserRole();
    fetchCars();
  }, []);

  const checkUserRole = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken?.role === "Admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      toast.error("Invalid token. Please log in again.");
    }
  };

  const fetchCars = async () => {
    try {
      const res = await axiosInstance.get("/cars");
      const carsData = res.data;

      const summary = carsData.reduce(
        (acc, car) => {
          acc.total++;
          acc.types[car.type] = (acc.types[car.type] || 0) + 1;
          return acc;
        },
        { total: 0, types: {} }
      );

      setCars(carsData);
      setCarSummary(summary);
    } catch (error) {
      console.error("Error fetching car data:", error);
      toast.error("Failed to fetch cars!");
    }
  };

  const handleDelete = async (carId) => {
    try {
      await axiosInstance.delete(`/cars/${carId}`);
      setCars((prev) => prev.filter((car) => car._id !== carId));
      toast.success("Car deleted successfully!");
      fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Failed to delete car!");
    }
  };

  const handleUpdate = (carId) => {
    toast.info(`Update feature for car ID: ${carId} is under development.`);
  };

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStock = async (newCar) => {
    try {
      const res = await axiosInstance.post("/cars", newCar, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCars((prev) => [...prev, res.data]);
      toast.success("Car added successfully!");
    } catch (error) {
      console.error("Error adding stock:", error);
      toast.error(
        error.response?.data?.message || error.message || "Error adding stock."
      );
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h2 style={headerStyle}>Manage Stocks</h2>

        <div style={{ marginBottom: "20px" }}>
          <div style={summaryCardsContainer}>
            <div style={summaryCardStyle}>
              <h3>Total Cars</h3>
              <p>{carSummary.total}</p>
            </div>
            {Object.entries(carSummary.types).map(([type, count]) => (
              <div key={type} style={summaryCardStyle}>
                <h3>{type}</h3>
                <p>{count}</p>
              </div>
            ))}
          </div>
          <div style={searchBarContainer}>
            <FaSearch style={{ marginRight: "10px" }} />
            <input
              type="text"
              placeholder="Search cars by name, type, or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchBarStyle}
            />
          </div>

          {isAdmin && (
            <button style={addButtonStyle} onClick={() => setIsModalOpen(true)}>
              Add Stock
            </button>
          )}
        </div>
        <div style={carCardsContainer}>
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div key={car._id} style={carCardStyle}>
                <Image
                  src={car.image}
                  alt={car.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
                <div style={{ padding: "15px" }}>
                  <h3 style={{ color: "white" }}>{car.name}</h3>
                  <p style={{ color: "#ccc" }}>{car.description}</p>
                  <p>
                    <strong>Type:</strong> {car.type}
                  </p>
                  <p>
                    <strong>Price:</strong> ${car.price}
                  </p>
                  <p>
                    <strong>Available:</strong>{" "}
                    {car.available ? (
                      <span style={{ color: "green" }}>Yes</span>
                    ) : (
                      <span style={{ color: "red" }}>No</span>
                    )}
                  </p>
                  <div style={actionsStyle}>
                    <button
                      style={updateButtonStyle}
                      onClick={() => handleUpdate(car._id)}
                    >
                      <FaCarSide /> Update
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => handleDelete(car._id)}
                    >
                      <FaCarSide /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "white", fontSize: "1.2rem" }}>
              No cars found matching your search.
            </p>
          )}
        </div>
      </div>

      <AddStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddStock={handleAddStock}
      />
    </div>
  );
};

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: "#0a0a0a",
  color: "white",
  padding: "20px",
};

const contentStyle = {
  margin: "0 auto",
  maxWidth: "1200px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const headerStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  marginBottom: "20px",
};

const summaryCardsContainer = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: "20px",
};

const summaryCardStyle = {
  background: "linear-gradient(to bottom, #1a1a1a, #0a0a0a)",
  color: "white",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  width: "200px",
  padding: "20px",
  textAlign: "center",
};

const searchBarContainer = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#1a1a1a",
  padding: "10px",
  borderRadius: "10px",
  maxWidth: "400px",
  margin: "0 auto",
};

const searchBarStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "transparent",
  color: "white",
  outline: "none",
};

const addButtonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  marginTop: "20px",
};

const carCardsContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "center",
  marginTop: "20px",
};

const carCardStyle = {
  background: "linear-gradient(to bottom, #1a1a1a, #0a0a0a)",
  color: "white",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  width: "300px",
  overflow: "hidden",
};

const actionsStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "15px",
};

const updateButtonStyle = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontWeight: "bold",
};

const deleteButtonStyle = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontWeight: "bold",
};

export default ManageStocks;
