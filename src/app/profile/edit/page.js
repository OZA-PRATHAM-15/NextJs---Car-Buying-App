"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import styles from "./EditProfile.module.css";
import axiosInstance from "@/utils/api";

const EditProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
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

        const data = res.data;
        setUser({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          gender: data.gender || "",
        });
      } catch (error) {
        toast.error("Failed to fetch profile data");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No token found. Cannot update profile.");
      return;
    }

    try {
      await axiosInstance.put(
        "/auth/profile",
        { ...user },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully");
      router.push("/profile");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.editContainer}>
      <div className={styles.editCard}>
        <h2>Edit Profile</h2>
        <form className={styles.editForm}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              readOnly
              className={styles.readOnlyInput}
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={user.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
