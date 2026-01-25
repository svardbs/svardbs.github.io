import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Award, Medal } from 'lucide-react';
import { formatSEK } from '@/lib/formatters';
import { LeaderboardEntry } from '@/hooks/useGames';

interface LeaderboardProps {
  antalRattLeaderboard: LeaderboardEntry[];
  utdelningLeaderboard: LeaderboardEntry[];
}

function getRankIcon(rank: number) {
  if (rank === 0) return <Trophy className="h-5 w-5 text-gold" />;
  if (rank === 1) return <Medal className="h-5 w-5 text-silver" />;
  if (rank === 2) return <Award className="h-5 w-5 text-bronze" />;
  return <span className="w-5 text-center text-muted-foreground">{rank + 1}</span>;
}

function LeaderboardList({ entries, type }: { entries: LeaderboardEntry[]; type: 'antal_ratt' | 'utdelning' }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Inga spel med utdelning ännu
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <div 
        key={`${entry.spellaggare}-${index}`}
        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
            index < 3 ? 'bg-accent/50' : 'bg-secondary/30'
          }`}
        >
          <div className="flex items-center gap-3">
            {getRankIcon(index)}
            <span className="font-medium">{entry.spellaggare}</span>
          </div>
          <span className={`font-bold ${type === 'utdelning' ? 'text-profit' : 'text-primary'}`}>
            {type === 'utdelning' ? formatSEK(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Leaderboard({ antalRattLeaderboard, utdelningLeaderboard }: LeaderboardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="antal_ratt" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="antal_ratt">Antal rätt</TabsTrigger>
            <TabsTrigger value="utdelning">Utdelning</TabsTrigger>
          </TabsList>
          <TabsContent value="antal_ratt">
            <LeaderboardList entries={antalRattLeaderboard} type="antal_ratt" />
          </TabsContent>
          <TabsContent value="utdelning">
            <LeaderboardList entries={utdelningLeaderboard} type="utdelning" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
