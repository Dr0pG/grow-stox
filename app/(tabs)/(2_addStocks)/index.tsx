import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ThemedView from "@/components/ThemedView";
import { Metrics } from "@/constants/Metrics";

const AddStocksScreen = () => {
  return <ThemedView style={styles.container}></ThemedView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largeMargin,
    paddingTop: Metrics.mediumMargin,
  },
});

export default AddStocksScreen;
