import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { AddGameForm } from '@/components/AddGameForm';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminAddGame() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AddGameForm />
      </main>
    </div>
  );
}
