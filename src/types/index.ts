/**
 * Centralized type definitions for the application
 * This makes it easy to find and manage all TypeScript types
 */

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface ITheme {
  mode: "light" | "dark";
}

export interface IHome {
  items: any[];
  loading: boolean;
  error: string | null;
}

export type TransactionCategory =
  | "food"
  | "transport"
  | "shopping"
  | "entertainment"
  | "utilities"
  | "health"
  | "other";

export interface ITransaction {
  id: string;
  amount: number;
  category: TransactionCategory;
  description: string;
  createdAt: string;
  rawInput?: string; // Original user input for reference
}

export interface ITransactionState {
  transactions: ITransaction[];
  loading: boolean;
  error: string | null;
}
