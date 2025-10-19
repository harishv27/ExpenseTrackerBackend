const Expense = require('../models/Expense');

/**
 * Get monthly expense report with aggregation
 * Returns total and category-wise breakdown
 */
const getMonthlyReport = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    // Create date range for the specified month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Aggregation pipeline for monthly report
    const report = await Expense.aggregate([
      {
        $match: {
          userId: req.user.uid,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    // Calculate overall total
    const totalExpense = report.reduce((sum, item) => sum + item.total, 0);

    // Format category-wise data
    const categories = {};
    report.forEach(item => {
      categories[item._id] = item.total;
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalExpense,
        categories,
      },
    });
  } catch (error) {
    console.error('Monthly report error:', error);
    next(error);
  }
};

/**
 * Get expenses filtered by category
 */
const getCategoryReport = async (req, res, next) => {
  try {
    const { category } = req.query;

    const expenses = await Expense.find({
      userId: req.user.uid,
      category,
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses.map(expense => ({
        id: expense._id,
        title: expense.title,
        amount: expense.amount,
        date: expense.date,
      })),
    });
  } catch (error) {
    console.error('Category report error:', error);
    next(error);
  }
};

module.exports = {
  getMonthlyReport,
  getCategoryReport,
};