import { Header } from "../Header";
import { AttractionCard } from "../AttractionCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// Добавлены иконки CreditCard и Calendar
import { Heart, MapPin, Settings, Star, Save, X, Loader2, CreditCard, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import Snowfall  from "react-snowfall";
interface Booking {
  id: number;
  route: number;          // ID маршрута (для ссылки)
  route_title: string;    // Название (приходит с бэкенда)
  date: string;           // Дата поездки
  people_count: number;
  total_price: string | number;
  status: 'pending' | 'paid' | 'cancelled';
}

interface UserProfileProps {
  onNavigate: (page: string, id?: number) => void;
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: "",
    country: "",
    first_name: "",
    last_name: ""
  });
  
  const token = localStorage.getItem('access_token');

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/profiles/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data;
      setProfile(data);
      if (data.favorites) setFavorites(data.favorites);
      if (data.bookings) setBookings(data.bookings);
      
      setEditForm({
        bio: data.bio || "",
        country: data.country || "",
        first_name: data.user.first_name || "",
        last_name: data.user.last_name || ""
      });

    } catch (error) {
      console.error("Error fetching profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      onNavigate('login');
      return;
    }
    fetchProfile();
  }, [token, onNavigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch('http://localhost:8000/api/profiles/me/', {
        bio: editForm.bio,
        country: editForm.country
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsEditing(false);
      fetchProfile();
      alert(t('profile_updated_success') || "Profile updated!");
    } catch (error) {
      console.error("Save error", error);
      alert(t('profile_update_fail') || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        bio: profile.bio || "",
        country: profile.country || "",
        first_name: profile.user.first_name || "",
        last_name: profile.user.last_name || ""
      });
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">{t('loading')}</div>;
  if (!profile) return <div>{t('profile_load_error') || "Error loading profile"}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn onNavigate={onNavigate} />
      <Snowfall color="#82C3D9" />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl bg-[#0A4B78] text-white">
                  {profile.user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h1 className="mb-1 text-2xl font-bold">{profile.user.first_name} {profile.user.last_name || profile.user.username}</h1>
                    <p className="text-gray-600">@{profile.user.username}</p>
                  </div>
                  
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      {t('edit_profile') || "Edit Profile"}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={handleCancel} disabled={saving}>
                        <X className="w-4 h-4 mr-2" /> {t('cancel') || "Cancel"}
                      </Button>
                      <Button className="bg-[#0A4B78]" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {t('save') || "Save"}
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="grid gap-4 mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">{t('country_label') || "Country"}</Label>
                        <Input 
                          value={editForm.country} 
                          onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                          placeholder={t('country_placeholder') || "Kazakhstan"}
                          className="bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">{t('bio_label') || "Bio"}</Label>
                      <Textarea 
                        value={editForm.bio} 
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        placeholder={t('bio_placeholder') || "Tell us about yourself..."}
                        className="bg-white"
                        rows={2}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="flex items-center gap-6 text-gray-600">
                      <div>
                        <span className="text-2xl text-gray-900 mr-2 font-bold">{favorites.length}</span>
                        <span>{t('favorites_stat') || "Favorites"}</span>
                      </div>
                      <div>
                        {/* Статистика покупок */}
                        <span className="text-2xl text-gray-900 mr-2 font-bold">{bookings.length}</span>
                        <span>{t('bookings_stat') || "Bookings"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.country || t('no_location') || "No location set"}</span>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-700">{profile.bio || t('no_bio') || "No bio yet."}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="bg-white">
              {/* Вкладка Бронирований */}
              <TabsTrigger value="bookings" className="gap-2">
                <CreditCard className="w-4 h-4" />
                {t('tab_bookings') || "My Bookings"}
              </TabsTrigger>

              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="w-4 h-4" />
                {t('tab_favorites') || "Favorites"}
              </TabsTrigger>
              
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                {t('tab_settings') || "Settings"}
              </TabsTrigger>
            </TabsList>

            {/* Контент Вкладки Бронирований */}
            <TabsContent value="bookings">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="mb-6 text-xl font-bold">{t('my_purchased_tours') || "My Purchased Tours"}</h2>
                
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden border border-gray-200">
                        <div className="flex flex-col md:flex-row">
                           <div className="p-6 flex-1">
                              <div className="flex justify-between items-start mb-2">
                                  <h3 className="text-lg font-bold text-[#0A4B78]">
                                    {booking.route_title || `Route #${booking.route}`}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      booking.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                      {booking.status ? booking.status.toUpperCase() : "PENDING"}
                                  </span>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-gray-600">
                                  <div>
                                      <p className="text-gray-400 text-xs uppercase tracking-wider">{t('date_label') || "Date"}</p>
                                      <p className="font-medium flex items-center gap-1 mt-1">
                                          <Calendar className="w-4 h-4" /> {booking.date}
                                      </p>
                                  </div>
                                  <div>
                                      <p className="text-gray-400 text-xs uppercase tracking-wider">{t('people_label') || "People"}</p>
                                      <p className="font-medium mt-1">{booking.people_count}</p>
                                  </div>
                                  <div>
                                      <p className="text-gray-400 text-xs uppercase tracking-wider">{t('total_price') || "Total Price"}</p>
                                      <p className="font-medium text-lg text-gray-900 mt-1">${booking.total_price}</p>
                                  </div>
                                  <div className="flex items-end">
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full"
                                        onClick={() => onNavigate('route-details', booking.route)}
                                      >
                                          {t('view_route') || "View Route"}
                                      </Button>
                                  </div>
                              </div>
                           </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>{t('no_bookings_yet') || "You haven't booked any tours yet."}</p>
                    <Button variant="link" onClick={() => onNavigate('route-list')} className="text-[#0A4B78]">
                        {t('browse_routes') || "Browse Routes"}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="favorites">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="mb-6">{t('fav_destinations_title') || "My Favorite Destinations"}</h2>
                {favorites.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((attraction: any) => (
                      <AttractionCard
                        key={attraction.id}
                        id={attraction.id}
                        image={attraction.image}
                        title={attraction.name} 
                        region={attraction.region_name}
                        category={attraction.category_name}
                        rating={attraction.rating}
                        // @ts-ignore
                        onClick={() => onNavigate('attraction-details', attraction.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>{t('no_favorites_yet') || "No favorites yet."}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="mb-6">{t('account_settings_title') || "Account Settings"}</h2>
                <div className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <Label>{t('username_label') || "Username"}</Label>
                    <Input defaultValue={profile.user.username} disabled className="bg-gray-100" />
                    <p className="text-xs text-gray-500">{t('username_note') || "Username cannot be changed."}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>{t('email_label') || "Email"}</Label>
                    <Input defaultValue={profile.user.email} disabled className="bg-gray-100" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}