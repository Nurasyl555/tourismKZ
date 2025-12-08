import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Mountain, User, Menu, Search, MapPin, Star, Heart, Share2, Calendar } from "lucide-react";

interface MobileViewsProps {
  onNavigate: (page: string) => void;
}

const mobileAttractions = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1556881798-ea9705321743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyeW4lMjBjYW55b24lMjBrYXpha2hzdGFufGVufDF8fHx8MTc2MjU0NTQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Charyn Canyon",
    region: "Almaty Region",
    category: "Natural Wonder",
    rating: 4.8
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1696229592679-9b8f53b68a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxha2UlMjB0dXJxdW9pc2V8ZW58MXx8fHwxNzYyNTQ1NDQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Kolsai Lakes",
    region: "Almaty Region",
    category: "Lake",
    rating: 4.9
  }
];

const mobileReviews = [
  {
    id: 1,
    author: "Emma Schmidt",
    country: "Germany",
    rating: 5,
    date: "October 2024",
    text: "Absolutely breathtaking! The canyon is even more impressive in person."
  }
];

export function MobileViews({ onNavigate }: MobileViewsProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="mb-8">
        <h1 className="mb-4 text-center">Mobile Mockups</h1>
        <p className="text-gray-600 text-center mb-8">
          Preview of how the website looks on mobile devices
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Mobile Homepage User View */}
          <div>
            <h2 className="mb-4 text-center">Homepage (User View)</h2>
            <div className="mx-auto" style={{ width: '375px' }}>
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
                {/* Status Bar */}
                <div className="bg-gray-800 h-6 flex items-center justify-between px-4 text-white text-xs">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                  </div>
                </div>

                {/* Mobile Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mountain className="w-6 h-6 text-[#0A4B78]" />
                      <span className="text-sm text-[#0A4B78]">Tourism KZ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-700" />
                      <Menu className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Mobile Content */}
                <div className="overflow-y-auto" style={{ height: '600px' }}>
                  {/* Hero */}
                  <div className="relative h-48">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1530480667809-b655d4dc3aaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXpha2hzdGFuJTIwbGFuZHNjYXBlJTIwbW91bnRhaW5zfGVufDF8fHx8MTc2MjU0NTQ0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <h2 className="text-white text-center px-4">Explore Kazakhstan</h2>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="p-4 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input placeholder="Search..." className="pl-10 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Select defaultValue="all-regions">
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-regions">All Regions</SelectItem>
                          <SelectItem value="almaty">Almaty</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="all-categories">
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-categories">Categories</SelectItem>
                          <SelectItem value="natural">Natural</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Attractions Grid */}
                  <div className="px-4 pb-4">
                    <h3 className="mb-3 text-sm">Popular Destinations</h3>
                    <div className="space-y-4">
                      {mobileAttractions.map((attraction) => (
                        <div key={attraction.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                          <div className="relative h-32">
                            <ImageWithFallback
                              src={attraction.image}
                              alt={attraction.title}
                              className="w-full h-full object-cover"
                            />
                            <Badge className="absolute top-2 left-2 bg-[#0A4B78] text-xs">
                              {attraction.category}
                            </Badge>
                            <button className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full">
                              <Heart className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="p-3">
                            <h4 className="text-sm mb-1">{attraction.title}</h4>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1 text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{attraction.region}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{attraction.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Attraction Details */}
          <div>
            <h2 className="mb-4 text-center">Attraction Details</h2>
            <div className="mx-auto" style={{ width: '375px' }}>
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
                {/* Status Bar */}
                <div className="bg-gray-800 h-6 flex items-center justify-between px-4 text-white text-xs">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                  </div>
                </div>

                {/* Mobile Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <button className="text-gray-700">← Back</button>
                    <div className="flex gap-2">
                      <Heart className="w-5 h-5" />
                      <Share2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Mobile Content */}
                <div className="overflow-y-auto" style={{ height: '600px' }}>
                  {/* Hero Image */}
                  <div className="relative h-56">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1556881798-ea9705321743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyeW4lMjBjYW55b24lMjBrYXpha2hzdGFufGVufDF8fHx8MTc2MjU0NTQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Charyn Canyon"
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-[#0A4B78] text-xs">
                      Natural Wonder
                    </Badge>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Title */}
                    <div>
                      <h2 className="text-xl mb-2">Charyn Canyon</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>Almaty Region</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>4.8 (127)</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-sm mb-2">About</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Charyn Canyon is a breathtaking natural wonder located in the Almaty Region. 
                        Often called Kazakhstan's Grand Canyon, this spectacular geological formation 
                        stretches for 154 kilometers.
                      </p>
                    </div>

                    {/* Quick Info */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h3 className="text-sm mb-3">Quick Info</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Best Time</span>
                          <span>Apr - Oct</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Entrance Fee</span>
                          <span>700 KZT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration</span>
                          <span>Full Day</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full bg-[#0A4B78] hover:bg-[#083A5E]">
                      <Calendar className="w-4 h-4 mr-2" />
                      Add to Itinerary
                    </Button>

                    {/* Map */}
                    <div>
                      <h3 className="text-sm mb-2">Location</h3>
                      <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>

                    {/* Reviews */}
                    <div>
                      <h3 className="text-sm mb-3">Reviews</h3>
                      {mobileReviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-3 mb-3">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">{review.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm">{review.author}</p>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{review.date}</p>
                              <p className="text-xs text-gray-700">{review.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Write Review */}
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-sm mb-3">Write a Review</h3>
                      <div className="space-y-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-5 h-5 text-gray-300" />
                          ))}
                        </div>
                        <Textarea 
                          placeholder="Share your experience..."
                          rows={3}
                          className="text-sm"
                        />
                        <Button className="w-full bg-[#0A4B78] hover:bg-[#083A5E]" size="sm">
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
