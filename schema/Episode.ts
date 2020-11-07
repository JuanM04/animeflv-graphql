import { objectType } from "@nexus/schema";

import EpisodeAnime from "./EpisodeAnime";

import { imageUrlToBase64 } from "../utils/helpers";

const Episode = objectType({
  name: "Episode",
  definition(t) {
    t.int("id", { deprecation: "Better use `n`" });
    t.float("n");
    t.field("anime", { type: EpisodeAnime });
    t.string("thumbnail", {
      resolve: async (episode) =>
        imageUrlToBase64(
          `https://cdn.animeflv.net/screenshots/${episode.id}/${episode.id}/th_3.jpg`
        ),
    });
  },
});

export default Episode;
