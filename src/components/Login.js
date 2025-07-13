"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import styles from "./Auth.module.css";
import Link from "next/link";
import axiosInstance from "@/utils/api"; // ✅ Use axios
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ Icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });

      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "Admin") {
        toast.success("Welcome Admin!");
        router.push("/");
      } else {
        toast.success("Login successful!");
        router.push("/");
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.error || "Login failed";

      if (status === 403) {
        toast.error(message);
        localStorage.setItem("email", email);
        router.push("/verify-otp");
      } else {
        toast.error(message);
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
                required
              />
            </label>

            <label>
              <span>Password</span>
              <div className={styles.passwordField}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </label>

            <button type="submit">Login</button>
          </form>
          <p>
            Don&apos;t have an account? <Link href="/register">Register</Link>
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
