import { ApolloServer } from "apollo-server-micro";
import schema from "./schema";

const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true,
  tracing: process.env.NODE_ENV === "development",
});

export default server.createHandler({ path: "/graphql" });
