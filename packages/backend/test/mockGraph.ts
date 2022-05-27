import { ApolloServer } from "apollo-server";
import { readFileSync } from "fs";
import { faker } from "@faker-js/faker";

const GraphServer = () => {
  const typeDefs = readFileSync("./schema.graphql").toString("utf-8");

  const resolvers = {};

  const mocks = {
    prices_tokens: () => ({
      id: () => 1,
      address: () => "0xABCDE619a4B46A6da29355023E0533a1332c7D84",
      creationEpoch: () => faker.datatype.number({ min: 0, max: 100000000 }),
      symbol: () => "MCK",
      tokenset: () => false,
    }),
    prices_daily: () => ({
      epoch: () => faker.datatype.number({ min: 0, max: 100000000 }),
      id: 1,
      price: () =>
        faker.datatype.number({ min: 0, max: 100, precision: 10 }).toString(),
    }),
    prices_hourlies: () => ({
      epoch: () => faker.datatype.number({ min: 0, max: 100000000 }),
      id: 2,
      price: () =>
        faker.datatype.number({ min: 0, max: 100, precision: 10 }).toString(),
    }),
    prices_minutes: () => ({
      epoch: () => faker.datatype.number({ min: 0, max: 100000000 }),
      id: 3,
      price: () =>
        faker.datatype.number({ min: 0, max: 100, precision: 10 }).toString(),
    }),
    prices_networks: () => ({
      chainId: () => "0x1",
      id: 1,
      name: () => "testnet",
    }),
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    mocks,
  });

  return server;
};

export default GraphServer;
