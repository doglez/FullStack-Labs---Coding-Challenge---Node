import request from 'supertest';

import app from '../../app';

const server = app.listen();

afterAll(() => server.close());

it('should GET the index endpoint', async () => {
  const response = await request(server).get('/');

  expect(response.text).toBe('Cuboids');
});
