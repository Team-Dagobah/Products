import http from 'k6/http';
import { sleep, check } from 'k6';
import {Counter } from 'k6/metrics';

export const requests =  new Counter('http_reqs');

export const options = {
  stages: [
    {duration: '10s', target: 1},
    {duration: '10s', target: 10},
    {duration: '10s', target: 100},
    {duration: '10s', target: 1000},
    {duration: '10s', target: 100},
    {duration: '10s', target: 10},
    {duration: '10s', target: 1},
  ]
}

const url = `http://localhost:3000/products`


export default function () {
  let product_id = 900000 + Math.floor(Math.random() * 100000)
  let res = http.get(`http://localhost:3000/products/${product_id}/related`)
  sleep(1);
  check(res, {
    'is status 200': r => r.status === 200,
    'transaction time < 200ms': r => r.timings.duration < 200,
    'transaction time < 500ms': r => r.timings.duration < 500,
    'transaction time < 1000ms': r => r.timings.duration < 1000,
    'transaction time < 2000ms': r => r.timings.duration < 2000,
  })
}
