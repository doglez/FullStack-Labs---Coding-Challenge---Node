import Bag from '../Bag';

const bags = [
  {
    volume: 10,
    title: 'A bag with no cuboids',
    payloadVolume: 0,
    availableVolume: 10,
    cuboids: [],
  },
  {
    volume: 20,
    title: 'A bag with one cuboid',
    payloadVolume: 18,
    availableVolume: 2,
    cuboids: [{ width: 3, height: 2, depth: 3 }],
  },
  {
    volume: 10,
    title: 'A bag with two cuboids',
    payloadVolume: 8,
    availableVolume: 2,
    cuboids: [
      { width: 1, height: 2, depth: 3 },
      { width: 1, height: 2, depth: 1 },
    ],
  },
  {
    volume: 100,
    title: 'A bag with three cuboids',
    payloadVolume: 99,
    availableVolume: 1,
    cuboids: [
      { width: 2, height: 2, depth: 2 },
      { width: 3, height: 3, depth: 3 },
      { width: 4, height: 4, depth: 4 },
    ],
  },
];

describe.each([
  ['no cuboids', bags[0]],
  ['one cuboid', bags[1]],
  ['two cuboids', bags[2]],
  ['three cuboids', bags[3]],
])('Bag with %s', (_, bagData) => {
  let bag: Bag;
  const { volume, title, payloadVolume, availableVolume, cuboids } = bagData;

  beforeAll(async () => {
    bag = await Bag.query().insertGraphAndFetch({
      volume,
      title,
      cuboids,
    });
  });

  it('should have volume', () => {
    expect(bag.volume).toBe(volume);
  });

  it('should have title', () => {
    expect(bag.title).toBe(title);
  });

  it('should have payloadVolume', () => {
    expect(bag.payloadVolume).toBe(payloadVolume);
  });

  it('should have availableVolume', () => {
    expect(bag.availableVolume).toBe(availableVolume);
  });
});

it('should have relation mapping', () => {
  expect(Bag.relationMappings).toHaveProperty('cuboids');
});
