const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const hashPassword = (password) => bcrypt.hash(password, 10);
const comparePassword = (password, hash) => bcrypt.compare(password, hash);

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m',
    });
};

const generateRefreshToken = (user, jti) => {
    // We generally don't need jti in the payload if we track by token hash, but beneficial for some strategies.
    // Here simple payload is enough as we verify against DB hash.
    return jwt.sign({ userId: user.id, role: user.role, jti }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        throw new Error('Invalid Access Token');
    }
}

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid Refresh Token');
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    hashToken,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};
