import cheerio from "cheerio";
import {
  get,
  getCover,
  getBanner,
  getThumbnail,
  imageUrlToBase64,
  getAnime,
  explore
} from "../utils";

export default {
  Query: {
    anime: async (_, { slug }, ctx) => {
      const body = await getAnime({ slug }, ctx);

      const rawInfo = body.split("var anime_info = ", 2)[1].split(";", 2)[0];
      const info = JSON.parse(rawInfo);

      const $ = cheerio.load(body);

      return {
        id: parseInt(info[0]),
        name: info[1],
        slug,
        type: $("span.Type")
          .attr("class")
          .split(" ")[1],
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
    cover: async ({ id }) => imageUrlToBase64(getCover(id)),
    banner: async ({ id }) => imageUrlToBase64(getBanner(id)),
    status: async (args, _, ctx) => {
      const body = await getAnime(args, ctx);
      const $ = cheerio.load(body);

      let status = 1;
      if ($("p.AnmStts").hasClass("A")) status = 2;
      else if ($("p.AnmStts").hasClass("B")) status = 3;

      return status;
    },
    genres: async (args, _, ctx) => {
      const body = await getAnime(args, ctx);
      const $ = cheerio.load(body);

      return $("nav.Nvgnrs a").map((_, a) => {
        const $a = $(a);
        return $a.attr("href").split("=")[1];
      });
    },
    episodes: async (args, _, ctx) => {
      const body = await getAnime(args, ctx);

      const rawEpisodes = body.split("var episodes = ", 2)[1].split(";", 2)[0];

      return JSON.parse(rawEpisodes).map(arr => ({
        id: arr[1],
        n: arr[0],
        thumbnail: getThumbnail(args.id, arr[0])
      }));
    },
    nextEpisode: async (args, _, ctx) => {
      const body = await getAnime(args, ctx);

      const rawInfo = body.split("var anime_info = ", 2)[1].split(";", 2)[0];

      return JSON.parse(rawInfo)[3] || null;
    }
  },
  Episode: {
    thumbnail: async ({ thumbnail }) => imageUrlToBase64(thumbnail)
  }
};
