// src/components/Login.js
'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import styles from './Auth.module.css';
import Link from 'next/link';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
        } else {
            try {
                const res = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();

                if (res.ok) {
                    // Log the token to see if it's correctly received
                    console.log('Received JWT Token:', data.token);

                    // Save JWT token and redirect user to profile page
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);

                    // Also log what is saved to localStorage
                    console.log('Token saved in localStorage:', localStorage.getItem('token'));
                    if (data.role === 'Admin') {
                        // Admins bypass OTP verification
                        toast.success("Welcome Admin!");
                        router.push('/');
                    }

                    toast.success("Login successful!");
                    router.push('/');
                } else if (res.status === 403) {
                    // Email not verified
                    toast.error(data.error);
                    localStorage.setItem('email', email); // Store email for verification
                    router.push('/verify-otp');
                } else {
                    toast.error(data.error || "Login failed");
                }
            } catch (error) {
                console.error('Error during login:', error);
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
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit">Login</button>
                    </form>
                    <p>Don't have an account? <Link href="/register">Register</Link></p>
                    <p>Back to <Link href="/">Frontseat</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
