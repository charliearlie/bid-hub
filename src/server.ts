import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { json } from 'body-parser';
import mikroORMConfig from './mikro-orm.config';
import { __prod__ } from './constants';

dotenv.config();

import { Item } from './entities/Item';
import { ItemResolver } from './resolvers/item-resolver';

const main = async () => {
  const orm = await MikroORM.init(mikroORMConfig);
  const migrator = orm.getMigrator();
  const migrations = await migrator.getPendingMigrations();
  if (migrations && migrations.length > 0) {
    await migrator.up();
  }

  // const newItem = await orm.em.create(Item, {
  //   title: 'New Item created in server.ts',
  //   description: 'Description of our item',
  //   imageUrl: 'image.png',
  //   price: 999,
  // });

  // console.log({ newItem });

  const items = await orm.em.find(Item, {});

  console.log({ items });

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
