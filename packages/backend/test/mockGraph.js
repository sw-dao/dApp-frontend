"use strict";
exports.__esModule = true;
var apollo_server_1 = require("apollo-server");
var fs_1 = require("fs");
var faker_1 = require("@faker-js/faker");
var GraphServer = function () {
    var typeDefs = (0, fs_1.readFileSync)("./schema.graphql").toString("utf-8");
    var resolvers = {};
    var mocks = {
        prices_tokens: function () { return ({
            id: function () { return 1; },
            address: function () { return "0xABCDE619a4B46A6da29355023E0533a1332c7D84"; },
            creationEpoch: function () { return faker_1.faker.datatype.number({ min: 0, max: 100000000 }); },
            symbol: function () { return "MCK"; },
            tokenset: function () { return false; }
        }); },
        prices_daily: function () { return ({
            epoch: function () { return faker_1.faker.datatype.number({ min: 0, max: 100000000 }); },
            id: 1,
            price: function () {
                return faker_1.faker.datatype.number({ min: 0, max: 100, precision: 10 }).toString();
            }
        }); },
        prices_hourlies: function () { return ({
            epoch: function () { return faker_1.faker.datatype.number({ min: 0, max: 100000000 }); },
            id: 2,
            price: function () {
                return faker_1.faker.datatype.number({ min: 0, max: 100, precision: 10 }).toString();
            }
        }); },
        prices_minutes: function () { return ({
            epoch: function () { return faker_1.faker.datatype.number({ min: 0, max: 100000000 }); },
            id: 3,
            price: function () {
                return faker_1.faker.datatype.number({ min: 0, max: 100, precision: 10 }).toString();
            }
        }); },
        prices_networks: function () { return ({
            chainId: function () { return "0x1"; },
            id: 1,
            name: function () { return "testnet"; }
        }); }
    };
    var server = new apollo_server_1.ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
        mocks: mocks
    });
    return server;
};
exports["default"] = GraphServer;
