import { objectType } from "@nexus/schema";

const EpisodeAnime = objectType({
  name: "EpisodeAnime",
  definition(t) {
    t.int("id", { deprecation: "Better use `slug`" });
    t.string("slug");
  },
});

export default EpisodeAnime;
