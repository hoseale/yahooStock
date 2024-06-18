import puppeteer, { Browser } from "puppeteer-core";
// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// 获取浏览器对象
export default async function getBrowser(force?: boolean): Promise<Browser> {
  if (!force && globalThis.browser) {
    return globalThis.browser;
  } else {
    // puppeteer.use(StealthPlugin());
    globalThis.browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    return globalThis.browser;
  }
}

// 获取行新的页面
export async function getNewPage() {
  let browser = await getBrowser();
  try {
    return await browser.newPage();
  } catch (error) {
    browser = await getBrowser(true);
    return await browser.newPage();
  }
}
