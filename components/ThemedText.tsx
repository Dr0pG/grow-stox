import { StyleSheet, type TextProps } from "react-native";

import Durations from "@/constants/Durations";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import Animated, {
  BounceInDown,
  BounceOutDown,
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useCallback } from "react";
import { Metrics } from "@/constants/Metrics";
import { Animations } from "@/constants/Animations";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  color?: string;
  type?:
    | "small"
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link";
  animationType?: Animations;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  color,
  type = "default",
  animationType = undefined,
  ...rest
}: ThemedTextProps) {
  const { theme } = useTheme();

  const currentColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  // Use derived value to compute the color based on `type` and `theme`
  const animatedTextColor = useDerivedValue(() => {
    return withTiming(color || currentColor, {
      duration: Durations.colorChanged,
    });
  }, [color, currentColor, theme, type]);

  const animatedStyle = useAnimatedStyle(() => ({
    color: animatedTextColor.value,
  }));

  const animation = useCallback(() => {
    if (!animationType) return null;
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
    <Animated.Text
      {...rest}
      accessible
      accessibilityLabel={rest.children?.toString()}
      style={[
        type === "small" ? styles.small : undefined,
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        animatedStyle,
        style,
      ]}
      {...(animation?.() &&
        !!animationType && {
          entering: animation().entering,
          exiting: animation().exiting,
        })}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: Metrics.size14,
    lineHeight: Metrics.size14 * 1.3,
  },
  default: {
    fontSize: Metrics.size16,
    lineHeight: Metrics.size16 * 1.3,
  },
  defaultSemiBold: {
    fontSize: Metrics.size16,
    lineHeight: Metrics.size16 * 1.3,
    fontWeight: "600",
  },
  title: {
    fontSize: Metrics.size32,
    fontWeight: "bold",
    lineHeight: Metrics.size32,
  },
  subtitle: {
    fontSize: Metrics.size20,
    fontWeight: "bold",
  },
  link: {
    fontSize: Metrics.size16,
    lineHeight: Metrics.size16 * 1.3,
    color: "#0a7ea4",
  },
});
