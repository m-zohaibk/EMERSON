
"use client"

import { Search, ChevronRight, Building2, Bell, Loader2, Sparkles, MapPin, FileText, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const db = useFirestore();
  const noticesQuery = useMemoFirebase(() => query(
    collection(db, 'notices'), 
    orderBy('date', 'desc'), 
    limit(4)
  ), [db]);
  
  const { data: notices = [], loading } = useCollection(noticesQuery);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center gap-6 md:gap-12 py-2 md:py-8">
        <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left order-2 md:order-1">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-primary leading-tight">
              Emerson <span className="text-secondary">Connect</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto md:mx-0">
              Official Digital Navigator and student ecosystem for Emerson University Multan.
            </p>
          </div>
        </div>
        
        <div className="relative w-32 h-32 sm:w-56 sm:h-56 xl:w-72 xl:h-72 flex items-center justify-center order-1 md:order-2">
          <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
          <div className="relative w-28 h-28 sm:w-56 sm:h-56">
            <Image 
              src="https://i.postimg.cc/zvZGp3m7/image.png" 
              alt="Emerson Emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Flagship Navigator Card */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-2xl bg-secondary text-white overflow-hidden relative rounded-[2rem] group h-full">
          <CardContent className="p-8 md:p-12 flex flex-col justify-between gap-6 z-10 relative">
            <div className="space-y-4">
              <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black flex items-center gap-3">
                  Campus Navigator
                  <Badge className="bg-white text-secondary font-black text-[10px] tracking-widest px-2 py-0">FLAGSHIP</Badge>
                </h2>
                <p className="text-white/80 text-sm font-medium leading-relaxed max-w-sm">
                  The primary search engine for finding any building, lab, or office on the 100-acre Emerson campus.
                </p>
              </div>
            </div>
            <Link href="/locations">
              <Button className="w-full md:w-auto px-10 h-14 font-black rounded-2xl bg-white text-secondary hover:bg-white/90 shadow-xl text-sm uppercase tracking-widest">
                Explore Directions
              </Button>
            </Link>
          </CardContent>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </Card>

        <Card className="border-none shadow-xl bg-primary text-white overflow-hidden relative rounded-[2rem] group h-full">
          <CardContent className="p-8 md:p-12 flex flex-col h-full justify-between gap-6 z-10 relative">
            <div className="space-y-4">
              <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-black">Emerson AI</h2>
                <p className="text-white/80 text-sm font-medium leading-relaxed">
                  Your smart conversational agent for campus info, exam dates, and student announcements.
                </p>
              </div>
            </div>
            <Link href="/assistant">
              <Button className="w-full md:w-auto px-10 h-14 font-black rounded-2xl bg-white text-primary hover:bg-white/90 shadow-xl text-sm uppercase tracking-widest">
                Start Chatting
              </Button>
            </Link>
          </CardContent>
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </Card>
      </section>

      {/* Quick Actions & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b px-8 py-6 bg-slate-50/50">
            <CardTitle className="text-xl flex items-center gap-2 text-primary font-black">
              <Bell className="w-6 h-6" />
              Campus Updates
            </CardTitle>
            <Link href="/updates">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-white font-bold text-xs h-8">
                View All <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary w-6 h-6" /></div>
            ) : notices.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {notices.map((notice: any) => (
                  <div key={notice.id} className="p-6 hover:bg-slate-50/80 transition-all cursor-pointer">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-secondary text-[10px] font-black px-2 py-0">
                          {notice.category}
                        </Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{notice.date}</span>
                      </div>
                      <h3 className="text-base font-black text-foreground line-clamp-1">{notice.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{notice.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-muted-foreground font-medium text-sm">
                No active announcements found.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Link href="/results" className="block group">
            <Card className="hover:shadow-xl transition-all border-none shadow-sm rounded-[2rem] bg-white">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="bg-green-100 p-4 rounded-3xl text-green-700">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-lg">My Transcript</h4>
                  <p className="text-xs text-muted-foreground font-bold">Check CGPA & Results</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/profile" className="block group">
            <Card className="hover:shadow-xl transition-all border-none shadow-sm rounded-[2rem] bg-white">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="bg-orange-100 p-4 rounded-3xl text-orange-700">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-lg">Digital ID</h4>
                  <p className="text-xs text-muted-foreground font-bold">Cloud Identity Portal</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
