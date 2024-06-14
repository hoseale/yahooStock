import yahooFinance from "./index-common";
import nodeEnvironment from "./env-node";
import { ExtendedCookieJar } from "./lib/cookieJar";

yahooFinance._env = nodeEnvironment;

export { ExtendedCookieJar };
export default yahooFinance;
