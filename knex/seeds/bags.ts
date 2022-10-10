import { Knex } from 'knex';
import { Bag } from '../../src/models';

const now = new Date();

const bags = [
  { id: 1, volume: 10, title: 'A bag', createdAt: now, updatedAt: now },
  { id: 2, volume: 20, title: 'Another bag', createdAt: now, updatedAt: now },
];

export const seed = async (knex: Knex): Promise<void> => {
  await knex(Bag.tableName).del();
  await knex(Bag.tableName).insert(bags);
};
