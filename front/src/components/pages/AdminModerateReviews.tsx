import { Header } from "../Header";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Star, Check, X, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface AdminModerateReviewsProps {
  onNavigate: (page: string) => void;
}

// Тип данных для отзыва
interface Review {
  id: number;
  author_name: string; // Поле из сериализатора
  attraction_name: string; // Поле из сериализатора
  rating: number;
  date: string; // created_at из Django
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
}

function ReviewCard({ review, onApprove, onReject }: { review: Review; onApprove?: () => void; onReject?: () => void }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback>{review.author_name ? review.author_name[0].toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-gray-900 font-medium">{review.author_name}</p>
              <p className="text-sm text-gray-600">{review.attraction_name}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(review.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1">
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
            <Badge 
              variant={
                review.status === 'pending' ? 'secondary' : 
                review.status === 'approved' ? 'default' : 
                'destructive'
              }
            >
              {review.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{review.text}</p>
        {review.status === 'rejected' && review.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm text-red-900 font-medium">Rejection Reason:</p>
              <p className="text-sm text-red-700">{review.rejection_reason}</p>
            </div>
          </div>
        )}
        {review.status === 'pending' && (
          <div className="flex gap-3">
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={onApprove}
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button 
              variant="destructive"
              onClick={onReject}
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminModerateReviews({ onNavigate }: AdminModerateReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Получаем токен из localStorage (предполагается, что он был сохранен при логине)
  const token = localStorage.getItem('access_token'); 

  // Функция загрузки отзывов
  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/reviews/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Маппинг данных с бэкенда
      const mappedReviews = response.data.results.map((r: any) => ({
        id: r.id,
        author_name: r.author_name,
        attraction_name: r.attraction_name || `Attraction #${r.attraction}`,
        rating: r.rating,
        date: r.created_at,
        text: r.text,
        status: r.status,
        rejection_reason: r.rejection_reason
      }));
      setReviews(mappedReviews);
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Обработчики действий
  const handleModerate = async (id: number, status: 'approved' | 'rejected') => {
    try {
      // Для 'rejected' можно добавить prompt для ввода причины
      let reason = "";
      if (status === 'rejected') {
        reason = prompt("Enter rejection reason:") || "Violation of rules";
      }

      await axios.post(`http://localhost:8000/api/reviews/${id}/moderate/`, {
        status: status,
        reason: reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Обновляем список после действия
      fetchReviews();
    } catch (error) {
      console.error(`Error moderating review ${id}`, error);
      alert("Failed to moderate review");
    }
  };

  // Фильтрация для табов
  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const rejectedReviews = reviews.filter(r => r.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn isAdmin onNavigate={onNavigate} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2">Moderate Reviews</h1>
          <p className="text-gray-600">Review and approve user-submitted reviews</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <p className="text-sm text-gray-600">Pending Reviews</p>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-orange-600">{loading ? '...' : pendingReviews.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <p className="text-sm text-gray-600">Approved Total</p>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-green-600">{loading ? '...' : approvedReviews.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <p className="text-sm text-gray-600">Rejected Total</p>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? '...' : rejectedReviews.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="pending" className="gap-2">
              <AlertCircle className="w-4 h-4" />
              Pending ({pendingReviews.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <Check className="w-4 h-4" />
              Approved ({approvedReviews.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <X className="w-4 h-4" />
              Rejected ({rejectedReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="space-y-4">
              {loading ? <p>Loading reviews...</p> : 
               pendingReviews.length > 0 ? (
                pendingReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onApprove={() => handleModerate(review.id, 'approved')}
                    onReject={() => handleModerate(review.id, 'rejected')}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Check className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p className="text-gray-600">No pending reviews to moderate</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="space-y-4">
              {approvedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="space-y-4">
              {rejectedReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}