import { Header } from "../Header";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Lightbulb, Wallet, Map, MessageCircle, Calendar, Shield } from "lucide-react";
import { useTranslation } from 'react-i18next'; // 1. Импорт

interface TravelersTipsProps {
  onNavigate: (page: string) => void;
}

export function TravelersTips({ onNavigate }: TravelersTipsProps) {
  const { t } = useTranslation(); // 2. Инициализация

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={true} onNavigate={onNavigate} />
      
      <main>
        {/* Hero Section */}
        <div className="relative h-[300px] flex items-center justify-center">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1629907903204-e2bd1d402f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXpha2hzdGFuJTIwc3RlcHBlJTIwbmF0dXJlfGVufDF8fHx8MTc2MjU0NTQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Kazakhstan landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="relative z-10 text-center text-white max-w-4xl px-4">
            <h1 className="mb-4 text-white">{t('tips_hero_title')}</h1>
            <p className="text-xl text-white">{t('tips_hero_subtitle')}</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <p className="text-gray-700 text-lg">
                {t('tips_intro_text')}
              </p>
            </div>

            {/* Tips Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-[#0A4B78]" />
                    </div>
                    <CardTitle>{t('tips_money_title')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• {t('tips_money_currency')}</li>
                    <li>• {t('tips_money_cards')}</li>
                    <li>• {t('tips_money_budget')}</li>
                    <li>• {t('tips_money_atms')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-[#0A4B78]" />
                    </div>
                    <CardTitle>{t('tips_lang_title')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• {t('tips_lang_official')}</li>
                    <li>• {t('tips_lang_english')}</li>
                    <li>• {t('tips_lang_russian')}</li>
                    <li>• {t('tips_lang_apps')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#0A4B78]" />
                    </div>
                    <CardTitle>{t('tips_time_title')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• {t('tips_time_spring')}</li>
                    <li>• {t('tips_time_summer')}</li>
                    <li>• {t('tips_time_fall')}</li>
                    <li>• {t('tips_time_winter')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                      <Map className="w-6 h-6 text-[#0A4B78]" />
                    </div>
                    <CardTitle>{t('tips_transport_title')}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• {t('tips_transport_flights')}</li>
                    <li>• {t('tips_transport_trains')}</li>
                    <li>• {t('tips_transport_cars')}</li>
                    <li>• {t('tips_transport_taxi')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-[#0A4B78]" />
                  <h2>{t('tips_safety_title')}</h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>
                    {t('tips_safety_intro')}
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• {t('tips_safety_1')}</li>
                    <li>• {t('tips_safety_2')}</li>
                    <li>• {t('tips_safety_3')}</li>
                    <li>• {t('tips_safety_4')}</li>
                    <li>• {t('tips_safety_5')}</li>
                    <li>• {t('tips_safety_6')}</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-8 h-8 text-[#0A4B78]" />
                  <h2>{t('tips_culture_title')}</h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>
                    {t('tips_culture_intro')}
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• {t('tips_culture_1')}</li>
                    <li>• {t('tips_culture_2')}</li>
                    <li>• {t('tips_culture_3')}</li>
                    <li>• {t('tips_culture_4')}</li>
                    <li>• {t('tips_culture_5')}</li>
                    <li>• {t('tips_culture_6')}</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="mb-4">{t('tips_visa_title')}</h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    {t('tips_visa_intro')}
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• {t('tips_visa_eu')}</li>
                    <li>• {t('tips_visa_us_uk')}</li>
                    <li>• {t('tips_visa_au_nz')}</li>
                    <li>• {t('tips_visa_asia')}</li>
                  </ul>
                  <p className="mt-3">
                    {t('tips_visa_footer')}
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="mb-4">{t('tips_pack_title')}</h2>
                <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <h3 className="text-[#0A4B78] mb-3">{t('tips_pack_essentials_title')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• {t('tips_pack_essentials_1')}</li>
                      <li>• {t('tips_pack_essentials_2')}</li>
                      <li>• {t('tips_pack_essentials_3')}</li>
                      <li>• {t('tips_pack_essentials_4')}</li>
                      <li>• {t('tips_pack_essentials_5')}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[#0A4B78] mb-3">{t('tips_pack_outdoor_title')}</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• {t('tips_pack_outdoor_1')}</li>
                      <li>• {t('tips_pack_outdoor_2')}</li>
                      <li>• {t('tips_pack_outdoor_3')}</li>
                      <li>• {t('tips_pack_outdoor_4')}</li>
                      <li>• {t('tips_pack_outdoor_5')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#E8F4F8] p-8 rounded-lg">
                <h3 className="mb-3">{t('tips_pro_title')}</h3>
                <p className="text-gray-700">
                  {t('tips_pro_text')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}