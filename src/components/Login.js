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

        // Ensure email and password are provided
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            // Send login request
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log('Received JWT Token:', data.token);

                // Save token and user role in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);

                console.log('Token saved in localStorage:', localStorage.getItem('token'));

                if (data.role === 'Admin') {
                    // Admins are redirected to the dashboard
                    toast.success("Welcome Admin!");
                    router.push('/'); // Update this route as needed
                } else {
                    // Redirect to user dashboard
                    toast.success("Login successful!");
                    router.push('/');
                }
            } else if (res.status === 403) {
                // Handle unverified email
                toast.error(data.error);
                localStorage.setItem('email', email); // Save email for OTP verification
                router.push('/verify-otp');
            } else {
                // General error handling
                toast.error(data.error || "Login failed");
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error("Something went wrong. Please try again.");
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
                                required
                            />
                        </label>
                        <label>
                            <span>Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit">Login</button>
                    </form>
                    <p>
                        Don't have an account? <Link href="/register">Register</Link>
                    </p>
                    <p>
                        Back to <Link href="/">Frontseat</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
