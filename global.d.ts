import { type FC, type PropsWithChildren } from "react";
import puppeteer, { type Browser } from "puppeteer-core";

// 声明全局的类型
declare global {
  namespace globalThis {
    var browser: Browser;
  }

  type ReactFC<T = {}> = React.FC<PropsWithChildren<T>>;
}

export {};
