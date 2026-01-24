import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Shield } from 'lucide-react';
import stryktipsetLogo from '@/assets/stryktipset_logo.svg';
import stryktipsetTextLogo from '@/assets/stryktipset_text_logo.svg';

export function Header() {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left side - Admin nav */}
        <nav className="flex items-center gap-4 flex-1">
          {isAdmin ? (
            <>
              <Link to="/admin/add-game">
                <Button 
                  variant={location.pathname === '/admin/add-game' ? 'default' : 'outline'}
                  size="sm"
                >
                  Lägg till spel
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logga ut
              </Button>
            </>
          ) : (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          )}
        </nav>
        
        {/* Center - Logos */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={stryktipsetLogo} alt="Stryktipset" className="h-10 w-10" />
          <img src={stryktipsetTextLogo} alt="Stryktipset" className="h-6" />
        </Link>
        
        {/* Right side - spacer for balance */}
        <div className="flex-1" />
      </div>
    </header>
  );
}
