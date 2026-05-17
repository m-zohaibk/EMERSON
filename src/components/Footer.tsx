
"use client"

import Link from 'next/link';
import { ExternalLink, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="w-full border-t bg-slate-50/50 mt-auto py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-sm font-black tracking-tighter text-primary">Emerson Connect</span>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Excellence • Innovation • Integrity
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="ghost" className="rounded-xl gap-2 text-muted-foreground hover:text-primary transition-colors text-xs font-bold">
            <ExternalLink className="w-3 h-3" />
            Student Portal
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground font-medium order-first md:order-last">
          &copy; {new Date().getFullYear()} Emerson University Multan.
        </p>
      </div>
    </footer>
  );
}
