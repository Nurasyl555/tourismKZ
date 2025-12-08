import { Mountain, User, Menu, LogOut, Heart } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onNavigate?: (page: string) => void;
}

export function Header({ isLoggedIn = false, isAdmin = false, onNavigate }: HeaderProps) {
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Перезагрузка страницы — самый простой способ сбросить состояние App.tsx
    window.location.reload(); 
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.('home-guest')}>
            <Mountain className="w-8 h-8 text-[#0A4B78]" />
            <span className="text-[#0A4B78] font-bold text-xl">Tourism Kazakhstan</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate?.('home-user')} className="text-gray-700 hover:text-[#0A4B78]">
              Destinations
            </button>
            <button onClick={() => onNavigate?.('route-list')} className="text-gray-700 hover:text-[#0A4B78]">
              Routes
            </button>
            <button onClick={() => onNavigate?.('travelers-tips')} className="text-gray-700 hover:text-[#0A4B78]">
              Traveler's Tips
            </button>
            {isAdmin && (
              <button onClick={() => onNavigate?.('admin-dashboard')} className="text-[#0A4B78] font-medium">
                Admin Dashboard
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                {/* Добавлены классы bg-white и z-50 для правильного отображения */}
                <DropdownMenuContent align="end" className="w-56 bg-white z-50 shadow-lg border border-gray-200">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Добавлен cursor-pointer для реакции на наведение */}
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center" 
                    onClick={() => onNavigate?.('user-profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center" 
                    onClick={() => onNavigate?.('user-profile')}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    <span>My Favorites</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-600 cursor-pointer flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => onNavigate?.('login')}
                >
                  Login
                </Button>
                <Button 
                  className="bg-[#0A4B78] hover:bg-[#083A5E]"
                  onClick={() => onNavigate?.('register')}
                >
                  Sign Up
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}