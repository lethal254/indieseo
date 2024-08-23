export async function runLighthouse(
  url: string,
  options: object = {},
  config: object = {}
): Promise<any> {
  console.log("Launching Chrome...")

  const chromeLauncher = await import("chrome-launcher")
  const { default: lighthouse } = await import("lighthouse")

  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] })
  const chromeOptions = { ...options, port: chrome.port }

  const defaultConfig = {
    extends: "lighthouse:default",
    settings: {
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    },
  }
  const finalConfig = { ...defaultConfig, ...config }

  console.log("Running Lighthouse...")
  let runnerResult

  try {
    runnerResult = await lighthouse(url, chromeOptions, finalConfig)
    console.log("Lighthouse run completed")
  } catch (error) {
    console.error("Lighthouse run failed:", error)
    await chrome.kill()
    throw error
  }

  console.log("Killing Chrome...")
  await chrome.kill()

  if (runnerResult && runnerResult.lhr) {
    return formatLighthouseResult(runnerResult.lhr)
  } else {
    throw new Error("Lighthouse result is undefined or missing lhr property")
  }
}

function formatLighthouseResult(lhr: any): any {
  const { categories, audits, fetchTime, requestedUrl, finalUrl } = lhr

  return {
    fetchedAt: fetchTime,
    requestedUrl,
    finalUrl,
    scores: {
      performance: categories.performance.score ?? "N/A",
      accessibility: categories.accessibility.score ?? "N/A",
      bestPractices: categories["best-practices"].score ?? "N/A",
      seo: categories.seo.score ?? "N/A",
    },
    metrics: {
      firstContentfulPaint:
        audits["first-contentful-paint"].displayValue ?? "N/A",
      largestContentfulPaint:
        audits["largest-contentful-paint"].displayValue ?? "N/A",
      cumulativeLayoutShift:
        audits["cumulative-layout-shift"].displayValue ?? "N/A",
    },
    criticalAudits: Object.keys(audits)
      .filter((key) => audits[key].score !== undefined && audits[key].score < 1) // Only include audits with a score less than 1 (not perfect)
      .map((key) => ({
        id: key,
        title: audits[key].title,
        description: audits[key].description,
        score: audits[key].score ?? "N/A",
        displayValue: audits[key].displayValue ?? "N/A",
      })),
  }
}
