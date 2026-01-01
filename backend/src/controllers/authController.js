const prisma = require('../utils/prisma');
const {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    hashToken,
    verifyRefreshToken
} = require('../utils/authUtils');
const { v4: uuidv4 } = require('uuid');

const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await hashPassword(password);

        // Default role is USER if not provided or valid
        const userRole = role === 'ADMIN' ? 'ADMIN' : 'USER';

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: userRole
            }
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user, uuidv4());

        await addRefreshTokenToWhitelist({ refreshToken, userId: user.id });

        res.status(201).json({
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.isDeleted) { // Check isDeleted
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user, uuidv4());

        await addRefreshTokenToWhitelist({ refreshToken, userId: user.id });

        res.json({
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Missing refresh token' });
        }

        // Verify token signature
        const payload = verifyRefreshToken(refreshToken);

        // Hash to find in DB
        const hashedFn = hashToken(refreshToken);

        // Find token in DB
        const savedToken = await prisma.refreshToken.findFirst({
            where: {
                hashedToken: hashedFn
            }
        });

        if (!savedToken) {
            // Reuse detection logic could go here (if a token is used but not found, maybe compromised?)
            // For now, unauthorized.
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (savedToken.revoked === true || new Date() > savedToken.expiresAt) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Rotation: Revoke old token
        await prisma.refreshToken.update({
            where: { id: savedToken.id },
            data: { revoked: true }
        });

        // Issue new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user, uuidv4());

        await addRefreshTokenToWhitelist({ refreshToken: newRefreshToken, userId: user.id });

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const logout = async (req, res) => {
    try {
        // Revoke the refresh token provided
        const { refreshToken } = req.body;
        if (refreshToken) {
            const hashedFn = hashToken(refreshToken);
            await prisma.refreshToken.updateMany({
                where: { hashedToken: hashedFn },
                data: { revoked: true }
            });
        }
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Helper to add token to DB
async function addRefreshTokenToWhitelist({ refreshToken, userId }) {
    const hashedTokenVal = hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
        data: {
            hashedToken: hashedTokenVal,
            userId,
            expiresAt
        }
    });
}

module.exports = {
    register,
    login,
    refresh,
    logout
};
