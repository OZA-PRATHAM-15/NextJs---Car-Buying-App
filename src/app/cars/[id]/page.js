"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import { FaGasPump, FaCogs, FaTachometerAlt, FaStar } from "react-icons/fa";
import styles from "./CarDetails.module.css";
import axiosInstance from "@/utils/api";

const CarDetailsPage = () => {
  const { id: carId } = useParams();
  const [carDetails, setCarDetails] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({
    specifications: false,
    features: false,
    colors: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (carId) {
      setTimeout(() => {
        fetchCarDetails(carId);
      }, 500);
    } else {
      setError("Car ID is missing!");
      setLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    if (carDetails) {
      fetchRecommendations(carDetails.type, carDetails.price);
    }
  }, [carDetails]);

  const fetchCarDetails = async (id) => {
    try {
      const response = await axiosInstance.get(`/cars/${id}`);
      const data = response.data;
      setCarDetails(data);
      setSelectedColor(data.colors[0]?.image || "");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch car details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (type, price) => {
    try {
      const response = await axiosInstance.get(
        `/cars/recommendations?type=${type}&minPrice=${price - 5000}&maxPrice=${
          price + 5000
        }`
      );
      const data = response.data;
      setRecommendations(
        data.filter((car) => String(car.id || car._id) !== String(carId))
      );
    } catch (err) {
      console.error("Error fetching recommendations:", err.message);
    }
  };

  const toggleDropdown = (section) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const getIconForSpecification = (key) => {
    if (key.toLowerCase().includes("engine"))
      return <FaCogs className={styles.specIcon} />;
    if (key.toLowerCase().includes("fuel"))
      return <FaGasPump className={styles.specIcon} />;
    if (key.toLowerCase().includes("horsepower"))
      return <FaTachometerAlt className={styles.specIcon} />;
    return <FaStar className={styles.specIcon} />;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading car details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <button onClick={() => fetchCarDetails(carId)}>Retry</button>
      </div>
    );
  }

  const {
    image,
    description,
    specifications,
    features,
    colors,
    price,
    name,
    available,
    type,
  } = carDetails;

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <img src="/logo.png" alt="Autorizz Logo" className={styles.logo} />
          </Link>
        </div>
        <div className={styles.navIcons}>
          <Link href="/cart">
            <FiShoppingCart size={24} className={styles.icon} />
          </Link>
          <Link href="/profile">
            <FiUser size={24} className={styles.icon} />
          </Link>
        </div>
      </header>

      <div className={styles.mainSection}>
        <div className={styles.left}>
          <div className={styles.imageContainer}>
            <img
              src={selectedColor || image}
              alt="Car"
              className={styles.carImage}
            />
          </div>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.separator}></div>

        <div className={styles.right}>
          <h1 className={styles.carName}>{name}</h1>
          <h2 className={styles.priceHighlight}>${price}</h2>
          <p>Monthly Installment: ${(price / 48).toFixed(2)}</p>
          <p
            className={`${styles.stockStatus} ${
              available ? styles.inStock : styles.outOfStock
            }`}
          >
            {available ? "In Stock" : "Out of Stock"}
          </p>

          <div
            className={`${styles.dropdown} ${
              dropdownStates.specifications ? styles.open : ""
            }`}
            onClick={() => toggleDropdown("specifications")}
          >
            <div className={styles.dropdownHeader}>
              <span>Specifications</span>
              <span
                className={`${styles.dropdownIcon} ${
                  dropdownStates.specifications ? styles.rotate : ""
                }`}
              >
                ▼
              </span>
            </div>
            <div className={styles.dropdownContent}>
              {specifications &&
                Object.entries(specifications).map(([key, value]) => (
                  <p key={key} className={styles.specItem}>
                    {getIconForSpecification(key)} <strong>{key}:</strong>{" "}
                    {value}
                  </p>
                ))}
            </div>
          </div>

          <div
            className={`${styles.dropdown} ${
              dropdownStates.features ? styles.open : ""
            }`}
            onClick={() => toggleDropdown("features")}
          >
            <div className={styles.dropdownHeader}>
              <span>Features</span>
              <span
                className={`${styles.dropdownIcon} ${
                  dropdownStates.features ? styles.rotate : ""
                }`}
              >
                ▼
              </span>
            </div>
            <div className={styles.dropdownContent}>
              {features?.map((feature, index) => (
                <p key={index} className={styles.featureItem}>
                  <FaStar className={styles.featureIcon} /> {feature}
                </p>
              ))}
            </div>
          </div>

          <div
            className={`${styles.dropdown} ${
              dropdownStates.colors ? styles.open : ""
            }`}
            onClick={() => toggleDropdown("colors")}
          >
            <div className={styles.dropdownHeader}>
              <span>Colors</span>
              <span
                className={`${styles.dropdownIcon} ${
                  dropdownStates.colors ? styles.rotate : ""
                }`}
              >
                ▼
              </span>
            </div>
            <div className={styles.dropdownContent}>
              {colors && colors.length > 0 ? (
                colors.map((color, index) => (
                  <button
                    key={index}
                    className={`${styles.colorSwatch} ${
                      selectedColor === color.image ? styles.selected : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.image)}
                  />
                ))
              ) : (
                <p className={styles.outOfStockMessage}>
                  Oops, looks like other colors are out of stock.
                </p>
              )}
            </div>
          </div>

          <div className={styles.buttons}>
            <button className={styles.addToCart}>Add to Cart</button>
            <button className={styles.buyNow}>Buy Now</button>
          </div>
        </div>
      </div>

      <div className={styles.recommendationsSection}>
        <h2 className={styles.recommendationsTitle}>Similar Cars</h2>
        <div className={styles.recommendationsContainer}>
          {recommendations.length > 0 ? (
            recommendations.map((car) => (
              <div key={car.id} className={styles.recommendationCard}>
                <img
                  src={car.image}
                  alt={car.name}
                  className={styles.recommendationImage}
                />
                <div className={styles.recommendationDetails}>
                  <h3 className={styles.recommendationName}>{car.name}</h3>
                  <p className={styles.recommendationPrice}>${car.price}</p>
                  <p>
                    {car.specifications?.engine ||
                      "Engine details not available"}
                  </p>
                </div>
                <button
                  onClick={() => window.open(`/car/${car.id}`, "_blank")}
                  className={styles.exploreButton}
                >
                  Explore
                </button>
              </div>
            ))
          ) : (
            <p>No similar cars found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
