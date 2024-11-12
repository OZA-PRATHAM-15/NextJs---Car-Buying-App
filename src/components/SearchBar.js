import React, { useState } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (onSearch) {
            onSearch(e.target.value); // Call the passed onSearch function
        }
    };

    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                placeholder="Search cars..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <button className={styles.filterButton}>Filter</button>
        </div>
    );
};

export default SearchBar;
