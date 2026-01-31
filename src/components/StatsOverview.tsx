import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { formatSEK, formatDecimal } from '@/lib/formatters';
import { GameStats } from '@/hooks/useGames';

interface StatsOverviewProps {
  stats: GameStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const { totalProfit, totalLoss, averagePerPerson, totalGamesPlayed, netTotal, averageParticipants } = stats;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
            Total utdelning
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-profit" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-profit">
            {formatSEK(totalProfit)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
            Total insats
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {formatSEK(totalLoss)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
            Resultat
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netTotal >= 0 ? 'text-profit' : 'text-destructive'}`}>
            {formatSEK(netTotal)}
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">Genomsnitt per person totalt</p>
            <div className={`text-xl font-semibold ${averagePerPerson >= 0 ? 'text-profit' : 'text-destructive'}`}>
              {formatSEK(averagePerPerson)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalGamesPlayed} spel totalt. Genomsnitt {averageParticipants} deltagare per spel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
