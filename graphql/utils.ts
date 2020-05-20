import cloudscraper from "cloudscraper";
import cheerio from "cheerio";
import { GraphQLError } from "graphql";

export const get = async (url: string, query?: string): Promise<string> => {
  try {
    let res = await cloudscraper({
      url: `https://animeflv.net${url}` + (query ? `?${query}` : ""),
      method: "GET"
    });
    return res;
  } catch (error) {
    throw new GraphQLError("Anime do not exist");
  }
};

export const getCover = (animeId: number) =>
  `https://animeflv.net/uploads/animes/covers/${animeId}.jpg`;

export const getBanner = (animeId: number) =>
  `https://animeflv.net/uploads/animes/banners/${animeId}.jpg`;

export const getThumbnail = (animeId: number, episodeN: number) =>
  `https://cdn.animeflv.net/screenshots/${animeId}/${episodeN}/th_3.jpg`;

export const imageUrlToBase64 = async url => {
  let res = await cloudscraper({
    url,
    method: "GET",
    encoding: null
  });

  return Buffer.from(res).toString("base64");
};

export const getAnime = async ({ slug }, ctx) => {
  if (ctx.animeBody) {
    return ctx.animeBody;
  } else {
    return await get(`/anime/${slug}`);
  }
};

export const explore = async ({ query, type, status, genre }) => {
  const body: string = await get(
    `/browse`,
    query ? `q=${query}` : generateQuery({ type, status, genre })
  );

  const $ = cheerio.load(body);

  return $("article.Anime").map((_, anime) => {
    const $anime = $(anime);
    const url = $anime
      .find("a.Button")
      .attr("href")
      .split("/");
    const image = $anime.find("div.Image img");
    const imageUrl = (image.attr("src") || image.attr("data-cfsrc")).split("/");
    const id = parseInt(imageUrl[imageUrl.length - 1].split(".")[0]);

    return {
      id,
      name: $anime.find("div.Title").text(),
      slug: url[url.length - 1],
      type: $anime
        .find("span.Type")
        .attr("class")
        .split(" ")[1],
      synopsis: $anime
        .find("div.Description p")
        .last()
        .text(),
      rating: parseFloat($anime.find("span.fa-star").text())
    };
  });
};

function generateQuery(object: object) {
  let accum = "";
  for (const key in object) {
    if (object[key] == null || object[key] == []) continue;

    for (const item of object[key]) {
      accum += `&${key}[]=${item}`;
    }
  }
  return accum;
}
