import * as faker from 'faker';
import { Factory } from 'rosie';

export default Factory.define('bag').attrs({
  volume: () => faker.datatype.number(100),
  title: () => `A ${faker.commerce.productAdjective().toLowerCase()} bag`,
});
