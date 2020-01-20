import cheerio from "cheerio";
import { get, getCover, getThumbnail, getAnime, explore } from "../utils";

export default {
  Query: {
    anime: async (_, { id }, ctx) => {
      const body = await getAnime(id, ctx);

      const rawInfo = body.split("var anime_info = ", 2)[1].split(";", 2)[0];
      const info = JSON.parse(rawInfo);

      const $ = cheerio.load(body);

      return {
        id,
        name: info[1],
        slug: info[2],
        type: $("span.Type")
          .attr("class")
          .split(" ")[1],
        cover: getCover(id),
        synopsis: $("div.Description p").text(),
        rating: parseFloat($("#votes_prmd").text())
      };
    },
    search: async (_, args) => explore(args),
    explore: async (_, args) => explore(args),
    episodeSources: async (_, { episodeId, episodeN, animeSlug, type }) => {
      const body = await get(`/ver/${episodeId}/${animeSlug}-${episodeN}`);

      const rawSources = body.split("var videos = ", 2)[1].split(";", 2)[0];
      const sources = JSON.parse(rawSources);

      return sources[type || "SUB"];
    }
  },
  Anime: {
    status: async ({ id }, _, ctx) => {
      const body = await getAnime(id, ctx);
      const $ = cheerio.load(body);

      let status = 1;
      if ($("p.AnmStts").hasClass("A")) status = 2;
      else if ($("p.AnmStts").hasClass("B")) status = 3;

      return status;
    },
    genres: async ({ id }, _, ctx) => {
      const body = await getAnime(id, ctx);
      const $ = cheerio.load(body);

      return $("nav.Nvgnrs a").map((_, a) => {
        const $a = $(a);

        return {
          id: $a.attr("href").split("=")[1],
          name: $a.text()
        };
      });
    },
    episodes: async ({ id }, _, ctx) => {
      const body = await getAnime(id, ctx);

      const rawEpisodes = body.split("var episodes = ", 2)[1].split(";", 2)[0];

      return JSON.parse(rawEpisodes).map(arr => ({
        id: arr[1],
        n: arr[0],
        thumbnail: getThumbnail(id, arr[1])
      }));
    },
    nextEpisode: async ({ id }, _, ctx) => {
      const body = await getAnime(id, ctx);

      const rawInfo = body.split("var anime_info = ", 2)[1].split(";", 2)[0];

      return JSON.parse(rawInfo)[3] || null;
    }
  }
};
