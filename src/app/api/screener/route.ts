import { type NextRequest } from "next/server";
import { getNewPage } from "@/utils/browser";
import queryParams from "@/utils/queryParams";

type QueryParam = {
  // lang=en-US&region=US&formatted=true&corsDomain=finance.yahoo.com
  lang?: string;
  region?: string;
  formatted?: "true" | "false";
  corsDomain?: string;
};
export async function POST(request: NextRequest) {
  const body = await request.json();
  const query = queryParams<QueryParam>(request.nextUrl.searchParams);

  const queryParam = {
    lang: query.lang || "en-US",
    region: query.region || "US",
    formatted: query.formatted || "true",
    corsDomain: query.corsDomain || "finance.yahoo.com",
  };

  const page = await getNewPage();
  // 随机setUserAgent
  await page.setUserAgent(
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.3",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.3",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.3",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.3",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.3",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.3",
      "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.3",
    ][Math.floor(Math.random() * 10)]
  );

  await page.setRequestInterception(true);
  page.on("request", (req: any) => {
    if (["document"].includes(req.resourceType())) {
      req.continue();
    } else {
      const url = req.url();
      if (url.includes("getcrumb") || url.includes("screener")) {
        req.continue();
        return;
      }
      req.abort();
    }
  });
  await page.goto("https://finance.yahoo.com/");

  const result = await page.evaluate(
    async ({ body, queryParam }) => {
      const res = await fetch(
        "https://query2.finance.yahoo.com/v1/test/getcrumb",
        {
          credentials: "include",
        }
      );
      const crumb = await res.text();
      const str = Object.entries(queryParam)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      const response = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/screener?crumb=${crumb}&${str}`,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      return await response.json();
    },
    { body, queryParam }
  );

  return Response.json(result);
}
