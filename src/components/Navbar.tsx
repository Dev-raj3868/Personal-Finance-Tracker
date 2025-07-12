
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {!isLoginPage && <SidebarTrigger className="mr-4" />}
        <div className="flex flex-1 items-center justify-between space-x-2">
          <h1 className="text-lg font-semibold">Personal Finance Tracker</h1>
          {!isLoginPage && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Demo User
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
