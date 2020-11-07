import { enumType } from "@nexus/schema";

export const AnimeGenre = enumType({
  name: "AnimeGenre",
  members: {
    ACCION: "accion",
    ARTES_MARCIALES: "artes-marciales",
    AVENTURA: "aventura",
    CARRERAS: "carreras",
    CIENCIA_FICCION: "ciencia-ficcion",
    COMEDIA: "comedia",
    DEMENCIA: "demencia",
    DEMONIOS: "demonios",
    DEPORTES: "deportes",
    DRAMA: "drama",
    ECCHI: "ecchi",
    ESCOLARES: "escolares",
    ESPACIAL: "espacial",
    FANTASIA: "fantasia",
    HAREM: "harem",
    HISTORICO: "historico",
    INFANTIL: "infantil",
    JOSEI: "josei",
    JUEGOS: "juegos",
    MAGIA: "magia",
    MECHA: "mecha",
    MILITAR: "militar",
    MISTERIO: "misterio",
    MUSICA: "musica",
    PARODIA: "parodia",
    POLICIA: "policia",
    PSICOLOGICO: "psicologico",
    RECUENTOS_DE_LA_VIDA: "recuentos-de-la-vida",
    ROMANCE: "romance",
    SAMURAI: "samurai",
    SEINEN: "seinen",
    SHOUJO: "shoujo",
    SHOUNEN: "shounen",
    SOBRENATURAL: "sobrenatural",
    SUPERPODERES: "superpoderes",
    SUSPENSO: "suspenso",
    TERROR: "terror",
    VAMPIROS: "vampiros",
    YAOI: "yaoi",
    YURI: "yuri",
  },
});

export const AnimeStatus = enumType({
  name: "AnimeStatus",
  members: {
    RUNNING: 1,
    ENDED: 2,
    SOON: 3,
  },
});

export const AnimeType = enumType({
  name: "AnimeType",
  members: {
    TV: "tv",
    MOVIE: "movie",
    SPECIAL: "special",
    OVA: "ova",
  },
});

export const SourcesType = enumType({
  name: "SourcesType",
  members: ["SUB", "LAT"],
});
