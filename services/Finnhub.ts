import { getDateRange } from "@/utils/Helper";

const API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY;
const POLYGON_API_KEY = process.env.EXPO_PUBLIC_POLYGON_API_KEY;

export enum GraphicRange {
  Weekly = "1W",
  Monthly = "1M",
  HalfYear = "6M",
  Yearly = "1Y",
}

export type StocksDTO = {
  name: any;
  price: any;
  percent: string;
  symbol: string;
};

export type NewsDTO = {
  headline: string;
  image: string;
  url: string;
  source: string;
  datetime: number;
  summary: string;
};

const fetchStockInfo = async (stocks: string[]): Promise<StocksDTO[]> => {
  const data = await Promise.all(
    stocks.map(async (symbol: string) => {
      const [quoteRes, profileRes] = await Promise.all([
        fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
        ),
        fetch(
          `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`
        ),
      ]);

      const quote = await quoteRes.json();
      const profile = await profileRes.json();

      const percent = (((quote.c - quote.pc) / quote.pc) * 100).toFixed(2);

      const price = quote.c.toFixed(2);

      return {
        name: profile.name,
        price,
        percent,
        symbol,
      };
    })
  );

  return data;
};

const fetchAllNews = async (stocks: string[]): Promise<NewsDTO[]> => {
  const { from, to } = getDateRange();

  const allNews = await Promise.all(
    stocks.map(async (stock) => {
      const res = await fetch(
        `https://finnhub.io/api/v1/company-news?symbol=${stock}&from=${from}&to=${to}&token=${API_KEY}`
      );
      const data = await res.json();
      return data.slice(0, 2).map((item: NewsDTO) => ({ ...item, stock }));
    })
  );

  return allNews.flat().sort(function (a: NewsDTO, b: NewsDTO) {
    return b.datetime - a.datetime;
  });
};

const fetchStockNews = async (stock: string): Promise<NewsDTO[]> => {
  const { from, to } = getDateRange();

  const res = await fetch(
    `https://finnhub.io/api/v1/company-news?symbol=${stock}&from=${from}&to=${to}&token=${API_KEY}`
  );
  const data = await res.json();
  return data.slice(0, 10).sort(function (a: NewsDTO, b: NewsDTO) {
    return b.datetime - a.datetime;
  });
};

const getStockData = async (
  stock: string,
  range: string = GraphicRange.Weekly
) => {
  const now = new Date();
  let fromDate;

  const time = now.getTime();

  switch (range) {
    case GraphicRange.Weekly:
      fromDate = new Date(time - 7 * 24 * 60 * 60 * 1000);
      break;
    case GraphicRange.Monthly:
      fromDate = new Date(time - 30 * 24 * 60 * 60 * 1000);
      break;
    case GraphicRange.HalfYear:
      fromDate = new Date(time - 180 * 24 * 60 * 60 * 1000);
      break;
    case GraphicRange.Yearly:
      fromDate = new Date(time - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      fromDate = new Date(time - 7 * 24 * 60 * 60 * 1000);
      break;
  }

  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const from = formatDate(fromDate);
  const to = formatDate(now);

  const url = `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=1000&apiKey=${POLYGON_API_KEY}`;

  const res = await fetch(url);
  const json = await res.json();

  if (!json.results || json.results.length === 0) {
    throw new Error("No candle data returned from Polygon");
  }

  // Convert to graph-friendly format
  const graphData = json.results.map((item: any) => ({
    date: new Date(item.t), // timestamp in ms
    value: item.c, // closing price
  }));

  return graphData;
};

export default { fetchStockInfo, fetchAllNews, fetchStockNews, getStockData };
