import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRound } from 'lucide-react';
import { formatSEK } from '@/lib/formatters';
import { Game } from '@/hooks/useGames';

interface SpellaggareSummaryProps {
  games: Game[];
}

interface SummaryRow {
  spellaggare: string;
  totalInsats: number;
  totalUtdelning: number;
  diff: number;
  gameCount: number;
}

function buildSummary(games: Game[]): SummaryRow[] {
  const map = new Map<string, SummaryRow>();

  games.forEach((game) => {
    const existing = map.get(game.spellaggare) ?? {
      spellaggare: game.spellaggare,
      totalInsats: 0,
      totalUtdelning: 0,
      diff: 0,
      gameCount: 0,
    };
    existing.totalInsats += game.total_insats;
    existing.totalUtdelning += game.utdelning;
    existing.gameCount += 1;
    map.set(game.spellaggare, existing);
  });

  return Array.from(map.values())
    .map((row) => ({ ...row, diff: row.totalUtdelning - row.totalInsats }))
    .sort((a, b) => b.diff - a.diff);
}

export function SpellaggareSummary({ games }: SpellaggareSummaryProps) {
  const rows = buildSummary(games);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-primary" />
          Sammanfattning per spelläggare
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Inga spel registrerade ännu
          </div>
        ) : (
          <div className="space-y-3">
            <div className="hidden sm:grid grid-cols-[1fr_repeat(3,minmax(0,1fr))] gap-4 px-4 text-xs uppercase tracking-wide text-muted-foreground">
              <span>Spelläggare</span>
              <span className="text-right">Total insats</span>
              <span className="text-right">Total utdelning</span>
              <span className="text-right">Diff</span>
            </div>
            {rows.map((row) => (
              <div
                key={row.spellaggare}
                className="grid grid-cols-2 sm:grid-cols-[1fr_repeat(3,minmax(0,1fr))] gap-2 sm:gap-4 items-center p-4 rounded-lg bg-secondary/30"
              >
                <div>
                  <p className="font-medium">{row.spellaggare}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.gameCount} {row.gameCount === 1 ? 'spel' : 'spel'}
                  </p>
                </div>
                <div className="text-right sm:order-none order-2">
                  <p className="sm:hidden text-xs text-muted-foreground">Insats</p>
                  <p className="font-medium">{formatSEK(row.totalInsats)}</p>
                </div>
                <div className="text-right sm:order-none order-3">
                  <p className="sm:hidden text-xs text-muted-foreground">Utdelning</p>
                  <p className="font-medium">{formatSEK(row.totalUtdelning)}</p>
                </div>
                <div className="text-right sm:order-none order-4">
                  <p className="sm:hidden text-xs text-muted-foreground">Diff</p>
                  <p
                    className={`font-bold ${
                      row.diff >= 0 ? 'text-profit' : 'text-destructive'
                    }`}
                  >
                    {row.diff > 0 ? '+' : ''}
                    {formatSEK(row.diff)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
