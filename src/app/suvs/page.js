'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GridView from '@/components/GridView';
import SearchBar from '@/components/SearchBar';
import styles from './SuvPage.module.css';
import api from '@/utils/api';
import ListView from '@/components/ListView';

const SedansPage = () => {
    const [cars, setCars] = useState([]);
    const [view, setView] = useState('grid'); // To toggle between grid and list view
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSedans = async () => {
            try {
                const { data } = await api.get('/api/cars/type/suv'); // Fetch sedans
                setCars(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cars:', error);
                setLoading(false);
            }
        };
        fetchSedans();
    }, []);

    return (
        <div className={styles.pageLayout}>
            <Navbar />  {/* Navbar remains at the top */}

            {/* Now the Quote Section comes below */}
            <div className={styles.quoteSection}>
                <h1>Comfort and style on the road.</h1>
            </div>

            {/* Search and Filter Section */}
            <div className={styles.searchFilterSection}>
                <SearchBar />
                <button className={styles.filterButton}>Filter</button>
            </div>

            {/* Cars Found Section */}
            <div className={styles.carsFound}>
                {loading ? 'Loading...' : `${cars.length} cars found`}
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
                {view === 'grid' ? <GridView cars={cars} /> : <ListView cars={cars} />}
            </div>
        </div>
    );
};

export default SedansPage;
