'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import styles from './Auth.module.css';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false); // To manage resend button state
    const router = useRouter();

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            toast.error("Please enter the OTP");
        } else {
            try {
                const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ otp }), // Pass the OTP to the backend
                });

                const data = await res.json();
                if (res.ok) {
                    toast.success("Verification successful!");
                    router.push('/login'); // Redirect to login after success
                } else {
                    toast.error(data.error || "OTP verification failed");
                }
            } catch (error) {
                console.error('Error during OTP verification:', error);
                toast.error("Something went wrong. Please try again.");
            }
        }
    };

    const handleResendOtp = async () => {
        try {
            setResendDisabled(true); // Disable button temporarily to avoid spam
            const res = await fetch('http://localhost:5000/api/auth/generate-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: localStorage.getItem('email') }), // Use stored email
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("OTP resent to your email");
            } else {
                toast.error(data.error || "Failed to resend OTP");
            }
            setTimeout(() => setResendDisabled(false), 60000); // Re-enable after 60 seconds
        } catch (error) {
            console.error('Error during OTP resend:', error);
            toast.error("Something went wrong. Please try again.");
            setResendDisabled(false);
        }
    };

    const handleUpdateEmail = () => {
        router.push('/register'); // Redirect back to registration for email update
    };

    return (
        <div className={styles.authContainer}>
            <video autoPlay muted loop className={styles.backgroundVideo}>
                <source src="/background.mp4" type="video/mp4" />
                Your browser does not support HTML5 video.
            </video>

            <div className={styles.authFormWrapper}>
                <div className={styles.authForm}>
                    <h2>Verify OTP</h2>
                    <form onSubmit={handleVerifyOtp}>
                        <label>
                            <span>Enter OTP</span>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6} // 6-digit OTP
                                placeholder="Enter 6-digit OTP"
                            />
                        </label>
                        <button type="submit" className={styles.verifyOtpButton}>Verify OTP</button>
                    </form>
                    <div className={styles.resendOtpWrapper}>
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendDisabled}
                            className={styles.resendOtpButton}
                        >
                            Resend OTP
                        </button>
                    </div>
                    <p>Entered wrong email?
                        <button
                            onClick={handleUpdateEmail}
                            type="button"
                            className={styles.updateEmailButton}>
                            Update Email
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
