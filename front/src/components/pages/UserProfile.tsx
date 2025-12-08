import { Header } from "../Header";
import { AttractionCard } from "../AttractionCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea"; // Убедитесь, что этот компонент есть, или используйте Input
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Heart, MapPin, Settings, Star, Save, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface UserProfileProps {
  onNavigate: (page: string, id?: number) => void;
}

export function UserProfile({ onNavigate }: UserProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Состояния для редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: "",
    country: "",
    first_name: "", // Эти поля есть в User, но меняем через профиль если API позволяет, 
    last_name: ""   // или просто bio/country в UserProfile
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
      
      // Инициализируем форму текущими данными
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
      // Отправляем PATCH запрос
      // Примечание: API UserProfileViewSet должен поддерживать обновление
      // Если first_name/last_name вложены в user, стандартный сериализатор может требовать настройки.
      // Для простоты сейчас обновим Bio и Country, которые прямо в модели Profile.
      
      await axios.patch('http://localhost:8000/api/profiles/me/', {
        bio: editForm.bio,
        country: editForm.country
        // Если хотите обновлять имя, нужно доработать UserProfileSerializer на бэкенде, 
        // чтобы он принимал вложенные поля user и делал update для них.
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsEditing(false);
      fetchProfile(); // Обновляем данные на экране
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Save error", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Сбрасываем форму к исходным данным
    if (profile) {
      setEditForm({
        bio: profile.bio || "",
        country: profile.country || "",
        first_name: profile.user.first_name || "",
        last_name: profile.user.last_name || ""
      });
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!profile) return <div>Error loading profile</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn onNavigate={onNavigate} />
      
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
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={handleCancel} disabled={saving}>
                        <X className="w-4 h-4 mr-2" /> Cancel
                      </Button>
                      <Button className="bg-[#0A4B78]" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="grid gap-4 mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Country</Label>
                        <Input 
                          value={editForm.country} 
                          onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                          placeholder="Kazakhstan"
                          className="bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Bio</Label>
                      <Textarea 
                        value={editForm.bio} 
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                        className="bg-white"
                        rows={2}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-6 mt-4 text-gray-600">
                      <div>
                        <span className="text-2xl text-gray-900 mr-2 font-bold">{favorites.length}</span>
                        <span>Favorites</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.country || 'No location set'}</span>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-700">{profile.bio || "No bio yet."}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="favorites" className="space-y-6">
            <TabsList className="bg-white">
              <TabsTrigger value="favorites" className="gap-2">
                <Heart className="w-4 h-4" />
                My Favorites
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                Account Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="mb-6">My Favorite Destinations</h2>
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
                    <p>No favorites yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="mb-6">Account Settings</h2>
                <div className="space-y-6 max-w-2xl">
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input defaultValue={profile.user.username} disabled className="bg-gray-100" />
                    <p className="text-xs text-gray-500">Username cannot be changed.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
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