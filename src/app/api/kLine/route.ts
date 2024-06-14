import { type NextRequest } from "next/server";
import getBrowser from "@/utils/browser";
import yahooFinance from "@/yahoo-finance2/src/index-node";
import dayjs from "dayjs";

type Params = {
  symbol?: string;
  period1?: string;
  period2?: string;
  // 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
  interval?:
    | "1m"
    | "2m"
    | "5m"
    | "15m"
    | "30m"
    | "60m"
    | "90m"
    | "1h"
    | "1d"
    | "5d"
    | "1wk"
    | "1mo"
    | "3mo";
  events?: string;
  includePrePost?: boolean;
  lang?: string;
  region?: string;
};
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol: string = searchParams.get("symbol") || "";
  if (!symbol) {
    return Response.json({
      status: -1,
      errorMessage: "symbol is required",
    });
  }

  let period1 = searchParams.get("period1");
  let period2 = searchParams.get("period2");

  period1 = period1
    ? dayjs(period1).unix().toString()
    : dayjs().subtract(20, "day").unix().toString();
  period2 = period2
    ? dayjs(period2).unix().toString()
    : dayjs().unix().toString();

  const interval: string = searchParams.get("interval") || "1d";
  const includePrePost: boolean = searchParams.get("includePrePost") === "true";
  const lang: string = searchParams.get("lang") || "en-US";
  const region: string = searchParams.get("region") || "US";

  let events: string = searchParams.get("events") || "div|split|earn";
  events = encodeURIComponent(events);

  const param = `${symbol}?period1=${period1}&period2=${period2}&interval=${interval}&events=${events}&includePrePost=${includePrePost}&lang=${lang}&region=${region}`;

  const browser = await getBrowser();
  const page = await browser.newPage();

  page.goto("https://query2.finance.yahoo.com/v8/finance/chart/" + param);

  const res = await new Promise((res) => {
    page.on("response", async (response) => {
      const responseBody = await response.json();
      res(responseBody);
    });
  });

  return Response.json({
    status: 0,
    data: res,
  });
}
