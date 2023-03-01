import 'reflect-metadata';

// Express
import cors from 'cors';
import express from 'express';
import http from 'http';
import session from 'express-session';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';

// Redis
import connectRedis from 'connect-redis';
import Redis from 'ioredis';

// Apollo
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import * as dotenv from 'dotenv';
import { buildSchema } from 'type-graphql';

import { MikroORM } from '@mikro-orm/core';
import mikroORMConfig from './mikro-orm.config';

import { SESSION_COOKIE, __prod__ } from './constants';
import {
  BidResolver,
  CategoryResolver,
  ItemResolver,
  UserResolver,
} from './resolvers';
import { Item, User } from './entities';
import setCurrentUser from './middleware/user-session';

dotenv.config();

const main = async () => {
  const redis = Redis.createClient();
  const RedisStore = connectRedis(session);
  const orm = await MikroORM.init(mikroORMConfig);
  const migrator = orm.getMigrator();
  const migrations = await migrator.getPendingMigrations();
  if (migrations && migrations.length > 0) {
    await migrator.up();
  }

  const users = await orm.em.find(User, {});

  console.log(users);

  const items = await orm.em.find(Item, {});

  console.log({ items });

  const app = express();
  const httpServer = http.createServer(app);

  app.set('trust proxy', !__prod__);
  app.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  app.set('Access-Control-Allow-Credentials', true);
  app.use(cookieParser());

  app.use(
    session({
      name: SESSION_COOKIE,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // cookie only works in https
      },
    })
  );

  app.use(setCurrentUser);
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [CategoryResolver, ItemResolver, UserResolver, BidResolver],
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
        includeCookies: true,
      }),
    ],
  });
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      credentials: true,
      origin: process.env.FRONTEND_URL,
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        em: orm.em,
        req,
        res,
        redis,
      }),
    })
  );

  app.get('/items', async (_req, res) => {
    const items = await orm.em.find(Item, {});
    res.send(items);
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
};

main().catch((error) => console.error(error));
