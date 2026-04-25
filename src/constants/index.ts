/**
 * Application-wide constants
 * Keep all magic strings and numbers in one place for easy maintenance
 */

// Screen names
export const SCREEN_NAMES = {
  MAIN: "Main",
  WELCOME: "Welcome",
  HOME: "Home",
  ONBOARDING: "Onboarding",
} as const;

// Storage keys
export const STORAGE_KEYS = {
  THEME: "theme",
  USER: "user",
  LANGUAGE: "language",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: process.env.API_URL || "https://api.example.com",
  USERS: "/users",
  POSTS: "/posts",
} as const;

// Default values
export const DEFAULTS = {
  LANGUAGE: "en",
  THEME: "light",
  TIMEOUT: 30000,
} as const;
