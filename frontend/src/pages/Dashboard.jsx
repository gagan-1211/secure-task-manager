import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import AdminStats from '../components/AdminStats';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
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
                await api.put(`/tasks/${editingTask.id}`, { ...data, status: editingTask.status }); // simple edit
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
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks(); // Refresh list to show it's gone (soft deleted)
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        reset({ title: task.title, description: task.description });
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

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow p-4 flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">Secure Task Manager</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        {user.email} ({user.role})
                    </span>
                    <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
                </div>
            </nav>

            <div className="container mx-auto p-4 max-w-5xl">
                {user.role === 'ADMIN' && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Admin Analytics</h2>
                        <AdminStats />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Task Form */}
                    <div className="bg-white p-6 rounded shadow h-fit">
                        <h2 className="text-lg font-bold mb-4">{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    {...register('title', { required: "Title is required" })}
                                    className="w-full border p-2 rounded mt-1"
                                    placeholder="Task title"
                                />
                                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    {...register('description')}
                                    className="w-full border p-2 rounded mt-1"
                                    rows="3"
                                    placeholder="Task details..."
                                ></textarea>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                                    {editingTask ? 'Update Task' : 'Add Task'}
                                </button>
                                {editingTask && (
                                    <button type="button" onClick={handleCancelEdit} className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Task List */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold">Your Tasks</h2>
                        {tasks.length === 0 && <p className="text-gray-500">No tasks found.</p>}
                        {tasks.map(task => (
                            <div key={task.id} className="bg-white p-4 rounded shadow border-l-4 border-l-blue-500 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{task.title}</h3>
                                    <p className="text-gray-600 mt-1">{task.description}</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded font-bold ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {task.status}
                                        </span>
                                        <span className="text-xs text-gray-400">Owner: {task.userId}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <select
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task, e.target.value)}
                                        className="text-xs border p-1 rounded"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => handleEdit(task)} className="text-blue-500 text-sm hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(task.id)} className="text-red-500 text-sm hover:underline">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
