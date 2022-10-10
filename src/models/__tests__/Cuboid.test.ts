import Bag from '../Bag';
import Cuboid from '../Cuboid';

let bag: Bag;

beforeAll(async () => {
  bag = await Bag.query().insertGraphAndFetch({
    volume: 100,
    title: 'A bag',
    cuboids: [{ width: 2, height: 2, depth: 2 }],
  });
});

describe.each([
  [3, 3, 3, 27],
  [4, 4, 4, 64],
])('Cuboid %i x %i x %i', (width, height, depth, volume) => {
  let cuboid: Cuboid;

  beforeAll(async () => {
    cuboid = await Cuboid.query().insert({
      width,
      height,
      depth,
      bagId: bag.id,
    });
  });

  it('should have dimensions', () => {
    expect(cuboid.width).toBe(width);
    expect(cuboid.height).toBe(height);
    expect(cuboid.depth).toBe(depth);
  });

  it('should have volume', () => {
    expect(cuboid.volume).toBe(volume);
  });
});

it('should have relation mapping', () => {
  expect(Cuboid.relationMappings).toHaveProperty('bag');
});
