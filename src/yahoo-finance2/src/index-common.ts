// libs
import yahooFinanceFetch from "./lib/yahooFinanceFetch";
import moduleExec from "./lib/moduleExec";
import options from "./lib/options";
import errors from "./lib/errors";
import setGlobalConfig from "./lib/setGlobalConfig";
import { disallowAdditionalProps } from "./lib/validateAndCoerceTypes";

// modules
import autoc from "./modules/autoc";
import chart, { _chart } from "./modules/chart";
import historical from "./modules/historical";
import insights from "./modules/insights";
import optionsModule from "./modules/options";
import quote from "./modules/quote";
import quoteSummary from "./modules/quoteSummary";
import fundamentalsTimeSeries from "./modules/fundamentalsTimeSeries";
import recommendationsBySymbol from "./modules/recommendationsBySymbol";
import search from "./modules/search";
import trendingSymbols from "./modules/trendingSymbols";
import dailyGainers from "./modules/dailyGainers";
import screener from "./modules/screener";

// other
import quoteCombine from "./other/quoteCombine";

export default {
  // internal
  _env: {},
  _fetch: yahooFinanceFetch,
  _moduleExec: moduleExec,
  _opts: options,
  _disallowAdditionalProps: disallowAdditionalProps,

  // common
  errors,
  setGlobalConfig,

  // modules,
  autoc,
  chart,
  _chart,
  historical,
  insights,
  options: optionsModule,
  quote,
  quoteSummary,
  fundamentalsTimeSeries,
  recommendationsBySymbol,
  search,
  trendingSymbols,
  dailyGainers,
  screener,

  // other
  quoteCombine,
};
