import { Header } from "../Header";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import axios from "axios";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Отправляем запрос на получение токена
      const response = await axios.post('http://localhost:8000/api/auth/token/', {
        username,
        password
      });

      // Сохраняем токены (в реальном приложении лучше использовать httpOnly cookies или более безопасные методы)
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Проверяем, является ли пользователь админом (опционально, нужен доп. запрос к /profile/me)
      // Для простоты сразу переходим на главную
      onNavigate('home-user');
      
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password");
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
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your account to continue exploring Kazakhstan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
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
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              <p className="text-sm text-gray-600 text-center">
                Don't have an account?{' '}
                <button 
                  onClick={() => onNavigate('register')}
                  className="text-[#0A4B78] hover:underline"
                >
                  Sign up
                </button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}