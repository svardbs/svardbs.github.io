import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { History, ChevronDown, Users, Coins, Calculator, X } from 'lucide-react';
import { formatSEK, formatDate, formatDecimal } from '@/lib/formatters';
import { Game } from '@/hooks/useGames';
import { useDeleteGame } from '@/hooks/useGames';

interface GameHistoryProps {
  games: Game[];
}

function GameRow({ game }: { game: Game }) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteGame, isLoading } = useDeleteGame()

  const result = game.utdelning - game.total_insats;
  const utdelningPerDeltagare = game.antal_deltagare > 0 
    ? game.utdelning / game.antal_deltagare 
    : 0;
  
  const handleDelete = (e: React.MouseEvent) => {
    console.log('click');
    e.stopPropagation();
    deleteGame(game.id);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="text-left">
              <p className="font-medium">{game.spellaggare}</p>
              <p className="text-sm text-muted-foreground">{formatDate(game.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Antal rätt</p>
              <p className="font-medium text-primary">{game.antal_ratt}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Utdelning</p>
              <p className={`font-medium ${result >= 0 ? 'text-profit' : 'text-destructive'}`}>
                {formatSEK(game.utdelning)}
              </p>
            </div>
            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 p-4 rounded-lg bg-accent/30 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Antal deltagare</p>
              <p className="font-medium">{game.antal_deltagare}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total insats</p>
              <p className="font-medium">{formatSEK(game.total_insats)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Utdelning per deltagare</p>
              <p className="font-medium">{formatSEK(utdelningPerDeltagare)}</p>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function GameHistory({ games }: GameHistoryProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Spelhistorik
        </CardTitle>
      </CardHeader>
      <CardContent>
        {games.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Inga spel registrerade ännu
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game) => (
              <GameRow key={game.id} game={game} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
