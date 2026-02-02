import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { formatSEK, formatDecimal } from '@/lib/formatters';
import { GameStats, Game } from '@/hooks/useGames';
import { LineChart, Line, ResponsiveContainer, YAxis, ReferenceLine } from 'recharts';

interface StatsOverviewProps {
  stats: GameStats;
  games: Game[];
}

export function StatsOverview({ stats, games }: StatsOverviewProps) {
  const { totalProfit, totalBet, averagePerPerson, totalGamesPlayed, netTotal, averageParticipants } = stats;
  const roi = totalBet > 0 ? (netTotal / totalBet) * 100 : 0;

  // Calculate cumulative net total for sparkline (starting from 0)
  const chartData = [
    { value: 0 }, // Start at 0
    ...games
      .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
      .reduce((acc: { value: number }[], game) => {
        const previousTotal = acc.length > 0 ? acc[acc.length - 1].value : 0;
        const gameNet = game.utdelning - game.total_insats;
        acc.push({ value: previousTotal + gameNet });
        return acc;
      }, [])
  ];

  // Calculate domain for Y-axis
  const minValue = Math.min(...chartData.map(d => d.value));
  const maxValue = Math.max(...chartData.map(d => d.value));
  const yDomain = [Math.min(minValue, 0), Math.max(maxValue, 0)];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">IVEO Stryktipset</h1>
        <span className="text-sm text-muted-foreground">Period: 2026</span>
      </div>

      {/* Full width Netto card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Netto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className={`text-3xl font-bold ${netTotal >= 0 ? 'text-profit' : 'text-destructive'}`}>
                {formatSEK(netTotal)}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {totalGamesPlayed} spel · Snitt {averageParticipants} deltagare/spel
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Snitt per person: <span className={`text-sm ${averagePerPerson >= 0 ? 'text-profit' : 'text-destructive'}`}>{formatSEK(averagePerPerson)}</span>
              </div>
            </div>
            {chartData.length > 1 && (
              <div className="flex flex-col items-center">
                <div className="w-32 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <YAxis domain={yDomain} hide />
                      <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={netTotal >= 0 ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-xs text-muted-foreground mt-1">Trend</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Three column cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Utdelning
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-profit" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-profit">
              {formatSEK(totalProfit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Totalt utbetalt
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Insats
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatSEK(totalBet)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Totalt insats
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avkastning (ROI)
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${roi >= 0 ? 'text-profit' : 'text-destructive'}`}>
              {formatDecimal(roi)}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
