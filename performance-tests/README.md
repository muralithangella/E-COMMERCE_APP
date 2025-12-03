# Performance Testing Guide

## Setup
```bash
cd performance-tests
npm install
npm run install:tools
```

## Backend Performance Tests

### 1. Quick Benchmark (Autocannon)
```bash
node benchmark.js
```
- Tests API endpoints with concurrent connections
- Shows requests/sec, latency, throughput

### 2. Load Testing (Artillery)
```bash
npm run test:artillery
```
- Simulates realistic user scenarios
- Tests with increasing load (10→50→100 users)

### 3. Advanced Load Testing (K6)
```bash
npm run test:k6
```
- Performance thresholds validation
- Detailed metrics and reporting

## Frontend Performance Tests

### 1. Lighthouse Audit
```bash
npm run test:lighthouse
```
- Performance, Accessibility, SEO scores
- Generates HTML reports

### 2. Browser DevTools
- Open Chrome DevTools → Performance tab
- Record page load and interactions
- Analyze Core Web Vitals

## Performance Metrics to Monitor

### Backend
- **Response Time**: < 200ms for API calls
- **Throughput**: > 1000 requests/sec
- **Error Rate**: < 1%
- **CPU Usage**: < 70%
- **Memory Usage**: < 80%

### Frontend
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Time to Interactive**: < 3.5s

## Running All Tests
```bash
npm run test:all
```

## Continuous Monitoring
- Set up automated tests in CI/CD
- Monitor production with APM tools
- Use real user monitoring (RUM)