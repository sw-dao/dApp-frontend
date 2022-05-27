import { ApolloServer } from "apollo-server";
import mockGraph from "./mockGraph";

module.exports = async () => {
  const graph: ApolloServer = mockGraph();
  await graph.stop().then(() => {
    console.log(`🚀 Apollo down`);
  });
};
