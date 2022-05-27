module.exports = {
  client: {
    service: {
      name: "hasura",
      url: "http://localhost:8080/v1/graphql",
      skipSSLValidation: true,
    },
  },
};
