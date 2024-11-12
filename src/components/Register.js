'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';
import Link from 'next/link';

const Register = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !name || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
        } else if (password !== confirmPassword) {
            toast.error("Passwords do not match");
        } else {
            try {
                const res = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await res.json();
                if (res.ok) {
                    toast.success("Registration successful!");
                    // Redirect to login page after successful registration
                    window.location.href = '/login';
                } else {
                    toast.error(data.error || "Registration failed");
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className={styles.authContainer}>
            <video autoPlay muted loop className={styles.backgroundVideo}>
                <source src="/background.mp4" type="video/mp4" />
                Your browser does not support HTML5 video.
            </video>

            <div className={styles.authFormWrapper}>
                <div className={styles.authForm}>
                    <h2>Register</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <span>Name</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Confirm Password</span>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </label>
                        <button type="submit">Register</button>
                    </form>
                    <p>Already have an account? <Link href="/login">Login</Link></p>
                    <p><Link href="/">Back to Frontseat</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
