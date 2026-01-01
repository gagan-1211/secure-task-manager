const prisma = require('../utils/prisma');

const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { userId } = req.user;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                userId
            }
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Could not create task' });
    }
};

const getTasks = async (req, res) => {
    try {
        const { userId, role } = req.user;

        let where = { isDeleted: false };
        if (role !== 'ADMIN') {
            where.userId = userId;
        }

        const tasks = await prisma.task.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch tasks' });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.user;

        const task = await prisma.task.findUnique({
            where: { id }
        });

        if (!task || task.isDeleted) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (role !== 'ADMIN' && task.userId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch task' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.user;
        const { title, description, status } = req.body;

        const task = await prisma.task.findUnique({ where: { id } });

        if (!task || task.isDeleted) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (role !== 'ADMIN' && task.userId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { title, description, status }
        });

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Could not update task' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.user;

        const task = await prisma.task.findUnique({ where: { id } });

        if (!task || task.isDeleted) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (role !== 'ADMIN' && task.userId !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Soft delete
        await prisma.task.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() }
        });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Could not delete task' });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};
