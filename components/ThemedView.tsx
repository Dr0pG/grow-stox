import { Animations } from "@/constants/Animations";
import Durations from "@/constants/Durations";
import { Theme, useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { memo, useCallback, useEffect } from "react";
import { type ViewProps } from "react-native";
import Animated, {
  BounceInDown,
  BounceOutDown,
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  animationType?: Animations;
};

const ThemedView = ({
  style,
  lightColor,
  darkColor,
  animationType,
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

  const animation = useCallback(() => {
    switch (animationType) {
      case Animations.Fade:
        return {
          entering: FadeInDown.duration(Durations.animations).springify(),
          exiting: FadeOutDown.duration(Durations.animations).springify(),
        };
      case Animations.Bounce:
        return {
          entering: BounceInDown.duration(Durations.animations).springify(),
          exiting: BounceOutDown.duration(Durations.animations).springify(),
        };
      default:
        return {
          entering: FadeInDown.duration(Durations.animations).springify(),
          exiting: FadeOutDown.duration(Durations.animations).springify(),
        };
    }
  }, [animationType]);

  return (
    <Animated.View
      style={[animatedStyle, style]}
      {...(animation?.() &&
        !!animationType && {
          entering: animation().entering,
          exiting: animation().exiting,
        })}
      {...otherProps}
    />
  );
};

export default memo(ThemedView);
