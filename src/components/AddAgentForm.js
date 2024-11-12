'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './AddAgentForm.module.css'; // Import CSS

const AddAgentForm = ({ setShowForm, setAgents }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/admin/add-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Agent added successfully!');
                setAgents(prev => [...prev, data.agent]); // Update the agents list in the parent component
                setShowForm(false); // Close the form
            } else {
                toast.error(data.error || 'Failed to add agent');
            }
        } catch (error) {
            toast.error('Error adding agent');
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
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Agent Password"
                        />
                    </div>
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton}>Add Agent</button>
                        <button type="button" className={styles.cancelButton} onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAgentForm;
