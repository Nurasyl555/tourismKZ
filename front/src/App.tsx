import { useState, useEffect } from "react";
import { HomePageGuest } from "./components/pages/HomePageGuest";
import { HomePageUser } from "./components/pages/HomePageUser";
import { LoginPage } from "./components/pages/LoginPage";
import { RegisterPage } from "./components/pages/RegisterPage";
import { AttractionDetails } from "./components/pages/AttractionDetails";
import { RouteDetails } from "./components/pages/RouteDetails";
import { TravelersTips } from "./components/pages/TravelersTips";
import { UserProfile } from "./components/pages/UserProfile";
import { AdminDashboard } from "./components/pages/AdminDashboard";
import { AdminManageAttractions } from "./components/pages/AdminManageAttractions";
import { AdminModerateReviews } from "./components/pages/AdminModerateReviews";
import { MobileViews } from "./components/pages/MobileViews";
import { Button } from "./components/ui/button";
import { Loader2 } from "lucide-react"; // Импорт иконки загрузки
import axios from "axios";
import { RouteList } from "./components/pages/RouteList";
import { AdminManageRoutes } from "./components/pages/AdminManageRoutes";
import { AiPlanner } from "./components/pages/AiPlanner";

export type PageType = 
  | 'index'
  | 'home-guest'
  | 'home-user'
  | 'route-list'
  | 'login'
  | 'register'
  | 'attraction-details'
  | 'route-details'
  | 'travelers-tips'
  | 'user-profile'
  | 'admin-dashboard'
  | 'admin-attractions'
  | 'admin-routes'
  | 'admin-reviews'
  | 'ai-planner'
  | 'mobile-views';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home-guest');
  const [selectedAttractionId, setSelectedAttractionId] = useState<number | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Состояние: Админ ли пользователь?
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Состояние проверки при загрузке

  // Функция проверки пользователя
  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsCheckingAuth(false);
      return;
    }

    try {
      // Запрашиваем данные о себе
      const response = await axios.get('http://localhost:8000/api/profiles/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsAuthenticated(true);
      // Проверяем поле is_staff, которое мы добавили в сериализатор
      if (response.data.user.is_staff) {
        setIsAdmin(true);
      }
      
      // Если мы были на гостевой, но вошли - переходим на главную
      if (currentPage === 'home-guest') {
        setCurrentPage('home-user');
      }
    } catch (error) {
      console.error("Auth check failed", error);
      // Если токен невалиден - сбрасываем
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleNavigate = (page: string, id?: number) => {
    if (id) {
      setSelectedAttractionId(id);
    }
    setCurrentPage(page as PageType);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Перезагрузка для полного сброса
    window.location.reload();
  };

  // Пока проверяем токен, показываем загрузку
  if (isCheckingAuth) {
    return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  // Рендеринг страниц
  const renderPage = () => {
    switch (currentPage) {
      case 'home-guest':
        return <HomePageGuest onNavigate={handleNavigate} />;
      case 'home-user':
        return <HomePageUser onNavigate={handleNavigate} isAdmin={isAdmin}/>;
      case 'login':
        return <LoginPage onNavigate={(page) => {
          // После логина сразу проверяем права заново
          checkAuth().then(() => handleNavigate(page));
        }} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'attraction-details':
        return <AttractionDetails onNavigate={handleNavigate} attractionId={selectedAttractionId} />;
      case 'route-details':
        return <RouteDetails onNavigate={handleNavigate} routeId={selectedAttractionId} />;
      case 'travelers-tips':
        return <TravelersTips onNavigate={handleNavigate} />;
      case 'user-profile':
        return <UserProfile onNavigate={handleNavigate} />;
      case 'admin-routes':
        return <AdminManageRoutes onNavigate={handleNavigate} />;
      case 'route-list':
        return <RouteList onNavigate={handleNavigate} isAdmin={isAdmin} />;
      case 'ai-planner':
        return <AiPlanner onNavigate={handleNavigate} isAdmin={isAdmin} />;
      
      // Админские страницы
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'admin-attractions':
        return <AdminManageAttractions onNavigate={handleNavigate} />;
      case 'admin-reviews':
        return <AdminModerateReviews onNavigate={handleNavigate} />;
      
      case 'mobile-views':
        return <MobileViews onNavigate={handleNavigate} />;
      default:
        return <HomePageGuest onNavigate={handleNavigate} />;
    }
  };

  return (
    <div>
      {/* Специальное плавающее меню для разработчика (вас), 
        чтобы быстро попасть в админку, даже если кнопка в хедере не сработает 
      */}
      {isAuthenticated && isAdmin && (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
          <Button className="bg-red-600 hover:bg-red-700 shadow-xl" onClick={() => handleNavigate('admin-dashboard')}>
            ⚙️ Open Admin Panel
          </Button>
        </div>
      )}
      
      {renderPage()}
    </div>
  );
}