import { objectType } from "@nexus/schema";

const EpisodeSource = objectType({
  name: "EpisodeSource",
  definition(t) {
    t.string("server");
    t.string("title");
    t.string("code");
  },
});

export default EpisodeSource;
