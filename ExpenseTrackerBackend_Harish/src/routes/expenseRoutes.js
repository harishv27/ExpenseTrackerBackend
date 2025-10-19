const express = require('express');
const router = express.Router();
const {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const {
  createExpenseValidation,
  updateExpenseValidation,
  expenseIdValidation,
} = require('../middleware/validators');
const verifyToken = require('../middleware/authMiddleware');

// All expense routes require authentication
router.use(verifyToken);

router.get('/', getAllExpenses);
router.get('/:id', expenseIdValidation, getExpenseById);
router.post('/', createExpenseValidation, createExpense);
router.put('/:id', updateExpenseValidation, updateExpense);
router.delete('/:id', expenseIdValidation, deleteExpense);

module.exports = router;