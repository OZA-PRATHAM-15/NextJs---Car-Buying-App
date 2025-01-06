import React, { useState } from 'react';
import {
    FaGasPump,
    FaCogs,
    FaTachometerAlt,
    FaCar,
    FaEye,
    FaCouch,
    FaSun,
    FaBluetooth,
    FaWrench,
    FaCarSide,
} from 'react-icons/fa';
import Link from 'next/link';

const CarCard = ({ car, showDetails = true, showFuelTag = true, userId = null }) => {
    const [hoverTimeout, setHoverTimeout] = useState(null);

    const handleMouseEnter = () => {
        const timeout = setTimeout(() => {
            sendHoverAnalytics(car._id);
        }, 6000); // Sends hover analytics after 6 seconds
        setHoverTimeout(timeout);
    };

    const handleMouseLeave = () => {
        if (hoverTimeout) clearTimeout(hoverTimeout);
    };

    const sendHoverAnalytics = async (carId) => {
        try {
            await fetch('http://localhost:5000/api/analytics/hover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ carId }),
            });
        } catch (error) {
            console.error('Error sending hover analytics:', error);
        }
    };

    const logVisit = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from localStorage
            let userId = null;

            if (token) {
                const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
                userId = decodedToken.userId; // Extract userId
            }

            const response = await fetch('http://localhost:5000/api/cars/visit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    carId: car._id,
                    userId: userId || null, // Pass userId if available
                }),
            });

            if (!response.ok) {
                console.error('Failed to log visit:', await response.json());
            }
        } catch (error) {
            console.error('Error logging visit:', error);
        }
    };

    const getFeatureIcon = (feature) => {
        if (feature.toLowerCase().includes('leather')) return <FaCouch style={featureIconStyle} />;
        if (feature.toLowerCase().includes('sunroof')) return <FaSun style={featureIconStyle} />;
        if (feature.toLowerCase().includes('bluetooth')) return <FaBluetooth style={featureIconStyle} />;
        if (feature.toLowerCase().includes('cruise')) return <FaCarSide style={featureIconStyle} />;
        if (feature.toLowerCase().includes('monitoring')) return <FaWrench style={featureIconStyle} />;
        return <FaCar style={featureIconStyle} />;
    };

    return (
        <div
            style={carCardStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Image Section */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                    src={car.image}
                    alt={car.name}
                    style={{ ...imageStyle, filter: 'brightness(0.9) contrast(1.1)' }}
                />
                {showFuelTag && (
                    <span style={fuelTagStyle}>{car.specifications?.fuel_type || 'N/A'}</span>
                )}
            </div>

            {/* Content Section */}
            <div style={contentStyle}>
                <h3 style={carTitleStyle}>{car.name}</h3>
                <p style={priceStyle}>From ${car.price}</p>
                <p style={descriptionStyle}>{car.description}</p>

                {/* Conditionally Render Specifications */}
                {showDetails && (
                    <>
                        <h4 style={sectionHeadingStyle}>Specifications</h4>
                        <div style={specificationsStyle}>
                            <div style={specStyle}>
                                <FaCar style={iconStyle} />
                                <span>{car.specifications?.engine}</span>
                            </div>
                            <div style={specStyle}>
                                <FaTachometerAlt style={iconStyle} />
                                <span>{car.specifications?.horsepower} PS</span>
                            </div>
                            <div style={specStyle}>
                                <FaCogs style={iconStyle} />
                                <span>{car.specifications?.transmission}</span>
                            </div>
                        </div>

                        <h4 style={sectionHeadingStyle}>Features</h4>
                        <div style={featuresStyle}>
                            {car.features?.slice(0, 3).map((feature, index) => (
                                <div key={index} style={featureItemStyle}>
                                    {getFeatureIcon(feature)}
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <Link
                    href={`/cars/${car._id}`}
                    legacyBehavior
                >
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        style={detailsButtonStyle}
                        onClick={logVisit} // Log the visit when user clicks "View Details"
                    >
                        <FaEye style={{ marginRight: '8px' }} />
                        View Details
                    </a>
                </Link>
            </div>
        </div>
    );
};

// Styles
const carCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '350px',
    margin: '0px auto',
    borderRadius: '10px',
    background: 'linear-gradient(to bottom, #1a1a1a, #0f0f0f)',
    color: '#fff',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.6)',
    transition: 'transform 0.3s ease-in-out',
    overflow: 'hidden',
    cursor: 'pointer',
};

const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    display: 'block',
};

const fuelTagStyle = {
    position: 'absolute',
    top: '8px',
    left: '8px',
    backgroundColor: '#fff',
    color: '#000',
    fontSize: '10px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    zIndex: '10',
};

const contentStyle = { padding: '15px' };

const carTitleStyle = { fontSize: '1.3rem', fontWeight: '700', marginBottom: '5px', marginTop: '0px' };

const priceStyle = { fontSize: '1.1rem', color: '#ccc', marginBottom: '10px' };

const descriptionStyle = { fontSize: '0.9rem', color: '#bbb', marginBottom: '10px' };

const sectionHeadingStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    borderBottom: '1px solid #444',
    marginBottom: '10px',
    paddingBottom: '5px',
};

const specificationsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    marginBottom: '15px',
};

const specStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    borderRadius: '8px',
    padding: '10px 5px',
    height: '65px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const iconStyle = { fontSize: '1.5rem', marginBottom: '5px', color: '#FFFFFF' };

const featuresStyle = { display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' };

const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.9rem',
    color: '#ccc',
};

const featureIconStyle = { fontSize: '1rem', color: '#fff' };

const detailsButtonStyle = {
    width: '100%',
    backgroundColor: '#000',
    color: '#fff',
    padding: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    border: '2px solid #fff',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
};

export default CarCard;
