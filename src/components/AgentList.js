import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AddAgentForm from './AddAgentForm'; // Import the form component
import styles from './Agents.module.css'; // CSS for styling

const AgentList = () => {
    const [agents, setAgents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // New state for search functionality

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

    const handleDeleteAgent = async (agentId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/admin/agents/${agentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.ok) {
                toast.success('Agent deleted successfully!');
                setAgents(agents.filter(agent => agent._id !== agentId));
            } else {
                toast.error('Failed to delete agent');
            }
        } catch (error) {
            toast.error('Error deleting agent');
        }
    };

    // Filter agents based on search query
    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className={styles.header}>
                <h2>Agents</h2>
                <input
                    type="text"
                    placeholder="Search Agents"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchBar}
                />
                <button onClick={handleAddAgentClick} className={styles.addAgentButton}>Add Agent</button>
            </div>
            {showForm && <AddAgentForm setShowForm={setShowForm} setAgents={setAgents} />}
            <div className={styles.agentsGrid}>
                {filteredAgents.length > 0 ? (
                    filteredAgents.map(agent => (
                        <div key={agent._id} className={styles.agentCard}>
                            <h3>{agent.name}</h3>
                            <p>Email: {agent.email}</p>
                            <div className={styles.actions}>
                                <button className={styles.deleteButton} onClick={() => handleDeleteAgent(agent._id)}>Delete</button>
                                <button className={styles.updateButton} onClick={() => {/* handleUpdateAgent(agent) */ }}>Update</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No agents available.</p>
                )}
            </div>
        </div>
    );
};

export default AgentList;
