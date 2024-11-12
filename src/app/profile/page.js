// src/app/profile/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import styles from './Profile.module.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // Get JWT token

            if (!token) {
                toast.error('You are not logged in. Redirecting to login page...');
                router.push('/login');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setUser(data); // Set fetched user data

                } else {

                    router.push('/login');
                }
            } catch (error) {
                toast.error('Failed to fetch profile data');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No token found, cannot delete account');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/delete-account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Account deleted successfully');
                localStorage.removeItem('token'); // Clear token
                router.push('/register'); // Redirect to register page
            } else {
                toast.error(data.error || 'Failed to delete account');
            }
        } catch (error) {
            toast.error('Error deleting account');
        }
    };

    const handleUpdateAccount = () => {
        router.push('/profile/edit'); // Redirect to the edit profile page
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.profileImage}>
                    <img
                        src="https://via.placeholder.com/150" // Placeholder for now
                        alt="Profile"
                    />
                </div>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <p>{user.phoneNumber || 'No phone number'}</p>
                <p>{user.address || 'No address'}</p>
                <p>{user.gender || 'Gender not specified'}</p>
                <div className={styles.actionButtons}>
                    <button className={styles.updateButton} onClick={handleUpdateAccount}>Update Account</button>
                    <button className={styles.deleteButton} onClick={handleDeleteAccount}>Delete Account</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
