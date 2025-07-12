"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaCartPlus, FaCreditCard } from "react-icons/fa";
import axiosInstance from "@/utils/api";

const CarDetailsPage = () => {
  const [carDetails, setCarDetails] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchCarDetails(id);
    }
  }, [id]);

  const fetchCarDetails = async (carId) => {
    try {
      const res = await axiosInstance.get(`/cars/${carId}`);
      setCarDetails(res.data);
      setSelectedColor(res.data.colors[0]?.image || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    console.log("Add to cart logic");
  };

  const handleBuyNow = () => {
    console.log("Buy now logic");
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Oops! {error}</p>
        <button onClick={() => fetchCarDetails(id)}>Retry</button>
      </div>
    );
  }

  if (!carDetails) {
    return (
      <div className="not-found-container">
        <p>The car you're looking for is not available.</p>
      </div>
    );
  }

  const { name, description, specifications, features, colors, price } =
    carDetails;

  return (
    <div className="car-details-page">
      <header className="header">
        <div className="logo">CarShowroom</div>
        <div className="car-name">{name}</div>
        <div className="actions">
          <FaCartPlus className="icon" />
          <FaCreditCard className="icon" />
        </div>
      </header>

      <main className="main-content">
        <div className="image-section">
          <img src={selectedColor} alt={name} />
        </div>
        <div className="details-section">
          <div className="colors">
            <h3>Colors</h3>
            {colors.map((color, index) => (
              <button
                key={index}
                className={`color-option ${
                  selectedColor === color.image ? "selected" : ""
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color.image)}
              />
            ))}
          </div>

          <div className="attachments">
            <h3>Attachments</h3>
            <ul>
              {carDetails.attachments.map((attachment, index) => (
                <li key={index}>{attachment}</li>
              ))}
            </ul>
          </div>

          <div className="price-actions">
            <h2>${price}</h2>
            <p>Taxes Included</p>
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </main>

      <section className="car-details">
        <h3>Description</h3>
        <p>{description}</p>

        <h3>Specifications</h3>
        <ul>
          <li>Engine: {specifications.engine}</li>
          <li>Horsepower: {specifications.horsepower}</li>
          <li>Transmission: {specifications.transmission}</li>
          <li>Fuel Type: {specifications.fuel_type}</li>
        </ul>

        <h3>Features</h3>
        <ul>
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CarDetailsPage;
