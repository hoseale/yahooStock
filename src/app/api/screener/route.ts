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
      if (response.status == 200) {
        return await response.json();
      }
      return { status: -1, error: response.statusText };
    },
    { body, queryParam }
  );

  return Response.json(result);
}
