import { type NextRequest } from "next/server";
import getBrowser from "@/utils/browser";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageNum: number = Number(searchParams.get("page")) || 1;
  const pageSize = 20;

  const browser = await getBrowser();
  const page = await browser.newPage();

  // 设置 Accept-Language 头
  // await page.setExtraHTTPHeaders({
  //   "Accept-Language": "ja-JP,ja;q=0.9",
  // });

  // 设置 navigator.language 和 navigator.languages
  // await page.evaluateOnNewDocument(() => {
  //   Object.defineProperty(navigator, "language", { get: () => "ja-JP" });
  //   Object.defineProperty(navigator, "languages", {
  //     get: () => ["ja-JP", "ja"],
  //   });
  // });

  await page.setRequestInterception(true);
  page.on("request", (req: any) => {
    if (["document"].includes(req.resourceType())) {
      req.continue();
    } else {
      req.abort();
    }
  });

  await page.goto(
    `https://finance.yahoo.com/screener/unsaved/1c343b6f-762a-4cba-8a3a-3be3a3fa3c2d?lang=ja-JP&region=JP&offset=${
      (pageNum - 1) * pageSize
    }&count=${pageSize}`
  ),
    { waitUntil: "networkidle2" };

  const html = await page.$eval("#screener-results", (el: any) => {
    return el.innerHTML;
  });

  const $ = cheerio.load(html);
  let keys: any = {
    1: "symbol",
    0: "name",
    2: "price",
    3: "change",
    4: "change_percent",
    5: "volume",
    6: "avg_volume",
    7: "market_cap",
    8: "pe_ratio",
  };
  let data: any = [];

  // '1-25 of 3943 results' 提取出 3943
  // <span>26-50 of 3943 results</span> cons提取出 3943
  const res = html.match(/<span>(\d+)-(\d+) of (\d+) results<\/span>/);

  $(".simpTblRow").each(function (i, el) {
    let row: any = {};
    $(this)
      .find("td")
      .each(function (j: any, el) {
        if (keys[j]) {
          row[keys[j]] = $(this).text();
        }
      });
    data.push(row);
  });

  page.close();

  return Response.json({
    list: data,
    pageNum,
    pageSize,
    total: Number(res[3] || 0),
  });
}
