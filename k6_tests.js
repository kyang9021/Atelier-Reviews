import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '20s', target: 100 }, // below normal load
    { duration: '20s', target: 250 }, // normal load
    { duration: '20s', target: 500 }, // around the breaking point
    { duration: '30s', target: 1000 }, // beyond the breaking point
    { duration: '30s', target: 1000 }, // maintain 1000 VUs
    { duration: '1m', target: 0 }, // scale down. Recovery stage.
  ],
};

export default function () {
  const BASE_URL = 'http://127.0.0.1:5000'; // make sure this is not production

  let random = Math.floor(Math.random() * 1000011);

  let responses = http.batch([
    [
      'GET',
      `${BASE_URL}/reviews/?product_id=${random}`,
      null,
    ],
    [
      'GET',
      `${BASE_URL}/reviews/meta?product_id${random}`,
      null,
    ]
  ]);

  sleep(1);
}


