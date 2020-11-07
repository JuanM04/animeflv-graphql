import { makeSchema } from "@nexus/schema";
import { join } from "path";

import * as scalars from "./scalars";
import * as enums from "./enums";
import Anime from "./Anime";
import Episode from "./Episode";
import EpisodeSource from "./EpisodeSource";
import Query from "./Query";

export default makeSchema({
  types: { ...scalars, ...enums, Anime, Episode, EpisodeSource, Query },
  outputs: {
    schema: join(process.cwd(), "generated", "schema.graphql"),
    typegen: join(process.cwd(), "generated", "nexus.ts"),
  },
});
