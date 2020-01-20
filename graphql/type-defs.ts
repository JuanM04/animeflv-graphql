const { gql } = require("apollo-server-micro");

export default gql`
  scalar Date

  enum AnimeType {
    TV
    MOVIE
    SPECIAL
    OVA
  }

  enum AnimeStatus {
    RUNNING
    ENDED
    SOON
  }

  enum SourcesType {
    SUB
    LAT
  }

  type Anime {
    id: Int!
    name: String!
    slug: String!
    type: AnimeType!
    status: AnimeStatus!
    cover: String!
    synopsis: String!
    rating: Float!
    genres: [Genre!]!
    episodes: [Episode!]!
    nextEpisode: Date
  }

  type Genre {
    id: String!
    name: String!
  }

  type Episode {
    id: Int!
    n: Int!
    thumbnail: String!
  }

  type EpisodeSource {
    server: String!
    title: String!
    code: String!
  }

  type Query {
    anime(id: Int!): Anime
    search(query: String!): [Anime!]!
    explore(type: AnimeType, status: AnimeStatus): [Anime!]!
    episodeSources(
      episodeId: Int!
      episodeN: Int!
      animeSlug: String!
      type: SourcesType
    ): [EpisodeSource!]
  }
`;
