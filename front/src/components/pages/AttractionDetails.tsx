import { Header } from "../Header";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { MapPin, Star, Heart, Share2, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
// Импорт компонента карты
import { MapComponent } from "../Map";

interface AttractionDetailsProps {
  onNavigate: (page: string) => void;
  attractionId?: number;
}

export function AttractionDetails({ onNavigate, attractionId = 1 }: AttractionDetailsProps) {
  const [data, setData] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('access_token');
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const attrResponse = await axios.get(`http://localhost:8000/api/attractions/${attractionId}/`);
        setData(attrResponse.data);

        const reviewsResponse = await axios.get(`http://localhost:8000/api/reviews/?attraction=${attractionId}`);
        setReviews(reviewsResponse.data.results || reviewsResponse.data);
      } catch (error) {
        console.error("Error fetching details", error);
      } finally {
        setLoading(false);
      }
    };

    if (attractionId) fetchData();
  }, [attractionId]);

  const handleSubmitReview = async () => {
    if (!token) {
      alert("Please login to submit a review");
      onNavigate('login');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/reviews/', {
        attraction: attractionId,
        rating: newReviewRating,
        text: newReviewText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Review submitted for moderation!");
      setNewReviewText("");
    } catch (error) {
      console.error("Error submitting review", error);
      alert("Failed to submit review");
    }
  };

  const handleToggleFavorite = async () => {
    if (!token) return onNavigate('login');
    try {
      await axios.post(`http://localhost:8000/api/attractions/${attractionId}/toggle_favorite/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Favorites updated!");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center">Attraction not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} onNavigate={onNavigate} />
      
      <main>
        {/* Hero Image */}
        <div className="relative h-[500px]">
          <ImageWithFallback
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
            <div className="container mx-auto">
              <Badge className="bg-[#0A4B78] mb-3">{data.category_name || "Destination"}</Badge>
              <h1 className="text-white mb-2">{data.name}</h1>
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{data.region_name || "Kazakhstan"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{data.rating} ({data.reviews_count} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2>About This Destination</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleToggleFavorite}>
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 whitespace-pre-line">
                  {data.description}
                </p>
              </div>

              {/* Map Section - ВОТ ЗДЕСЬ ИЗМЕНЕНИЯ */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="mb-4">Location</h2>
                <div className="h-80 rounded-lg overflow-hidden border border-gray-200 z-0">
                  {data.latitude && data.longitude ? (
                    <MapComponent 
                      lat={data.latitude} 
                      lng={data.longitude} 
                      popupText={data.name} 
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                      <MapPin className="w-12 h-12 mb-2 opacity-20" />
                      <p>Coordinates not available for this location</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="mb-6">Traveler Reviews ({reviews.length})</h2>
                
                <div className="space-y-6 mb-8">
                  {reviews.length > 0 ? reviews.map((review: any) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>{review.author_name ? review.author_name[0].toUpperCase() : 'A'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-900 font-medium">{review.author_name}</p>
                            <div className="text-right">
                              <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  )) : <p className="text-gray-500">No reviews yet.</p>}
                </div>

                {/* Write Review Form */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="mb-4">Write a Review</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            onClick={() => setNewReviewRating(star)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Star className={`w-6 h-6 ${star <= newReviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Your Review</label>
                      <Textarea 
                        placeholder="Share your experience..."
                        rows={4}
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                      />
                    </div>
                    <Button className="bg-[#0A4B78] hover:bg-[#083A5E]" onClick={handleSubmitReview}>
                      Submit Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="mb-4">Quick Information</h3>
                <div className="space-y-3 text-sm">
                  {data.best_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Time to Visit</span>
                      <span>{data.best_time}</span>
                    </div>
                  )}
                  {data.entrance_fee && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entrance Fee</span>
                      <span>{data.entrance_fee}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visitors</span>
                    <span>{data.visitors_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}