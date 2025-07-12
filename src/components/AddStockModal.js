"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/api";

const AddStockModal = ({ isOpen, onClose, onAddStock }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    type: "sedan",
    available: true,
    engine: "",
    horsepower: "",
    fuel_type: "",
    transmission: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        "/cars",
        {
          ...formData,
          available: formData.available === "true",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Car added successfully!");
      onAddStock();
      onClose();
    } catch (error) {
      console.error("Error adding car:", error);
      toast.error(error.response?.data?.error || "Error adding car!");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={headerStyle}>Add New Stock</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={horizontalGroupStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                style={textareaStyle}
              ></textarea>
            </div>
          </div>

          <div style={horizontalGroupStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Image URL:</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Price:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={horizontalGroupStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="accessory">Accessory</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Available:</label>
              <select
                name="available"
                value={formData.available}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div style={horizontalGroupStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Engine:</label>
              <input
                type="text"
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Horsepower:</label>
              <input
                type="number"
                name="horsepower"
                value={formData.horsepower}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={horizontalGroupStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Fuel Type:</label>
              <input
                type="text"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Transmission:</label>
              <input
                type="text"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={buttonGroupStyle}>
            <button type="submit" style={submitButtonStyle}>
              Add Stock
            </button>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  background: "#1a1a1a",
  padding: "20px",
  borderRadius: "10px",
  width: "700px",
  color: "white",
};

const headerStyle = {
  fontSize: "1.5rem",
  marginBottom: "20px",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const horizontalGroupStyle = {
  display: "flex",
  gap: "20px",
  justifyContent: "space-between",
  flexWrap: "wrap",
};

const formGroupStyle = {
  flex: "1 1 calc(50% - 20px)",
  marginBottom: "15px",
};

const labelStyle = {
  fontWeight: "bold",
  color: "#ccc",
  marginBottom: "5px",
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  background: "#0a0a0a",
  color: "white",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "80px",
};

const selectStyle = {
  ...inputStyle,
  padding: "8px",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
};

const submitButtonStyle = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
};

const cancelButtonStyle = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  cursor: "pointer",
};

export default AddStockModal;
