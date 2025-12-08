import { Header } from "../Header";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, MapPin, Eye, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/stats/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn isAdmin onNavigate={onNavigate} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of Tourism Kazakhstan platform analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
              <Users className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats?.total_users || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Attractions</CardTitle>
              <MapPin className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats?.total_attractions || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Page Views</CardTitle>
              <Eye className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats?.total_page_views || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Pending Reviews</CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats?.pending_reviews || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Destinations Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Most Popular Destinations (by Visitors)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.popular_destinations || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visitors_count" fill="#0A4B78" name="Visitors" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('admin-attractions')}
          >
            <CardContent className="pt-6 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-[#0A4B78]" />
              <h3 className="mb-2">Manage Attractions</h3>
              <p className="text-sm text-gray-600">Add, edit, or remove destinations</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate('admin-reviews')}
          >
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-[#0A4B78]" />
              <h3 className="mb-2">Moderate Reviews</h3>
              <p className="text-sm text-gray-600">Approve or deny user reviews</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}