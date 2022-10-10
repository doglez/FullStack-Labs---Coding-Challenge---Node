import * as faker from 'faker';
import { Factory } from 'rosie';

export default Factory.define('cuboid').attrs({
  width: () => faker.datatype.number(10),
  height: () => faker.datatype.number(10),
  depth: () => faker.datatype.number(10),
});
