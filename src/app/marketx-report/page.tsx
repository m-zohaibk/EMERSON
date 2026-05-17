
"use client"

import { 
  FileText, 
  MapPin, 
  CheckCircle2, 
  Printer,
  ChevronLeft,
  Bell,
  Sparkles,
  Navigation,
  Target,
  Zap,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function MarketXReport() {
  const teamMembers = [
    { name: "Muhammad Hassan Yousaf", roll: "22" },
    { name: "Muhammad Zohaib", roll: "43" },
    { name: "Nida Sahar", roll: "23" },
    { name: "Fatima Tahira", roll: "09" },
    { name: "Iqra Aslam", roll: "18" },
    { name: "Ali Maqbool Malik", roll: "33" },
    { name: "Muhammad Younis", roll: "44" },
    { name: "Aizad Ali", roll: "42" }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-5xl mx-auto pb-32 px-4 relative">
      
      {/* Action Bar (Hidden in Print) */}
      <div className="flex items-center justify-between gap-4 sticky top-4 z-50 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border print:hidden">
        <Link href="/">
          <Button variant="ghost" className="gap-2 font-bold text-primary">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
        <Button 
          onClick={handlePrint}
          className="bg-primary text-white font-black gap-2 rounded-xl h-11 px-6 shadow-xl shadow-primary/20"
        >
          <Printer className="w-5 h-5" /> Print / Save PDF
        </Button>
      </div>

      {/* COVER PAGE */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-8 md:p-20 relative overflow-hidden text-center print:shadow-none print:border-none print:min-h-screen">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 print:hidden" />
        
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-10">
          <Image 
            src="https://i.postimg.cc/zvZGp3m7/image.png" 
            alt="Emerson Connect Logo"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-7xl font-black text-primary tracking-tighter uppercase leading-none">Emerson Connect</h1>
          <p className="text-xl md:text-2xl font-bold text-muted-foreground tracking-widest uppercase mt-4">Smart Campus Ecosystem</p>
          <div className="h-1.5 w-32 bg-primary mx-auto rounded-full mt-6" />
        </div>

        <div className="space-y-10 max-w-2xl w-full">
          <div>
            <h3 className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-6">Project Team</h3>
            <p className="text-xl font-black text-secondary mb-8">BS IT 6th Semester (Evening)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-left max-w-xl mx-auto border-y border-slate-100 py-8">
              {teamMembers.map((member, i) => (
                <div key={i} className="flex justify-between items-center pb-1">
                  <span className="font-bold text-slate-700">{member.name}</span>
                  <span className="font-black text-primary">({member.roll})</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-6">
            <p className="font-black text-slate-400 uppercase text-xs tracking-[0.4em] leading-loose">MarketX: Create • Redesign • Sell</p>
            <p className="font-bold text-slate-500 mt-2 text-sm">Emerson University Multan</p>
          </div>
        </div>
      </section>

      {/* PAGE 1: INTRODUCTION */}
      <section className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 min-h-[90vh] flex flex-col print:shadow-none print:border-none print:break-before-page">
        <div className="bg-primary p-12 text-white">
          <Badge className="bg-white/20 text-white border-none mb-4 font-bold px-4 py-1">PAGE 1/5: INTRODUCTION</Badge>
          <h2 className="text-5xl font-black uppercase tracking-tight">Project Overview</h2>
        </div>
        <CardContent className="p-14 space-y-10 flex-1 text-justify leading-[1.6]">
          <p className="text-xl font-medium text-slate-700">
            <strong>Emerson Connect</strong> is a professional digital solution designed to modernize the student experience at Emerson University Multan. Our platform serves as a unified hub that integrates <strong>GPS Navigation</strong>, <strong>AI-driven Support</strong>, and <strong>Automated Academic Records</strong>.
          </p>
          
          <div className="space-y-6 bg-slate-50 p-10 rounded-[2rem]">
            <h4 className="font-black text-primary uppercase text-sm tracking-[0.2em]">Our Mission</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <Target className="w-6 h-6 text-secondary mt-1 shrink-0" />
                <span className="text-lg"><strong>Simplify Campus Life:</strong> Removing physical and digital barriers for students.</span>
              </li>
              <li className="flex items-start gap-4">
                <Navigation className="w-6 h-6 text-secondary mt-1 shrink-0" />
                <span className="text-lg"><strong>Modernize Navigation:</strong> Providing exact digital routes for the massive 100-acre campus.</span>
              </li>
              <li className="flex items-start gap-4">
                <Zap className="w-6 h-6 text-secondary mt-1 shrink-0" />
                <span className="text-lg"><strong>Automate Data:</strong> Eliminating manual PDF searching through smart database integration.</span>
              </li>
            </ul>
          </div>
          
          <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl mt-10">
            <Image src="https://i.postimg.cc/sgdbZP6Q/image.png" alt="Emerson Connect Homepage" width={1200} height={700} className="object-cover w-full" />
            <div className="absolute bottom-6 left-6 bg-primary/95 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase shadow-lg">Platform Home Screen</div>
          </div>
        </CardContent>
      </section>

      {/* PAGE 2: THE PROBLEM */}
      <section className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 min-h-[90vh] flex flex-col print:shadow-none print:border-none print:break-before-page">
        <div className="bg-slate-50 p-12 border-b">
          <Badge className="bg-primary/10 text-primary border-none mb-4 font-bold px-4 py-1">PAGE 2/5: THE PROBLEM</Badge>
          <h2 className="text-5xl font-black text-primary uppercase tracking-tight">Campus Obstacles</h2>
        </div>
        <CardContent className="p-14 space-y-12 flex-1 text-justify leading-[1.6]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="font-black text-3xl text-secondary uppercase tracking-tight">1. Physical Friction</h3>
              <ul className="space-y-4 text-lg font-medium text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2.5 shrink-0" />
                  <span><strong>Navigation Difficulty:</strong> New students waste 20+ minutes daily finding specific labs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2.5 shrink-0" />
                  <span><strong>Outdated Signage:</strong> Lack of digital maps makes reaching the right department frustrating.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2.5 shrink-0" />
                  <span><strong>Efficiency Loss:</strong> Massive campus size causes students to frequently arrive late.</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-black text-3xl text-secondary uppercase tracking-tight">2. Manual Data Handling</h3>
              <ul className="space-y-4 text-lg font-medium text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2.5 shrink-0" />
                  <span><strong>Long PDF Gazettes:</strong> Students search through 500-page files for a single roll number.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2.5 shrink-0" />
                  <span><strong>CGPA Confusion:</strong> No instant way to track cumulative performance across semesters.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2.5 shrink-0" />
                  <span><strong>Missed Announcements:</strong> Physical notice boards are often ignored or outdated.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-10">
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center gap-5 shadow-sm transition-transform hover:scale-[1.02]">
              <div className="bg-white p-4 rounded-2xl shadow-sm"><MapPin className="w-10 h-10 text-primary" /></div>
              <p className="text-base font-bold text-slate-600"><strong>Time Loss</strong> due to lack of a digital campus directory.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center gap-5 shadow-sm transition-transform hover:scale-[1.02]">
              <div className="bg-white p-4 rounded-2xl shadow-sm"><FileText className="w-10 h-10 text-primary" /></div>
              <p className="text-base font-bold text-slate-600"><strong>Data Stress</strong> from manual record-keeping and searching.</p>
            </div>
          </div>
        </CardContent>
      </section>

      {/* PAGE 3: FLAGSHIP INNOVATION */}
      <section className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 min-h-[90vh] flex flex-col print:shadow-none print:border-none print:break-before-page">
        <div className="bg-secondary p-12 text-white">
          <Badge className="bg-white/20 text-white border-none mb-4 font-bold px-4 py-1">PAGE 3/5: FLAGSHIP INNOVATION</Badge>
          <h2 className="text-5xl font-black uppercase tracking-tight">Digital Campus Navigator</h2>
        </div>
        <CardContent className="p-14 space-y-12 flex-1 text-justify leading-[1.6]">
          <div className="space-y-8">
            <h3 className="font-black text-3xl text-primary uppercase tracking-tight">Smart Wayfinding</h3>
            <p className="text-xl font-medium text-slate-700">
              The <strong>Digital Navigator</strong> is our flagship tool, designed to eliminate the complexity of the Emerson campus.
            </p>
            <ul className="space-y-6">
              <li className="flex items-start gap-5">
                <CheckCircle2 className="w-7 h-7 text-secondary mt-1 shrink-0" />
                <span className="text-lg"><strong>GPS Integration:</strong> Precise coordinates for every department and laboratory.</span>
              </li>
              <li className="flex items-start gap-5">
                <CheckCircle2 className="w-7 h-7 text-secondary mt-1 shrink-0" />
                <span className="text-lg"><strong>Direct Navigation:</strong> Integrated walking paths that guide students directly.</span>
              </li>
              <li className="flex items-start gap-5">
                <CheckCircle2 className="w-7 h-7 text-secondary mt-1 shrink-0" />
                <span className="text-lg"><strong>Search Engine:</strong> Instant search for "IT Block," "Registrar," or "Library."</span>
              </li>
            </ul>
          </div>
          
          <div className="relative rounded-[3rem] overflow-hidden border-[12px] border-slate-50 shadow-2xl mt-8">
            <Image src="https://i.postimg.cc/sXSdQnYm/image.png" alt="Digital Navigator Feature" width={1200} height={700} className="object-cover w-full" />
            <div className="absolute top-6 right-6 bg-secondary text-white px-8 py-3 rounded-2xl font-black text-sm uppercase shadow-lg">Navigator Interface</div>
          </div>
          <p className="text-center font-black text-primary text-xl italic mt-6 tracking-tight">
            "From Main Gate to Classroom in under 30 seconds."
          </p>
        </CardContent>
      </section>

      {/* PAGE 4: DATA & ANNOUNCEMENTS */}
      <section className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 min-h-[90vh] flex flex-col print:shadow-none print:border-none print:break-before-page">
        <div className="bg-primary p-12 text-white">
          <Badge className="bg-white/20 text-white border-none mb-4 font-bold px-4 py-1">PAGE 4/5: DATA & AUTOMATION</Badge>
          <h2 className="text-5xl font-black uppercase tracking-tight">Smart Ecosystem</h2>
        </div>
        <CardContent className="p-14 space-y-12 flex-1 text-justify leading-[1.6]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            <div className="space-y-8">
              <h3 className="font-black text-3xl text-primary uppercase tracking-tight">Auto-Fetch Transcript</h3>
              <p className="text-lg font-medium text-slate-700 leading-relaxed">
                <strong>One-Time Setup:</strong> Students enter their roll number during <strong>Registration</strong>.
                <br /><br />
                <strong>Zero Search:</strong> After login, the system <strong>Auto-Fetches</strong> results from the database.
                <br /><br />
                <strong>Instant CGPA:</strong> View the <strong>Latest CGPA</strong> on a clean digital dashboard immediately.
              </p>
              <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-xl group">
                <Image src="https://i.postimg.cc/vmp0pbJV/image.png" alt="Transcript View" width={600} height={400} className="object-cover w-full transition-transform group-hover:scale-105" />
                <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-1.5 rounded-xl font-black text-[10px] text-primary uppercase">Digital Transcript</div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h3 className="font-black text-3xl text-secondary uppercase tracking-tight">Campus Announcements</h3>
              <p className="text-lg font-medium text-slate-700 leading-relaxed">
                <strong>Live Notice Board:</strong> Instant access to exam schedules and emergency alerts.
                <br /><br />
                <strong>Filterable Content:</strong> Browse updates by category (Exams, General, Emergency).
                <br /><br />
                <strong>Centralized Hub:</strong> Replaces physical boards with a professional digital interface.
              </p>
              <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-xl group">
                <Image src="https://i.postimg.cc/MK55Dyt4/image.png" alt="Campus Announcements" width={600} height={400} className="object-cover w-full transition-transform group-hover:scale-105" />
                <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-1.5 rounded-xl font-black text-[10px] text-secondary uppercase">Smart Notice Board</div>
              </div>
            </div>
          </div>
        </CardContent>
      </section>

      {/* PAGE 5: AI & CONCLUSION */}
      <section className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 min-h-[90vh] flex flex-col print:shadow-none print:border-none print:break-before-page">
        <div className="bg-slate-900 p-12 text-white">
          <Badge className="bg-white/20 text-white border-none mb-4 font-bold px-4 py-1">PAGE 5/5: AI & STRATEGY</Badge>
          <h2 className="text-5xl font-black uppercase tracking-tight">Final Vision</h2>
        </div>
        <CardContent className="p-14 space-y-12 flex-1 text-justify leading-[1.6]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
            <div className="space-y-8">
              <h3 className="font-black text-3xl text-primary uppercase tracking-tight">AI Assistant</h3>
              <p className="text-lg font-medium text-slate-700">
                <strong>Gemini Powered:</strong> Advanced AI for 24/7 student support.
                <br /><br />
                <strong>Trained Knowledge:</strong> Optimized for Emerson University buildings and notices.
                <br /><br />
                <strong>Natural Queries:</strong> Accurate retrieval of exam dates and result schedules.
              </p>
              <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-xl group">
                <Image src="https://i.postimg.cc/sx0srBsp/image.png" alt="AI Assistant" width={600} height={400} className="object-cover w-full transition-transform group-hover:scale-105" />
                <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-1.5 rounded-xl font-black text-[10px] text-primary uppercase">Emerson AI Chat</div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h3 className="font-black text-3xl text-secondary uppercase tracking-tight">Conclusion</h3>
              <p className="text-xl font-medium text-slate-600 leading-[1.6] bg-slate-50 p-8 rounded-[2rem]">
                <strong>Emerson Connect</strong> transforms the campus experience by bridging physical and digital barriers. With <strong>GPS navigation</strong>, <strong>automated records</strong>, and <strong>AI assistance</strong>, we empower students to focus on academic excellence. Our vision is a fully digital Emersonian ecosystem where every student has their university in their pocket.
              </p>
              
              <div className="flex flex-col items-center text-center gap-6 pt-6">
                <h3 className="text-2xl font-black text-primary uppercase tracking-tight">Scan to Experience</h3>
                <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border-4 border-slate-50">
                  <div className="relative w-32 h-32">
                    <Image 
                      src="https://i.postimg.cc/V6hzyrYw/image.png" 
                      alt="Official Scan QR Code"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </section>
    </div>
  );
}
