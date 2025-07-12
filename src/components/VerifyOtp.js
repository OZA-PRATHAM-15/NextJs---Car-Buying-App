"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import styles from "./Auth.module.css";
import axiosInstance from "@/utils/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const router = useRouter();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
    } else {
      try {
        const res = await axiosInstance.post("/auth/verify-otp", { otp });

        toast.success("Verification successful!");
        router.push("/login");
      } catch (error) {
        console.error("Error during OTP verification:", error);
        toast.error(error.response?.data?.error || "OTP verification failed");
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true);
      const email = localStorage.getItem("email");

      const res = await axiosInstance.post("/auth/generate-otp", { email });

      toast.success("OTP resent to your email");
      setTimeout(() => setResendDisabled(false), 60000);
    } catch (error) {
      console.error("Error during OTP resend:", error);
      toast.error(error.response?.data?.error || "Failed to resend OTP");
      setResendDisabled(false);
    }
  };

  const handleUpdateEmail = () => {
    router.push("/register");
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
                maxLength={6}
                placeholder="Enter 6-digit OTP"
              />
            </label>
            <button type="submit" className={styles.verifyOtpButton}>
              Verify OTP
            </button>
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
          <p>
            Entered wrong email?
            <button
              onClick={handleUpdateEmail}
              type="button"
              className={styles.updateEmailButton}
            >
              Update Email
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
