// src/components/SectionHeader.js
import React from 'react';

const SectionHeader = ({ sectionName, quote }) => {
    return (
        <header>
            <h1>{sectionName}</h1>
            <p>{quote}</p>
        </header>
    );
};

export default SectionHeader;
