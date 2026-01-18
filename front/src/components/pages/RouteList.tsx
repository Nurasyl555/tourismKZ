import { Header } from "../Header";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Clock, MapPin, DollarSign, Users, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next'; // 1. Импорт
import Snowfall  from "react-snowfall";
interface RouteListProps {
  onNavigate: (page: string, id?: number) => void;
  isAdmin?: boolean;
}

export function RouteList({ onNavigate, isAdmin }: RouteListProps) {
  const { t } = useTranslation(); // 2. Инициализация
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/routes/');
        setRoutes(response.data.results || response.data);
      } catch (error) {
        console.error("Error fetching routes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const isLoggedIn = !!localStorage.getItem('access_token');

  return (
    <div className="min-h-screen bg-gray-50">
      <Snowfall color="#82C3D9" />
      <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} onNavigate={onNavigate} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0A4B78] mb-2">{t('explore_routes_title')}</h1>
          <p className="text-gray-600">{t('explore_routes_subtitle')}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">{t('loading_routes')}</div>
        ) : routes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">{t('no_routes_available')}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Card key={route.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={route.image}
                    alt={route.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-white/90 text-[#0A4B78] hover:bg-white">
                    {route.duration_days} {t('days_unit')}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-[#0A4B78]">{route.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {route.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#2D5016]" />
                      {/* days_unit мы добавили в прошлом шаге */}
                      <span>{route.duration_days} {t('days_unit')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#2D5016]" />
                      <span>{route.budget_range}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#2D5016]" />
                      <span>{route.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#2D5016]" />
                      {/* km_unit мы добавили в прошлом шаге */}
                      <span>~{route.distance_km} {t('km_unit')}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <Button 
                    className="w-full bg-[#0A4B78] hover:bg-[#083A5E]"
                    onClick={() => onNavigate('route-details', route.id)}
                  >
                    {t('view_itinerary_btn')} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}