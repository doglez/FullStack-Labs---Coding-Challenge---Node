import { Knex } from 'knex';
import { Cuboid } from '../../src/models';

const now = new Date();

const cuboids = [
  {
    id: 1,
    width: 2,
    height: 2,
    depth: 2,
    bagId: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    width: 3,
    height: 2,
    depth: 1,
    bagId: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    width: 3,
    height: 4,
    depth: 2,
    bagId: 2,
    createdAt: now,
    updatedAt: now,
  },
];

export const seed = async (knex: Knex): Promise<void> => {
  await knex(Cuboid.tableName).del();
  await knex(Cuboid.tableName).insert(cuboids);
};
