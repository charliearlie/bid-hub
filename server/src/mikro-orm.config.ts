import 'reflect-metadata';
import { Options } from '@mikro-orm/core';
import type { PostgreSqlDriver } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';
import { Item } from './entities/Item';
import { __prod__ } from './constants';
import path from 'path';
import { Address, Bid, Category, User } from './entities';

dotenv.config();

const config: Options<PostgreSqlDriver> = {
  migrations: {
    path: path.join(__dirname, './migrations'),
  },
  entities: [Address, Item, Category, User, Bid],
  dbName: process.env.DATABASE_NAME,
  type: 'postgresql',
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  tsNode: true,
  allowGlobalContext: true,
  debug: __prod__,
};

export default config;
