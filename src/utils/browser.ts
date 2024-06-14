import puppeteer, { type Browser } from "puppeteer";
// 获取浏览器对象
export default async function getBrowser(): Promise<Browser> {
  if (globalThis.browser) {
    return globalThis.browser;
  } else {
    globalThis.browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=ja-JP"],
    });
    return globalThis.browser;
  }
}
