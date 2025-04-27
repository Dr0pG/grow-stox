import StocksCard from "@/components/StocksCard";
import StocksNews from "@/components/StocksNews";
import { ThemedText } from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Animations } from "@/constants/Animations";
import { Metrics } from "@/constants/Metrics";
import { useTheme } from "@/context/ThemeContext";
import Finnhub, { NewsDTO, StocksDTO } from "@/services/Finnhub";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const STOCKS = ["AAPL", "TSLA", "MSFT"];

let init = true;

const MainScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const isFocused = useIsFocused();

  const { toggleTheme } = useTheme();

  const [stockData, setStockData] = useState<StocksDTO[]>([]);
  const [news, setNews] = useState<NewsDTO[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const onNavigateToStock = (name: string, symbol: string) =>
    router.push({
      pathname: "/stock",
      params: { name, stock: symbol },
    });

  const fetchStockInfo = async () => {
    if (init) setIsLoading(true);
    try {
      const data = await Finnhub.fetchStockInfo(STOCKS);
      setStockData(data);

      const news = await Finnhub.fetchAllNews(STOCKS);
      setNews(news);
    } catch (error) {
      console.log("🚀 ~ fetchStockInfo ~ error:", error);
    } finally {
      setIsLoading(false);
      init = false;
    }
  };

  useEffect(() => {
    if (!isFocused) return;

    fetchStockInfo();
  }, [isFocused]);

  const renderFollowedStocks = useCallback(() => {
    if (!stockData?.length) return;

    return (
      <View style={styles.followedStocksContainer}>
        <ThemedText
          animationType={Animations.Fade}
          type="subtitle"
          style={styles.followedStocksTitle}
        >
          {t("followed_stocks")}
        </ThemedText>
        <ThemedView animationType={Animations.Fade}>
          <FlatList
            keyExtractor={(item, index) => `${item.name}_${index}`}
            contentContainerStyle={{ flexGrow: 1 }}
            data={stockData}
            renderItem={({
              item,
              index,
            }: {
              item: StocksDTO;
              index: number;
            }) => (
              <StocksCard
                key={`${item.name}_${index}`}
                name={item.name}
                symbol={item.symbol}
                price={item.price}
                percent={parseFloat(item.percent)}
                onPress={onNavigateToStock}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            scrollEnabled={false}
            removeClippedSubviews={false}
          />
        </ThemedView>
      </View>
    );
  }, [stockData]);

  const renderNews = useCallback(() => {
    if (!news?.length) return;

    return (
      <View style={styles.newsContainer}>
        <ThemedText
          animationType={Animations.Fade}
          type="subtitle"
          style={styles.newsTitle}
        >
          {t("news")}
        </ThemedText>
        <FlatList
          keyExtractor={(item, index) => `${item.headline}_${index}`}
          contentContainerStyle={{ flexGrow: 1 }}
          data={news}
          renderItem={({ item, index }: { item: NewsDTO; index: number }) => (
            <StocksNews
              key={`${item.headline}_${index}`}
              headline={item.headline}
              source={item.source}
              url={item.url}
              datetime={item.datetime}
            />
          )}
          ItemSeparatorComponent={() => (
            <View style={styles.newsItemSeparator} />
          )}
          scrollEnabled={false}
          removeClippedSubviews={false}
        />
      </View>
    );
  }, [news]);

  const renderContent = useCallback(() => {
    if (isLoading)
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator />
        </View>
      );

    return (
      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
      >
        {renderFollowedStocks()}
        {renderNews()}
      </ScrollView>
    );
  }, [isLoading, news, stockData]);

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={toggleTheme}>
        <ThemedText type="title">{t("home")}</ThemedText>
      </TouchableOpacity>
      {renderContent()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Metrics.largeMargin,
    paddingVertical: Metrics.mediumMargin,
  },
  mainScroll: {
    marginTop: Metrics.largeMargin,
  },
  followedStocksContainer: {
    paddingBottom: Metrics.largeMargin,
  },
  followedStocksTitle: {
    paddingBottom: Metrics.mediumMargin,
  },
  followedStocksList: {
    height: "100%",
  },
  listContainer: {
    minHeight: 2,
    height: "100%",
  },
  itemSeparator: {
    height: Metrics.smallMargin,
  },
  newsItemSeparator: {
    height: Metrics.largeMargin,
  },
  newsContainer: {
    paddingBottom: Metrics.mediumMargin,
  },
  newsTitle: {
    paddingBottom: Metrics.mediumMargin,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MainScreen;
