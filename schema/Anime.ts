import { objectType } from "@nexus/schema";
import cheerio from "cheerio";

import { AnimeType, AnimeGenre, AnimeStatus } from "./enums";
import Episode from "./Episode";

import { imageUrlToBase64, get, ANIMEFLV_URL } from "../utils/helpers";
import { NexusGenEnums } from "../generated/nexus";

const getAnime = async (slug: string | null | undefined, ctx: any) => {
  if (ctx.animeBody) {
    return ctx.animeBody;
  } else {
    return await get(`anime/${slug}`);
  }
};

const Anime = objectType({
  name: "Anime",
  definition(t) {
    t.int("id", { deprecation: "Better use `slug`" });
    t.string("slug");
    t.string("name");
    t.field("type", { type: AnimeType });
    t.field("status", {
      type: AnimeStatus,
      resolve: async ({ slug }, _, ctx) => {
        const body = await getAnime(slug, ctx);
        const $ = cheerio.load(body);

        let status = 1;
        if ($("p.AnmStts").hasClass("A")) status = 2;
        else if ($("p.AnmStts").hasClass("B")) status = 3;

        return status as NexusGenEnums["AnimeStatus"];
      },
    });
    t.string("cover", {
      resolve: (anime) =>
        imageUrlToBase64(
          `${ANIMEFLV_URL}/uploads/animes/covers/${anime.id}.jpg`
        ),
    });
    t.string("coverURL", {
      resolve: (anime) =>
        `${ANIMEFLV_URL}/uploads/animes/covers/${anime.id}.jpg`,
    });
    t.string("banner", {
      resolve: (anime) =>
        imageUrlToBase64(
          `${ANIMEFLV_URL}/uploads/animes/banners/${anime.id}.jpg`
        ),
    });
    t.string("bannerURL", {
      resolve: (anime) =>
        `${ANIMEFLV_URL}/uploads/animes/banners/${anime.id}.jpg`,
    });
    t.string("synopsis");
    t.float("rating");
    t.list.field("genres", {
      type: AnimeGenre,
      resolve: async ({ slug }, _, ctx) => {
        const body = await getAnime(slug, ctx);
        const $ = cheerio.load(body);

        return $("nav.Nvgnrs a")
          .toArray()
          .map((_, a) => {
            const $a = $(a);
            return $a.attr("href")?.split("=")[1];
          }) as NexusGenEnums["AnimeGenre"][];
      },
    });
    t.list.field("episodes", {
      type: Episode,
      resolve: async ({ id, slug }, _, ctx) => {
        const body = await getAnime(slug, ctx);

        const rawEpisodes = body
          .split("var episodes = ", 2)[1]
          .split(";", 2)[0];

        return JSON.parse(rawEpisodes).map((arr: number[]) => ({
          id: arr[1],
          n: arr[0],
          anime: { id, slug },
        }));
      },
    });
    t.date("nextEpisode", {
      nullable: true,
      resolve: async ({ slug }, _, ctx) => {
        const body = await getAnime(slug, ctx);

        const rawInfo = body
          .split("var anime_info = ", 2)[1]
          .replace(/&#039;/g, "'")
          .split(";", 2)[0];

        return JSON.parse(rawInfo)[3] || null;
      },
    });
  },
});

export default Anime;
