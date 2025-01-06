'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiUser, FiShoppingCart } from 'react-icons/fi';
import { FaGasPump, FaCogs, FaTachometerAlt, FaStar } from 'react-icons/fa';
import styles from './CarDetails.module.css';

const CarDetailsPage = () => {
    const { id: carId } = useParams();
    const [carDetails, setCarDetails] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [dropdownStates, setDropdownStates] = useState({
        specifications: false,
        features: false,
        colors: false,
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (carId) {
            fetchCarDetails(carId);
        } else {
            setError('Car ID is missing!');
        }
    }, [carId]);

    useEffect(() => {
        if (carDetails) {
            fetchRecommendations(carDetails.type, carDetails.price);
        }
    }, [carDetails]);

    const fetchCarDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cars/${id}`);
            if (!response.ok) throw new Error('Failed to fetch car details');
            const data = await response.json();
            setCarDetails(data);
            setSelectedColor(data.colors[0]?.image || '');
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchRecommendations = async (type, price) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/cars/recommendations?type=${type}&minPrice=${price - 5000}&maxPrice=${price + 5000}`
            );
            if (!response.ok) throw new Error('Failed to fetch recommendations');
            const data = await response.json();
            setRecommendations(data);
        } catch (err) {
            console.error('Error fetching recommendations:', err.message);
        }
    };

    const toggleDropdown = (section) => {
        setDropdownStates((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const getIconForSpecification = (key) => {
        if (key.toLowerCase().includes('engine')) return <FaCogs className={styles.specIcon} />;
        if (key.toLowerCase().includes('fuel')) return <FaGasPump className={styles.specIcon} />;
        if (key.toLowerCase().includes('horsepower')) return <FaTachometerAlt className={styles.specIcon} />;
        return <FaStar className={styles.specIcon} />;
    };

    if (error) {
        return (
            <div className={styles.error}>
                <p>Error: {error}</p>
                <button onClick={() => fetchCarDetails(carId)}>Retry</button>
            </div>
        );
    }

    if (!carDetails) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading car details...</p>
            </div>
        );
    }

    const { image, description, specifications, features, colors, price, name,
        available, type } = carDetails;

    return (
        <div className={styles.page}>
            {/* Header */}
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

            {/* Main Section */}
            <div className={styles.mainSection}>
                {/* Left Section */}
                <div className={styles.left}>
                    <div className={styles.imageContainer}>
                        <img src={selectedColor || image} alt="Car" className={styles.carImage} />
                    </div>
                    <p className={styles.description}>{description}</p>
                </div>

                {/* Separator */}
                <div className={styles.separator}></div>

                {/* Right Section */}
                <div className={styles.right}>
                    <h1 className={styles.carName}>{name}</h1>
                    <h2 className={styles.priceHighlight}>${price}</h2>
                    <p>Monthly Installment: ${(price / 48).toFixed(2)}</p>
                    <p className={`${styles.stockStatus} ${available ? styles.inStock : styles.outOfStock}`}>
                        {available ? 'In Stock' : 'Out of Stock'}
                    </p>

                    {/* Specifications Dropdown */}
                    <div
                        className={`${styles.dropdown} ${dropdownStates.specifications ? styles.open : ''}`}
                        onClick={() => toggleDropdown('specifications')}
                    >
                        <div className={styles.dropdownHeader}>
                            <span>Specifications</span>
                            <span
                                className={`${styles.dropdownIcon} ${dropdownStates.specifications ? styles.rotate : ''}`}
                            >
                                ▼
                            </span>
                        </div>
                        <div className={styles.dropdownContent}>
                            {specifications && (
                                <div>
                                    {Object.entries(specifications).map(([key, value]) => (
                                        <p key={key} className={styles.specItem}>
                                            {getIconForSpecification(key)} <strong>{key}:</strong> {value}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Features Dropdown */}
                    <div
                        className={`${styles.dropdown} ${dropdownStates.features ? styles.open : ''}`}
                        onClick={() => toggleDropdown('features')}
                    >
                        <div className={styles.dropdownHeader}>
                            <span>Features</span>
                            <span
                                className={`${styles.dropdownIcon} ${dropdownStates.features ? styles.rotate : ''}`}
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

                    {/* Colors Dropdown */}
                    <div
                        className={`${styles.dropdown} ${dropdownStates.colors ? styles.open : ''}`}
                        onClick={() => toggleDropdown('colors')}
                    >
                        <div className={styles.dropdownHeader}>
                            <span>Colors</span>
                            <span
                                className={`${styles.dropdownIcon} ${dropdownStates.colors ? styles.rotate : ''}`}
                            >
                                ▼
                            </span>
                        </div>
                        <div className={styles.dropdownContent}>
                            {colors?.map((color, index) => (
                                <button
                                    key={index}
                                    className={`${styles.colorSwatch} ${selectedColor === color.image ? styles.selected : ''}`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => setSelectedColor(color.image)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className={styles.buttons}>
                        <button className={styles.addToCart}>Add to Cart</button>
                        <button className={styles.buyNow}>Buy Now</button>
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            <div className={styles.recommendationsSection}>
                <h2 className={styles.recommendationsTitle}>Similar Cars</h2>
                <div className={styles.recommendationsContainer}>
                    {recommendations.length > 0 ? (
                        recommendations.map((car) => (
                            <div key={car.id} className={styles.recommendationCard}>
                                <img src={car.image} alt={car.name} className={styles.recommendationImage} />
                                <div className={styles.recommendationDetails}>
                                    <h3 className={styles.recommendationName}>{car.name}</h3>
                                    <p className={styles.recommendationPrice}>${car.price}</p>
                                    <p>{car.specifications?.engine || 'Engine details not available'}</p>
                                </div>
                                <button
                                    onClick={() => window.open(`/car/${car.id}`, '_blank')}
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
