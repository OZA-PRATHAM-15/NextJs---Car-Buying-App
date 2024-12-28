import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line, Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import FileSaver from 'file-saver';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip,
    Legend
);

const ManageAnalytics = () => {
    const [mostHovered, setMostHovered] = useState([]);
    const [leastHovered, setLeastHovered] = useState([]);
    const [categoryHoverData, setCategoryHoverData] = useState([]);
    const [zeroHovered, setZeroHovered] = useState([]);
    const [overview, setOverview] = useState({});
    const [activeTab, setActiveTab] = useState('charts');

    useEffect(() => {
        fetchMostHovered();
        fetchLeastHovered();
        fetchCategoryHoverData();
        fetchZeroHovered();
        fetchOverview();
    }, []);

    const fetchMostHovered = async () => {
        const res = await fetch('http://localhost:5000/api/analytics/hover/most');
        const data = await res.json();
        setMostHovered(data);
    };

    const fetchLeastHovered = async () => {
        const res = await fetch('http://localhost:5000/api/analytics/hover/least');
        const data = await res.json();
        setLeastHovered(data);
    };

    const fetchCategoryHoverData = async () => {
        const res = await fetch('http://localhost:5000/api/analytics/hover/category');
        const data = await res.json();
        setCategoryHoverData(data);
    };

    const fetchZeroHovered = async () => {
        const res = await fetch('http://localhost:5000/api/analytics/hover/zero');
        const data = await res.json();
        setZeroHovered(data);
    };

    const fetchOverview = async () => {
        const res = await fetch('http://localhost:5000/api/analytics/hover/overview');
        const data = await res.json();
        setOverview(data);
    };

    const exportAnalytics = (data, filename) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        FileSaver.saveAs(blob, `${filename}.json`);
    };

    const categoryHoverChartData = {
        labels: categoryHoverData.map((item) => item._id),
        datasets: [
            {
                label: 'Hover Count by Category',
                data: categoryHoverData.map((item) => item.totalHoverCount),
                backgroundColor: ['#4a4a4a', '#6a6a6a', '#8a8a8a', '#aaaaaa', '#cccccc'],
                borderColor: '#ffffff',
            },
        ],
    };

    const mostHoveredChartData = {
        labels: mostHovered.map((item) => item.carName),
        datasets: [
            {
                label: 'Most Hovered Products',
                data: mostHovered.map((item) => item.totalHoverCount),
                backgroundColor: '#ffffff',
                borderColor: '#000000',
                borderWidth: 1,
            },
        ],
    };

    const leastHoveredChartData = {
        labels: leastHovered.map((item) => item.carName),
        datasets: [
            {
                label: 'Least Hovered Products',
                data: leastHovered.map((item) => item.totalHoverCount),
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderColor: '#ffffff',
                tension: 0.4,
            },
        ],
    };

    const radarChartData = {
        labels: categoryHoverData.map((item) => item._id),
        datasets: [
            {
                label: 'Hover Distribution Radar',
                data: categoryHoverData.map((item) => item.totalHoverCount),
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderColor: '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>Hover Analytics Dashboard</h1>
            <div style={tabContainerStyle}>
                <button
                    style={activeTab === 'charts' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('charts')}
                >
                    Charts & Insights
                </button>
                <button
                    style={activeTab === 'tables' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('tables')}
                >
                    Detailed Tables
                </button>
            </div>

            {activeTab === 'charts' && (
                <div style={sectionStyle}>
                    <h2 style={sectionHeaderStyle}>Charts and Insights</h2>
                    <div style={overviewContainerStyle}>
                        <div style={overviewItemStyle}>
                            <h3>Total Hovers</h3>
                            <p>{overview.totalHovers || 0}</p>
                        </div>
                        <div style={overviewItemStyle}>
                            <h3>Top Hovered Product</h3>
                            <p>{overview.topHoveredProduct || 'N/A'}</p>
                        </div>
                        <div style={overviewItemStyle}>
                            <h3>Total Categories</h3>
                            <p>{overview.totalCategories || 0}</p>
                        </div>
                    </div>
                    <div style={chartContainerStyle}>
                        <div style={chartItemStyle}>
                            <h3>Category-Wise Hover Distribution</h3>
                            <Pie data={categoryHoverChartData} />
                        </div>
                        <div style={chartItemStyle}>
                            <h3>Most Hovered Products</h3>
                            <Bar data={mostHoveredChartData} />
                        </div>
                        <div style={chartItemStyle}>
                            <h3>Least Hovered Products</h3>
                            <Line data={leastHoveredChartData} />
                        </div>
                        <div style={chartItemStyle}>
                            <h3>Hover Distribution Radar</h3>
                            <Radar data={radarChartData} />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'tables' && (
                <div style={sectionStyle}>
                    <h2 style={sectionHeaderStyle}>Detailed Tables</h2>
                    <div style={tableContainerStyle}>
                        <h3>Products Without Any Hovers</h3>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>Name</th>
                                    <th style={tableHeaderStyle}>Category</th>
                                    <th style={tableHeaderStyle}>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {zeroHovered.map((product) => (
                                    <tr key={product._id} style={tableRowStyle}>
                                        <td style={tableCellStyle}>{product.name}</td>
                                        <td style={tableCellStyle}>{product.type}</td>
                                        <td style={tableCellStyle}>${product.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            style={exportButtonStyle}
                            onClick={() => exportAnalytics(zeroHovered, 'ZeroHoveredProducts')}
                        >
                            Export Data
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// CSS Inline Styles
const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    minHeight: '100vh',
    padding: '20px',
};

const headerStyle = {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '30px',
};

const tabContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
};

const tabStyle = {
    padding: '10px 20px',
    margin: '0 10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#ffffff',
    color: '#000000',
};

const sectionStyle = {
    padding: '20px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
};

const sectionHeaderStyle = {
    textAlign: 'center',
    fontSize: '1.8rem',
    marginBottom: '20px',
};

const overviewContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
};

const overviewItemStyle = {
    textAlign: 'center',
    flex: 1,
    margin: '0 10px',
    backgroundColor: '#333',
    borderRadius: '8px',
    padding: '10px',
};

const chartContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
};

const chartItemStyle = {
    width: '48%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '8px',
    backgroundColor: '#444',
};

const tableContainerStyle = {
    padding: '20px',
    backgroundColor: '#333',
    borderRadius: '8px',
    marginTop: '20px',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
};

const tableHeaderStyle = {
    backgroundColor: '#555',
    color: '#fff',
    padding: '10px',
    borderBottom: '2px solid #666',
};

const tableCellStyle = {
    padding: '10px',
    color: '#fff',
};

const tableRowStyle = {
    textAlign: 'left',
};

const exportButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default ManageAnalytics;
