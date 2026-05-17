"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Bell, MessageSquare, LayoutDashboard, Settings, Menu, UserCircle, UserPlus, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import Image from 'next/image';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Locations', href: '/locations', icon: MapPin },
  { name: 'Updates', href: '/updates', icon: Bell },
  { name: 'AI Assistant', href: '/assistant', icon: MessageSquare },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const auth = useAuth();

  const handleLogout = () => signOut(auth);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 shrink-0">
              <Image 
                src="https://i.postimg.cc/zvZGp3m7/image.png" 
                alt="Emerson"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm md:text-xl font-black tracking-tighter text-primary">Emerson Connect</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                  pathname === item.href ? "bg-accent text-primary" : "text-muted-foreground hover:bg-slate-50"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2">
                  <div className="flex flex-col items-end leading-none">
                    <span className="text-[10px] md:text-xs font-black text-primary uppercase">{user.email?.split('@')[0]}</span>
                    <span className="text-[8px] md:text-[10px] text-muted-foreground font-bold uppercase">Profile</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary">
                    <User className="w-4 h-4" />
                  </div>
                </Link>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" className="rounded-full px-4 font-bold text-xs h-8">Login</Button>
              </Link>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle className="text-primary font-black flex items-center gap-2">
                  <div className="relative w-6 h-6"><Image src="https://i.postimg.cc/zvZGp3m7/image.png" alt="E" fill /></div>
                  Emerson Connect
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col p-4 gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold",
                      pathname === item.href ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
                <Link 
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted"
                >
                  <User className="w-4 h-4" /> Profile
                </Link>
                {user ? (
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/5 text-left">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-primary">
                    <UserCircle className="w-4 h-4" /> Login
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
