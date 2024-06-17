import { type NextRequest } from "next/server";
import { getNewPage } from "@/utils/browser";
import queryParams from "@/utils/queryParams";

type Param = {
  // 股票代码
  symbols: string;
  fields?: string;
  formatted?: "true" | "false";
  region?: string;
  lang?: string;
};
// 股票详情
export async function GET(request: NextRequest) {
  const param = queryParams<Param>(request.nextUrl.searchParams);

  if (!param.symbols) {
    return Response.json({
      status: -1,
      errorMessage: "symbols is required",
    });
  }

  const searchParams = {
    symbols: param.symbols,
    fields:
      param.fields ||
      "currency,fromCurrency,toCurrency,exchangeTimezoneName,exchangeTimezoneShortName,gmtOffSetMilliseconds,regularMarketChange,regularMarketChangePercent,regularMarketPrice,regularMarketTime,regularMarketOpen,regularMarketVolume,preMarketTime,postMarketTime,extendedMarketTime",
    formatted: !!(param.formatted === "true"),
    region: param.region || "US",
    lang: param.lang || "en-US",
  };

  const page = await getNewPage();
  await page.setRequestInterception(true);
  page.on("request", (req: any) => {
    if (["document"].includes(req.resourceType())) {
      req.continue();
    } else {
      const url = req.url();
      if (url.includes("getcrumb") || url.includes("finance/quote")) {
        req.continue();
        return;
      }
      req.abort();
    }
  });
  await page.goto("https://finance.yahoo.com/");

  const result = await page.evaluate(
    async ({ searchParams }) => {
      const res = await fetch(
        "https://query2.finance.yahoo.com/v1/test/getcrumb",
        {
          credentials: "include",
        }
      );
      const crumb = await res.text();
      const str = Object.entries(searchParams)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      const response = await fetch(
        `https://query1.finance.yahoo.com/v7/finance/quote?crumb=${crumb}&${str}`,
        {
          credentials: "include",
        }
      );
      return await response.json();
    },
    { searchParams }
  );

  return Response.json({
    status: 0,
    data: result,
  });
}
