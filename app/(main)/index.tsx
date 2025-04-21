import { ThemedText } from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity } from "react-native";

const MainScreen = () => {
  const { t } = useTranslation();

  const { toggleTheme } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={toggleTheme}>
        <ThemedText>{t('welcome')}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MainScreen;
