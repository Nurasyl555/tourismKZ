import { Header } from "../Header";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Plus, Pencil, Trash2, Loader2, Map, Calendar, DollarSign, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "../ui/card";

interface AdminManageRoutesProps {
  onNavigate: (page: string) => void;
}

// Типы данных
interface RouteStopData {
  day_number: number;
  title: string;
  description: string;
  image: string;
  duration_label: string;
}

interface RouteData {
  id?: number;
  title: string;
  description: string;
  duration_days: number;
  budget_range: string;
  difficulty: string;
  distance_km: number;
  image: string;
  stops: RouteStopData[];
}

export function AdminManageRoutes({ onNavigate }: AdminManageRoutesProps) {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const initialFormState: RouteData = {
    title: "",
    description: "",
    duration_days: 1,
    budget_range: "",
    difficulty: "Moderate",
    distance_km: 0,
    image: "",
    stops: []
  };

  const [formData, setFormData] = useState<RouteData>(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('access_token');

  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/routes/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoutes(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching routes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData({ ...initialFormState, stops: [
      { day_number: 1, title: "", description: "", image: "", duration_label: "Full Day" }
    ]});
    setIsDialogOpen(true);
  };

  const handleEdit = (route: any) => {
    setEditingId(route.id);
    setFormData({
      title: route.title,
      description: route.description,
      duration_days: route.duration_days,
      budget_range: route.budget_range,
      difficulty: route.difficulty,
      distance_km: route.distance_km,
      image: route.image,
      stops: route.stops || []
    });
    setIsDialogOpen(true);
  };

  // --- Управление остановками ---
  
  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [
        ...prev.stops,
        { 
          day_number: prev.stops.length + 1, 
          title: "", 
          description: "", 
          image: "", 
          duration_label: "Full Day" 
        }
      ]
    }));
  };

  const removeStop = (index: number) => {
    setFormData(prev => {
      const newStops = prev.stops.filter((_, i) => i !== index);
      return {
        ...prev,
        stops: newStops.map((stop, i) => ({ ...stop, day_number: i + 1 }))
      };
    });
  };

  const updateStop = (index: number, field: keyof RouteStopData, value: string | number) => {
    setFormData(prev => {
      const newStops = [...prev.stops];
      newStops[index] = { ...newStops[index], [field]: value };
      return { ...prev, stops: newStops };
    });
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        duration_days: formData.stops.length
      };

      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        await axios.put(`http://localhost:8000/api/routes/${editingId}/`, payload, { headers });
        alert("Route updated!");
      } else {
        await axios.post('http://localhost:8000/api/routes/', payload, { headers });
        alert("Route created!");
      }

      setIsDialogOpen(false);
      fetchRoutes();
    } catch (error: any) {
      console.error("Save error", error);
      alert("Failed to save: " + JSON.stringify(error.response?.data));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this route?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/routes/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoutes(routes.filter(r => r.id !== id));
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-sm">
      <Header isLoggedIn isAdmin onNavigate={onNavigate} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Manage Routes</h1>
            <p className="text-xs text-gray-500">Compact view mode</p>
          </div>
          <Button size="sm" className="bg-[#0A4B78] h-8 text-xs" onClick={openCreateDialog}>
            <Plus className="w-3 h-3 mr-1" />
            Add Route
          </Button>
        </div>

        {/* --- COMPACT DIALOG --- */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl w-[95vw] h-[90vh] max-h-[90vh] flex flex-col p-0 gap-0">
            
            {/* Header: Очень компактный */}
            <div className="px-4 py-3 shrink-0 border-b bg-gray-50">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-lg leading-none">{editingId ? "Edit Route" : "Create Route"}</DialogTitle>
                <DialogDescription className="text-xs">Fill in the details below.</DialogDescription>
              </DialogHeader>
            </div>

            {/* Body: Плотный контент */}
            <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
              <div className="space-y-5">
                
                {/* 1. General Info (Compact Grid) */}
                <div className="space-y-2 border-b pb-4">
                  <h3 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-2">General Info</h3>
                  
                  {/* Row 1: Title & Image */}
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-7 space-y-1">
                      <Label className="text-[10px] text-gray-500 font-bold">TITLE</Label>
                      <Input 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        placeholder="Route Title"
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="col-span-5 space-y-1">
                      <Label className="text-[10px] text-gray-500 font-bold">IMAGE URL</Label>
                      <Input 
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})} 
                        placeholder="https://..."
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>

                  {/* Row 2: Description */}
                  <div className="space-y-1">
                     <Label className="text-[10px] text-gray-500 font-bold">DESCRIPTION</Label>
                    <Textarea 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      placeholder="Brief description..."
                      rows={1}
                      className="text-xs min-h-[36px] resize-none"
                    />
                  </div>

                  {/* Row 3: Metrics (3 columns) */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-500 font-bold flex items-center gap-1"><DollarSign className="w-3 h-3"/> BUDGET</Label>
                      <Input 
                        value={formData.budget_range} 
                        onChange={e => setFormData({...formData, budget_range: e.target.value})} 
                        placeholder="$200-300"
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-500 font-bold flex items-center gap-1"><Activity className="w-3 h-3"/> DIFFICULTY</Label>
                      <Input 
                        value={formData.difficulty} 
                        onChange={e => setFormData({...formData, difficulty: e.target.value})} 
                        placeholder="Moderate"
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-gray-500 font-bold flex items-center gap-1"><Map className="w-3 h-3"/> KM</Label>
                      <Input 
                        type="number"
                        value={formData.distance_km} 
                        onChange={e => setFormData({...formData, distance_km: parseInt(e.target.value) || 0})} 
                        className="h-7 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Stops Section (Compact) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between sticky top-0 bg-white z-10 py-1 border-b">
                    <h3 className="font-bold text-xs uppercase text-gray-400 tracking-wider">Itinerary ({formData.stops.length} Days)</h3>
                  </div>

                  <div className="space-y-2">
                    {formData.stops.map((stop, index) => (
                      <Card key={index} className="w-full border-gray-200 shadow-none hover:border-blue-300 transition-all group">
                        <CardContent className="p-2 flex gap-3 items-start relative">
                           {/* Кнопка удаления (появляется при наведении) */}
                           <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute -right-1 -top-1 h-6 w-6 text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeStop(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>

                          {/* Day Indicator (Small) */}
                          <div className="shrink-0 pt-1">
                            <div className="w-6 h-6 rounded bg-[#0A4B78] text-white flex items-center justify-center font-bold text-xs">
                              {stop.day_number}
                            </div>
                          </div>

                          {/* Inputs Grid */}
                          <div className="flex-1 grid grid-cols-12 gap-2">
                            {/* Line 1: Title (7 cols) + Duration (5 cols) */}
                            <div className="col-span-7">
                                <Input 
                                  value={stop.title} 
                                  onChange={e => updateStop(index, 'title', e.target.value)}
                                  placeholder="Stop Title"
                                  className="h-6 text-xs border-transparent hover:border-input focus:border-input px-1"
                                />
                            </div>
                            <div className="col-span-5">
                                <Input 
                                  value={stop.duration_label} 
                                  onChange={e => updateStop(index, 'duration_label', e.target.value)}
                                  placeholder="Duration"
                                  className="h-6 text-xs border-transparent hover:border-input focus:border-input px-1 text-gray-500"
                                />
                            </div>

                            {/* Line 2: Description (Full) */}
                            <div className="col-span-12">
                                <Textarea 
                                  value={stop.description} 
                                  onChange={e => updateStop(index, 'description', e.target.value)}
                                  className="text-xs min-h-[30px] h-[30px] resize-none py-1 px-1 border-transparent hover:border-input focus:border-input bg-gray-50/50"
                                  placeholder="Day description..."
                                />
                            </div>
                             
                            {/* Line 3: Image URL (Full) */}
                            <div className="col-span-12">
                                <Input 
                                  value={stop.image} 
                                  onChange={e => updateStop(index, 'image', e.target.value)}
                                  className="h-5 text-[10px] text-gray-400 font-mono border-transparent hover:border-input focus:border-input px-1"
                                  placeholder="Image URL..."
                                />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={addStop}
                      className="w-full h-8 border-dashed text-xs text-gray-500 hover:text-[#0A4B78] hover:bg-blue-50"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Day
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Compact */}
            <div className="p-3 border-t bg-gray-50 shrink-0 flex justify-end gap-2">
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-[#0A4B78] h-7 text-xs" onClick={handleSave} disabled={submitting}>
                {submitting && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                Save
              </Button>
            </div>

          </DialogContent>
        </Dialog>

        {/* Routes Table (Compact) */}
        <div className="bg-white rounded border shadow-sm overflow-hidden mt-4">
          <Table>
            <TableHeader>
              <TableRow className="h-8 hover:bg-transparent">
                <TableHead className="h-8 text-xs py-1 w-[50px]">ID</TableHead>
                <TableHead className="h-8 text-xs py-1">Title</TableHead>
                <TableHead className="h-8 text-xs py-1">Days</TableHead>
                <TableHead className="h-8 text-xs py-1">Diff</TableHead>
                <TableHead className="h-8 text-xs py-1">Stops</TableHead>
                <TableHead className="h-8 text-xs py-1 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-4 text-xs">Loading...</TableCell></TableRow>
              ) : routes.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-4 text-xs">No routes found</TableCell></TableRow>
              ) : (
                routes.map((route) => (
                  <TableRow key={route.id} className="h-8">
                    <TableCell className="py-1 text-xs">{route.id}</TableCell>
                    <TableCell className="py-1 text-xs font-medium">{route.title}</TableCell>
                    <TableCell className="py-1 text-xs">{route.duration_days}</TableCell>
                    <TableCell className="py-1 text-xs">{route.difficulty}</TableCell>
                    <TableCell className="py-1 text-xs">{route.stops?.length || 0}</TableCell>
                    <TableCell className="py-1 text-xs text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(route)}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600" onClick={() => handleDelete(route.id)}>
                          <Trash2 className="w-3 h-3" />
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