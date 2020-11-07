import { objectType, stringArg, arg, floatArg } from "@nexus/schema";
import cheerio from "cheerio";

import { AnimeGenre, AnimeStatus, AnimeType, SourcesType } from "./enums";
import Anime from "./Anime";
import EpisodeSource from "./EpisodeSource";

import { get } from "../utils/helpers";

export const explore = async ({
  query,
  type,
  status,
  genre,
}: {
  query?: string;
  type?: any;
  status?: any;
  genre?: any;
}) => {
  const body: string = await get(
    `browse`,
    query ? `q=${query}` : generateQuery({ type, status, genre })
  );

  const $ = cheerio.load(body);

  return $("article.Anime")
    .toArray()
    .map((anime) => {
      const $anime = $(anime);
      const url = $anime.find("a.Button").attr("href")?.split("/") as string[];
      const image = $anime.find("div.Image img");
      const imageUrl = (image.attr("src") || image.attr("data-cfsrc"))?.split(
        "/"
      ) as string[];
      const id = parseInt(imageUrl[imageUrl.length - 1].split(".")[0]);

      return {
        id,
        name: $anime.find("div.Title").text(),
        slug: url[url.length - 1],
        type: $anime.find("span.Type").attr("class")?.split(" ")[1],
        synopsis: $anime.find("div.Description p").last().text(),
        rating: parseFloat($anime.find("span.fa-star").text()),
      };
    });
};

function generateQuery(object: any) {
  let accum = "";
  for (const key in object) {
    if (object[key] == null || object[key] == []) continue;

    for (const item of object[key]) {
      accum += `&${key}[]=${item}`;
    }
  }
  return accum;
}

const Query = objectType({
  name: "Query",
  definition(t) {
    t.field("anime", {
      type: Anime,
      nullable: true,
      args: {
        slug: stringArg({ required: true }),
      },
      // @ts-ignore
      resolve: async (_, args, ctx) => {
        const body = await get(`anime/${args.slug}`);
        ctx.animeBody = body;

        const rawInfo = body
          .split("var anime_info = ", 2)[1]
          .replace(/&#039;/g, "'")
          .split(";", 2)[0];
        const info = JSON.parse(rawInfo);

        const $ = cheerio.load(body);

        return {
          id: parseInt(info[0]),
          name: info[1],
          slug: args.slug,
          type: $("span.Type")?.attr("class")?.split(" ")?.[1],
          synopsis: $("div.Description p").text(),
          rating: parseFloat($("#votes_prmd").text()),
        };
      },
    });
    t.list.field("search", {
      type: Anime,
      args: {
        query: stringArg({ required: true }),
      },
      // @ts-ignore
      resolve: (_, args) => explore(args),
    });
    t.list.field("explore", {
      type: Anime,
      args: {
        type: arg({
          type: AnimeType,
          list: true,
        }),
        status: arg({
          type: AnimeStatus,
          list: true,
        }),
        genre: arg({
          type: AnimeGenre,
          list: true,
        }),
      },
      // @ts-ignore
      resolve: (_, args) => explore(args),
    });
    t.list.field("episodeSources", {
      type: EpisodeSource,
      nullable: true,
      args: {
        animeSlug: stringArg({ required: true }),
        episodeN: floatArg({ required: true }),
        type: arg({ type: SourcesType }),
      },
      resolve: async (_, { episodeN, animeSlug, type }) => {
        const body = await get(`ver/${animeSlug}-${episodeN}`);

        const rawSources = body.split("var videos = ", 2)[1].split(";", 2)[0];
        const sources = JSON.parse(rawSources);

        return sources[type || "SUB"];
      },
    });
  },
});

export default Query;
