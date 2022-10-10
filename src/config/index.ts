import * as dotenv from 'dotenv';

dotenv.config();

enum NodeEnv {
  TEST = 'test',
  DEV = 'development',
}

interface Env {
  env: NodeEnv;
  dbFilename: string;
  dbTestFilename: string;
  knexDebug: boolean;
  port: number;
  defaultPage: number;
  defaultPageSize: number;
}

export const config: Env = {
  env: (process.env.NODE_ENV as NodeEnv) || NodeEnv.DEV,
  dbFilename: process.env.DB_FILENAME || '',
  dbTestFilename: process.env.DB_TEST_FILENAME || '',
  knexDebug: process.env.KNEX_DEBUG === 'true',
  port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 5000,
  defaultPage: 0,
  defaultPageSize: 10,
};
