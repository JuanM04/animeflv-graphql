import cloudscraper from "cloudscraper";
import { GraphQLError } from "graphql";

export const ANIMEFLV_URL = "https://www3.animeflv.net/";

export const get = async (url: string, query?: string): Promise<string> => {
  try {
    let res = await cloudscraper({
      url: ANIMEFLV_URL + url + (query ? `?${query}` : ""),
      method: "GET",
    });
    return res;
  } catch (error) {
    throw new GraphQLError("Anime do not exist");
  }
};

export const imageUrlToBase64 = async (url: string) => {
  let res = await cloudscraper({
    url,
    method: "GET",
    encoding: null,
  });

  return Buffer.from(res).toString("base64");
};
