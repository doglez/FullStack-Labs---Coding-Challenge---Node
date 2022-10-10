import HttpStatus from 'http-status-codes';
import request from 'supertest';
import urlJoin from 'url-join';

import app from '../../app';
import { Bag } from '../../models';
import factories from '../../factories';

const server = app.listen();

afterAll(() => server.close());

describe('bag list', () => {
  it('should get all bags', async () => {
    const sampleSize = 3;
    const bags = factories.bag.buildList(sampleSize);

    const ids = await Promise.all(
      bags.map(async ({ id, ...data }) => (await Bag.query().insert(data)).id)
    );

    const response = await request(server).get('/bags').query({
      ids,
    });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.length).toBe(ids.length);
    response.body.forEach((bag: Bag) => {
      expect(bag.volume).toBeDefined();
      expect(bag.title).toBeDefined();
      expect(bag.cuboids).toBeDefined();
    });
  });
});

describe('bag get', () => {
  it('should get by id', async () => {
    const bag = factories.bag.build();
    const id = (await Bag.query().insert(bag)).id;

    const response = await request(server).get(urlJoin('/bags', id.toString()));

    expect(response.status).toBe(HttpStatus.OK);
    expect(typeof response.body.id).toBe('number');
    expect(response.body.id).toBe(id);
  });

  it('should return not-found if not found', async () => {
    const response = await request(server).get(urlJoin('/bags', '0'));
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});

describe('bag create', () => {
  it('should create', async () => {
    const bag = factories.bag.build({ volume: 111, title: 'A bag' });
    const response = await request(server).post('/bags').send(bag);

    expect(response.status).toBe(HttpStatus.CREATED);

    const fetchedBag = await Bag.query().findById(response.body.id);

    if (!fetchedBag) {
      throw new Error('Bag not found');
    }

    const { volume, title } = fetchedBag;

    expect(volume).toBe(bag.volume);
    expect(title).toBe(bag.title);
  });
});
