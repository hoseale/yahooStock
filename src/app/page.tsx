export default function Home() {
  const apis = [
    {
      name: "日本股票分页列表",
      path: "/api/list",
      method: "GET",
      query: (
        <div>
          <div>pageNum: 页码</div>
          <div>pageSize: 每页数量</div>
          <div>
            sortBy: 排序字段 intradayprice 当前价格 intradaypricechange 涨跌额
            percentchange 涨跌幅 dayvolume 成交量 intradaymarketcap 市值
            peratio.lasttwelvemonths 市盈率
          </div>
          <div>sortOrder: 排序方式 desc 降序 asc 升序</div>
        </div>
      ),
      response: <div>quotes: 股票列表数据</div>,
    },
    {
      name: "按股票代码查询股票信息（支持批量查询）",
      path: "/api/quote",
      method: "GET",
      query: (
        <div>
          <div>symbols: 股票代码，多个用逗号分隔，比如 AAPL,MSFT,AMZN</div>
          <div>region: 地区 默认US</div>
          <div>lang: 语言 默认en-US</div>
        </div>
      ),
      response: <div>quoteResponse 返回股票列表信息 </div>,
    },
    {
      name: "日本榜单数据",
      path: "/api/ranking",
      method: "GET",
      query: (
        <div>
          <div>
            type: up涨幅前30名 down跌幅前30 volUp成交量前30 mcUp市值前30名
          </div>
        </div>
      ),
      response: <div>quoteResponse 返回股票列表信息 </div>,
    },
    {
      name: "日本股票K线数据",
      path: "/api/kLine",
      method: "GET",
      query: (
        <div>
          <div>symbol: 股票代码</div>
          <div>period1: 开始时间 2024-10-10</div>
          <div>period2: 结束时间 2024-10-10</div>
          <div>
            interval: 数据间隔，比如 "1d" 表示每日数据 1m, 2m, 5m, 15m, 30m,
            60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
          </div>
          {/* <div>events: 事件类型</div> */}
          <div>includePrePost: 是否包含盘前盘后数据 默认true</div>
          <div>lang: 语言, 默认en-US</div>
          <div>region: 地区 默认US</div>
        </div>
      ),
      response: (
        <div>
          timestamp 全部时间戳， indicators里的数据说明： open 开盘价，high
          最高价，low 最低价，close 收盘价，volume 成交量
        </div>
      ),
    },
  ];
  return (
    <main className="flex min-h-screen flex-col p-24">
      {apis.map((api, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold">{api.name}</h2>
          <div className="text-blue-500">{api.path}</div>
          <div>
            <span className="font-bold">请求方法</span>
            <span className="ml-2">{api.method}</span>
          </div>
          <div className="font-bold">请求参数</div>
          {api.query}
          <div className="font-bold">返回数据</div>
          {api.response}
        </div>
      ))}
    </main>
  );
}
