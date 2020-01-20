import { GraphQLScalarType } from "graphql";

export default {
  AnimeType: {
    TV: "tv",
    MOVIE: "movie",
    SPECIAL: "special",
    OVA: "ova"
  },
  AnimeStatus: {
    RUNNING: 1,
    ENDED: 2,
    SOON: 3
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date scalar type YYYY-MM-DD",
    parseValue(string) {
      return string;
    },
    serialize(string) {
      return string;
    }
  })
};
