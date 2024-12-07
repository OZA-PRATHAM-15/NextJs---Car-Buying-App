'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FaHome, FaUser, FaLock, FaSignOutAlt } from 'react-icons/fa';
import styles from './Profile.module.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('You are not logged in. Redirecting to login page...');
                router.push('/login');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/auth/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setUser(data);
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

    const handleUpdateProfile = () => {
        router.push('/profile/edit'); // Redirect to the Update Profile page
    };

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No token found. Cannot delete account.');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/delete-account', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                toast.success('Account deleted successfully');
                localStorage.removeItem('token');
                router.push('/register'); // Redirect to the Register page
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete account.');
            }
        } catch (error) {
            toast.error('Error deleting account.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
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
        <div className={styles.profileModal}>
            {/* Sidebar Navbar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <img
                        src="https://via.placeholder.com/100"
                        alt="Profile"
                        className={styles.sidebarProfileImage}
                    />
                    <h3>{user.name}</h3>
                </div>
                <ul className={styles.navLinks}>
                    <li onClick={() => handleNavigate('/')}>
                        <FaHome className={styles.icon} /> Back to Showroom
                    </li>
                    <li onClick={() => handleNavigate('/profile')}>
                        <FaUser className={styles.icon} /> Profile
                    </li>
                    <li onClick={() => handleNavigate('/change-password')}>
                        <FaLock className={styles.icon} /> Change Password
                    </li>
                    <li onClick={handleLogout}>
                        <FaSignOutAlt className={styles.icon} /> Logout
                    </li>
                </ul>
            </aside>

            {/* Profile Details */}
            <main className={styles.profileContent}>
                <h2>Account Details</h2>
                <div className={styles.profileDetails}>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phoneNumber || 'No phone number'}</p>
                    <p><strong>Address:</strong> {user.address || 'No address'}</p>
                    <p><strong>Gender:</strong> {user.gender || 'Gender not specified'}</p>
                    <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={styles.actionButtons}>
                    <button className={styles.updateButton} onClick={handleUpdateProfile}>
                        Update Profile
                    </button>
                    <button className={styles.deleteButton} onClick={handleDeleteAccount}>
                        Delete Account
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
