import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo } from "react";
import { ThemedText } from "./ThemedText";
import { Image } from "expo-image";
import { useThemeColor } from "@/hooks/useThemeColor";

type PropTypes = {
  headline: string;
  url: string;
  source: string;
};

const StocksNews = ({ headline, source, url }: PropTypes) => {
  const secondaryText = useThemeColor({}, "secondaryText");

  return (
    <TouchableOpacity
      key={`${headline}_${source}_${url}`}
      onPress={() => Linking.openURL(url)}
    >
      <View style={styles.mainContainer}>
        <ThemedText animationType="fade">{headline}</ThemedText>
        <ThemedText animationType="fade" type="small" color={secondaryText}>
          {source}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
});

export default memo(StocksNews);
