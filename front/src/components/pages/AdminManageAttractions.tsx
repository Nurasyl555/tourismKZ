import { Header } from "../Header";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Plus, Pencil, Trash2, Loader2, ImageIcon } from "lucide-react";
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
  
  // Состояния формы
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    category: "",
    description: "",
    status: "active",
    entrance_fee: "",
    best_time: "",
    latitude: "",
    longitude: ""
  });
  
  // Отдельное состояние для файла
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Для предпросмотра
  
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
      name: "", region: "", category: "", description: "", status: "active",
      entrance_fee: "", best_time: "", latitude: "", longitude: ""
    });
    setImageFile(null);
    setPreviewUrl(null);
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
      latitude: attraction.latitude ? attraction.latitude.toString() : "",
      longitude: attraction.longitude ? attraction.longitude.toString() : ""
    });
    // Если есть старая картинка, показываем её как превью
    setPreviewUrl(attraction.image); 
    setImageFile(null); // Файл пока не выбран новый
    setIsDialogOpen(true);
  };

  // Обработчик выбора файла
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Показываем превью сразу
    }
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      // ИСПОЛЬЗУЕМ FormData для отправки файлов
      const data = new FormData();
      data.append('name', formData.name);
      data.append('region', formData.region);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('status', formData.status);
      data.append('entrance_fee', formData.entrance_fee);
      data.append('best_time', formData.best_time);
      
      if (formData.latitude) data.append('latitude', formData.latitude);
      if (formData.longitude) data.append('longitude', formData.longitude);

      // Добавляем файл, только если пользователь выбрал новый
      if (imageFile) {
        data.append('image', imageFile);
      }

      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Важно для файлов
        }
      };

      if (editingId) {
        await axios.patch(`http://localhost:8000/api/attractions/${editingId}/`, data, config);
        alert("Attraction updated successfully!");
      } else {
        await axios.post('http://localhost:8000/api/attractions/', data, config);
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
    if (!confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/attractions/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttractions(attractions.filter(a => a.id !== id));
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn isAdmin onNavigate={onNavigate} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Manage Attractions</h1>
            <p className="text-gray-600">Create, edit, and upload photos</p>
          </div>
          <Button className="bg-[#0A4B78] hover:bg-[#083A5E]" onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Attraction
          </Button>
        </div>

        {/* Таблица */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : attractions.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">No attractions found</TableCell></TableRow>
              ) : (
                attractions.map((attraction) => (
                  <TableRow key={attraction.id}>
                    <TableCell>
                      {/* Миниатюра картинки в таблице */}
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                        {attraction.image ? (
                          <img src={attraction.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-6 h-6 m-auto mt-3 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{attraction.name}</TableCell>
                    <TableCell>{attraction.region_name}</TableCell>
                    <TableCell>{attraction.category_name}</TableCell>
                    <TableCell>
                      <Badge variant={attraction.status === 'active' ? 'default' : 'secondary'}>
                        {attraction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(attraction)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(attraction.id)}>
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

        {/* Диалог создания/редактирования */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Attraction" : "Add New Attraction"}</DialogTitle>
              <DialogDescription>Upload photos and fill details.</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Поле загрузки картинки */}
              <div className="flex flex-col gap-2">
                <Label>Attraction Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 relative">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500">Supported: JPG, PNG, WEBP</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(val: string) => setFormData({...formData, status: val})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select 
                    value={formData.region} 
                    onValueChange={(val: string) => setFormData({...formData, region: val})}
                  >
                    <SelectTrigger><SelectValue placeholder="Select Region" /></SelectTrigger>
                    <SelectContent>
                      {regions.map((region: any) => (
                        <SelectItem key={region.id} value={region.id.toString()}>{region.name}</SelectItem>
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
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entrance Fee</Label>
                  <Input 
                    value={formData.entrance_fee}
                    onChange={e => setFormData({...formData, entrance_fee: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Best Time</Label>
                  <Input 
                    value={formData.best_time}
                    onChange={e => setFormData({...formData, best_time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input 
                    type="number" step="any"
                    value={formData.latitude}
                    onChange={e => setFormData({...formData, latitude: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input 
                    type="number" step="any"
                    value={formData.longitude}
                    onChange={e => setFormData({...formData, longitude: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="bg-[#0A4B78]" onClick={handleSave} disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Attraction"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}