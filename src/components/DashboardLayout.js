'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiBox, FiUsers, FiShoppingBag, FiLogOut, FiArrowLeftCircle } from 'react-icons/fi'; // Icons
import OrdersList from '../components/OrdersList';
import ManageStock from '../components/ManageStocks';
import AgentList from '../components/AgentList';
import ManageUsers from '../components/ManageUsers'; // Importing all components
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ userRole }) => {
    const [selectedFeature, setSelectedFeature] = useState('orders'); // Default feature to 'orders'

    // Features for Admin role
    const adminFeatures = [
        { name: 'Orders', route: 'orders', icon: FiShoppingBag, component: <OrdersList /> },
        { name: 'Stocks', route: 'stocks', icon: FiBox, component: <ManageStock /> },
        { name: 'Agents', route: 'agents', icon: FiUsers, component: <AgentList /> },
        { name: 'Manage Users', route: 'manage-users', icon: FiUsers, component: <ManageUsers /> }
    ];

    // Features for Agent role
    const agentFeatures = [
        { name: 'Orders', route: 'orders', icon: FiShoppingBag, component: <OrdersList /> },
        { name: 'Stocks', route: 'stocks', icon: FiBox, component: <ManageStock /> }
    ];

    // Select features based on the role of the user
    const features = userRole === 'Admin' ? adminFeatures : agentFeatures;

    // Render the component based on the selected feature
    const renderComponent = () => {
        const selected = features.find(f => f.route === selectedFeature);
        return selected ? selected.component : <p>No component found</p>;
    };

    return (
        <div className={styles.dashboardLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                {/* Home Button */}
                <div className={styles.homeButton}>
                    <Link href="/">
                        <FiArrowLeftCircle size={24} className={styles.icon} />
                        <span>Back to showroom</span>
                    </Link>
                </div>

                <ul>
                    {features.map((feature, index) => (
                        <li
                            key={index}
                            className={selectedFeature === feature.route ? styles.active : ''}
                            onClick={() => setSelectedFeature(feature.route)}
                        >
                            <feature.icon className={styles.icon} />
                            <span>{feature.name}</span>
                        </li>
                    ))}
                    <li onClick={() => alert('Logging out...')}>
                        <FiLogOut className={styles.icon} />
                        <span>Logout</span>
                    </li>
                </ul>
            </aside>

            {/* Main Content Area */}
            <main className={styles.content}>
                {renderComponent()} {/* Dynamically render the selected component */}
            </main>
        </div>
    );
};

export default DashboardLayout;
