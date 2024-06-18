/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
          "puppeteer-extra",
          "puppeteer-extra-plugin-stealth",
          "puppeteer-extra-plugin-recaptcha",
          "puppeteer-extra-plugin-user-data-dir",
          "puppeteer-extra-plugin-user-preferences",
        ],
      }
};

export default nextConfig;
