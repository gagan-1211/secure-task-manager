import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LogOut, Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import AdminStats from '../components/AdminStats';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error("Fetch tasks failed", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const onSubmit = async (data) => {
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask.id}`, { ...data, status: editingTask.status });
                setEditingTask(null);
            } else {
                await api.post('/tasks', data);
            }
            reset();
            fetchTasks();
        } catch (error) {
            console.error("Save task failed", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setValue('title', task.title);
        setValue('description', task.description);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        reset({ title: '', description: '' });
    };

    const handleStatusChange = async (task, newStatus) => {
        try {
            await api.put(`/tasks/${task.id}`, { ...task, status: newStatus });
            fetchTasks();
        } catch (error) {
            console.error("Status update failed", error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'IN_PROGRESS': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle size={14} />;
            case 'IN_PROGRESS': return <Clock size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    return (
        <Layout>
            <div className="min-h-screen">
                {/* Navbar */}
                <nav className="bg-neutral-900/80 backdrop-blur-md border-b border-white/5 p-4 sticky top-0 z-50">
                    <div className="container mx-auto max-w-6xl flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                ST
                            </div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">SecureTask</h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-medium text-white">{user.email}</span>
                                <span className="text-xs text-fuchsia-400 font-bold tracking-wider">{user.role}</span>
                            </div>
                            <button onClick={logout} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto p-4 md:p-8 max-w-6xl">

                    {user.role === 'ADMIN' && (
                        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-fuchsia-500 rounded-full"></span>
                                System Analytics
                            </h2>
                            <AdminStats />
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Task Form - Sticky on Desktop */}
                        <div className="lg:col-span-1">
                            <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 sticky top-24 shadow-xl">
                                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Plus className="text-fuchsia-500" size={20} />
                                    {editingTask ? 'Edit Task' : 'New Task'}
                                </h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <Input
                                        label="Title"
                                        {...register('title', { required: "Title is required" })}
                                        placeholder="What needs to be done?"
                                        error={errors.title}
                                    />
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-300">Description</label>
                                        <textarea
                                            {...register('description')}
                                            className="w-full bg-neutral-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 transition-all backdrop-blur-sm min-h-[120px]"
                                            placeholder="Add details..."
                                        ></textarea>
                                    </div>
                                    <div className="pt-2 flex gap-2">
                                        <Button type="submit" variant="primary" className="flex-1 flex items-center justify-center gap-2">
                                            {editingTask ? <Edit2 size={16} /> : <Plus size={16} />}
                                            {editingTask ? 'Update' : 'Create'}
                                        </Button>
                                        {editingTask && (
                                            <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                                Your Tasks
                            </h2>

                            {tasks.length === 0 ? (
                                <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-white/5">
                                    <p className="text-gray-400">No tasks yet. Create one to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tasks.map(task => (
                                        <div key={task.id} className="group bg-neutral-900/40 backdrop-blur-sm p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all hover:bg-neutral-900/60 shadow-lg hover:shadow-xl">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-bold text-lg text-white group-hover:text-fuchsia-400 transition-colors">{task.title}</h3>
                                                        <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 font-medium ${getStatusColor(task.status)}`}>
                                                            {getStatusIcon(task.status)}
                                                            {task.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm leading-relaxed">{task.description}</p>
                                                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                                                        <span>Owner: <span className="text-gray-300">{task.userId}</span></span>
                                                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                    <div className="relative">
                                                        <select
                                                            value={task.status}
                                                            onChange={(e) => handleStatusChange(task, e.target.value)}
                                                            className="appearance-none bg-black/40 border border-white/10 text-xs rounded-lg pl-3 pr-8 py-1.5 text-gray-300 focus:outline-none focus:border-fuchsia-500 cursor-pointer hover:bg-black/60 transition-colors w-full"
                                                        >
                                                            <option value="PENDING">Pending</option>
                                                            <option value="IN_PROGRESS">In Progress</option>
                                                            <option value="COMPLETED">Completed</option>
                                                        </select>
                                                        <div className="absolute right-2 top-1.5 pointer-events-none text-gray-500">
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 justify-end mt-1">
                                                        <button onClick={() => handleEdit(task)} className="p-2 hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 rounded-lg transition-colors" title="Edit">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(task.id)} className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
