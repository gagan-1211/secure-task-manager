import { useEffect, useState } from 'react';
import { Users, CheckSquare, Activity } from 'lucide-react';
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

    if (!stats) return (
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl animate-pulse flex items-center justify-center h-24">
            <span className="text-gray-400">Loading Stats...</span>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Total Users */}
            <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-fuchsia-500/30 transition-all flex items-center gap-4 group">
                <div className="p-3 rounded-lg bg-fuchsia-500/10 text-fuchsia-500 group-hover:bg-fuchsia-500/20 transition-colors">
                    <Users size={24} />
                </div>
                <div>
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Users</h3>
                    <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
            </div>

            {/* Total Tasks */}
            <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-orange-500/30 transition-all flex items-center gap-4 group">
                <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20 transition-colors">
                    <CheckSquare size={24} />
                </div>
                <div>
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Tasks</h3>
                    <p className="text-2xl font-bold text-white">{stats.totalTasks}</p>
                </div>
            </div>

            {/* Active Users */}
            <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-violet-500/30 transition-all flex items-center gap-4 group">
                <div className="p-3 rounded-lg bg-violet-500/10 text-violet-500 group-hover:bg-violet-500/20 transition-colors">
                    <Activity size={24} />
                </div>
                <div>
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Active Users (7d)</h3>
                    <p className="text-2xl font-bold text-white">{stats.activeUsersLast7Days}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
