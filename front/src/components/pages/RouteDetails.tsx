import { Header } from "../Header";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
// 1. ИСПРАВЛЕНИЕ: Добавили Calendar в список импортов, чтобы убрать красную линию
import { MapPin, Clock, DollarSign, Users, Loader2, CreditCard, CheckCircle, Lock, Calendar, Download } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface RouteDetailsProps {
  onNavigate: (page: string) => void;
  routeId?: number; 
}

export function RouteDetails({ onNavigate, routeId }: RouteDetailsProps) {
  const { t } = useTranslation();
  const [route, setRoute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Состояния
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Данные карты
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const PRICE_PER_PERSON = 100;

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true);
        let idToLoad = routeId;

        // Если ID нет, ищем первый доступный маршрут
        if (!idToLoad) {
            const listResponse = await axios.get('http://localhost:8000/api/routes/');
            if (listResponse.data.results?.length > 0) idToLoad = listResponse.data.results[0].id;
            else if (Array.isArray(listResponse.data) && listResponse.data.length > 0) idToLoad = listResponse.data[0].id;
        }

        if (idToLoad) {
            const response = await axios.get(`http://localhost:8000/api/routes/${idToLoad}/`);
            setRoute(response.data);
        }
      } catch (error) {
        console.error("Error fetching route", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoute();
  }, [routeId]);

  const isLoggedIn = !!localStorage.getItem('access_token');

  // --- ЛОГИКА КАРТЫ ---
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, '').substring(0, 16);
      setCardNumber(value.match(/.{1,4}/g)?.join(' ') || value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (value.length >= 3) setCardExpiry(`${value.substring(0, 2)}/${value.substring(2)}`);
      else setCardExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 3));
  };

  // 2. ИСПРАВЛЕНИЕ: Надежная функция для PDF
  const handleDownloadPDF = () => {
    window.print(); // Вызывает системное окно печати (Сохранить как PDF)
  };

  const handleBookAndPay = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { setIsBookingOpen(false); onNavigate('login'); return; }

    setIsProcessing(true);
    try {
        const createRes = await axios.post('http://localhost:8000/api/bookings/', {
            route: route.id, date: selectedDate, people_count: peopleCount
        }, { headers: { Authorization: `Bearer ${token}` } });

        const bookingId = createRes.data.id;
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        await axios.post(`http://localhost:8000/api/bookings/${bookingId}/pay/`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setBookingSuccess(true);
    } catch (error) {
        alert("Payment failed.");
    } finally {
        setIsProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">{t('loading')}</div>;
  if (!route) return <div className="min-h-screen flex items-center justify-center">{t('no_routes_found')}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 3. СТИЛИ ДЛЯ PDF: Скрываем кнопки и Header при печати */}
      <style>{`
        @media print {
          .no-print, header, footer { display: none !important; }
          body { background: white; }
          .container { max-width: 100%; padding: 0; }
        }
      `}</style>

      <div className="no-print">
        <Header isLoggedIn={isLoggedIn} onNavigate={onNavigate} />
      </div>
      
      <main id="route-content" className="bg-white">
        {/* Hero Section */}
        <div className="bg-[#0A4B78] text-white py-16">
          <div className="container mx-auto px-4">
            <Badge className="bg-white text-[#0A4B78] mb-4">
              {t('day_route_badge', { count: route.duration_days, defaultValue: `${route.duration_days}-Day Route` })}
            </Badge>
            <h1 className="mb-4 text-white">{route.title}</h1>
            <p className="text-xl text-white/90 mb-6">{route.description}</p>
            
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
              <div className="space-y-6">
                <h2>{t('daily_itinerary_title') || "Daily Itinerary"}</h2>
                {route.stops && route.stops.map((stop: any) => (
                  <div key={stop.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 break-inside-avoid">
                    <div className="grid md:grid-cols-3">
                      <div className="h-48 md:h-auto">
                        <ImageWithFallback
                          src={stop.image}
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

            {/* Sidebar - Скрывается при печати благодаря классу no-print */}
            <div className="space-y-6 no-print">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24 border border-gray-100">
                <h3 className="mb-4">{t('start_journey_title') || "Start This Journey"}</h3>
                
                <Button onClick={() => setIsBookingOpen(true)} className="w-full bg-[#0A4B78] hover:bg-[#083A5E] mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('add_to_itinerary_btn') || "Book Now"}
                </Button>
                
                <Button variant="outline" className="w-full mb-4" onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  {t('download_pdf_btn') || "Download PDF Guide"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isBookingOpen} onOpenChange={(open: boolean) => {
          setIsBookingOpen(open);
          if (!open) setTimeout(() => { setBookingSuccess(false); setCardNumber(""); setCardExpiry(""); setCardCvc(""); }, 300);
      }}>
          <DialogContent className="sm:max-w-[425px]">
              {!bookingSuccess ? (
                  <>
                      <DialogHeader>
                          <DialogTitle>{t('book_tour_title') || `Book: ${route.title}`}</DialogTitle>
                          <DialogDescription>{t('enter_details') || "Enter details."}</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Date</Label>
                              <Input type="date" className="col-span-3" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">People</Label>
                              <Input type="number" min={1} className="col-span-3" value={peopleCount} onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)} />
                          </div>
                          <div className="border-t my-2"></div>
                          <div className="space-y-3">
                              <div className="flex items-center gap-2 text-[#0A4B78] font-medium"><Lock className="w-4 h-4" /><span>Secure Payment</span></div>
                              <div>
                                  <Label className="mb-1 text-xs">Card Number</Label>
                                  <div className="relative">
                                      <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                      <Input placeholder="0000 0000 0000 0000" className="pl-9" value={cardNumber} onChange={handleCardNumberChange} inputMode="numeric" />
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div><Label className="mb-1 text-xs">Expiry</Label><Input placeholder="MM/YY" value={cardExpiry} onChange={handleExpiryChange} inputMode="numeric" /></div>
                                  <div><Label className="mb-1 text-xs">CVC</Label><Input type="password" placeholder="123" value={cardCvc} onChange={handleCvcChange} inputMode="numeric" /></div>
                              </div>
                          </div>
                          <div className="text-right font-bold text-lg text-[#0A4B78] mt-2">Total: ${(peopleCount * PRICE_PER_PERSON)}</div>
                      </div>
                      <DialogFooter>
                          <Button variant="outline" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
                          <Button className="bg-[#0A4B78]" onClick={handleBookAndPay} disabled={isProcessing || !selectedDate || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvc.length < 3}>
                              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Pay Now"}
                          </Button>
                      </DialogFooter>
                  </>
              ) : (
                  <div className="py-10 text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                      <Button onClick={() => setIsBookingOpen(false)} className="w-full">Close</Button>
                  </div>
              )}
          </DialogContent>
      </Dialog>
    </div>
  );
}