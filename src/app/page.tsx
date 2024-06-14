export default function Home() {
  const apis = [
    {
      name: "日本股票分页列表",
      path: "/api/list",
      query: (
        <div>
          <div>pageNum: 页码</div>
          <div>pageSize: 每页数量</div>
        </div>
      ),
      response: (
        <div>
          返回列表key说明 symbol 股票代码， name 股票名称， price 当前价格，
          change 涨跌额， change_percent 涨跌幅， volume 成交量， avg_volume
          平均成交量， market_cap 市值， pe_ratio 市盈率，
        </div>
      ),
    },
    {
      name: "日本股票K线数据",
      path: "/api/kLine",
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
          <div className="text-gray-500">请求参数</div>
          {api.query}
          <div className="text-gray-500">返回数据</div>
          {api.response}
        </div>
      ))}
    </main>
  );
}
