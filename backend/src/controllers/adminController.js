const prisma = require('../utils/prisma');

const getStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count({ where: { isDeleted: false } });
        const totalTasks = await prisma.task.count({ where: { isDeleted: false } });

        // Active users in last 7 days (created or updated tasks)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const activeUserCount = await prisma.user.count({
            where: {
                isDeleted: false,
                tasks: {
                    some: {
                        updatedAt: {
                            gte: sevenDaysAgo
                        }
                    }
                }
            }
        });

        res.json({
            totalUsers,
            totalTasks,
            activeUsersLast7Days: activeUserCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not fetch stats' });
    }
};

module.exports = { getStats };
