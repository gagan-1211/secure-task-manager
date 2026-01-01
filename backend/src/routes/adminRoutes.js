const express = require('express');
const { getStats } = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(isAuthenticated);
router.use(isAdmin);

router.get('/stats', getStats);

module.exports = router;
