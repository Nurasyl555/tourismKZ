import { Header } from "../Header";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Lightbulb, Wallet, Map, MessageCircle, Calendar, Shield } from "lucide-react";

interface TravelersTipsProps {
  onNavigate: (page: string) => void;
}

export function TravelersTips({ onNavigate }: TravelersTipsProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn onNavigate={onNavigate} />
      
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
            <h1 className="mb-4 text-white">Traveler's Tips & Guides</h1>
            <p className="text-xl text-white">Everything you need to know for a smooth journey in Kazakhstan</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <p className="text-gray-700 text-lg">
                Kazakhstan is a vast and diverse country with unique customs, landscapes, and experiences. 
                Whether you're an international visitor or a local explorer, these essential tips will help 
                you make the most of your journey through this beautiful Central Asian nation.
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
                    <CardTitle>Money & Budget</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Currency: Kazakhstan Tenge (KZT)</li>
                    <li>• Cards accepted in cities, cash needed in rural areas</li>
                    <li>• Daily budget: $30-50 (budget), $80-150 (comfort)</li>
                    <li>• ATMs widely available in major cities</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-[#0A4B78]" />
                    </div>
                    <CardTitle>Language</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Official languages: Kazakh and Russian</li>
                    <li>• English spoken in tourist areas and hotels</li>
                    <li>• Learn basic Russian phrases for easier travel</li>
                    <li>• Translation apps are very helpful</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#0A4B78]" />
                    </div>
                    <CardTitle>Best Time to Visit</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Spring (Apr-May): Mild weather, blooming landscapes</li>
                    <li>• Summer (Jun-Aug): Peak season, warm temperatures</li>
                    <li>• Fall (Sep-Oct): Beautiful autumn colors, fewer crowds</li>
                    <li>• Winter (Nov-Mar): Excellent for skiing and winter sports</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                      <Map className="w-6 h-6 text-[#0A4B78]" />
                    </div>
                    <CardTitle>Transportation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Domestic flights connect major cities</li>
                    <li>• Trains are comfortable and affordable</li>
                    <li>• Rental cars available in cities (international license needed)</li>
                    <li>• Taxis and ride-sharing apps in urban areas</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-[#0A4B78]" />
                  <h2>Safety & Health</h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>
                    Kazakhstan is generally a safe country for travelers. Crime rates are relatively low, 
                    but exercise normal precautions as you would in any country:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Keep valuables secure and be aware of your surroundings in crowded areas</li>
                    <li>• Drink bottled water, especially outside major cities</li>
                    <li>• Bring any prescription medications with you</li>
                    <li>• Medical facilities are good in cities but limited in rural areas</li>
                    <li>• Travel insurance is highly recommended</li>
                    <li>• Emergency number: 112</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-8 h-8 text-[#0A4B78]" />
                  <h2>Cultural Etiquette</h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>
                    Kazakhs are known for their warm hospitality. Respect local customs to enhance your experience:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Remove shoes when entering someone's home</li>
                    <li>• Accept tea when offered - it's a sign of hospitality</li>
                    <li>• Dress modestly, especially when visiting religious sites</li>
                    <li>• Always ask permission before photographing people</li>
                    <li>• Handshakes are common, but wait for women to extend their hand first</li>
                    <li>• Tipping is appreciated but not mandatory (10% in restaurants)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="mb-4">Visa Requirements</h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    Many nationalities can visit Kazakhstan visa-free for up to 30 days. This includes:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• EU countries</li>
                    <li>• USA, Canada, UK</li>
                    <li>• Australia, New Zealand</li>
                    <li>• Many Asian and Latin American countries</li>
                  </ul>
                  <p className="mt-3">
                    Always check the latest visa requirements for your nationality before traveling. 
                    Your passport should be valid for at least 6 months beyond your planned departure date.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="mb-4">What to Pack</h2>
                <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <h3 className="text-[#0A4B78] mb-3">Essentials</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Comfortable walking shoes</li>
                      <li>• Weather-appropriate clothing (layers recommended)</li>
                      <li>• Sun protection (hat, sunglasses, sunscreen)</li>
                      <li>• Power adapter (220V, European plugs)</li>
                      <li>• Reusable water bottle</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-[#0A4B78] mb-3">For Outdoor Adventures</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Hiking boots</li>
                      <li>• Backpack</li>
                      <li>• Warm jacket (even in summer for mountains)</li>
                      <li>• First aid kit</li>
                      <li>• Headlamp/flashlight</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#E8F4F8] p-8 rounded-lg">
                <h3 className="mb-3">Pro Tip: Stay Connected</h3>
                <p className="text-gray-700">
                  Purchase a local SIM card at the airport or in city centers for affordable data and calls. 
                  Major providers include Kcell, Beeline, and Tele2. Coverage is excellent in cities and 
                  along major routes, but can be limited in remote areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
