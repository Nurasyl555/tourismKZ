import { Mountain, User, Menu, LogOut, Heart, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
// Импортируем хук перевода и наш переключатель
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  onNavigate?: (page: string) => void;
}

export function Header({ isLoggedIn = false, isAdmin = false, onNavigate }: HeaderProps) {
  const { t } = useTranslation(); // Хук для использования переводов
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.reload(); 
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.('home-guest')}>
            <Mountain className="w-8 h-8 text-[#0A4B78]" />
            {/* Используем ключ перевода */}
            <span className="text-[#0A4B78] font-bold text-xl hidden sm:block">
              {t('app_title')}
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            {/* НОВАЯ КНОПКА AI */}
            <button 
              onClick={() => onNavigate?.('ai-planner')} 
              className="flex items-center gap-1 text-[#0A4B78] font-semibold bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Planner</span>
            </button>
            <button onClick={() => onNavigate?.('home-user')} className="text-gray-700 hover:text-[#0A4B78]">
              {t('destinations')}
            </button>
            <button onClick={() => onNavigate?.('route-list')} className="text-gray-700 hover:text-[#0A4B78]">
              {t('routes')}
            </button>
            <button onClick={() => onNavigate?.('travelers-tips')} className="text-gray-700 hover:text-[#0A4B78]">
              {t('tips')}
            </button>
            {isAdmin && (
              <button onClick={() => onNavigate?.('admin-dashboard')} className="text-[#0A4B78] font-medium">
                {t('admin_panel')}
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {/* Вставляем переключатель языков */}
            <LanguageSwitcher />

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white z-50 shadow-lg border border-gray-200">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center" 
                    onClick={() => onNavigate?.('user-profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span>{t('profile')}</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center" 
                    onClick={() => onNavigate?.('user-profile')}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    <span>{t('favorites')}</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-600 cursor-pointer flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="ghost"
                  onClick={() => onNavigate?.('login')}
                  className="hidden sm:inline-flex"
                >
                  {t('login')}
                </Button>
                <Button 
                  className="bg-[#0A4B78] hover:bg-[#083A5E]"
                  onClick={() => onNavigate?.('register')}
                >
                  {t('signup')}
                </Button>
              </div>
            )}
            {/* Мобильное меню (можно доработать позже) */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}