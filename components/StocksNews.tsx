import { useThemeColor } from "@/hooks/useThemeColor";
import { getFormattedDate } from "@/utils/Helper";
import React, { memo } from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Animations } from "@/constants/Animations";

type PropTypes = {
  headline: string;
  url: string;
  source: string;
  datetime: number;
};

const StocksNews = ({ headline, source, url, datetime }: PropTypes) => {
  const secondaryText = useThemeColor({}, "secondaryText");

  return (
    <TouchableOpacity
      key={`${headline}_${source}_${url}`}
      onPress={() => Linking.openURL(url)}
    >
      <View style={styles.mainContainer}>
        <ThemedText animationType={Animations.Fade}>{headline}</ThemedText>
        {datetime && (
          <ThemedText
            animationType={Animations.Fade}
            type="small"
            color={secondaryText}
          >
            {getFormattedDate(datetime)}
          </ThemedText>
        )}
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
