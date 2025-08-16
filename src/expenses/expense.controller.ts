import { Request, Response } from "express";
import { errorResponse, successResponse } from "../utils/ResponseHandler";
import Expense from "./expense.model";


const addExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, amount, category, date } = req.body;
        if (!title || !amount || !category || !date) {
            return errorResponse(res, 400, "Title, amount, category, and date are required");
        }
        const expense = new Expense({ title, amount, category, date, author: req.userId });
        await expense.save();
        return successResponse(res, 201, "Expense added successfully", expense);
    } catch (error) {
        errorResponse(res, 500, "Something went wrong");
    }
};

const getExpenses = async (req: Request, res: Response): Promise<void> => {
    try {
        const expenses = await Expense.find({ author: req.userId });
        return successResponse(res, 200, "Expenses fetched successfully", expenses);
    } catch (error) {
        errorResponse(res, 500, "Something went wrong");
    }
};

const updateExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, amount, category, date } = req.body;
        if (!title || !amount || !category || !date) {
            return errorResponse(res, 400, "Title, amount, category, and date are required");
        }
        const expense = await Expense.findById(id);
        if (!expense) {
            return errorResponse(res, 404, "Expense not found");
        }
        expense.title = title;
        expense.amount = amount;
        expense.category = category;
        expense.date = date;
        await expense.save();
        return successResponse(res, 200, "Expense updated successfully", expense);
    } catch (error) {
        errorResponse(res, 500, "Something went wrong");
    }
};

const deleteExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) {
            return errorResponse(res, 404, "Expense not found");
        }
        return successResponse(res, 200, "Expense deleted successfully", expense);
    } catch (error) {
        errorResponse(res, 500, "Something went wrong");
    }
};

export { addExpense, getExpenses, deleteExpense, updateExpense };