import request from 'supertest';
import { app } from '../src/app.js';

describe('Health', () => {
  it('GET /api/health -> 200 ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
