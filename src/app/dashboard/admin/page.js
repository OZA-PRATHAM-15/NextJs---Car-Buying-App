'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import OrdersList from '@/components/OrdersList';
import ManageStock from '@/components/ManageStocks';
import AgentList from '@/components/AgentList';
import ManageUsers from '@/components/ManageUsers'; // Add other necessary imports

const AdminPage = () => {
    const [selectedSection, setSelectedSection] = useState('orders');  // Default to 'orders'

    // Function to render the correct component based on the selected section
    const renderSection = () => {
        switch (selectedSection) {
            case 'orders':
                return <OrdersList />;
            case 'stocks':
                return <ManageStock />;
            case 'agents':
                return <AgentList />;
            case 'manage-users':
                return <ManageUsers />;
            default:
                return <OrdersList />;
        }
    };

    return (
        <DashboardLayout userRole="Admin" setSelectedSection={setSelectedSection}>
            {renderSection()} {/* Dynamically render the selected section */}
        </DashboardLayout>
    );
};

export default AdminPage;
