"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaHome,
  FaUser,
  FaLock,
  FaSignOutAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaCalendar,
} from "react-icons/fa";
import styles from "./Profile.module.css";
import CarGame from "./CarGame";
import axiosInstance from "@/utils/api";
import Image from "next/image";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You are not logged in. Redirecting to login page...");
        router.push("/login");
        return;
      }

      try {
        const res = await axiosInstance.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data);
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleUpdateProfile = () => {
    router.push("/profile/edit");
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Cannot delete account.");
      return;
    }

    try {
      const res = await axiosInstance.delete("/auth/delete-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Account deleted successfully");
      localStorage.removeItem("token");
      router.push("/register");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete account.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleNavigate = (path) => {
    router.push(path);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.profileContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Image
            src="https://via.placeholder.com/100"
            alt="Profile"
            className={styles.sidebarProfileImage}
            width={100}
            height={100}
          />
          <h3>{user.name}</h3>
        </div>
        <ul className={styles.navLinks}>
          <li onClick={() => handleNavigate("/")}>
            <FaHome className={styles.icon} /> Back to Showroom
          </li>
          <li onClick={() => handleNavigate("/profile")}>
            <FaUser className={styles.icon} /> Profile
          </li>
          <li onClick={() => handleNavigate("/change-password")}>
            <FaLock className={styles.icon} /> Change Password
          </li>
          <li onClick={() => setShowLogoutModal(true)}>
            <FaSignOutAlt className={styles.icon} /> Logout
          </li>
        </ul>
      </aside>

      <main className={styles.profileContent}>
        <h2>Account Details</h2>
        <div className={styles.profileDetails}>
          <p>
            <FaUser className={styles.detailIcon} /> <strong>Name:</strong>{" "}
            {user.name}
          </p>
          <p>
            <FaEnvelope className={styles.detailIcon} /> <strong>Email:</strong>{" "}
            {user.email}
          </p>
          <p>
            <FaPhone className={styles.detailIcon} /> <strong>Phone:</strong>{" "}
            {user.phoneNumber || "No phone number"}
          </p>
          <p>
            <FaMapMarkerAlt className={styles.detailIcon} />{" "}
            <strong>Address:</strong> {user.address || "No address"}
          </p>
          <p>
            <FaVenusMars className={styles.detailIcon} />{" "}
            <strong>Gender:</strong> {user.gender || "Not specified"}
          </p>
          <p>
            <FaCalendar className={styles.detailIcon} />{" "}
            <strong>Member Since:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.updateButton} onClick={handleUpdateProfile}>
            Update Profile
          </button>
          <button className={styles.deleteButton} onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
        <CarGame />
      </main>

      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p>Are you sure you want to log out?</p>
            <div className={styles.modalActions}>
              <button className={styles.confirmButton} onClick={handleLogout}>
                Yes, Log Out
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
