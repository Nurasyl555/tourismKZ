import { Header } from "../Header";
import { AttractionCard } from "../AttractionCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from 'react';
import axios from 'axios';

// 1. Добавляем isAdmin в интерфейс
interface HomePageUserProps {
  onNavigate: (page: string, id?: number) => void;
  isAdmin?: boolean; // <--- Новое поле
}

// Интерфейс для данных
interface Attraction {
  id: number;
  image: string;
  title: string;
  region: string;
  category: string;
  rating: number;
}

// 2. Принимаем isAdmin в пропсах
export function HomePageUser({ onNavigate, isAdmin }: HomePageUserProps) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all-regions');
  const [selectedCategory, setSelectedCategory] = useState('all-categories');

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const params: any = {};
        if (selectedRegion !== 'all-regions') params.region = selectedRegion;
        if (selectedCategory !== 'all-categories') params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;

        const response = await axios.get('http://localhost:8000/api/attractions/', { params });
        
        const dataList = response.data.results ? response.data.results : response.data;

        const mappedData = dataList.map((item: any) => ({
            id: item.id,
            image: item.image,
            title: item.name,
            region: item.region_name || item.region, 
            category: item.category_name || item.category,
            rating: item.rating || 0
        }));

        setAttractions(mappedData);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
        fetchAttractions();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedRegion, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 3. Передаем isAdmin в Header */}
      <Header isLoggedIn={true} isAdmin={isAdmin} onNavigate={onNavigate} />
      
      <main>
        {/* Hero Section */}
        <div className="relative h-[400px] flex items-center justify-center bg-gray-900">
           <div className="absolute inset-0 bg-black/40" />
           <div className="relative z-10 text-center text-white max-w-4xl px-4">
            <h1 className="mb-6 text-white">Explore Kazakhstan</h1>
            <p className="text-xl text-white">Your next adventure awaits</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search destinations..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-regions">All Regions</SelectItem>
                  <SelectItem value="Almaty Region">Almaty Region</SelectItem>
                  <SelectItem value="Astana">Astana</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  <SelectItem value="Natural Wonder">Natural Wonder</SelectItem>
                  <SelectItem value="Lake">Lake</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="popular">
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attractions Grid */}
          <div>
            <h2 className="mb-6">Popular Destinations</h2>
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
                {attractions.length > 0 ? (
                    attractions.map((attraction) => (
                        <AttractionCard
                        key={attraction.id}
                        {...attraction}
                        // Исправленный вызов onNavigate с ID
                        // @ts-ignore
                        onClick={() => onNavigate('attraction-details', attraction.id)}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-3 text-center">No attractions found.</p>
                )}
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}