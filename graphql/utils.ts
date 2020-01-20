import cloudscraper from "cloudscraper";
import cheerio from "cheerio";
import { GraphQLError } from "graphql";

export const get = async (url: string, query?: any): Promise<string> => {
  try {
    let res = await cloudscraper({
      url: "https://animeflv.net" + url,
      method: "GET",
      qs: query || {}
    });
    return res;
  } catch (error) {
    throw new GraphQLError("Anime do not exist");
  }
};

export const getCover = (animeId: number) =>
  `https://animeflv.net/uploads/animes/covers/${animeId}.jpg`;

export const getThumbnail = (animeId: number, episodeN: number) =>
  `https://cdn.animeflv.net/screenshots/${animeId}/${episodeN}/th_3.jpg`;

export const getAnime = async (id: number, ctx) => {
  if (ctx.animeBody) {
    return ctx.animeBody;
  } else {
    return await get(`/anime/${id}/-`);
  }
};

export const explore = async ({ query, type, status }) => {
  const body: string = await get(
    `/browse`,
    query ? { q: query } : { type, status }
  );

  const $ = cheerio.load(body);

  return $("article.Anime").map((_, anime) => {
    const $anime = $(anime);
    const url = $anime
      .find("a.Button")
      .attr("href")
      .split("/");
    const id = parseInt(url[url.length - 2]);

    return {
      id,
      name: $anime.find("div.Title").text(),
      slug: url[url.length - 1],
      type: $anime
        .find("span.Type")
        .attr("class")
        .split(" ")[1]
        .toUpperCase(),
      cover: getCover(id),
      synopsis: $anime
        .find("div.Description p")
        .last()
        .text(),
      rating: parseFloat($anime.find("span.fa-star").text())
    };
  });
};
