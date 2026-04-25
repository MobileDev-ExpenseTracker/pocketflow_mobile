/**
 * LoadingSpinner Component
 * Reusable loading indicator component
 */

import React from "react";
import { ActivityIndicator, View } from "react-native";

interface LoadingSpinnerProps {
  visible?: boolean;
  size?: "small" | "large";
}

/**
 * LoadingSpinner - Shows a centered loading spinner
 * @param visible - Whether to show the spinner (default: true)
 * @param size - Size of the spinner (default: "large")
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  visible = true,
  size = "large",
}) => {
  if (!visible) return null;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color="#0000ff" />
    </View>
  );
};
