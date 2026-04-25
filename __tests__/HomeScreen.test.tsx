/**
 * HomeScreen.test.tsx
 * Test cases for HomeScreen component
 * 
 * Tests:
 * 1. Component renders correctly
 * 2. Button press event works
 * 3. Component doesn't crash
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import HomeScreen from "../HomeScreen";

describe("HomeScreen Component", () => {
  /**
   * Test 1: Verify that HomeScreen renders without errors
   */
  it("should render correctly", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText(/home/i)).toBeTruthy();
  });

  /**
   * Test 2: Verify that button press event is triggered
   */
  it("should handle button press correctly", () => {
    const { getByText } = render(<HomeScreen />);
    const btn = getByText(/add/i);
    
    // Verify button exists
    expect(btn).toBeTruthy();
    
    // Simulate button press
    fireEvent.press(btn);
    
    // In real scenario, verify state/props changes or navigation occurs
  });

  /**
   * Test 3: Smoke test - ensure component doesn't crash during render
   */
  it("should not crash during render", () => {
    expect(() => {
      render(<HomeScreen />);
    }).not.toThrow();
  });
});

