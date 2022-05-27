import { ApolloServer } from "apollo-server";
import mockGraph from "./mockGraph";

module.exports = async () => {
  const graph: ApolloServer = mockGraph();
  await graph.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
};
