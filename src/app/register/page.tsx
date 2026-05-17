
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Lock, Mail, User, ArrowRight, AlertCircle, Hash, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!rollNumber.trim()) {
      setError("University Roll Number is required.");
      setLoading(false);
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userData = {
        uid: user.uid,
        email: user.email,
        role: 'user',
        name: name,
        rollNumber: rollNumber.toUpperCase().trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="text-center py-10 bg-accent/20">
          <div className="bg-white w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-xl mb-6">
            <UserPlus className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black text-primary">Join Emerson Connect</CardTitle>
          <CardDescription className="font-medium">Create your official student account</CardDescription>
        </CardHeader>
        <CardContent className="px-8 pt-8">
          <form onSubmit={handleRegister} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="rounded-2xl border-none bg-destructive/10 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-bold">{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="font-black text-[10px] uppercase tracking-widest text-foreground/50 ml-1">Full Student Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ahmad Ali" 
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary font-bold"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollNumber" className="font-black text-[10px] uppercase tracking-widest text-foreground/50 ml-1">University Roll Number</Label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  id="rollNumber" 
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="COSC2311XXXXX" 
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary uppercase font-black tracking-widest"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-black text-[10px] uppercase tracking-widest text-foreground/50 ml-1">University Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@emerson.edu.pk" 
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary font-bold"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-black text-[10px] uppercase tracking-widest text-foreground/50 ml-1">Secure Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl font-black text-lg gap-3 shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 mt-6 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Complete Registration <ArrowRight className="w-6 h-6" /></>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="px-8 pb-10 pt-6 flex flex-col gap-4 text-center">
          <p className="text-sm font-bold text-muted-foreground">
            Already registered?{' '}
            <Link href="/login" className="text-secondary font-black hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
