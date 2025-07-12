"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import OrdersList from "@/components/OrdersList";
import ManageStock from "@/components/ManageStocks";
import AgentList from "@/components/AgentList";
import ManageUsers from "@/components/ManageUsers";
import ManageAnalytics from "@/components/ManageAnalytics";

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState("orders");

  const renderSection = () => {
    switch (selectedSection) {
      case "orders":
        return <OrdersList />;
      case "stocks":
        return <ManageStock />;
      case "agents":
        return <AgentList />;
      case "manage-users":
        return <ManageUsers />;
      case "analytics":
        return <ManageAnalytics />;
      default:
        return <OrdersList />;
    }
  };

  return (
    <DashboardLayout userRole="Admin" setSelectedSection={setSelectedSection}>
      {renderSection()}
    </DashboardLayout>
  );
};

export default AdminPage;
