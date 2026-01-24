import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { Leaderboard } from '@/components/Leaderboard';
import { GameHistory } from '@/components/GameHistory';
import { useGames, calculateGameStats, getLeaderboard } from '@/hooks/useGames';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { data: games = [], isLoading, error } = useGames();
  
  const stats = calculateGameStats(games);
  const antalRattLeaderboard = getLeaderboard(games, 'antal_ratt');
  const utdelningLeaderboard = getLeaderboard(games, 'utdelning');

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-destructive">
            Ett fel uppstod vid hämtning av data. Försök igen senare.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {isLoading ? (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-96" />
            <Skeleton className="h-64" />
          </div>
        ) : (
          <>
            <StatsOverview stats={stats} />
            <div className="grid gap-8 lg:grid-cols-2">
              <Leaderboard 
                antalRattLeaderboard={antalRattLeaderboard} 
                utdelningLeaderboard={utdelningLeaderboard} 
              />
              <GameHistory games={games} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
