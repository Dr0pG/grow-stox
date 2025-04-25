import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ThemedView from "@/components/ThemedView";
import { Metrics } from "@/constants/Metrics";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { GraphPoint, LineGraph } from "react-native-graph";
import { getFinalPercentageChange, hexToRgba } from "@/utils/Helper";
import { useLocalSearchParams, useRouter } from "expo-router";
import Finnhub, { GraphicRange, NewsDTO } from "@/services/Finnhub";
import StocksNews from "@/components/StocksNews";
import Back from "@/components/Back";

const RANGE = [
  GraphicRange.Weekly,
  GraphicRange.Monthly,
  GraphicRange.HalfYear,
  GraphicRange.Yearly,
];

const Stock = () => {
  const router = useRouter();
  const { name, stock } = useLocalSearchParams();

  const [accentGreen, accentRed, borderLines, secondaryText] = useThemeColor(
    {},
    ["accentGreen", "accentRed", "borderLines", "secondaryText"]
  );

  const [points, setPoints] = useState<GraphPoint[]>([]);

  const [selectedPoint, setSelectedPoint] = useState<number>(0);
  const [currentNews, setCurrentNews] = useState<NewsDTO[]>([]);
  const [currentRange, setCurrentRange] = useState<GraphicRange>(
    GraphicRange.Weekly
  );

  const [isLoading, setIsLoading] = useState(false);

  const onBack = () => router.back();

  const getStockData = async () => {
    setIsLoading(true);
    try {
      if (!stock) return;

      const currentData = await Finnhub.getStockData(
        stock as string,
        currentRange
      );
      setPoints(currentData);
    } catch (error) {
      console.log("🚀 ~ getStockData ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStockData();
  }, [currentRange]);

  useEffect(() => {
    const fetchStockNews = async () => {
      const news = await Finnhub.fetchStockNews(stock as string);
      setCurrentNews(news);
    };

    fetchStockNews();
  }, []);

  const renderRange = () => {
    return (
      <View
        style={[
          styles.rangeContainer,
          {
            borderColor: borderLines,
          },
        ]}
      >
        {RANGE.map((item) => {
          return (
            <TouchableOpacity key={item} onPress={() => setCurrentRange(item)}>
              <ThemedText
                {...(item !== currentRange && {
                  color: secondaryText,
                })}
              >
                {item}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderGraph = () => {
    if (!points?.length) return;

    const values = points.map((point) => point.value);
    const result = getFinalPercentageChange(values);

    return (
      <View>
        <View
          style={[
            styles.graphInfo,
            {
              borderColor: borderLines,
            },
          ]}
        >
          <ThemedText animationType="fade" type="subtitle">{`$${selectedPoint}`}</ThemedText>
          {result && (
            <ThemedText animationType="fade" color={result.isPositive ? accentGreen : accentRed}>
              {result.value}
            </ThemedText>
          )}
        </View>
        <LineGraph
          style={styles.graph}
          points={points}
          animated
          color={accentGreen}
          enablePanGesture
          onPointSelected={(p) => setSelectedPoint(p.value)}
          onGestureEnd={() => setSelectedPoint(points[points.length - 1].value)}
          panGestureDelay={0}
          indicatorPulsating
          enableFadeInMask
          gradientFillColors={[hexToRgba(accentGreen, 0.4), "transparent"]}
        />
        {renderRange()}
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.titleContainer}>
        <ThemedText animationType="fade" type="title">{name}</ThemedText>
      </View>
    );
  };

  const renderNews = () => {
    return (
      <FlatList
        keyExtractor={(item, index) => `${item.headline}_${index}`}
        style={styles.newsContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        data={currentNews}
        renderItem={({ item, index }: { item: NewsDTO; index: number }) => (
          <StocksNews
            key={`${item.headline}_${index}`}
            headline={item.headline}
            source={item.source}
            url={item.url}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.newsItemSeparator} />}
        scrollEnabled={false}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
      >
        <Back onPress={onBack} />
        {renderHeader()}
        {renderGraph()}
        {renderNews()}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largeMargin,
    paddingVertical: Metrics.mediumMargin,
  },
  graphInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: Metrics.largeMargin,
    marginBottom: Metrics.mediumMargin,
    borderBottomWidth: 1,
  },
  graph: {
    alignSelf: "center",
    width: Metrics.screenWidth - Metrics.largeMargin * 2,
    height: Metrics.graphHeight,
  },
  randomValuesContainer: {
    paddingVertical: Metrics.mediumMargin,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Metrics.mediumMargin,
    paddingTop: Metrics.mediumMargin,
    paddingBottom: Metrics.largeMargin,
    borderBottomWidth: 1,
  },
  titleContainer: {
    paddingVertical: Metrics.largeMargin,
  },
  newsItemSeparator: {
    height: Metrics.largeMargin,
  },
  newsContainer: {
    paddingVertical: Metrics.largeMargin,
  },
  mainScroll: {
    marginBottom: Metrics.mediumMargin,
  },
});

export default Stock;
