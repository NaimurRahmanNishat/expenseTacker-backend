"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expense_controller_1 = require("./expense.controller");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const router = (0, express_1.Router)();
router.post("/add-expense", verifyToken_1.default, expense_controller_1.addExpense);
router.get("/", expense_controller_1.getExpenses);
router.patch("/:id", verifyToken_1.default, expense_controller_1.updateExpense);
router.delete("/:id", verifyToken_1.default, expense_controller_1.deleteExpense);
exports.default = router;
