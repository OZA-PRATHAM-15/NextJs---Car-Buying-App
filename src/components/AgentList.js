import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AddAgentForm from "./AddAgentForm";
import styles from "./Agents.module.css";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import axiosInstance from "@/utils/api";

const AgentList = () => {
  const [agents, setAgents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/admin/agents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgents(res.data);
    } catch (error) {
      toast.error("Error fetching agents");
      console.error(error);
    }
  };

  const handleAddAgentClick = () => {
    setShowForm(true);
  };

  const handleDeleteAgent = async () => {
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.delete(`/admin/agents/${agentToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Agent deleted successfully!");
      setAgents((prev) => prev.filter((agent) => agent._id !== agentToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Error deleting agent");
      console.error(error);
    }
  };

  const filteredAgents = agents.filter((agent) =>
    agent?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className={styles.header}>
        <h2>Agents</h2>
        <div className={styles.searchAndAdd}>
          <input
            type="text"
            placeholder="Search Agents by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchBar}
          />
          <button
            onClick={handleAddAgentClick}
            className={styles.addAgentButton}
          >
            <FaPlus /> Add Agent
          </button>
        </div>
      </div>

      {showForm && (
        <AddAgentForm
          setShowForm={setShowForm}
          onSuccess={() => {
            fetchAgents();
            setShowForm(false);
          }}
        />
      )}

      <div className={styles.agentsGrid}>
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => (
            <div key={agent._id} className={styles.agentCard}>
              <h3>{agent.name}</h3>
              <p>
                Email: <span>{agent.email}</span>
              </p>
              <div className={styles.actions}>
                <button className={styles.updateButton} onClick={() => {}}>
                  <FaEdit /> Update
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => {
                    setAgentToDelete(agent._id);
                    setShowDeleteModal(true);
                  }}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No agents available.</p>
        )}
      </div>

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Are you sure?</h3>
            <p>This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button
                className={styles.confirmButton}
                onClick={handleDeleteAgent}
              >
                Confirm
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setShowDeleteModal(false)}
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

export default AgentList;
