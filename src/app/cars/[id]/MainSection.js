'use client';

import React, { useState, useEffect } from 'react';
import styles from './MainSection.module.css';

const MainSection = ({ carId }) => {
    const [carDetails, setCarDetails] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (carId) {
            fetchCarDetails(carId);
        }
    }, [carId]);

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

    if (error) {
        return (
            <div className={styles.error}>
                <p>Error: {error}</p>
                <button onClick={() => fetchCarDetails(carId)}>Retry</button>
            </div>
        );
    }

    if (!carDetails) {
        return <div className={styles.loading}>Loading...</div>;
    }

    const { image, description, specifications, features, colors, attachments, price } = carDetails;

    return (
        <div className={styles.mainSection}>
            {/* Left Section */}
            <div className={styles.left}>
                <img src={selectedColor || image} alt="Car" className={styles.carImage} />
                <p className={styles.description}>{description}</p>
            </div>

            {/* Right Section */}
            <div className={styles.right}>
                {/* Specifications */}
                <div className={styles.specifications}>
                    <h3>Specifications</h3>
                    <ul>
                        {specifications && typeof specifications === 'object' ? (
                            Object.entries(specifications).map(([key, value], index) => (
                                <li key={index}>
                                    <strong>{key}:</strong> {value}
                                </li>
                            ))
                        ) : (
                            <p>No specifications available</p>
                        )}
                    </ul>
                </div>

                {/* Features */}
                <div className={styles.features}>
                    <h3>Features</h3>
                    <ul>
                        {features?.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>

                {/* Colors */}
                <div className={styles.colors}>
                    <h3>Colors</h3>
                    {colors?.map((color, index) => (
                        <button
                            key={index}
                            className={`${styles.colorSwatch} ${selectedColor === color.image ? styles.selected : ''}`}
                            style={{ backgroundColor: color.hex }}
                            onClick={() => setSelectedColor(color.image)}
                        />
                    ))}
                </div>

                {/* Attachments */}
                <div className={styles.attachments}>
                    <h3>Attachments</h3>
                    <ul>
                        {attachments?.map((attachment, index) => (
                            <li key={index}>{attachment}</li>
                        ))}
                    </ul>
                </div>

                {/* Price and Buttons */}
                <div className={styles.priceActions}>
                    <h2>${price}</h2>
                    <p>Taxes Included</p>
                    <button className={styles.addToCart}>Add to Cart</button>
                    <button className={styles.buyNow}>Buy Now</button>
                </div>
            </div>
        </div>
    );
};

export default MainSection;
