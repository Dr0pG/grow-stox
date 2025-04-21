import Durations from "@/constants/Durations";
import { Theme, useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { memo, useEffect } from "react";
import { type ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const ThemedView = ({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) => {
  const { theme } = useTheme();
  const lightBg = lightColor || useThemeColor({}, "background");
  const darkBg = darkColor || useThemeColor({}, "background");

  const animatedColor = useSharedValue(
    theme === Theme.Light ? lightBg : darkBg
  );

  useEffect(() => {
    animatedColor.value = withTiming(theme === Theme.Light ? lightBg : darkBg, {
      duration: Durations.colorChanged,
    });
  }, [theme, lightBg, darkBg]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedColor.value,
  }));

  return <Animated.View style={[animatedStyle, style]} {...otherProps} />;
};

export default memo(ThemedView);
