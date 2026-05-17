
"use client"

import { useState } from 'react';
import { Search, Navigation, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase 
} from '@/firebase';
import { collection } from 'firebase/firestore';

export default function LocationsPage() {
  const db = useFirestore();
  const locationsQuery = useMemoFirebase(() => collection(db, 'locations'), [db]);
  const { data: locations, loading } = useCollection(locationsQuery);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const filteredLocations = (locations || []).filter((loc: any) => {
    const tags = loc.tags || [];
    const matchesSearch = loc.name?.toLowerCase().includes(search.toLowerCase()) || 
                         tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = !filter || loc.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleNavigate = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
    window.open(url, "_blank");
  };

  const filters = ['Classroom', 'Office', 'Department', 'Service'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Campus Locations</h1>
          <p className="text-muted-foreground">Search and navigate to any building or service on campus.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search by name, department, or tags..." 
            className="pl-10 h-11 rounded-xl shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === null ? "default" : "outline"} 
            onClick={() => setFilter(null)}
            size="sm"
            className="rounded-full"
          >
            All
          </Button>
          {filters.map((f) => (
            <Button 
              key={f} 
              variant={filter === f ? "default" : "outline"} 
              onClick={() => setFilter(f)}
              size="sm"
              className="rounded-full"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
      ) : filteredLocations.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((loc: any) => (
            <Card key={loc.id} className="border-none shadow-sm hover:shadow-md transition-all group rounded-2xl bg-white">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="bg-accent text-accent-foreground border-none">
                    {loc.type}
                  </Badge>
                  <MapPin className="w-5 h-5 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{loc.name}</CardTitle>
                <CardDescription className="line-clamp-2">{loc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {(loc.tags || []).map((tag: string) => (
                    <span key={tag} className="text-[10px] font-medium bg-muted px-2 py-0.5 rounded text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleNavigate(loc.latitude, loc.longitude)}
                  className="w-full gap-2 rounded-xl h-11 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all font-semibold"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  Navigate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No locations found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter keywords.</p>
        </div>
      )}
    </div>
  );
}
