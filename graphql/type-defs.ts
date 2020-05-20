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

  enum AnimeGenre {
    ACCION
    ARTES_MARCIALES
    AVENTURA
    CARRERAS
    CIENCIA_FICCION
    COMEDIA
    DEMENCIA
    DEMONIOS
    DEPORTES
    DRAMA
    ECCHI
    ESCOLARES
    ESPACIAL
    FANTASIA
    HAREM
    HISTORICO
    INFANTIL
    JOSEI
    JUEGOS
    MAGIA
    MECHA
    MILITAR
    MISTERIO
    MUSICA
    PARODIA
    POLICIA
    PSICOLOGICO
    RECUENTOS_DE_LA_VIDA
    ROMANCE
    SAMURAI
    SEINEN
    SHOUJO
    SHOUNEN
    SOBRENATURAL
    SUPERPODERES
    SUSPENSO
    TERROR
    VAMPIROS
    YAOI
    YURI
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
    banner: String!
    synopsis: String!
    rating: Float!
    genres: [AnimeGenre!]!
    episodes: [Episode!]!
    nextEpisode: Date
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
    anime(id: Int, slug: String!): Anime
    search(query: String!): [Anime!]!
    explore(
      type: [AnimeType!]
      status: [AnimeStatus!]
      genre: [AnimeGenre!]
    ): [Anime!]!
    episodeSources(
      episodeId: Int!
      episodeN: Int!
      animeSlug: String!
      type: SourcesType
    ): [EpisodeSource!]
  }
`;

/**
 * *AnimeGenre
 *
 * Acción                 accion
 * Artes Marciales        artes-marciales
 * Aventuras              aventura
 * Carreras               carreras
 * Ciencia Ficción        ciencia-ficcion
 * Comedia                comedia
 * Demencia               demencia
 * Demonios               demonios
 * Deportes               deportes
 * Drama                  drama
 * Ecchi                  ecchi
 * Escolares              escolares
 * Espacial               espacial
 * Fantasía               fantasia
 * Harem                  harem
 * Historico              historico
 * Infantil               infantil
 * Josei                  josei
 * Juegos                 juegos
 * Magia                  magia
 * Mecha                  mecha
 * Militar                militar
 * Misterio               misterio
 * Música                 musica
 * Parodia                parodia
 * Policía                policia
 * Psicológico            psicologico
 * Recuentos de la vida   recuentos-de-la-vida
 * Romance                romance
 * Samurai                samurai
 * Seinen                 seinen
 * Shoujo                 shoujo
 * Shounen                shounen
 * Sobrenatural           sobrenatural
 * Superpoderes           superpoderes
 * Suspenso               suspenso
 * Terror                 terror
 * Vampiros               vampiros
 * Yaoi                   yaoi
 * Yuri                   yuri
 */
