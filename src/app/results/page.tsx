
"use client"

import { FileText, Trophy, GraduationCap, CheckCircle2, AlertCircle, Loader2, ArrowRight, Lock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  
  const userDocRef = useMemoFirebase(() => user ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: userProfile, loading: profileLoading } = useDoc(userDocRef);

  const resultsQuery = useMemoFirebase(() => {
    if (!userProfile?.rollNumber) return null;
    return query(collection(db, 'results'), where('rollNumber', '==', userProfile.rollNumber.toUpperCase().trim()));
  }, [db, userProfile?.rollNumber]);

  const { data: results = [], loading: resultsLoading } = useCollection(resultsQuery);

  if (authLoading || profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Accessing Secure Portal...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-primary/5 p-8 sm:p-16 rounded-[2rem] sm:rounded-[3rem] shadow-inner">
          <Lock className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
        </div>
        <div className="space-y-3 max-w-sm">
          <h2 className="text-2xl sm:text-4xl font-black text-primary tracking-tighter">Identity Required</h2>
          <p className="text-muted-foreground font-medium text-sm sm:text-lg">Please log in to access your secure academic transcript.</p>
        </div>
        <Link href="/login">
          <Button className="rounded-2xl h-14 sm:h-16 px-8 sm:px-12 font-black text-base shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 transition-all">
            Student Login <ArrowRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      </div>
    );
  }

  const sortedResults = [...results].sort((a: any, b: any) => {
    const semA = parseInt(a.semester?.match(/\d+/)?.[0] || '0');
    const semB = parseInt(b.semester?.match(/\d+/)?.[0] || '0');
    return semB - semA;
  });

  const latestCGPA = sortedResults.length > 0 ? (sortedResults[0].cgpa || sortedResults[0].gpa).toFixed(2) : '0.00';

  return (
    <div className="space-y-6 sm:space-y-12 animate-in fade-in duration-700 max-w-5xl mx-auto pb-24 px-1 sm:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 sm:gap-8 px-4 sm:px-0">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-3xl sm:text-6xl font-black tracking-tighter text-primary leading-none">Transcript</h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Badge className="bg-secondary/10 text-secondary border-none px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
              Authenticated
            </Badge>
            <span className="text-foreground/60 font-black text-[10px] sm:text-sm uppercase tracking-tighter">
              ID: <span className="text-primary">{userProfile?.rollNumber}</span>
            </span>
          </div>
        </div>
        
        <Card className="bg-primary text-white border-none shadow-2xl px-5 py-4 sm:px-10 sm:py-8 flex items-center gap-4 sm:gap-8 rounded-[1.5rem] sm:rounded-[2.5rem] relative overflow-hidden w-full md:w-auto">
          <div className="bg-white/20 p-2 sm:p-4 rounded-xl sm:rounded-[1.5rem] shadow-xl">
            <Trophy className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-300" />
          </div>
          <div>
            <div className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest opacity-70 mb-0.5 sm:mb-1 leading-none">Latest CGPA</div>
            <div className="text-2xl sm:text-4xl font-black tabular-nums tracking-tighter">{latestCGPA}</div>
          </div>
        </Card>
      </div>

      {resultsLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
      ) : sortedResults.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:gap-10">
          {sortedResults.map((semester: any, idx) => (
            <Card key={idx} className="border-none shadow-xl rounded-[1.25rem] sm:rounded-[2.5rem] overflow-hidden bg-white hover:shadow-2xl transition-all border border-slate-100/50">
              <CardHeader className="bg-slate-50/50 border-b py-4 sm:py-8 px-4 sm:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="bg-primary/10 p-2 sm:p-4 rounded-xl sm:rounded-[1.5rem] shadow-sm">
                    <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-3xl font-black text-primary tracking-tight">{semester.semester}</CardTitle>
                    <div className="flex items-center gap-1 text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                      <Calendar className="w-3 h-3" />
                      Session: {new Date(semester.createdAt).getFullYear()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 sm:gap-10 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="flex gap-4 sm:gap-8">
                    <div className="text-left sm:text-right">
                      <div className="text-[8px] sm:text-[10px] font-black text-primary/40 uppercase tracking-widest mb-0.5">SGPA</div>
                      <div className="text-xl sm:text-3xl font-black text-primary/80 tabular-nums tracking-tighter leading-none">{semester.gpa.toFixed(2)}</div>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-[8px] sm:text-[10px] font-black text-secondary/60 uppercase tracking-widest mb-0.5">CGPA</div>
                      <div className="text-xl sm:text-3xl font-black text-secondary tabular-nums tracking-tighter leading-none">{(semester.cgpa || semester.gpa).toFixed(2)}</div>
                    </div>
                  </div>
                  <Badge className="bg-secondary text-white border-none rounded-lg sm:rounded-2xl px-3 sm:px-6 py-1 sm:py-2 text-[9px] sm:text-xs font-black">
                    PASSED
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto scrollbar-hide">
                  {semester.subjects && semester.subjects.length > 0 ? (
                    <Table>
                      <TableHeader className="bg-slate-100/20">
                        <TableRow>
                          <TableHead className="pl-4 sm:pl-12 h-10 sm:h-16 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Subject</TableHead>
                          <TableHead className="h-10 sm:h-16 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Grade</TableHead>
                          <TableHead className="text-right pr-4 sm:pr-12 h-10 sm:h-16 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {semester.subjects.map((sub: any, sIdx: number) => (
                          <TableRow key={sIdx} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="pl-4 sm:pl-12 py-3 sm:py-6 font-bold text-[10px] sm:text-lg text-foreground/80 tracking-tight">{sub.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-black px-2 sm:px-5 py-0.5 sm:py-1.5 rounded-full border-primary/20 text-primary text-[8px] sm:text-sm">
                                {sub.grade}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-4 sm:pr-12">
                              <div className="flex items-center justify-end gap-1 text-green-600 font-black text-[8px] sm:text-sm uppercase tracking-tighter">
                                <CheckCircle2 className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                                <span>VERIFIED</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="p-8 sm:p-16 text-center bg-slate-50/20">
                      <div className="flex flex-col items-center gap-3 sm:gap-4 max-w-xs mx-auto">
                        <AlertCircle className="w-6 h-6 text-orange-400" />
                        <h4 className="text-xs sm:text-lg font-black text-primary uppercase tracking-tight">Data Synchronized</h4>
                        <p className="text-[10px] sm:text-sm text-muted-foreground leading-relaxed font-medium">Averages are verified. Subject-specific records issued.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 sm:py-40 bg-slate-50/50 rounded-[2rem] sm:rounded-[4rem] border-4 border-dashed border-slate-200 px-6 mx-4 sm:mx-0">
          <div className="bg-white w-20 h-20 sm:w-28 sm:h-28 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl flex items-center justify-center mx-auto mb-6 sm:mb-10">
            <FileText className="w-10 h-10 sm:w-14 sm:h-14 text-primary/20" />
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-primary tracking-tighter">Results Pending</h3>
          <p className="text-muted-foreground max-w-sm mx-auto font-medium mt-3 sm:mt-4 text-xs sm:text-base">
            Transcript for <span className="text-secondary font-black">{userProfile?.rollNumber || 'Your ID'}</span> is waiting for registrar verification.
          </p>
        </div>
      )}
    </div>
  );
}
