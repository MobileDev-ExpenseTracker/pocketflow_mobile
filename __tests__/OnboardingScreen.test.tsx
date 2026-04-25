/**
 * OnboardingScreen.test.tsx
 * Test cases for OnboardingScreen component
 * 
 * Tests:
 * 1. Component renders correctly
 * 2. Button press event works
 * 3. Component doesn't crash
 */

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import OnboardingScreen from "../OnboardingScreen";

describe("OnboardingScreen Component", () => {
  /**
   * Test 1: Verify that OnboardingScreen renders without errors
   */
  it("should render correctly", () => {
    const { getByText } = render(<OnboardingScreen />);
    expect(getByText(/welcome/i)).toBeTruthy();
  });

  /**
   * Test 2: Verify that button press event is triggered
   */
  it("should handle button press correctly", () => {
    const { getByText } = render(<OnboardingScreen />);
    const button = getByText(/start/i);
    
    // Verify button exists
    expect(button).toBeTruthy();
    
    // Simulate button press
    fireEvent.press(button);
    
    // In real scenario, verify navigation or state changes
  });

  /**
   * Test 3: Smoke test - ensure component doesn't crash during render
   */
  it("should not crash during render", () => {
    expect(() => {
      render(<OnboardingScreen />);
    }).not.toThrow();
  });
});

