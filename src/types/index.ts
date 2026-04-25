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
