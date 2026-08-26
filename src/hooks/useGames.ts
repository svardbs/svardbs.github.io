import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

export interface Game {
  id: string;
  datum: string;
  spellaggare: string;
  antal_deltagare: number;
  total_insats: number;
  antal_ratt: number;
  utdelning: number;
}

export interface NewGame {
  datum: string;
  spellaggare: string;
  antal_deltagare: number;
  total_insats: number;
  antal_ratt: number;
  utdelning: number;
}

const gamesCollection = collection(db, 'games');

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: async (): Promise<Game[]> => {
      const snapshot = await getDocs(query(gamesCollection, orderBy('datum', 'desc')));
      return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Game, 'id'>) }));
    },
  });
}

export function useAddGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGame: NewGame) => {
      const docRef = await addDoc(gamesCollection, {
        ...newGame,
        created_at: serverTimestamp(),
      });
      return { id: docRef.id, ...newGame };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}

export function useDeleteGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameId: string) => {
      await deleteDoc(doc(db, 'games', gameId));
      return gameId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}


export interface GameStats {
  totalProfit: number;
  totalBet: number;
  averagePerPerson: number;
  averagePerPersonPerGame: number;
  totalGamesPlayed: number;
  netTotal: number;
  averageParticipants: number;
}

export function calculateGameStats(games: Game[]): GameStats {
  let totalProfit = 0;
  let totalBet = 0;
  const totalGamesPlayed = games.length;
  let allParticipants = 0;

  games.forEach((game) => {
    totalProfit += game.utdelning;
    totalBet += game.total_insats;
    allParticipants += game.antal_deltagare;
  });

  const netTotal = totalProfit - totalBet;
  const averageParticipants = totalGamesPlayed > 0
    ? Math.round(allParticipants / totalGamesPlayed)
    : 0;
  const averagePerPerson = averageParticipants > 0
    ? Math.floor(netTotal / averageParticipants)
    : 0;
  const averagePerPersonPerGame = totalGamesPlayed > 0
    ? Math.floor(averagePerPerson / totalGamesPlayed)
    : 0;

  return {
    totalProfit,
    totalBet,
    averagePerPerson,
    averagePerPersonPerGame,
    totalGamesPlayed,
    netTotal,
    averageParticipants
  };
}

const SEASON_START_MONTH = 7; // August (0-indexed)

export function getSeason(datum: string): string {
  const date = new Date(datum);
  const year = date.getFullYear();
  const startYear = date.getMonth() >= SEASON_START_MONTH ? year : year - 1;
  return `${startYear}/${startYear + 1}`;
}

export function getCurrentSeason(): string {
  return getSeason(new Date().toISOString());
}

export interface LeaderboardEntry {
  spellaggare: string;
  value: number;
}

export function getLeaderboard(
  games: Game[],
  type: 'antal_ratt' | 'utdelning'
): LeaderboardEntry[] {
  return games
    .map((game) => ({
      spellaggare: game.spellaggare,
      value: type === 'antal_ratt' ? game.antal_ratt : game.utdelning,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}
