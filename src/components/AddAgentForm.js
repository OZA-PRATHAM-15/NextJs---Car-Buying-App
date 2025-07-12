"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "./AddAgentForm.module.css";
import axiosInstance from "@/utils/api";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ import icons

const AddAgentForm = ({ setShowForm, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ control visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        "/admin/add-agent",
        { name, email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Agent added successfully!");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding agent:", error);
      toast.error(error.response?.data?.error || "Error adding agent");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Add New Agent</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Agent Name"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Agent Email"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.passwordField}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Agent Password"
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Add Agent
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgentForm;
