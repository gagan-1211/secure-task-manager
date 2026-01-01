import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminStats = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="p-4 bg-white rounded shadow mb-4">Loading Stats...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Users</h3>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Total Tasks</h3>
                <p className="text-3xl font-bold">{stats.totalTasks}</p>
            </div>
            <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
                <h3 className="text-gray-500 text-sm font-bold uppercase">Active Users (7d)</h3>
                <p className="text-3xl font-bold">{stats.activeUsersLast7Days}</p>
            </div>
        </div>
    );
};

export default AdminStats;
