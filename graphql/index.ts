import { ApolloServer } from "apollo-server-micro";
import typeDefs from "./type-defs";
import resolvers from "./resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

module.exports = server.createHandler({ path: "/graphql" });
