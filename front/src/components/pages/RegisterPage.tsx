import { Header } from "../Header";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next'; // Хук уже был импортирован

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwords_mismatch')); // Перевод ошибки
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://localhost:8000/api/auth/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      alert(t('reg_success_alert')); // Перевод алерта
      onNavigate('login');
    } catch (err: any) {
      console.error("Registration error", err);
      // Если сервер не вернул ошибку, показываем общий текст
      setError(err.response?.data?.detail || t('reg_failed_default')); 
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
              <CardTitle>{t('create_account_title')}</CardTitle>
              <CardDescription>
                {t('create_account_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="space-y-2">
                {/* Используем существующий ключ username_label или создаем новый, если контекст другой */}
                <Label htmlFor="username">{t('username_label')}</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder={t('choose_username_placeholder')}
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('email_label')}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={t('email_placeholder')}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('password_label')}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder={t('create_password_placeholder')}
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirm_password_label')}</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder={t('confirm_password_placeholder')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                className="w-full bg-[#0A4B78] hover:bg-[#083A5E]"
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? t('creating_account_loading') : t('create_account_btn')}
              </Button>
              <p className="text-sm text-gray-600 text-center">
                {t('already_have_account')}{' '}
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-[#0A4B78] hover:underline"
                >
                  {t('sign_in_link')}
                </button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}