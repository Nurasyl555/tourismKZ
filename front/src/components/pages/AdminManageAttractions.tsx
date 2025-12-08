import { Header } from "../Header";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface AdminManageAttractionsProps {
  onNavigate: (page: string) => void;
}

export function AdminManageAttractions({ onNavigate }: AdminManageAttractionsProps) {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Состояния для формы
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    category: "",
    description: "",
    status: "active",
    entrance_fee: "",
    best_time: "",
    image: "",
    // Новые поля
    latitude: "",
    longitude: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('access_token');

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [attrRes, regionRes, catRes] = await Promise.all([
        axios.get('http://localhost:8000/api/attractions/', { headers }),
        axios.get('http://localhost:8000/api/regions/', { headers }),
        axios.get('http://localhost:8000/api/categories/', { headers })
      ]);

      setAttractions(attrRes.data.results || attrRes.data);
      setRegions(regionRes.data.results || regionRes.data);
      setCategories(catRes.data.results || catRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData({
      name: "",
      region: "",
      category: "",
      description: "",
      status: "active",
      entrance_fee: "",
      best_time: "",
      image: "",
      latitude: "",
      longitude: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (attraction: any) => {
    setEditingId(attraction.id);
    setFormData({
      name: attraction.name,
      region: attraction.region.toString(), 
      category: attraction.category.toString(),
      description: attraction.description,
      status: attraction.status,
      entrance_fee: attraction.entrance_fee,
      best_time: attraction.best_time,
      image: attraction.image,
      // Заполняем координаты (если они есть)
      latitude: attraction.latitude ? attraction.latitude.toString() : "",
      longitude: attraction.longitude ? attraction.longitude.toString() : ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        region: parseInt(formData.region),
        category: parseInt(formData.category),
        description: formData.description,
        image: formData.image,
        status: formData.status,
        entrance_fee: formData.entrance_fee,
        best_time: formData.best_time,
        // Преобразуем строки в числа (float) или отправляем null, если пусто
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        await axios.put(`http://localhost:8000/api/attractions/${editingId}/`, payload, { headers });
        alert("Attraction updated successfully!");
      } else {
        await axios.post('http://localhost:8000/api/attractions/', payload, { headers });
        alert("Attraction created successfully!");
      }

      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Save error", error);
      alert("Failed to save: " + JSON.stringify(error.response?.data));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this attraction?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/attractions/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttractions(attractions.filter(a => a.id !== id));
    } catch (error) {
      console.error("Delete error", error);
      alert("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn isAdmin onNavigate={onNavigate} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-2">Manage Attractions</h1>
              <p className="text-gray-600">Add, edit, or remove tourist destinations</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0A4B78] hover:bg-[#083A5E]" onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Attraction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Attraction" : "Add New Attraction"}</DialogTitle>
                  <DialogDescription>
                    Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input 
                        placeholder="e.g. Big Almaty Lake" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input 
                        placeholder="https://..." 
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Координаты */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Latitude</Label>
                      <Input 
                        placeholder="e.g. 43.3512" 
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={e => setFormData({...formData, latitude: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude</Label>
                      <Input 
                        placeholder="e.g. 79.0827" 
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={e => setFormData({...formData, longitude: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Region</Label>
                      <Select 
                        value={formData.region} 
                        onValueChange={(val: string) => setFormData({...formData, region: val})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region: any) => (
                            <SelectItem key={region.id} value={region.id.toString()}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(val: string) => setFormData({...formData, category: val})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(val: string) => setFormData({...formData, status: val})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Detailed description..."
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Entrance Fee</Label>
                      <Input 
                        placeholder="e.g. 500 KZT" 
                        value={formData.entrance_fee}
                        onChange={e => setFormData({...formData, entrance_fee: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Best Time</Label>
                      <Input 
                        placeholder="e.g. May - September" 
                        value={formData.best_time}
                        onChange={e => setFormData({...formData, best_time: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button 
                    className="bg-[#0A4B78] hover:bg-[#083A5E]" 
                    onClick={handleSave}
                    disabled={submitting}
                  >
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingId ? "Save Changes" : "Create Attraction"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Attractions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Coords</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : attractions.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8">No attractions found</TableCell></TableRow>
              ) : (
                attractions.map((attraction) => (
                  <TableRow key={attraction.id}>
                    <TableCell>{attraction.id}</TableCell>
                    <TableCell className="font-medium">{attraction.name}</TableCell>
                    <TableCell>{attraction.region_name}</TableCell>
                    <TableCell>{attraction.category_name}</TableCell>
                    <TableCell>
                      <Badge variant={attraction.status === 'active' ? 'default' : 'secondary'}>
                        {attraction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {attraction.latitude ? `${attraction.latitude}, ${attraction.longitude}` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(attraction)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(attraction.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}