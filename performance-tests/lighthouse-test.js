const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const urls = [
    'http://localhost:3000',
    'http://localhost:3000/products',
    'http://localhost:4001/login'
  ];

  for (const url of urls) {
    console.log(`Testing ${url}...`);
    
    const runnerResult = await lighthouse(url, options);
    const reportHtml = runnerResult.report;
    
    const urlName = url.replace(/[^a-zA-Z0-9]/g, '_');
    fs.writeFileSync(`./performance-tests/lighthouse-${urlName}.html`, reportHtml);
    
    const scores = runnerResult.lhr.categories;
    console.log(`Performance: ${Math.round(scores.performance.score * 100)}`);
    console.log(`Accessibility: ${Math.round(scores.accessibility.score * 100)}`);
    console.log(`Best Practices: ${Math.round(scores['best-practices'].score * 100)}`);
    console.log(`SEO: ${Math.round(scores.seo.score * 100)}`);
    console.log('---');
  }

  await chrome.kill();
}

runLighthouse().catch(console.error);