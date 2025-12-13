import { Header } from "../Header";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next'; // 1. Импорт

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { t } = useTranslation(); // 2. Инициализация
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post('http://localhost:8000/api/auth/token/', {
        username,
        password
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      onNavigate('home-user');
      
    } catch (err) {
      console.error("Login error:", err);
      setError(t('login_error_msg')); // Перевод ошибки
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={onNavigate} />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>{t('welcome_back_title')}</CardTitle>
              <CardDescription>
                {t('login_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">{t('username_label')}</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder={t('username_placeholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('password_label')}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder={t('password_placeholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full bg-[#0A4B78] hover:bg-[#083A5E]"
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? t('signing_in_loading') : t('sign_in_button')}
              </Button>
              <p className="text-sm text-gray-600 text-center">
                {t('no_account_text')}{' '}
                <button 
                  onClick={() => onNavigate('register')}
                  className="text-[#0A4B78] hover:underline"
                >
                  {t('signup')}
                </button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}