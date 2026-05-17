"use client"

import { useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, Camera, Loader2, Save, Fingerprint, Award, CheckCircle2, QrCode, Printer } from 'lucide-react';
import Image from 'next/image';
import { doc, updateDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const [saving, setSaving] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const userDocRef = useMemoFirebase(() => user ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: profile, loading: profileLoading } = useDoc(userDocRef);

  const handleUpdatePhoto = async () => {
    if (!user || !photoUrlInput) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        photoUrl: photoUrlInput,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || profileLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
  if (!user) return <div className="text-center py-20 font-black text-primary text-xl px-6">Access restricted.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-16 animate-in fade-in duration-700 pb-20 px-0">
      {/* Profile Banner - Optimized for mobile */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-14 bg-white p-6 md:p-16 rounded-[2rem] md:rounded-[4rem] shadow-xl border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 md:w-80 md:h-80 bg-primary/5 rounded-full -mr-20 -mt-20" />
        
        <div className="relative z-10 shrink-0">
          <div className="w-32 h-32 md:w-64 md:h-64 rounded-[2rem] md:rounded-[3.5rem] bg-slate-50 flex items-center justify-center overflow-hidden border-[8px] border-white shadow-xl relative">
            {profile?.photoUrl ? (
              <div className="relative w-full h-full">
                <Image src={profile.photoUrl} alt="Identity Photo" fill className="object-cover" />
              </div>
            ) : (
              <User className="w-12 h-12 md:w-24 md:h-24 text-primary/10" />
            )}
          </div>
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute -bottom-2 -right-2 w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] shadow-xl bg-primary text-white"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Camera className="w-4 h-4 md:w-7 md:h-7" />
          </Button>
        </div>

        <div className="flex-1 space-y-3 md:space-y-6 text-center md:text-left z-10">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-6xl font-black text-primary tracking-tighter leading-none">{profile?.name || 'Student'}</h1>
            <p className="text-muted-foreground font-black tracking-widest uppercase text-[8px] md:text-xs flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-3 h-3 text-secondary" /> {user.email}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4">
            <Badge className="bg-primary text-white rounded-xl md:rounded-2xl px-4 md:px-8 py-1.5 md:py-3 text-[10px] md:text-sm font-black">
              {profile?.rollNumber || 'VERIFYING ID'}
            </Badge>
            <Badge variant="secondary" className="rounded-xl md:rounded-2xl px-4 md:px-8 py-1.5 md:py-3 text-[10px] md:text-sm font-black bg-secondary/10 text-secondary border-none">
              STUDENT
            </Badge>
          </div>
        </div>
      </div>

      {isEditing && (
        <Card className="border-none shadow-xl rounded-[2rem] bg-white p-6 md:p-12 space-y-6">
          <div className="space-y-3">
            <Label className="font-black text-[10px] uppercase tracking-widest text-primary/60">Photo URL</Label>
            <div className="flex flex-col md:flex-row gap-3">
              <Input 
                placeholder="Image URL" 
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                className="rounded-xl h-12 md:h-16 bg-slate-50 border-none px-6 font-bold"
              />
              <Button 
                onClick={handleUpdatePhoto} 
                disabled={saving || !photoUrlInput}
                className="rounded-xl h-12 md:h-16 px-8 bg-secondary text-white font-black"
              >
                {saving ? <Loader2 className="animate-spin" /> : 'Update Identity'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Identity Card Section - Scaled for Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-14">
        <div className="lg:col-span-3 space-y-6 md:space-y-14">
          <Card className="border-none shadow-lg rounded-[2rem] md:rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="bg-accent/30 py-6 md:py-10 px-6 md:px-12 border-b">
              <CardTitle className="text-xl md:text-3xl font-black flex items-center gap-3 text-primary">
                <Shield className="w-5 h-5 md:w-7 md:h-7" /> Enrollment Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-2 gap-6 md:gap-12 p-6 md:p-14">
              {[
                { label: 'Roll Number', val: profile?.rollNumber },
                { label: 'Status', val: 'VERIFIED', isStatus: true },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[8px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest">{item.label}</div>
                  <div className={cn("font-black text-sm md:text-2xl", item.isStatus ? "text-green-600" : "text-primary")}>
                    {item.val}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {/* Digital ID Visual - Responsive sizing */}
          <div className="bg-primary text-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center shadow-2xl min-h-[480px] md:min-h-[600px]">
            <div className="absolute top-6 left-6 w-10 h-10">
              <Image src="https://i.postimg.cc/zvZGp3m7/image.png" alt="University" fill className="object-contain" />
            </div>
            
            <div className="mt-8 space-y-6 w-full">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white/20 overflow-hidden mx-auto bg-white/10 p-1">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  {profile?.photoUrl ? (
                    <Image src={profile.photoUrl} alt="Student" fill className="object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter">{profile?.name || 'STUDENT'}</h2>
                <p className="text-[8px] md:text-[10px] text-white/50 font-black tracking-widest uppercase">Excellence • Innovation • Integrity</p>
              </div>
              <div className="bg-white p-4 md:p-8 rounded-[2rem] w-40 h-40 md:w-64 md:h-64 mx-auto flex items-center justify-center shadow-2xl">
                <QrCode className="w-full h-full text-primary" />
              </div>
              <div className="pt-4">
                <div className="text-[8px] text-white/40 font-black uppercase mb-1">Serial ID</div>
                <div className="text-2xl md:text-4xl font-black tracking-tighter bg-white/10 py-2 rounded-xl">
                  {profile?.rollNumber}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
