// src/components/Navbar.js
'use client';
import React, { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { FiUser, FiShoppingCart } from 'react-icons/fi'; // Sleek Feather Icons
import { toast } from 'react-toastify'; // Import Toastify

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Dropdown visibility state
    const [role, setRole] = useState(''); // Role state

    // Check for JWT token in localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true); // User is logged in
            const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
            setRole(decodedToken.role); // Set role from token (Admin, Agent, User)
            console.log("User is logged in with role:", decodedToken.role);
        }
    }, []);

    // Toggle dropdown visibility on click
    const handleDropdownToggle = () => {
        setIsDropdownVisible(prev => !prev); // Toggle the state
        console.log("Dropdown toggle clicked. Is dropdown visible?", !isDropdownVisible);
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove JWT token
        setIsLoggedIn(false); // Set login state to false
        setRole(''); // Reset role
        console.log("User logged out");
        toast.success('Logged out successfully!'); // Show Toastify message
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">
                    <img src="/logo.png" alt="Autorizz Logo" style={{ cursor: 'pointer' }} />
                </Link>
            </div>

            <div className={styles.links}>
                <Link href="/sedans">Sedans</Link>
                <Link href="/suvs">SUVs</Link>
                <Link href="/sports">Sports</Link>
                <Link href="/accessories">Accessories</Link>
            </div>

            <div className={styles.auth}>
                {isLoggedIn ? (
                    <div className={styles.icons}>
                        {/* Account Icon */}
                        <div
                            onClick={handleDropdownToggle} // Only toggle dropdown on click
                            className={styles.accountIconWrapper}
                        >
                            <FiUser size={24} className={styles.icon} />

                            {/* Dropdown that appears on click */}
                            <div className={`${styles.dropdown} ${isDropdownVisible ? styles.dropdownVisible : ''}`}>
                                {role === 'Admin' ? (
                                    <Link href="/dashboard/admin">Dashboard</Link> // Admin Dashboard
                                ) : role === 'Agent' ? (
                                    <Link href="/dashboard/agent">Dashboard</Link> // Agent Dashboard
                                ) : role === 'User' ? (
                                    <Link href="/profile">Profile</Link> // User Profile
                                ) : null}

                                {/* Show Orders link for Users and Agents only */}
                                {role !== 'Admin' && role && (
                                    <Link href="/orders">Orders</Link>
                                )}

                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        </div>

                        {/* Cart Icon */}
                        {role !== 'Admin' && role !== 'Agent' && (
                            <Link href="/cart">
                                <FiShoppingCart size={24} className={styles.icon} />
                            </Link>
                        )}
                    </div>
                ) : (
                    <Link href="/login">
                        <button className={styles.authButton}>Login/Register</button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
