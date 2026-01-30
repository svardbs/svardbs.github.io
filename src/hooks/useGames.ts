import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

export function useGames() {
  return useQuery({
    queryKey: ['games'],
    queryFn: async (): Promise<Game[]> => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('datum', { ascending: false });

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

export function useDeleteGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameId: string) => {
      console.log(gameId);
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);

        if (error) throw error;
      return gameId;
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
