import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AddAgentForm from './AddAgentForm'; // Import the form component
import styles from './Agents.module.css'; // CSS for styling
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const AgentList = () => {
    const [agents, setAgents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState(null);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/admin/agents', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch agents');
                }

                const data = await res.json();
                setAgents(data);
            } catch (error) {
                toast.error('Error fetching agents');
                console.error(error);
            }
        };

        fetchAgents();
    }, []);

    const handleAddAgentClick = () => {
        setShowForm(true);
    };

    const handleDeleteAgent = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/admin/agents/${agentToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                toast.success('Agent deleted successfully!');
                setAgents(agents.filter(agent => agent._id !== agentToDelete));
                setShowDeleteModal(false);
            } else {
                toast.error('Failed to delete agent');
            }
        } catch (error) {
            toast.error('Error deleting agent');
        }
    };

    const filteredAgents = agents.filter(agent =>
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
                    <button onClick={handleAddAgentClick} className={styles.addAgentButton}>
                        <FaPlus /> Add Agent
                    </button>
                </div>
            </div>
            {showForm && <AddAgentForm setShowForm={setShowForm} setAgents={setAgents} />}
            <div className={styles.agentsGrid}>
                {filteredAgents.length > 0 ? (
                    filteredAgents.map(agent => (
                        <div key={agent._id} className={styles.agentCard}>
                            <h3>{agent.name}</h3>
                            <p>Email: <span>{agent.email}</span></p>
                            <div className={styles.actions}>
                                <button
                                    className={styles.updateButton}
                                    onClick={() => {/* handleUpdateAgent(agent) */ }}
                                >
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
