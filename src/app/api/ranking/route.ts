import { type NextRequest } from "next/server";
import getBrowser from "@/utils/browser";
import dayjs from "dayjs";
import queryParams from "@/utils/queryParams";
import config from "@/config/servConf";

type Params = {
  // up涨幅前30名 down跌幅前30 volUp成交量前30 mcUp市值前30名
  type: "up" | "down" | "volUp" | "mcUp";
};
// 各种榜单
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const params = queryParams<Params>(searchParams);
  const type = params.type;
  if (!type) {
    return Response.json({
      status: -1,
      errorMessage: "type is required",
    });
  }
  let sortField = "";
  let sortType = "";
  switch (type) {
    case "up":
      sortField = "percentchange";
      sortType = "desc";
      break;
    case "down":
      sortField = "percentchange";
      sortType = "asc";
      break;
    case "volUp":
      sortField = "dayvolume";
      sortType = "desc";
      // asc
      break;
    case "mcUp":
      sortField = "intradaymarketcap";
      sortType = "desc";
      break;
    default:
  }
  if (!sortField || !sortType) {
    return Response.json({
      status: -1,
      errorMessage: "type is invalid",
    });
  }

  const nums = 30;

  const param = {
    offset: 0,
    size: nums,
    sortField: sortField,
    sortType: sortType,
    quoteType: "EQUITY",
    query: {
      operator: "AND",
      operands: [{ operator: "eq", operands: ["region", "jp"] }],
    },
    userId: "",
    userIdType: "guid",
  };

  const response = await fetch(config.BASE_URL + "/api/screener", {
    method: "POST",
    body: JSON.stringify(param),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return Response.json(data);
}
