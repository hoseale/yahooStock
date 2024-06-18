import { type Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
require("puppeteer-extra-plugin-stealth/evasions/chrome.app");
require("puppeteer-extra-plugin-stealth/evasions/chrome.csi");
require("puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes");
require("puppeteer-extra-plugin-stealth/evasions/chrome.runtime");
require("puppeteer-extra-plugin-stealth/evasions/defaultArgs"); // pkg warned me this one was missing
require("puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow");
require("puppeteer-extra-plugin-stealth/evasions/media.codecs");
require("puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency");
require("puppeteer-extra-plugin-stealth/evasions/navigator.languages");
require("puppeteer-extra-plugin-stealth/evasions/navigator.permissions");
require("puppeteer-extra-plugin-stealth/evasions/navigator.plugins");
require("puppeteer-extra-plugin-stealth/evasions/navigator.vendor");
require("puppeteer-extra-plugin-stealth/evasions/navigator.webdriver");
require("puppeteer-extra-plugin-stealth/evasions/sourceurl");
require("puppeteer-extra-plugin-stealth/evasions/user-agent-override");
require("puppeteer-extra-plugin-stealth/evasions/webgl.vendor");
require("puppeteer-extra-plugin-stealth/evasions/window.outerdimensions");
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// 获取浏览器对象
export default async function getBrowser(force?: boolean): Promise<Browser> {
  if (!force && globalThis.browser) {
    return globalThis.browser;
  } else {
    puppeteer.use(StealthPlugin());
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
