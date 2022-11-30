import { Options } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Item } from './entities/Item';
import { __prod__ } from './constants';
import path from 'path';

const config: Options<PostgreSqlDriver> = {
  migrations: {
    path: path.join(__dirname, './migrations'),
  },
  entities: [Item],
  dbName: 'resellers-r-us',
  type: 'postgresql',
  user: 'postgres',
  password: 'password',
  tsNode: true,
  allowGlobalContext: true,
  debug: __prod__,
};

export default config;
