"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FiBox,
  FiUsers,
  FiShoppingBag,
  FiLogOut,
  FiArrowLeftCircle,
} from "react-icons/fi";
import { FaChartLine } from "react-icons/fa";
import OrdersList from "../components/OrdersList";
import ManageStock from "../components/ManageStocks";
import AgentList from "../components/AgentList";
import ManageUsers from "../components/ManageUsers";
import ManageAnalytics from "./ManageAnalytics";
import styles from "./DashboardLayout.module.css";
import Bot from "./bot";

const DashboardLayout = ({ userRole }) => {
  const [selectedFeature, setSelectedFeature] = useState("orders");

  const adminFeatures = [
    {
      name: "Orders",
      route: "orders",
      icon: FiShoppingBag,
      component: <OrdersList />,
    },
    {
      name: "Stocks",
      route: "stocks",
      icon: FiBox,
      component: <ManageStock />,
    },
    {
      name: "Agents",
      route: "agents",
      icon: FiUsers,
      component: <AgentList />,
    },
    {
      name: "Manage Users",
      route: "manage-users",
      icon: FiUsers,
      component: <ManageUsers />,
    },
    {
      name: "Analytics",
      route: "analytics",
      icon: FaChartLine,
      component: <ManageAnalytics />,
    },
    { name: "IntelliBot", route: "bot", icon: FiUsers, component: <Bot /> },
  ];

  const agentFeatures = [
    {
      name: "Orders",
      route: "orders",
      icon: FiShoppingBag,
      component: <OrdersList />,
    },
    {
      name: "Stocks",
      route: "stocks",
      icon: FiBox,
      component: <ManageStock />,
    },
    {
      name: "Analytics",
      route: "analytics",
      icon: FaChartLine,
      component: <ManageAnalytics />,
    },
    { name: "IntelliBot", route: "bot", icon: FiUsers, component: <Bot /> },
  ];

  const features = userRole === "Admin" ? adminFeatures : agentFeatures;

  const renderComponent = () => {
    const selected = features.find((f) => f.route === selectedFeature);
    return selected ? selected.component : <p>Select a feature to continue</p>;
  };

  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.homeButton}>
          <Link href="/">
            <FiArrowLeftCircle size={22} className={styles.icon} />
            <span>Back to showroom</span>
          </Link>
        </div>

        <ul>
          {features.map((feature) => (
            <li
              key={feature.route}
              className={selectedFeature === feature.route ? styles.active : ""}
              onClick={() => setSelectedFeature(feature.route)}
            >
              <feature.icon className={styles.icon} />
              <span>{feature.name}</span>
            </li>
          ))}
          <li onClick={() => alert("Logging out...")}>
            <FiLogOut className={styles.icon} />
            <span>Logout</span>
          </li>
        </ul>
      </aside>

      <main className={styles.content}>{renderComponent()}</main>
    </div>
  );
};

export default DashboardLayout;
