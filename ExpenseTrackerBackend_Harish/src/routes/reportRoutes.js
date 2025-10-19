const express = require('express');
const router = express.Router();
const {
  getMonthlyReport,
  getCategoryReport,
} = require('../controllers/reportController');
const {
  monthlyReportValidation,
  categoryReportValidation,
} = require('../middleware/validators');
const verifyToken = require('../middleware/authMiddleware');

// All report routes require authentication
router.use(verifyToken);

router.get('/monthly', monthlyReportValidation, getMonthlyReport);
router.get('/category', categoryReportValidation, getCategoryReport);

module.exports = router;