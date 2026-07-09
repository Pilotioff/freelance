import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000/api';

export const options = {
  vus: 20,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.01'],
  },
};

export function setup() {
  const email = `k6-${Date.now()}@test.com`;
  const password = 'password123';

  http.post(
    `${BASE_URL}/auth/registro`,
    JSON.stringify({ nombre: 'K6', apellido: 'Load', email, password }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email, password }),
    { headers: { 'Content-Type': 'application/json' } },
  );

  const cookies = loginRes.cookies;
  const tokenCookie = cookies['token'] ? cookies['token'][0].value : null;

  return { cookie: `token=${tokenCookie}` };
}

export default function (data) {
  const payload = JSON.stringify({
    tipo_proyecto: 'webapp',
    cantidad_paginas: 10,
    nivel_disenio: 'intermedio',
    cantidad_desarrolladores: 2,
    tiempo_entrega: '1mes',
    hosting: 'vps',
    perfil_cliente: 'startup',
  });

  const res = http.post(`${BASE_URL}/cotizaciones/estimar`, payload, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: data.cookie,
    },
  });

  check(res, {
    'status es 200 o 201': (r) => r.status === 200 || r.status === 201,
    'responde en menos de 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
