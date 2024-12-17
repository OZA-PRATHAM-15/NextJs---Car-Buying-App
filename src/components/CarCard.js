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

const CarCard = ({ car }) => {
    const [hoverTimeout, setHoverTimeout] = useState(null);

    const handleMouseEnter = () => {
        const timeout = setTimeout(() => {
            sendHoverAnalytics(car._id);
        }, 6000);
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

    // Function to map features to icons
    const getFeatureIcon = (feature) => {
        if (feature.toLowerCase().includes('leather')) return <FaCouch style={featureIconStyle} />;
        if (feature.toLowerCase().includes('sunroof')) return <FaSun style={featureIconStyle} />;
        if (feature.toLowerCase().includes('bluetooth')) return <FaBluetooth style={featureIconStyle} />;
        if (feature.toLowerCase().includes('cruise')) return <FaCarSide style={featureIconStyle} />;
        if (feature.toLowerCase().includes('monitoring')) return <FaWrench style={featureIconStyle} />;
        return <FaCar style={featureIconStyle} />; // Default fallback icon
    };

    return (
        <div
            style={carCardStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Image Blending Directly into Card */}
            <div style={{ ...imageStyle, backgroundImage: `url(${car.image})` }}>
                <span style={fuelTagStyle}>{car.specifications?.fuel_type || 'N/A'}</span>
            </div>

            {/* Content Section */}
            <div style={contentStyle}>
                <h3 style={carTitleStyle}>{car.name}</h3>
                <p style={priceStyle}>From ${car.price}</p>
                <p style={descriptionStyle}>{car.description}</p>

                {/* Specifications Heading */}
                <h4 style={sectionHeadingStyle}>Specifications</h4>
                <div style={specificationsStyle}>
                    <div style={specStyle}>
                        <FaCar style={iconStyle} />
                        <div>
                            <strong>{car.specifications?.engine}</strong>
                            <p style={specTextStyle}>Engine</p>
                        </div>
                    </div>
                    <div style={specStyle}>
                        <FaTachometerAlt style={iconStyle} />
                        <div>
                            <strong>{car.specifications?.horsepower} PS</strong>
                            <p style={specTextStyle}>Power</p>
                        </div>
                    </div>
                    <div style={specStyle}>
                        <FaCogs style={iconStyle} />
                        <div>
                            <strong>{car.specifications?.transmission}</strong>
                            <p style={specTextStyle}>Transmission</p>
                        </div>
                    </div>
                </div>

                {/* Features Heading */}
                <h4 style={sectionHeadingStyle}>Features</h4>
                <div style={featuresStyle}>
                    {car.features?.slice(0, 3).map((feature, index) => (
                        <div key={index} style={featureItemStyle}>
                            {getFeatureIcon(feature)}
                            {feature}
                        </div>
                    ))}
                </div>

                {/* View Details Button */}
                <button style={detailsButtonStyle}>
                    <FaEye style={{ marginRight: '8px' }} />
                    View Details
                </button>
            </div>
        </div>
    );
};

// Styles
const carCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '370px',
    height: '600px',
    margin: '20px auto',
    borderRadius: '10px',
    background: 'linear-gradient(to bottom, #1a1a1a, #0f0f0f)',
    color: '#fff',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.6)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out',
    cursor: 'pointer',
};

const imageStyle = {
    position: 'relative',
    width: '100%',
    height: '300px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'brightness(1.2) contrast(1.1)',
};

const fuelTagStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: '#fff',
    color: '#000',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '5px 10px',
    borderRadius: '5px',
};

const contentStyle = {
    padding: '20px',
};

const carTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '5px',
};

const priceStyle = {
    fontSize: '1.1rem',
    color: '#ccc',
    marginBottom: '10px',
};

const descriptionStyle = {
    fontSize: '0.9rem',
    color: '#bbb',
    marginBottom: '15px',
};

const sectionHeadingStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '10px',
    borderBottom: '1px solid #444',
    paddingBottom: '5px',
};

const specificationsStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '15px',
};

const specStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
};

const specTextStyle = {
    margin: '3px 0',
    fontSize: '0.85rem',
    color: '#aaa',
};

const iconStyle = {
    fontSize: '1.5rem',
    marginBottom: '5px',
    color: '#fff',
};

const featuresStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
};

const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    color: '#ccc',
};

const featureIconStyle = {
    fontSize: '1.2rem',
    color: '#fff',
};

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
    transition: 'background-color 0.3s ease, color 0.3s ease',
};

export default CarCard;
