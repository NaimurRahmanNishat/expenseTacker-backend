"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExpense = exports.deleteExpense = exports.getExpenses = exports.addExpense = void 0;
const ResponseHandler_1 = require("../utils/ResponseHandler");
const expense_model_1 = __importDefault(require("./expense.model"));
const addExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;
        if (!title || !amount || !category || !date) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, "Title, amount, category, and date are required");
        }
        const expense = new expense_model_1.default({ title, amount, category, date, author: req.userId });
        await expense.save();
        return (0, ResponseHandler_1.successResponse)(res, 201, "Expense added successfully", expense);
    }
    catch (error) {
        (0, ResponseHandler_1.errorResponse)(res, 500, "Something went wrong");
    }
};
exports.addExpense = addExpense;
const getExpenses = async (req, res) => {
    try {
        const expenses = await expense_model_1.default.find({ author: req.userId });
        return (0, ResponseHandler_1.successResponse)(res, 200, "Expenses fetched successfully", expenses);
    }
    catch (error) {
        (0, ResponseHandler_1.errorResponse)(res, 500, "Something went wrong");
    }
};
exports.getExpenses = getExpenses;
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, category, date } = req.body;
        if (!title || !amount || !category || !date) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, "Title, amount, category, and date are required");
        }
        const expense = await expense_model_1.default.findById(id);
        if (!expense) {
            return (0, ResponseHandler_1.errorResponse)(res, 404, "Expense not found");
        }
        expense.title = title;
        expense.amount = amount;
        expense.category = category;
        expense.date = date;
        await expense.save();
        return (0, ResponseHandler_1.successResponse)(res, 200, "Expense updated successfully", expense);
    }
    catch (error) {
        (0, ResponseHandler_1.errorResponse)(res, 500, "Something went wrong");
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await expense_model_1.default.findByIdAndDelete(id);
        if (!expense) {
            return (0, ResponseHandler_1.errorResponse)(res, 404, "Expense not found");
        }
        return (0, ResponseHandler_1.successResponse)(res, 200, "Expense deleted successfully", expense);
    }
    catch (error) {
        (0, ResponseHandler_1.errorResponse)(res, 500, "Something went wrong");
    }
};
exports.deleteExpense = deleteExpense;
