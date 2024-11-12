'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GridView from '@/components/GridView';
import SearchBar from '@/components/SearchBar';
import axios from '@/utils/api'; // Axios instance
import ListView from '@/components/ListView';
import styles from './SedansPage.module.css';

const SedansPage = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [view, setView] = useState('grid'); // To toggle between grid and list view
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSedans = async () => {
            try {
                const { data } = await axios.get('/api/cars/type/sedan'); // Fetch sedans
                setCars(data);
                setFilteredCars(data); // Initially set filtered cars to all cars
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cars:', error);
                setLoading(false);
            }
        };
        fetchSedans();
    }, []);

    // Handle search functionality
    const handleSearch = (searchTerm) => {
        const filtered = cars.filter((car) =>
            car.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCars(filtered); // Update the filtered cars based on search
    };

    return (
        <div className={styles.pageLayout}>
            <Navbar />  {/* Navbar remains at the top */}

            {/* Quote Section */}
            <div className={styles.quoteSection}>
                <h1>Comfort and style on the road.</h1>
            </div>

            {/* Search and Filter Section */}
            <div className={styles.searchFilterSection}>
                <SearchBar onSearch={handleSearch} />
                <button className={styles.filterButton}>Filter</button>
            </div>

            {/* Cars Found Section */}
            <div className={styles.carsFound}>
                {loading ? 'Loading...' : `${filteredCars.length} cars found`}
            </div>

            {/* Grid/List View Toggle */}
            <div className={styles.gridListToggle}>
                <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>
                    Grid View
                </button>
                <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
                    List View
                </button>
            </div>

            {/* Display Cars */}
            <div className={styles.carsView}>
                {view === 'grid' ? <GridView cars={filteredCars} /> : <ListView cars={filteredCars} />}
            </div>
        </div>
    );
};

export default SedansPage;
