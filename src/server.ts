import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { MikroORM } from '@mikro-orm/core';
import { json } from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { buildSchema } from 'type-graphql';

import mikroORMConfig from './mikro-orm.config';
import { __prod__ } from './constants';

import { Item } from './entities/Item';
import { ItemResolver } from './resolvers/item-resolver';
import { User } from './entities/User';

dotenv.config();

const main = async () => {
  const orm = await MikroORM.init(mikroORMConfig);
  const migrator = orm.getMigrator();
  const migrations = await migrator.getPendingMigrations();
  if (migrations && migrations.length > 0) {
    await migrator.up();
  }

  const user = await orm.em.findOneOrFail(User, { id: 1 });

  const items = await orm.em.find(Item, {});

  console.log(items);

  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ItemResolver],
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        token: req.headers.token,
        em: orm.em,
        req,
        res,
      }),
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
};

main().catch((error) => console.error(error));
