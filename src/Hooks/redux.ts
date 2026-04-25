/**
 * Redux hooks - Type-safe Redux hooks
 * These replace useSelector and useDispatch with type safety
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "@/Store";

/**
 * Type-safe useDispatch hook
 * Use instead of plain useDispatch for better TypeScript support
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Type-safe useSelector hook
 * Use instead of plain useSelector for better TypeScript support
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
