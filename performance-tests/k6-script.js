import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  // Test categories endpoint
  let categoriesRes = http.get(`${BASE_URL}/api/categories`);
  check(categoriesRes, {
    'categories status is 200': (r) => r.status === 200,
    'categories response time < 200ms': (r) => r.timings.duration < 200,
  });

  // Test products endpoint
  let productsRes = http.get(`${BASE_URL}/api/products`);
  check(productsRes, {
    'products status is 200': (r) => r.status === 200,
    'products response time < 500ms': (r) => r.timings.duration < 500,
  });

  // Test login
  let loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}