import { Header } from "../Header";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useTranslation } from 'react-i18next';
import { TypeAnimation } from 'react-type-animation'; // 1. Импортируем библиотеку

interface HomePageGuestProps {
  onNavigate: (page: string) => void;
}

export function HomePageGuest({ onNavigate }: HomePageGuestProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={onNavigate} />
      
      <main>
        {/* Hero Section */}
        <div className="relative h-[600px] flex items-center justify-center">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1530480667809-b655d4dc3aaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXpha2hzdGFuJTIwbGFuZHNjYXBlJTIwbW91bnRhaW5zfGVufDF8fHx8MTc2MjU0NTQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Kazakhstan landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="relative z-10 text-center text-white max-w-4xl px-4">
            
            {/* 2. ЗАМЕНИЛИ ОБЫЧНЫЙ H1 НА АНИМАЦИЮ */}
            <div className="mb-6 text-white text-4xl md:text-5xl font-bold min-h-[60px]">
                <TypeAnimation
                  sequence={[
                    t('guest_hero_title'), // Сначала печатает ваш основной заголовок
                    2000,                  // Ждет 2 секунды
                    t('guest_hero_title_2'),      // Печатает второй текст (можете заменить на t('key'))
                    2000,
                    t('guest_hero_title_3'),      // Печатает третий текст
                    2000
                  ]}
                  wrapper="h1" // Оборачиваем это всё в тег h1
                  speed={50}
                  repeat={Infinity}
                />
            </div>

            <p className="text-xl mb-8 text-white">
              {t('guest_hero_subtitle')}
            </p>
            <Button 
              size="lg"
              className="bg-[#0A4B78] hover:bg-[#083A5E] px-8"
              onClick={() => onNavigate('login')}
            >
              {t('start_journey')}
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏔️</span>
              </div>
              <h3 className="mb-3">{t('feature_natural_wonders')}</h3>
              <p className="text-gray-600">{t('feature_natural_desc')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="mb-3">{t('feature_routes')}</h3>
              <p className="text-gray-600">{t('feature_routes_desc')}</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="mb-3">{t('feature_insights')}</h3>
              <p className="text-gray-600">{t('feature_insights_desc')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}