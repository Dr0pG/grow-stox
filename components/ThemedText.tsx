import { StyleSheet, type TextProps } from "react-native";

import Durations from "@/constants/Durations";
import { useTheme } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const { theme } = useTheme();

  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  // Use derived value to compute the color based on `type` and `theme`
  const animatedTextColor = useDerivedValue(() => {
    if (color) {
      return withTiming(color, { duration: Durations.colorChanged });
    }
  }, [color, theme, type]);

  const animatedStyle = useAnimatedStyle(() => ({
    color: animatedTextColor.value,
  }));

  const animation = () => {
    return {
      entering: FadeInDown.duration(Durations.animations).springify(),
      exiting: FadeOutDown.duration(Durations.animations).springify(),
    };
  };

  return (
    <Animated.Text
      {...rest}
      accessible
      accessibilityLabel={rest.children?.toString()}
      style={[
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        animatedStyle,
        style,
      ]}
      {...(animation?.() && {
        entering: animation().entering,
        exiting: animation().exiting,
      })}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
