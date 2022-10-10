import { Id } from 'objection';
import HttpStatus from 'http-status-codes';
import request from 'supertest';

import app from '../../app';
import { Bag, Cuboid } from '../../models';
import factories from '../../factories';
import urlJoin from 'url-join';

const server = app.listen();

afterAll(() => server.close());

describe('cuboid get', () => {
  let bagId: Id;

  beforeEach(async () => {
    bagId = (
      await Bag.query().insert(
        factories.bag.build({
          volume: 10000,
          title: 'A bag',
        })
      )
    ).id;
  });

  it('should get all cuboids', async () => {
    const sampleSize = 3;
    const cuboids = factories.cuboid.buildList(sampleSize, { bagId });

    const ids = await Promise.all(
      cuboids.map(
        async ({ id, ...data }) => (await Cuboid.query().insert(data)).id
      )
    );

    const response = await request(server).get('/cuboids').query({
      ids,
    });

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.length).toBe(ids.length);

    response.body.forEach((cuboid: Cuboid) => {
      expect(cuboid.width).toBeDefined();
      expect(cuboid.height).toBeDefined();
      expect(cuboid.depth).toBeDefined();
      expect(cuboid.bag?.id).toBe(bagId);
    });
  });

  it('should get by id', async () => {
    const cuboid = factories.cuboid.build({ bagId });
    const id = (await Cuboid.query().insert(cuboid)).id;

    const response = await request(server).get(
      urlJoin('/cuboids', id.toString())
    );

    expect(response.status).toBe(HttpStatus.OK);
    expect(typeof response.body.id).toBe('number');
    expect(response.body.id).toBe(id);
  });

  it('should get with volume', async () => {
    const cuboid = factories.cuboid.build({
      width: 4,
      height: 4,
      depth: 4,
      bagId,
    });
    const id = (await Cuboid.query().insert(cuboid)).id;

    const response = await request(server).get(
      urlJoin('/cuboids', id.toString())
    );

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.volume).toBe(64);
  });

  it('should return not-found if not found', async () => {
    const response = await request(server).get(urlJoin('/cuboids', '0'));
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});

describe('cuboid create', () => {
  let bagId: Id;

  beforeEach(async () => {
    bagId = (
      await Bag.query().insert(
        factories.bag.build({
          volume: 2000,
          title: 'A bag',
        })
      )
    ).id;
    const cuboids = factories.cuboid.buildList(3, {
      width: 10,
      height: 10,
      depth: 5,
      bagId,
    });
    await Promise.all(cuboids.map((data) => Cuboid.query().insert(data)));
  });

  it('should succeed', async () => {
    const cuboid = factories.cuboid.build({
      width: 6,
      height: 7,
      depth: 8,
      bagId,
    });

    const response = await request(server).post('/cuboids').send(cuboid);

    expect(response.status).toBe(HttpStatus.CREATED);

    const fetchedCuboid = await Cuboid.query()
      .findById(response.body.id)
      .withGraphFetched('bag');

    if (!fetchedCuboid) {
      throw new Error('Cuboid not found');
    }

    const { width, height, depth, bag } = fetchedCuboid;

    expect(width).toBe(cuboid.width);
    expect(height).toBe(cuboid.height);
    expect(depth).toBe(cuboid.depth);
    expect(bagId).toBe(bag?.id);
  });

  it('should fail if insufficient capacity', async () => {
    const cuboid = factories.cuboid.build({
      width: 7,
      height: 8,
      depth: 9,
      bagId,
    });

    const response = await request(server).post('/cuboids').send(cuboid);

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.body.message).toBe('Insufficient capacity in bag');
  });

  it('should return not-found because bag does not exists', async () => {
    const cuboid = factories.cuboid.build({
      width: 6,
      height: 7,
      depth: 8,
      bagId: 9999,
    });

    const response = await request(server).post('/cuboids').send(cuboid);
    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});

/**
 * DO NOT modify the tests ABOVE
 * IMPLEMENT the tests BELOW
 */

describe('cuboid update', () => {
  let bag: Bag;
  let cuboid: Cuboid;

  beforeEach(async () => {
    bag = await Bag.query().insert(
      factories.bag.build({
        volume: 250,
        title: 'A bag',
      })
    );
    await Cuboid.query().insert(
      factories.cuboid.build({
        width: 5,
        height: 5,
        depth: 5,
        bagId: bag.id,
      })
    );
    cuboid = await Cuboid.query().insert(
      factories.cuboid.build({
        width: 4,
        height: 4,
        depth: 4,
        bagId: bag.id,
      })
    );
  });

  it('should succeed to update the cuboid', () => {
    const [newWidth, newHeight, newDepth] = [5, 5, 5];
    const response = { body: {} as Cuboid, status: HttpStatus.OK };
    cuboid = response.body;

    expect(response.status).toBe(HttpStatus.OK);
    expect(cuboid.width).toBe(newWidth);
    expect(cuboid.height).toBe(newHeight);
    expect(cuboid.depth).toBe(newDepth);
    expect(cuboid.bag?.id).toBe(bag.id);
  });

  it('should fail to update if insufficient capacity and return 422 status code', () => {
    const [newWidth, newHeight, newDepth] = [6, 6, 6];
    const response = {
      body: {} as Cuboid,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    };

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(response.body.width).not.toBe(newWidth);
    expect(response.body.height).not.toBe(newHeight);
    expect(response.body.depth).not.toBe(newDepth);
  });
});

describe('cuboid delete', () => {
  it('should delete the cuboid', () => {
    const response = { status: HttpStatus.OK };

    expect(response.status).toBe(HttpStatus.OK);
  });

  it('should not delete and return 404 status code when cuboids doesnt exists', () => {
    const response = { status: HttpStatus.NOT_FOUND };

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
  });
});
