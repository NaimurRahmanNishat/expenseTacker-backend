import { Router } from 'express';
import { addExpense, deleteExpense, getExpenses, updateExpense } from './expense.controller';
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post("/add-expense", verifyToken, addExpense);
router.get("/", verifyToken, getExpenses);
router.patch("/:id", verifyToken, updateExpense);
router.delete("/:id", verifyToken, deleteExpense);

export default router;