import { MapPin, Star, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface AttractionCardProps {
  id: number;
  image: string;
  title: string;
  region: string;
  category: string;
  rating?: number;
  onClick?: () => void;
}

export function AttractionCard({ image, title, region, category, rating, onClick }: AttractionCardProps) {
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="w-4 h-4" />
        </Button>
        <Badge className="absolute top-2 left-2 bg-[#0A4B78]">
          {category}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="mb-2 text-gray-900">{title}</h3>
        
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{region}</span>
        </div>
        
        {rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
