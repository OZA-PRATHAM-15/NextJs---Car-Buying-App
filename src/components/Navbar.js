"use client";
import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [role, setRole] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setRole(decodedToken.role);
    }
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRole("");
    toast.success("Logged out successfully!");
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/">
            <img
              src="/logo.png"
              alt="Autorizz Logo"
              style={{ cursor: "pointer" }}
            />
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
              <div
                onClick={handleDropdownToggle}
                className={styles.accountIconWrapper}
              >
                <FiUser size={24} className={styles.icon} />
                <div
                  className={`${styles.dropdown} ${
                    isDropdownVisible ? styles.dropdownVisible : ""
                  }`}
                >
                  {role === "Admin" ? (
                    <Link href="/dashboard/admin">Dashboard</Link>
                  ) : role === "Agent" ? (
                    <Link href="/dashboard/agent">Dashboard</Link>
                  ) : role === "User" ? (
                    <Link href="/profile">Profile</Link>
                  ) : null}
                  {role !== "Admin" && role && (
                    <Link href="/orders">Orders</Link>
                  )}
                  <button onClick={() => setShowLogoutModal(true)}>
                    Logout
                  </button>
                </div>
              </div>
              {role !== "Admin" && role !== "Agent" && (
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

      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Are you sure you want to logout?</p>
            <div className={styles.modalActions}>
              <button
                className={styles.confirmBtn}
                onClick={handleLogoutConfirm}
              >
                Confirm
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
