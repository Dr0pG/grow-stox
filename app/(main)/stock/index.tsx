import Back from "@/components/Back";
import StocksNews from "@/components/StocksNews";
import { ThemedText } from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Animations } from "@/constants/Animations";
import { Metrics } from "@/constants/Metrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import Finnhub, { GraphicRange, NewsDTO } from "@/services/Finnhub";
import { getFinalPercentageChange, hexToRgba } from "@/utils/Helper";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GraphPoint, LineGraph } from "react-native-graph";

const RANGE = [
  GraphicRange.Weekly,
  GraphicRange.Monthly,
  GraphicRange.HalfYear,
  GraphicRange.Yearly,
];

let init = true;

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
    if (init) setIsLoading(true);
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
      init = false;
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
        <FlatList
          keyExtractor={(item) => item}
          contentContainerStyle={styles.graphRange}
          data={RANGE}
          horizontal
          renderItem={({ item }: { item: GraphicRange }) => (
            <TouchableOpacity key={item} onPress={() => setCurrentRange(item)}>
              <ThemedText
                {...(item !== currentRange && {
                  color: secondaryText,
                })}
              >
                {item}
              </ThemedText>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
          removeClippedSubviews={false}
        />
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
          <ThemedText
            animationType={Animations.Fade}
            type="subtitle"
          >{`$${selectedPoint}`}</ThemedText>
          {result && (
            <ThemedText
              animationType={Animations.Fade}
              color={result.isPositive ? accentGreen : accentRed}
            >
              {result.value}
            </ThemedText>
          )}
        </View>
        <ThemedView animationType={Animations.Fade}>
          <LineGraph
            style={styles.graph}
            points={points}
            animated
            color={accentGreen}
            enablePanGesture
            onPointSelected={(p) => setSelectedPoint(p.value)}
            onGestureEnd={() =>
              setSelectedPoint(points[points.length - 1].value)
            }
            panGestureDelay={0}
            indicatorPulsating
            enableFadeInMask
            gradientFillColors={[hexToRgba(accentGreen, 0.4), "transparent"]}
          />
          {renderRange()}
        </ThemedView>
      </View>
    );
  };

  const renderHeader = useCallback(() => {
    if (!name) return;

    return (
      <View style={styles.titleContainer}>
        <ThemedText animationType={Animations.Fade} type="title">
          {name}
        </ThemedText>
      </View>
    );
  }, [name]);

  const renderNews = useCallback(() => {
    if (!currentNews?.length) return;

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
            datetime={item.datetime}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.newsItemSeparator} />}
        scrollEnabled={false}
        removeClippedSubviews={false}
      />
    );
  }, [currentNews]);

  const renderContent = () => {
    if (isLoading)
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator />
        </View>
      );

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Back onPress={onBack} />
        {renderHeader()}
        {renderGraph()}
        {renderNews()}
      </ScrollView>
    );
  };

  return <ThemedView style={styles.container}>{renderContent()}</ThemedView>;
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
  graphRange: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
});

export default Stock;
