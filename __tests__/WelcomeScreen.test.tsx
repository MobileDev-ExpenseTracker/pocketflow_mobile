/**
 * WelcomeScreen.test.tsx
 * Test cases for Welcome screen component
 * 
 * Tests:
 * 1. Component renders without crashing
 * 2. Welcome text is displayed
 * 3. Navigation works correctly on button press
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Welcome } from "../Screens/Welcome/Welcome";
import { RootScreens } from "../Screens";

// Mock các dependency ngoài
jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

jest.mock("native-base", () => ({
  Button: ({ children, onPress }: any) => {
    const { TouchableOpacity, Text } = require("react-native");
    return (
      <TouchableOpacity testID="welcome-button" onPress={onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

jest.mock("@/Localization", () => ({
  i18n: { t: (key: string) => key },
  LocalizationKey: {
    WELCOME: "WELCOME",
    START: "START",
  },
}));

describe("Welcome Screen", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  /**
   * Test 1: Smoke test - ensure component doesn't crash during render
   */
  it("should render without crashing", () => {
    const { toJSON } = render(<Welcome onNavigate={mockNavigate} />);
    expect(toJSON()).toBeTruthy();
  });

  /**
   * Test 2: Verify that welcome text is displayed
   */
  it("should display welcome text", () => {
    const { getByText } = render(<Welcome onNavigate={mockNavigate} />);
    expect(getByText("WELCOME")).toBeTruthy();
  });

  /**
   * Test 3: Verify that navigation is triggered on button press
   */
  it("should call onNavigate with MAIN when button is pressed", () => {
    const { getByTestId } = render(<Welcome onNavigate={mockNavigate} />);
    fireEvent.press(getByTestId("welcome-button"));
    expect(mockNavigate).toHaveBeenCalledWith(RootScreens.MAIN);
  });
});


