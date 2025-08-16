import mongoose, { Schema,  Document } from "mongoose";

export const ExpenseCategories = ["FOOD", "TRANSPORT", "SHOPPING", "OTHER"] as const;
export type ExpenseCategory = typeof ExpenseCategories[number];

export interface IExpense extends Document {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  author: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    title: { type: String, required: true, minlength: 3, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, enum: ExpenseCategories },
    date: { type: Date, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const Expense = mongoose.models.Expense || mongoose .model <IExpense>("Expense", ExpenseSchema);
export default Expense;