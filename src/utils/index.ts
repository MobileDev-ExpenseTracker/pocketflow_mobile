/**
 * Utility functions - reusable helper functions
 * Keep these pure and side-effect free
 */

/**
 * Validates if a string is a valid email
 * @param email - Email string to validate
 * @returns true if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats a date to readable string
 * @param date - Date object to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Safely parses JSON string
 * @param jsonString - JSON string to parse
 * @returns Parsed object or null if invalid
 */
export const safeJsonParse = <T>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON parse error:", error);
    return null;
  }
};

// Transaction parser utilities
export {
  parseTransactionInput,
  isValidParsedTransaction,
  getAvailableCategories,
  type ParsedTransaction,
} from "./transactionParser";
