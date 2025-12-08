import { Header } from "../Header";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MapPin, Clock, DollarSign, Users, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface RouteDetailsProps {
  onNavigate: (page: string) => void;
}

export function RouteDetails({ onNavigate }: RouteDetailsProps) {
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // Получаем список маршрутов и берем первый для отображения
        // В реальном приложении сюда нужно передавать ID через пропсы или URL
        const response = await axios.get('http://localhost:8000/api/routes/');
        if (response.data.results && response.data.results.length > 0) {
          setRoute(response.data.results[0]);
        }
      } catch (error) {
        console.error("Error fetching routes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, []);

  const isLoggedIn = !!localStorage.getItem('access_token');

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!route) return <div className="min-h-screen flex items-center justify-center">No routes found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} onNavigate={onNavigate} />
      
      <main>
        {/* Hero Section */}
        <div className="bg-[#0A4B78] text-white py-16">
          <div className="container mx-auto px-4">
            <Badge className="bg-white text-[#0A4B78] mb-4">{route.duration_days}-Day Route</Badge>
            <h1 className="mb-4 text-white">{route.title}</h1>
            <p className="text-xl text-white/90 mb-6">
              {route.description}
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8" />
                <div>
                  <p className="text-sm text-white/80">Duration</p>
                  <p>{route.duration_days} Days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8" />
                <div>
                  <p className="text-sm text-white/80">Budget</p>
                  <p>{route.budget_range}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8" />
                <div>
                  <p className="text-sm text-white/80">Difficulty</p>
                  <p>{route.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-8 h-8" />
                <div>
                  <p className="text-sm text-white/80">Distance</p>
                  <p>~{route.distance_km} km</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Day by Day Itinerary */}
              <div className="space-y-6">
                <h2>Daily Itinerary</h2>
                
                {route.stops && route.stops.map((stop: any, index: number) => (
                  <div key={stop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="grid md:grid-cols-3">
                      <div className="h-48 md:h-auto">
                        <ImageWithFallback
                          src={stop.image} // Убедитесь, что это полный URL
                          alt={stop.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-2 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#0A4B78] text-white flex items-center justify-center">
                            {stop.day_number}
                          </div>
                          <div>
                            <h3>{stop.title}</h3>
                            <p className="text-sm text-gray-600">{stop.duration_label}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{stop.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h3 className="mb-4">Start This Journey</h3>
                <Button className="w-full bg-[#0A4B78] hover:bg-[#083A5E] mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Itinerary
                </Button>
                <Button variant="outline" className="w-full mb-4">
                  Download PDF Guide
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}