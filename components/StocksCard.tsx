import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Metrics } from "@/constants/Metrics";

type PropTypes = {
  name: string;
  symbol: string;
  price: string;
  percent: number;
  onPress: (name: string, symbol: string) => void;
};

const StocksCard = ({ name, symbol, price, percent, onPress }: PropTypes) => {
  const [cardContainer, accentGreen, accentRed, secondaryText] = useThemeColor(
    {},
    ["cardContainer", "accentGreen", "accentRed", "secondaryText"]
  );

  const isIncrease = percent >= 0;

  return (
    <Pressable onPress={() => onPress(name, symbol)}>
      <View
        key={symbol}
        style={[styles.card, { backgroundColor: cardContainer }]}
      >
        <View style={styles.leftColumn}>
          <ThemedText style={styles.name}>{name}</ThemedText>
          <ThemedText color={secondaryText}>{symbol}</ThemedText>
        </View>
        <View style={styles.rightColumn}>
          <ThemedText
            type="defaultSemiBold"
            color={isIncrease ? accentGreen : accentRed}
          >
            ${price}
          </ThemedText>
          <ThemedText type="small" color={isIncrease ? accentGreen : accentRed}>
            {isIncrease ? "+" : ""} {percent}%
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: Metrics.mediumRadius,
    paddingHorizontal: Metrics.smallMargin,
    paddingVertical: Metrics.smallMargin + 2,
  },
  leftColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  rightColumn: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
});

export default memo(StocksCard);
