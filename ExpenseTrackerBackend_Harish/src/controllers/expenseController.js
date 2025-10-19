const Expense = require('../models/Expense');

/**
 * Get all expenses for the logged-in user
 * Supports optional filtering and sorting
 */
const getAllExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate, sortBy, order } = req.query;
    
    // Build query filter
    const filter = { userId: req.user.uid };
    
    if (category) {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Build sort options
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;
    } else {
      sortOptions = { date: -1 }; // Default: newest first
    }

    const expenses = await Expense.find(filter).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses.map(expense => ({
        id: expense._id,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
      })),
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    next(error);
  }
};

/**
 * Get a single expense by ID
 */
const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: expense._id,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
      },
    });
  } catch (error) {
    console.error('Get expense error:', error);
    next(error);
  }
};

/**
 * Create a new expense
 */
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;

    const newExpense = new Expense({
      userId: req.user.uid,
      title,
      amount,
      category,
      date: new Date(date),
    });

    await newExpense.save();

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      id: newExpense._id,
    });
  } catch (error) {
    console.error('Create expense error:', error);
    next(error);
  }
};

/**
 * Update an existing expense
 */
const updateExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    // Update fields if provided
    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (date !== undefined) expense.date = new Date(date);

    await expense.save();

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
    });
  } catch (error) {
    console.error('Update expense error:', error);
    next(error);
  }
};

/**
 * Delete an expense
 */
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    next(error);
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};