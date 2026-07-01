import type { Episode, MediaDetails, MediaItem, MediaType } from "../../types/media";

const MOCK_DELAY_MS = {
  continueWatching: 400,
  details: 500,
  popularSeries: 700,
  recentlyAdded: 800,
  search: 500,
  trendingMovies: 600,
} as const;

const mediaTypeSearchLabels: Record<MediaType, string[]> = {
  movie: ["movie", "film"],
  series: ["series", "show", "tv"],
};

function createEpisodes(
  seasonId: string,
  titles: Array<{ title: string; description: string }>,
): Episode[] {
  return titles.map((episode, index) => ({
    id: `${seasonId}-e${index + 1}`,
    seasonId,
    episodeNumber: index + 1,
    title: episode.title,
    description: episode.description,
  }));
}

// Pre-define 12 mock media items for local discovery
const MOCK_DATA: MediaDetails[] = [
  {
    id: "m1",
    type: "movie",
    title: "Cyberpunk: Edge of Reality",
    year: "2024",
    genres: [{ id: "g1", name: "Sci-Fi" }, { id: "g2", name: "Action" }],
    rating: 8.7,
    description: "In a dystopian future, a rogue AI hunter must team up with their prey to uncover a conspiracy that threatens the entire digital consciousness.",
    posterUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=1200&q=80",
    runtime: 124,
    director: "Alex Proyas",
    cast: ["Keanu Reeves", "Charlize Theron", "Idris Elba"]
  },
  {
    id: "s1",
    type: "series",
    title: "Neon Skies",
    year: "2023",
    genres: [{ id: "g1", name: "Sci-Fi" }, { id: "g3", name: "Drama" }],
    rating: 9.1,
    description: "A group of smugglers navigating the treacherous asteroid belts of the outer rim must decide between saving themselves or saving humanity.",
    posterUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    runtime: 45,
    seasons: [
      {
        id: "s1-s1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: createEpisodes("s1-s1", [
          {
            title: "Signal in the Static",
            description: "The crew follows a corrupted distress beacon into restricted space.",
          },
          {
            title: "Gravity Debt",
            description: "A stolen cargo run puts the smugglers at odds with a ruthless broker.",
          },
          {
            title: "Neon Horizon",
            description: "A hidden map reveals a route that could change the outer colonies.",
          },
        ]),
      },
    ],
    watchProgress: { mediaId: "s1", mediaType: "series", progressPercentage: 45, progressSeconds: 1215, durationSeconds: 2700, lastWatchedAt: new Date().toISOString() }
  },
  {
    id: "m2",
    type: "movie",
    title: "The Silent Forest",
    year: "2022",
    genres: [{ id: "g4", name: "Thriller" }, { id: "g5", name: "Mystery" }],
    rating: 7.8,
    description: "A detective returns to her hometown to solve a series of disappearances in the dense, silent woods.",
    posterUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&q=80",
    runtime: 110,
  },
  {
    id: "m3",
    type: "movie",
    title: "Velocity",
    year: "2025",
    genres: [{ id: "g2", name: "Action" }, { id: "g4", name: "Thriller" }],
    rating: 6.9,
    description: "An underground street racer gets caught up in a high-stakes heist.",
    posterUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80",
    runtime: 98,
    watchProgress: { mediaId: "m3", mediaType: "movie", progressPercentage: 80, progressSeconds: 4704, durationSeconds: 5880, lastWatchedAt: new Date().toISOString() }
  },
  {
    id: "s2",
    type: "series",
    title: "Chronicles of the Ancients",
    year: "2021",
    genres: [{ id: "g6", name: "Fantasy" }, { id: "g2", name: "Action" }],
    rating: 8.5,
    description: "Epic fantasy detailing the fall of the last great empire of magic.",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=1200&q=80",
    runtime: 52,
    seasons: [
      {
        id: "s2-s1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: createEpisodes("s2-s1", [
          {
            title: "Ashes of the First Gate",
            description: "A young archivist finds proof that the empire's origin story is false.",
          },
          {
            title: "The Hollow Crown",
            description: "Rival houses gather as forbidden magic returns to the capital.",
          },
          {
            title: "Storm Over Vaelor",
            description: "An ancient pact forces enemies to defend the same city walls.",
          },
        ]),
      },
    ]
  },
  {
    id: "m4",
    type: "movie",
    title: "Midnight in Tokyo",
    year: "2024",
    genres: [{ id: "g7", name: "Romance" }, { id: "g3", name: "Drama" }],
    rating: 8.2,
    description: "Two strangers connect over one fleeting, sleepless night in the neon-lit streets of Tokyo.",
    posterUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
    runtime: 105,
  },
  {
    id: "m5",
    type: "movie",
    title: "The Horizon Event",
    year: "2023",
    genres: [{ id: "g1", name: "Sci-Fi" }],
    rating: 7.5,
    description: "A crew of explorers travels to the edge of a black hole, only to realize the real danger is inside their ship.",
    posterUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1200&q=80",
    runtime: 140,
  },
  {
    id: "s3",
    type: "series",
    title: "Culinary Masters",
    year: "2022",
    genres: [{ id: "g8", name: "Documentary" }],
    rating: 9.0,
    description: "Explore the kitchens of the most renowned chefs in the world.",
    posterUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    runtime: 42,
    seasons: [
      {
        id: "s3-s1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: createEpisodes("s3-s1", [
          {
            title: "Fire and Steel",
            description: "A coastal kitchen builds a menu around flame, smoke, and local catch.",
          },
          {
            title: "The Quiet Table",
            description: "A tiny mountain restaurant proves how restraint can define a dish.",
          },
        ]),
      },
      {
        id: "s3-s2",
        seasonNumber: 2,
        title: "Season 2",
        episodes: createEpisodes("s3-s2", [
          {
            title: "Market at Dawn",
            description: "Chefs race through a morning market to design a single perfect plate.",
          },
          {
            title: "Pressure Service",
            description: "A legendary dinner service tests timing, trust, and improvisation.",
          },
        ]),
      },
    ]
  },
  {
    id: "m6",
    type: "movie",
    title: "Desert Sands",
    year: "2021",
    genres: [{ id: "g2", name: "Action" }, { id: "g9", name: "Adventure" }],
    rating: 6.5,
    description: "A treasure hunter seeks a lost city buried under the dunes.",
    posterUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80",
    runtime: 115,
  },
  {
    id: "s4",
    type: "series",
    title: "Tech Valley",
    year: "2025",
    genres: [{ id: "g10", name: "Comedy" }, { id: "g3", name: "Drama" }],
    rating: 8.8,
    description: "A satirical look at the absurdity of a fast-growing startup.",
    posterUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80",
    watchProgress: { mediaId: "s4", mediaType: "series", progressPercentage: 15, progressSeconds: 405, durationSeconds: 2700, lastWatchedAt: new Date().toISOString() },
    runtime: 31,
    seasons: [
      {
        id: "s4-s1",
        seasonNumber: 1,
        title: "Season 1",
        episodes: createEpisodes("s4-s1", [
          {
            title: "Minimum Viable Chaos",
            description: "A product demo derails when the team's prototype starts predicting layoffs.",
          },
          {
            title: "Burn Rate",
            description: "The founders scramble to impress investors without admitting the numbers.",
          },
          {
            title: "Launch Window",
            description: "A public release forces everyone to choose between polish and survival.",
          },
        ]),
      },
    ]
  },
  {
    id: "m7",
    type: "movie",
    title: "Spectral",
    year: "2020",
    genres: [{ id: "g11", name: "Horror" }, { id: "g4", name: "Thriller" }],
    rating: 7.1,
    description: "A family moves into a house with a dark past, and the entities within refuse to let them leave.",
    posterUrl: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=1200&q=80",
    runtime: 95,
  },
  {
    id: "m8",
    type: "movie",
    title: "The Final Note",
    year: "2026",
    genres: [{ id: "g3", name: "Drama" }, { id: "g12", name: "Music" }],
    rating: 9.3,
    description: "An aging composer struggles to finish his masterpiece before his memory completely fades.",
    posterUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&q=80",
    runtime: 130,
  }
];

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockMediaService = {
  getTrendingMovies: async (): Promise<MediaItem[]> => {
    await delay(MOCK_DELAY_MS.trendingMovies);
    return MOCK_DATA.filter(m => m.type === "movie").slice(0, 6);
  },

  getPopularSeries: async (): Promise<MediaItem[]> => {
    await delay(MOCK_DELAY_MS.popularSeries);
    return MOCK_DATA.filter(m => m.type === "series").slice(0, 6);
  },

  getContinueWatching: async (): Promise<MediaItem[]> => {
    await delay(MOCK_DELAY_MS.continueWatching);
    return MOCK_DATA.filter(m => m.watchProgress).sort((a, b) => {
      const dateA = new Date(a.watchProgress!.lastWatchedAt).getTime();
      const dateB = new Date(b.watchProgress!.lastWatchedAt).getTime();
      return dateB - dateA;
    });
  },

  getRecentlyAdded: async (): Promise<MediaItem[]> => {
    await delay(MOCK_DELAY_MS.recentlyAdded);
    return [...MOCK_DATA].sort((a, b) => parseInt(b.year || "0") - parseInt(a.year || "0")).slice(0, 8);
  },

  searchMedia: async (query: string): Promise<MediaItem[]> => {
    await delay(MOCK_DELAY_MS.search);
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return MOCK_DATA.filter(m => 
      m.title.toLowerCase().includes(q) || 
      m.description?.toLowerCase().includes(q) ||
      m.genres?.some(g => g.name.toLowerCase().includes(q)) ||
      m.year?.includes(q) ||
      mediaTypeSearchLabels[m.type].some((label) => label.includes(q))
    );
  },

  getMediaDetails: async (type: MediaType, id: string): Promise<MediaDetails> => {
    await delay(MOCK_DELAY_MS.details);
    const media = MOCK_DATA.find(m => m.id === id && m.type === type);
    if (!media) {
      throw new Error("Media not found");
    }
    return media;
  }
};
