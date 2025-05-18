import puppeteer from 'puppeteer';

async function measurePagePerformance(url) {
  console.log(`Testing performance for: ${url}`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable performance metrics
  await page.setCacheEnabled(false);
  await page.setRequestInterception(true);
  
  const requests = [];
  page.on('request', request => {
    requests.push({
      url: request.url(),
      resourceType: request.resourceType(),
      time: Date.now()
    });
    request.continue();
  });
  
  const responses = [];
  page.on('response', response => {
    responses.push({
      url: response.url(),
      status: response.status(),
      contentType: response.headers()['content-type'],
      time: Date.now()
    });
  });
  
  // Set up performance observer
  await page.evaluateOnNewDocument(() => {
    window.performance.setResourceTimingBufferSize(500);
  });
  
  // Start timing
  const startTime = Date.now();
  
  // Navigate to the page
  const response = await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  
  // Measure First Contentful Paint
  const fcpMetric = await page.evaluate(() => {
    const performanceEntries = performance.getEntriesByType('paint');
    const fcpEntry = performanceEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : null;
  });
  
  // Get all page metrics
  const metrics = await page.evaluate(() => {
    return {
      domContentLoaded: performance.timing.domContentLoadedEventStart - performance.timing.navigationStart,
      load: performance.timing.loadEventStart - performance.timing.navigationStart,
      firstPaint: performance.getEntriesByType('paint')
        .find(entry => entry.name === 'first-paint')?.startTime,
      resources: performance.getEntriesByType('resource').map(entry => ({
        name: entry.name,
        duration: entry.duration,
        transferSize: entry.transferSize,
        initiatorType: entry.initiatorType
      }))
    };
  });
  
  // End timing
  const endTime = Date.now();
  const totalLoadTime = endTime - startTime;
  
  // Generate a report
  const report = {
    url,
    statusCode: response.status(),
    performance: {
      totalLoadTime: `${totalLoadTime}ms`,
      domContentLoaded: `${metrics.domContentLoaded}ms`,
      loadEvent: `${metrics.load}ms`,
      firstPaint: metrics.firstPaint ? `${metrics.firstPaint.toFixed(2)}ms` : 'N/A',
      firstContentfulPaint: fcpMetric ? `${fcpMetric.toFixed(2)}ms` : 'N/A'
    },
    resources: {
      total: metrics.resources.length,
      byType: metrics.resources.reduce((acc, resource) => {
        acc[resource.initiatorType] = (acc[resource.initiatorType] || 0) + 1;
        return acc;
      }, {}),
      totalTransferSize: metrics.resources.reduce((total, resource) => total + (resource.transferSize || 0), 0)
    }
  };
  
  // Get the slowest resources
  const slowestResources = metrics.resources
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 5)
    .map(resource => ({
      url: resource.name,
      duration: `${resource.duration.toFixed(2)}ms`,
      size: resource.transferSize ? `${(resource.transferSize / 1024).toFixed(2)}KB` : 'Unknown',
      type: resource.initiatorType
    }));
  
  console.log(JSON.stringify(report, null, 2));
  console.log('\nSlowest Resources:');
  console.table(slowestResources);
  
  await browser.close();
  return report;
}

// List of pages to test
const pagesToTest = [
  'https://arxen-website.vercel.app/',
  'https://arxen-website.vercel.app/about',
  'https://arxen-website.vercel.app/residential',
  'https://arxen-website.vercel.app/commercial',
  'https://arxen-website.vercel.app/free-estimate',
  'https://arxen-website.vercel.app/contact'
];

// Run tests for each page
async function runAllTests() {
  console.log('Starting performance tests...\n');
  
  const results = {};
  
  for (const url of pagesToTest) {
    try {
      const pageName = url.split('/').pop() || 'home';
      results[pageName] = await measurePagePerformance(url);
      console.log('\n-------------------------------------------\n');
    } catch (error) {
      console.error(`Error testing ${url}:`, error);
    }
  }
  
  console.log('Performance testing complete!');
}

runAllTests(); 