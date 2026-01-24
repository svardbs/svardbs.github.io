import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLogin() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/add-game');
    }
  }, [isAdmin, navigate]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <LoginForm />
      </main>
    </div>
  );
}
