'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiUser, FiShoppingCart } from 'react-icons/fi';
import styles from './Header.module.css';

const Header = ({ carName }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state

    useEffect(() => {
        const token = localStorage.getItem('token'); // Simulate auth check
        setIsLoggedIn(!!token); // Set login state
    }, []);

    return (
        <header className={styles.navbar}>
            {/* Logo */}
            <div className={styles.logo}>
                <Link href="/">
                    <img src="/logo.png" alt="Autorizz Logo" />
                </Link>
            </div>

            {/* Car Name */}
            <div className={styles.carName}>
                <h1>{carName || 'Car Model Name'}</h1>
            </div>

            {/* Right Side */}
            <div className={styles.auth}>
                {isLoggedIn ? (
                    <div className={styles.icons}>
                        <Link href="/cart">
                            <FiShoppingCart size={24} className={styles.icon} />
                        </Link>
                        <Link href="/profile">
                            <FiUser size={24} className={styles.icon} />
                        </Link>
                    </div>
                ) : (
                    <Link href="/login">
                        <span className={styles.authText}>Login/Register</span>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
