'use client';

import { useState, useEffect } from 'react';
import SidebarFilter from '@/components/SidebarFilter';
import CarCard from '@/components/CarCard';
import Navbar from '@/components/Navbar';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';
import { sendFilterAnalytics } from '@/components/analytics';

const SedanPage = () => {
    const [cars, setCars] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        minPrice: '',
        maxPrice: '',
        fuel: '',
        transmission: '',
    });

    useEffect(() => {
        fetchCars();
    }, []);



    const fetchCars = async (appliedFilters = filters) => {
        try {
            // Clean the filters to include only valid keys
            const validFilters = Object.fromEntries(
                Object.entries(appliedFilters).filter(
                    ([key, value]) => value !== "" && ["search", "minPrice", "maxPrice", "fuel", "transmission"].includes(key)
                )
            );

            // Construct query string
            const queryParams = new URLSearchParams(validFilters).toString();

            // Debugging log

            // Fetch data from backend
            const res = await fetch(`http://localhost:5000/api/cars/type/suv?${queryParams}`);
            const data = await res.json();

            if (res.ok) {
                setCars(data);
            } else {
                toast.error(data.message || "No cars found matching your filters.");
                setCars([]); // Clear the car list if no cars are found
            }
        } catch (error) {
            console.error("Error fetching cars:", error);
            toast.error("Failed to fetch cars!");
        }
    };

    const handleApplyFilters = (appliedFilters) => {

        setFilters(appliedFilters);
        fetchCars(appliedFilters);
        sendFilterAnalytics(appliedFilters);
    };

    const resetFilters = () => {
        const defaultFilters = {
            search: '',
            minPrice: '',
            maxPrice: '',
            fuel: '',
            transmission: '',
        };
        setFilters(defaultFilters);
        fetchCars(defaultFilters);
    };

    return (
        <div style={containerStyle}>
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <div style={heroSectionStyle}>
                <hr style={dividerAboveTitleStyle} />
                <h1 style={heroTitleStyle}>Suvs</h1>
                <p style={heroSubtitleStyle}>Explore our premium collection of suv cars</p>
            </div>

            {/* Main Content */}
            <div style={contentStyle}>
                <SidebarFilter
                    filters={filters}
                    setFilters={handleApplyFilters}
                    resetFilters={resetFilters}
                />

                {/* Divider */}
                <div style={dividerStyle}></div>

                {/* Main Section */}
                <div style={mainContentStyle}>
                    <div style={searchBarContainer}>
                        <FaSearch style={{ marginRight: '10px', color: '#ccc' }} />
                        <input
                            type="text"
                            placeholder="Search cars"
                            value={filters.search}
                            onChange={(e) => {
                                const updatedFilters = { ...filters, search: e.target.value };
                                setFilters(updatedFilters);
                                fetchCars(updatedFilters); // Fetch cars dynamically based on updated search
                            }}
                            style={searchBarStyle}
                        />
                    </div>
                    <div style={carGridStyle}>
                        {cars.length > 0 ? (
                            cars.map((car) => <CarCard key={car._id} car={car} />)
                        ) : (
                            <p style={noCarsTextStyle}>No cars found matching your filters.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: 'white',
};

const heroSectionStyle = {
    textAlign: 'center',
    padding: '60px 20px 40px', // Increased top padding for better spacing
    backgroundColor: '#111',
    borderBottom: '1px solid #333',
    marginBottom: '20px',
    position: 'relative',
};

const heroTitleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#fff',
};

const heroSubtitleStyle = {
    fontSize: '1.2rem',
    color: '#bbb',
};

const contentStyle = {
    display: 'flex',
    gap: '20px',
    padding: '20px',
};

const dividerStyle = {
    width: '3px',
    backgroundColor: '#444',
    borderRadius: '5px',
};

const mainContentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
};

const searchBarContainer = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
};

const searchBarStyle = {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    color: 'white',
    outline: 'none',
    fontSize: '1rem',
};

const carGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '10px',
    marginTop: '20px',
};

const noCarsTextStyle = {
    textAlign: 'center',
    color: '#fff',
    fontSize: '1.1rem',
    marginTop: '20px',
};
const dividerAboveTitleStyle = {
    width: '100%',          // Full width of the container
    height: '1px',          // Thickness of the line
    backgroundColor: '#444', // Line color
    margin: '20px 0',       // 20px gap above and below
    border: 'none',
};

export default SedanPage;
