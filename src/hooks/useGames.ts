import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Game {
  id: string;
  spellaggare: string;
  antal_deltagare: number;
  total_insats: number;
  antal_ratt: number;
  utdelning: number;
  created_at: string;
}

export interface NewGame {
  spellaggare: string;
  antal_deltagare: number;
  total_insats: number;
  antal_ratt: number;
  utdelning: number;
}

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: async (): Promise<Game[]> => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useAddGame() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newGame: NewGame) => {
      const { data, error } = await supabase
        .from('games')
        .insert([newGame])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}

export interface GameStats {
  totalProfit: number;
  totalLoss: number;
  averagePerPerson: number;
  totalGamesPlayed: number;
}

export function calculateGameStats(games: Game[]): GameStats {
  let totalProfit = 0;
  let totalLoss = 0;
  let totalGamesPlayed = games.length;
  let averagePerPerson = 0;

  games.forEach((game) => {
    const result = game.utdelning - game.total_insats;

    if (result >= 0) {
      totalProfit += result;
    } else {
      totalLoss += result;
    }

    if (game.antal_deltagare > 0) {
      averagePerPerson += result / game.antal_deltagare;
    }
  });

  return {
    totalProfit,
    totalLoss,
    averagePerPerson,
    totalGamesPlayed,
  };
}

export interface LeaderboardEntry {
  spellaggare: string;
  value: number;
}

export function getLeaderboard(games: Game[], type: 'antal_ratt' | 'utdelning'): LeaderboardEntry[] {
  // Get highest value per player for the specified type
  const playerBest = new Map<string, number>();
  
  games.forEach((game) => {
    const key = game.spellaggare.toLowerCase();
    const value = type === 'antal_ratt' ? game.antal_ratt : game.utdelning;
    const current = playerBest.get(key) || 0;
    if (value > current) {
      playerBest.set(key, value);
    }
  });
  
  // Find original casing for display
  const playerNames = new Map<string, string>();
  games.forEach((game) => {
    const key = game.spellaggare.toLowerCase();
    if (!playerNames.has(key)) {
      playerNames.set(key, game.spellaggare);
    }
  });
  
  // Convert to array and sort
  const entries: LeaderboardEntry[] = [];
  playerBest.forEach((value, key) => {
    entries.push({
      spellaggare: playerNames.get(key) || key,
      value,
    });
  });
  
  return entries
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}
