"use client"

import { useState } from 'react';
import { Bell, Calendar, Filter, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase 
} from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function UpdatesPage() {
  const db = useFirestore();
  const noticesQuery = useMemoFirebase(() => query(collection(db, 'notices'), orderBy('date', 'desc')), [db]);
  const { data: notices, loading } = useCollection(noticesQuery);

  const [filter, setFilter] = useState<string | null>(null);

  const filteredNotices = (notices || []).filter((notice: any) => 
    !filter || notice.category === filter
  );

  const categories = ['Exams', 'General', 'Emergency'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20">
      <div className="space-y-3 px-4 sm:px-0">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-primary">Campus Updates</h1>
        <p className="text-muted-foreground font-medium text-lg">Official university announcements and alerts.</p>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 px-4 sm:px-0 scrollbar-hide">
        <div className="flex items-center bg-slate-100/50 p-1.5 rounded-full border shadow-sm">
          <Button 
            variant={filter === null ? "default" : "ghost"} 
            onClick={() => setFilter(null)}
            size="sm"
            className={cn("rounded-full px-6 font-bold text-xs h-9 transition-all", filter === null ? "shadow-lg" : "hover:bg-white")}
          >
            All Updates
          </Button>
          {categories.map((cat) => (
            <Button 
              key={cat} 
              variant={filter === cat ? "default" : "ghost"} 
              onClick={() => setFilter(cat)}
              size="sm"
              className={cn("rounded-full px-6 font-bold text-xs h-9 transition-all", filter === cat ? "shadow-lg bg-primary" : "hover:bg-white")}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-6 px-4 sm:px-0">
        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>
        ) : filteredNotices.length > 0 ? (
          filteredNotices.map((notice: any) => (
            <Card key={notice.id} className="border-none shadow-xl hover:shadow-2xl transition-all group cursor-pointer bg-white rounded-[2rem] overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className={cn(
                    "p-5 rounded-[1.5rem] shrink-0 shadow-lg transition-transform group-hover:rotate-6",
                    notice.category === 'Exams' ? 'bg-orange-100 text-orange-600 shadow-orange-100' :
                    notice.category === 'Emergency' ? 'bg-destructive/10 text-destructive shadow-red-100' :
                    'bg-primary/10 text-primary shadow-slate-100'
                  )}>
                    <Bell className="w-8 h-8" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200 px-3 py-1">
                        {notice.category}
                      </Badge>
                      <div className="flex items-center text-[11px] font-black text-muted-foreground gap-2 uppercase tracking-widest">
                        <Calendar className="w-4 h-4" />
                        {notice.date}
                      </div>
                    </div>
                    <h2 className="text-2xl font-black group-hover:text-primary transition-colors tracking-tight leading-tight">{notice.title}</h2>
                    <p className="text-muted-foreground leading-relaxed font-medium text-base line-clamp-3">{notice.description}</p>
                  </div>
                  <div className="hidden lg:flex items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <div className="bg-primary/5 p-3 rounded-full">
                      <ChevronRight className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-200">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-10" />
            <h3 className="text-2xl font-black text-primary">Quiet on Campus</h3>
            <p className="text-muted-foreground font-medium mt-2">Check back later for new updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}