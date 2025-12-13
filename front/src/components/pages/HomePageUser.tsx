import { Header } from "../Header";
import { AttractionCard } from "../AttractionCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface HomePageUserProps {
  onNavigate: (page: string, id?: number) => void;
  isAdmin?: boolean;
}

interface Attraction {
  id: number;
  image: string;
  title: string;
  region: string;
  category: string;
  rating: number;
}

export function HomePageUser({ onNavigate, isAdmin }: HomePageUserProps) {
  const { t } = useTranslation();
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  
  // Состояния для динамических фильтров
  const [regionsList, setRegionsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all-regions');
  const [selectedCategory, setSelectedCategory] = useState('all-categories');
  const [sortBy, setSortBy] = useState('popular'); // Состояние для сортировки

  // 1. Загрузка справочников (Регионы и Категории)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [regionsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:8000/api/regions/'),
          axios.get('http://localhost:8000/api/categories/')
        ]);
        setRegionsList(regionsRes.data.results || regionsRes.data);
        setCategoriesList(categoriesRes.data.results || categoriesRes.data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilters();
  }, []);

  // 2. Загрузка достопримечательностей с учетом фильтров
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        setLoading(true);
        const params: any = {};
        
        // Фильтры
        if (selectedRegion !== 'all-regions') params.region = selectedRegion;
        if (selectedCategory !== 'all-categories') params.category = selectedCategory;
        if (searchTerm) params.search = searchTerm;
        
        // Сортировка (если вы добавите ordering в Django, это будет работать)
        // Пока просто передаем параметр, чтобы логика была готова
        if (sortBy === 'rating') params.ordering = '-average_rating'; // Пример для DRF
        
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
  }, [searchTerm, selectedRegion, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={true} isAdmin={isAdmin} onNavigate={onNavigate} />
      
      <main>
        {/* Hero Section */}
        <div className="relative h-[400px] flex items-center justify-center bg-gray-900">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1530480667809-b655d4dc3aaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXpha2hzdGFuJTIwbGFuZHNjYXBlJTIwbW91bnRhaW5zfGVufDF8fHx8MTc2MjU0NTQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Kazakhstan landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />
           <div className="absolute inset-0 bg-black/40" />
           <div className="relative z-10 text-center text-white max-w-4xl px-4">
            <h1 className="mb-6 text-white">{t('hero_title')}</h1>
            <p className="text-xl text-white">{t('hero_subtitle')}</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder={t('search_placeholder')} 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Динамический список регионов */}
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder={t('region_label')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-regions">{t('all_regions')}</SelectItem>
                  {regionsList.map((region) => (
                    <SelectItem key={region.id} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Динамический список категорий */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('category_label')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">{t('all_categories')}</SelectItem>
                  {categoriesList.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder={t('sort_by')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">{t('most_popular')}</SelectItem>
                  <SelectItem value="rating">{t('highest_rated')}</SelectItem>
                  <SelectItem value="name">{t('name_az')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attractions Grid */}
          <div>
            <h2 className="mb-6">{t('popular_destinations_header')}</h2>
            {loading ? (
                <div className="text-center">{t('loading')}</div>
            ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
                {attractions.length > 0 ? (
                    attractions.map((attraction) => (
                        <AttractionCard
                        key={attraction.id}
                        {...attraction}
                        // @ts-ignore
                        onClick={() => onNavigate('attraction-details', attraction.id)}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 col-span-3 text-center">{t('no_attractions')}</p>
                )}
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}