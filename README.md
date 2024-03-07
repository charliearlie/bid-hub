# Bidhub

An eCommerce website built on a modern tech stack

## Development

Clone repository

Open project in IDE and fill in the `.env.template` and remove the `.template` suffix. (should be `.env`)

From your terminal:

```sh
cd bidhub
pnpm install
```

If the `pnpm install` doesn't show anything to do with Prisma, then also run

```sh
pnpm db:generate
```

Run the application

```sh
pnpn dev
```

### View and manipulate database data

Data can be viewed in Prisma's studio. To do this run:

```sh
pnpm db:studio
```

## Playwright tests

Currently on the CI we create and seed a brand new database every time we run the e2e tests. Locally, this is possible but will likely need to be done in a container. So until I set that up, it's preferred that you create a db locally and run the tests against that, and empty it when finished. Especially for tests involving mutations.

Or solely run your tests on the CI

Talking to myself but never mind.
