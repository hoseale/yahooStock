import { type NextRequest } from "next/server";
import config from "@/config/servConf";
import queryParams from "@/utils/queryParams";

type QueryParam = {
  pageNum?: string;
  pageSize?: string;
  sortBy?:
    | "intradayprice"
    | "intradaypricechange"
    | "percentchange"
    | "dayvolume"
    | "intradaymarketcap"
    | "peratio.lasttwelvemonths";
  sortOrder?: "desc" | "asc";
};
export async function GET(request: NextRequest) {
  const searchParams = queryParams<QueryParam>(request.nextUrl.searchParams);

  const pageNum = Number(searchParams.pageNum) || 1;
  const pageSize = Number(searchParams.pageSize) || 20;

  const response = await fetch(
    config.BASE_URL + "/api/screener?lang=ja-JP&region=JP",
    {
      method: "POST",
      body: JSON.stringify({
        offset: (pageNum - 1) * pageSize,
        size: pageSize,
        sortField: searchParams.sortBy,
        sortType: searchParams.sortOrder,
        quoteType: "EQUITY",
        query: {
          operator: "AND",
          operands: [{ operator: "eq", operands: ["region", "jp"] }],
        },
        userId: "",
        userIdType: "guid",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  return Response.json(data);
}
