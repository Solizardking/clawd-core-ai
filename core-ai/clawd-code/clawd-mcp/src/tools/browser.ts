/**
 * Browser Tool - Playwright-based browser automation
 * Gives Claude the ability to browse, interact, and extract data from websites
 */

import { chromium, Browser, BrowserContext, Page } from "playwright";

export interface BrowserConfig {
  /** Run in headless mode */
  headless?: boolean;
  /** Default timeout in ms */
  timeout?: number;
  /** User agent string */
  userAgent?: string;
  /** Viewport size */
  viewport?: { width: number; height: number };
}

export interface GotoResult {
  url: string;
  title: string;
  status: number;
}

export interface ScreenshotResult {
  path: string;
  width: number;
  height: number;
}

export interface ExtractResult {
  text?: string;
  html?: string;
  data?: Record<string, unknown>;
}

export class BrowserTool {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private config: BrowserConfig;

  constructor(config: BrowserConfig = {}) {
    this.config = {
      headless: true,
      timeout: 30000,
      viewport: { width: 1920, height: 1080 },
      ...config,
    };
  }

  /**
   * Start the browser
   */
  async start(): Promise<void> {
    if (this.browser) {
      console.log("[browser] Already started");
      return;
    }

    this.browser = await chromium.launch({
      headless: this.config.headless,
    });

    this.context = await this.browser.newContext({
      userAgent: this.config.userAgent,
      viewport: this.config.viewport,
    });

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(this.config.timeout ?? 30000);

    console.log("[browser] Started");
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string): Promise<GotoResult> {
    if (!this.page) throw new Error("Browser not started");

    const response = await this.page.goto(url, {
      waitUntil: "domcontentloaded",
    });

    return {
      url: this.page.url(),
      title: await this.page.title(),
      status: response?.status() ?? 0,
    };
  }

  /**
   * Take a screenshot
   */
  async screenshot(path: string, fullPage = false): Promise<ScreenshotResult> {
    if (!this.page) throw new Error("Browser not started");

    await this.page.screenshot({ path, fullPage });
    const viewport = this.page.viewportSize();

    return {
      path,
      width: viewport?.width ?? 0,
      height: viewport?.height ?? 0,
    };
  }

  /**
   * Click an element
   */
  async click(selector: string): Promise<void> {
    if (!this.page) throw new Error("Browser not started");
    await this.page.click(selector);
  }

  /**
   * Type text into an input
   */
  async type(selector: string, text: string): Promise<void> {
    if (!this.page) throw new Error("Browser not started");
    await this.page.fill(selector, text);
  }

  /**
   * Press a key
   */
  async press(key: string): Promise<void> {
    if (!this.page) throw new Error("Browser not started");
    await this.page.keyboard.press(key);
  }

  /**
   * Wait for an element
   */
  async waitFor(selector: string, timeout?: number): Promise<void> {
    if (!this.page) throw new Error("Browser not started");
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Extract text content
   */
  async extractText(selector?: string): Promise<string> {
    if (!this.page) throw new Error("Browser not started");

    if (selector) {
      const element = await this.page.$(selector);
      return (await element?.textContent()) ?? "";
    }

    return await this.page.textContent("body") ?? "";
  }

  /**
   * Extract HTML content
   */
  async extractHtml(selector?: string): Promise<string> {
    if (!this.page) throw new Error("Browser not started");

    if (selector) {
      const element = await this.page.$(selector);
      return (await element?.innerHTML()) ?? "";
    }

    return await this.page.content();
  }

  /**
   * Execute JavaScript in the page context
   */
  async evaluate<T>(script: string | (() => T)): Promise<T> {
    if (!this.page) throw new Error("Browser not started");
    return await this.page.evaluate(script);
  }

  /**
   * Extract structured data using a selector map
   */
  async extractData(
    selectors: Record<string, string>
  ): Promise<Record<string, string | null>> {
    if (!this.page) throw new Error("Browser not started");

    const data: Record<string, string | null> = {};

    for (const [key, selector] of Object.entries(selectors)) {
      const element = await this.page.$(selector);
      data[key] = element ? await element.textContent() : null;
    }

    return data;
  }

  /**
   * Extract all links from the page
   */
  async extractLinks(): Promise<{ text: string; href: string }[]> {
    if (!this.page) throw new Error("Browser not started");

    return await this.page.$$eval("a[href]", (links) =>
      links.map((a) => ({
        text: a.textContent?.trim() ?? "",
        href: a.getAttribute("href") ?? "",
      }))
    );
  }

  /**
   * Get current page URL
   */
  getUrl(): string {
    return this.page?.url() ?? "";
  }

  /**
   * Get cookies
   */
  async getCookies(): Promise<
    Array<{ name: string; value: string; domain: string }>
  > {
    if (!this.context) throw new Error("Browser not started");
    return await this.context.cookies();
  }

  /**
   * Set cookies
   */
  async setCookies(
    cookies: Array<{ name: string; value: string; domain: string; path?: string }>
  ): Promise<void> {
    if (!this.context) throw new Error("Browser not started");
    await this.context.addCookies(cookies);
  }

  /**
   * Close the browser
   */
  async close(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
    this.browser = null;
    this.context = null;
    this.page = null;
    console.log("[browser] Closed");
  }

  /**
   * Check if browser is running
   */
  isRunning(): boolean {
    return this.browser !== null;
  }
}
