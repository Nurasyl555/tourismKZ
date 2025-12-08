import { Header } from "../Header";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface HomePageGuestProps {
  onNavigate: (page: string) => void;
}

export function HomePageGuest({ onNavigate }: HomePageGuestProps) {
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
            <h1 className="mb-6 text-white">Discover the Heart of Central Asia</h1>
            <p className="text-xl mb-8 text-white">
              Explore Kazakhstan's breathtaking landscapes, rich culture, and unforgettable adventures
            </p>
            <Button 
              size="lg"
              className="bg-[#0A4B78] hover:bg-[#083A5E] px-8"
              onClick={() => onNavigate('login')}
            >
              Start Your Journey
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
              <h3 className="mb-3">Natural Wonders</h3>
              <p className="text-gray-600">From towering mountains to vast steppes, discover diverse landscapes</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="mb-3">Curated Routes</h3>
              <p className="text-gray-600">Expertly planned itineraries for every type of traveler</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="mb-3">Local Insights</h3>
              <p className="text-gray-600">Get authentic tips from travelers and locals</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
