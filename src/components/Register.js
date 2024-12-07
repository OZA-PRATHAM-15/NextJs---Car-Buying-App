'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';
import Link from 'next/link';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Correct import

const Register = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState({
        length: false,
        capital: false,
        number: false,
        special: false,
    });

    const router = useRouter(); // Initialize router

    const validatePassword = (password) => {
        setPasswordValid({
            length: password.length >= 8,
            capital: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !name || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
        } else if (password !== confirmPassword) {
            toast.error("Passwords do not match");
        } else if (!Object.values(passwordValid).every(Boolean)) {
            toast.error("Password does not meet the required criteria");
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
                    console.log('Redirecting to verify-otp...');
                    localStorage.setItem('email', email); // Save email for OTP verification
                    router.push('/verify-otp'); // Redirect to OTP page
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
                            <div className={styles.passwordField}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validatePassword(e.target.value);
                                    }}
                                />
                                <span
                                    className={styles.eyeIcon}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div className={styles.passwordCriteria}>
                                <p>
                                    {passwordValid.length ? (
                                        <FaCheckCircle className={styles.validIcon} />
                                    ) : (
                                        <FaTimesCircle className={styles.invalidIcon} />
                                    )}
                                    At least 8 characters
                                </p>
                                <p>
                                    {passwordValid.capital ? (
                                        <FaCheckCircle className={styles.validIcon} />
                                    ) : (
                                        <FaTimesCircle className={styles.invalidIcon} />
                                    )}
                                    At least 1 uppercase letter
                                </p>
                                <p>
                                    {passwordValid.number ? (
                                        <FaCheckCircle className={styles.validIcon} />
                                    ) : (
                                        <FaTimesCircle className={styles.invalidIcon} />
                                    )}
                                    At least 1 number
                                </p>
                                <p>
                                    {passwordValid.special ? (
                                        <FaCheckCircle className={styles.validIcon} />
                                    ) : (
                                        <FaTimesCircle className={styles.invalidIcon} />
                                    )}
                                    At least 1 special character
                                </p>
                            </div>
                        </label>
                        <label>
                            <span>Confirm Password</span>
                            <div className={styles.passwordField}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <span
                                    className={styles.eyeIcon}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <p
                                className={
                                    password === confirmPassword && confirmPassword
                                        ? styles.match
                                        : styles.noMatch
                                }
                            >
                                {password === confirmPassword && confirmPassword
                                    ? "Passwords match"
                                    : "Passwords do not match"}
                            </p>
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
