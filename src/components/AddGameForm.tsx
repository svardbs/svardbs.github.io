import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAddGame } from '@/hooks/useGames';
import { Plus, Loader2 } from 'lucide-react';

const formSchema = z.object({
  datum: z.string().min(1, 'Datum krävs'),
  spellaggare: z.string().min(1, 'Spelläggare krävs'),
  antal_deltagare: z.coerce.number().int().positive('Måste vara större än 0'),
  total_insats: z.coerce.number().min(0, 'Måste vara 0 eller högre'),
  antal_ratt: z.coerce.number().int().min(0, 'Måste vara 0 eller högre'),
  utdelning: z.coerce.number().min(0, 'Måste vara 0 eller högre'),
});

type FormValues = z.infer<typeof formSchema>;

export function AddGameForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addGame = useAddGame();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      datum: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      spellaggare: '',
      antal_deltagare: 1,
      total_insats: 0,
      antal_ratt: 0,
      utdelning: 0,
    },
  });
  
  async function onSubmit(values: FormValues) {
    try {
      await addGame.mutateAsync({
        datum: values.datum,
        spellaggare: values.spellaggare,
        antal_deltagare: values.antal_deltagare,
        total_insats: values.total_insats,
        antal_ratt: values.antal_ratt,
        utdelning: values.utdelning,
      });
      toast({
        title: 'Spelet har sparats',
        description: 'Statistiken har uppdaterats.',
      });
      form.reset();
      navigate('/');
    } catch (error) {
      toast({
        title: 'Fel',
        description: 'Kunde inte spara spelet. Försök igen.',
        variant: 'destructive',
      });
    }
  }
  
  return (
    <Card className="bg-card border-border max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Lägg till nytt spel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="datum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Datum</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spellaggare"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spelläggare</FormLabel>
                  <FormControl>
                    <Input placeholder="Ange namn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="antal_deltagare"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antal deltagare</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="total_insats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total insats (kr)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="antal_ratt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antal rätt</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="utdelning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Utdelning (kr)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={addGame.isPending}
            >
              {addGame.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sparar...
                </>
              ) : (
                'Spara spel'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
