export const client = {
  service: {
    name: "hasura",
    includes: ['./packages/backend/src/utils/**/*.ts'],
    localSchemaFile: "./packages/backend/schema.graphql",
  },
};
