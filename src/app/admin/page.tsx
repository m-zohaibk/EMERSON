
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  MapPin, 
  Bell, 
  Trash2, 
  Loader2,
  LayoutDashboard,
  GraduationCap,
  Database,
  ShieldAlert,
  Eraser,
  Search,
  Navigation,
  FileText,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  useFirestore, 
  useCollection, 
  useMemoFirebase,
  useUser
} from '@/firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc,
  writeBatch,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import * as pdfjs from 'pdfjs-dist';
import * as XLSX from 'xlsx';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function AdminDashboard() {
  const db = useFirestore();
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  
  // Guard queries so they don't run until admin status is confirmed
  const isAdmin = user?.email === 'admin1@gmail.com';

  const locationsQuery = useMemoFirebase(() => 
    isAdmin ? collection(db, 'locations') : null, 
  [db, isAdmin]);

  const noticesQuery = useMemoFirebase(() => 
    isAdmin ? query(collection(db, 'notices'), orderBy('date', 'desc')) : null, 
  [db, isAdmin]);

  const resultsQuery = useMemoFirebase(() => 
    isAdmin ? query(collection(db, 'results'), orderBy('createdAt', 'desc'), limit(1000)) : null, 
  [db, isAdmin]);

  const { data: locations = [], loading: loadingLocs } = useCollection(locationsQuery);
  const { data: notices = [], loading: loadingNotices } = useCollection(noticesQuery);
  const { data: results = [], loading: loadingResults } = useCollection(resultsQuery);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [contentType, setContentType] = useState<'Location' | 'Notice'>('Location');
  const [formData, setFormData] = useState<any>({
    type: 'Classroom',
    category: 'General'
  });
  const [selectedSemester, setSelectedSemester] = useState<string>('Semester 1');
  const [bulkText, setBulkText] = useState('');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && user.email !== 'admin1@gmail.com') {
      router.push('/');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-bold">Verifying Administrator Access...</p>
      </div>
    );
  }

  if (!user || user.email !== 'admin1@gmail.com') return null;

  const handleSaveItem = async () => {
    setImporting(true);
    const collName = contentType === 'Location' ? 'locations' : 'notices';
    
    // Process tags
    const tagsArray = formData.tagsInput 
      ? formData.tagsInput.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
      : [];

    const finalData = {
      ...formData,
      tags: tagsArray,
      createdAt: new Date().toISOString()
    };
    delete finalData.tagsInput;

    try {
      await addDoc(collection(db, collName), finalData);
      toast({ title: "Success", description: `${contentType} added successfully.` });
      setDialogOpen(false);
      setFormData({ type: 'Classroom', category: 'General' });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save item." });
    } finally {
      setImporting(false);
    }
  };

  const handleWipeCollection = async (collName: 'locations' | 'notices' | 'results') => {
    const confirmMessage = `This will permanently delete ALL ${collName.toUpperCase()} records. Are you sure?`;
    if (!window.confirm(confirmMessage)) return;

    setImporting(true);
    try {
      const collRef = collection(db, collName);
      const snapshot = await getDocs(collRef);
      const batch = writeBatch(db);
      
      snapshot.docs.forEach((d) => {
        batch.delete(d.ref);
      });

      await batch.commit();
      toast({ title: "Collection Wiped", description: `Successfully deleted all records from ${collName}.` });
      setMaintenanceOpen(false);
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Action Failed", description: "Database error during bulk deletion." });
    } finally {
      setImporting(false);
    }
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      let combinedText = '';
      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        combinedText += rows.map(row => row.join('\t')).join('\n') + '\n\n';
      });
      setBulkText(combinedText);
      toast({ title: "Excel Data Extracted", description: "Review text below and run parser." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Excel Error", description: "Could not process spreadsheet." });
    } finally {
      setImporting(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => (item as any).str).join(' ');
        fullText += pageText + '\n';
      }
      setBulkText(fullText);
      toast({ title: "PDF Data Extracted", description: "Review text below and run parser." });
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "PDF Error", description: "Could not read PDF." });
    } finally {
      setImporting(false);
    }
  };

  const executeMasterParser = (text: string, defaultSemester: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const results: any[] = [];
    let currentSemester = defaultSemester;
    let subjectsInHeader: string[] = [];
    
    const semesterMarkers = [
      { regex: /1st/i, val: 'Semester 1' },
      { regex: /2nd/i, val: 'Semester 2' },
      { regex: /3rd/i, val: 'Semester 3' },
      { regex: /4th/i, val: 'Semester 4' },
      { regex: /5th/i, val: 'Semester 5' },
      { regex: /6th/i, val: 'Semester 6' },
      { regex: /7th/i, val: 'Semester 7' },
      { regex: /8th/i, val: 'Semester 8' },
    ];
    
    const statusKeywords = ['Promoted', 'Dropped', 'Pass', 'Fail', 'Passes', 'Failed'];
    const rollPattern = /[A-Z]{4}\d{9}/i;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.toUpperCase().includes('SEMESTER') || /^\s*(1st|2nd|3rd|4th|5th|6th|7th|8th)\s*$/i.test(line)) {
        const marker = semesterMarkers.find(m => m.regex.test(line));
        if (marker) {
          currentSemester = marker.val;
          subjectsInHeader = [];
          continue;
        }
      }
      const potentialCodes = line.match(/[A-Z]{2,}-?\s*\d+/g);
      if (potentialCodes && (line.includes('Sr#') || line.includes('Roll #'))) {
        subjectsInHeader = potentialCodes.map(c => c.replace(/\s+/g, ''));
        continue;
      }
      const rollMatch = line.match(rollPattern);
      const statusMatch = statusKeywords.find(s => line.includes(s));
      if (rollMatch && statusMatch) {
        const rollNumber = rollMatch[0].toUpperCase();
        const tokens = line.split(/\s+/).filter(t => t.length > 0);
        const rollIdx = tokens.findIndex(t => t.toUpperCase() === rollNumber);
        const statusIdx = tokens.findIndex(t => statusKeywords.includes(t));
        
        if (rollIdx !== -1 && statusIdx !== -1) {
          const middleTokens = tokens.slice(rollIdx + 1, statusIdx);
          const numbers = middleTokens.filter(t => /^\d+(\.\d+)?$/.test(t)).map(n => parseFloat(n));
          
          if (numbers.length > 0) {
            let sgpa = 0;
            let cgpa = 0;
            let grades: number[] = [];

            if (numbers.length >= 2) {
              cgpa = numbers[numbers.length - 1];
              sgpa = numbers[numbers.length - 2];
              grades = numbers.slice(0, -2);
            } else {
              sgpa = numbers[0];
              cgpa = sgpa;
              grades = [];
            }

            results.push({
              rollNumber,
              semester: currentSemester,
              gpa: sgpa,
              cgpa: cgpa,
              subjects: grades.map((g, idx) => ({
                name: subjectsInHeader[idx] || `Subject ${idx + 1}`,
                grade: g.toFixed(2),
                status: g > 0 ? 'Passed' : 'Failed'
              })),
              createdAt: new Date().toISOString()
            });
          }
        }
      }
    }
    return results;
  };

  const handleCommitBulk = async () => {
    if (!bulkText.trim()) return;
    setImporting(true);
    try {
      const parsedData = executeMasterParser(bulkText, selectedSemester);
      if (parsedData.length === 0) {
        toast({ variant: "destructive", title: "Parsing Failed", description: "No student records identified." });
        return;
      }
      const batch = writeBatch(db);
      parsedData.forEach(item => {
        const ref = doc(collection(db, 'results'));
        batch.set(ref, item);
      });
      await batch.commit();
      toast({ title: "Import Successful", description: `Uploaded ${parsedData.length} records.` });
      setBulkDialogOpen(false);
      setBulkText('');
    } catch (e) {
      toast({ variant: "destructive", title: "DB Error", description: "Failed to save results." });
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = (id: string, coll: string) => {
    const docRef = doc(db, coll, id);
    deleteDoc(docRef).catch(async (err) => {
      const permissionError = new FirestorePermissionError({ path: docRef.path, operation: 'delete' });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 pb-20 px-2 sm:px-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-4 rounded-3xl text-white shadow-xl shadow-primary/20">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-primary leading-tight">Admin Console</h1>
            <p className="text-muted-foreground font-medium text-sm sm:text-base">Infrastructure Management System</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Dialog open={maintenanceOpen} onOpenChange={setMaintenanceOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/5 rounded-2xl h-11 px-6">
                <ShieldAlert className="w-4 h-4" /> Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] p-8 max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-destructive text-xl font-black">Danger Zone</DialogTitle>
                <DialogDescription className="font-medium">Clear collections to prevent duplicates.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {['locations', 'notices', 'results'].map((c: any) => (
                  <Button key={c} variant="destructive" className="w-full justify-between h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest" onClick={() => handleWipeCollection(c)}>
                    Delete All {c} <Eraser className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-2xl h-12 px-6 bg-primary text-white font-black shadow-xl shadow-primary/20">
                <Plus className="w-5 h-5" /> Add Content
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] p-10 sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Add New Content</DialogTitle>
                <DialogDescription>Create a single location or campus announcement.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Select onValueChange={(val: any) => setContentType(val)} defaultValue={contentType}>
                    <SelectTrigger className="rounded-xl h-12 border-none bg-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Location">Campus Location</SelectItem>
                      <SelectItem value="Notice">Notice/Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {contentType === 'Location' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Location Name</Label>
                      <Input 
                        placeholder="e.g. IT Block Library"
                        className="rounded-xl h-12 bg-slate-100 border-none px-4"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location Type</Label>
                      <Select onValueChange={(val: any) => setFormData({ ...formData, type: val })} defaultValue="Classroom">
                        <SelectTrigger className="rounded-xl h-12 border-none bg-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Classroom', 'Office', 'Department', 'Service', 'Other'].map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Notice Title</Label>
                      <Input 
                        placeholder="e.g. Midterm Exams Schedule"
                        className="rounded-xl h-12 bg-slate-100 border-none px-4"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notice Category</Label>
                      <Select onValueChange={(val: any) => setFormData({ ...formData, category: val })} defaultValue="General">
                        <SelectTrigger className="rounded-xl h-12 border-none bg-slate-100">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['Exams', 'Admissions', 'General', 'Emergency'].map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Enter full details..."
                    className="rounded-xl bg-slate-100 border-none px-4 py-3 min-h-[100px]"
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags (Comma separated)</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="e.g. info, urgent, IT Block"
                      className="rounded-xl h-12 bg-slate-100 border-none pl-10 pr-4"
                      onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                    />
                  </div>
                </div>

                {contentType === 'Location' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Latitude</Label>
                      <Input type="number" step="any" className="rounded-xl h-12 bg-slate-100 border-none" onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude</Label>
                      <Input type="number" step="any" className="rounded-xl h-12 bg-slate-100 border-none" onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" className="rounded-xl h-12 bg-slate-100 border-none px-4" onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </div>
                )}
              </div>
              <DialogFooter className="mt-4">
                <Button onClick={handleSaveItem} disabled={importing} className="w-full rounded-xl h-14 bg-primary text-white font-black text-lg shadow-xl shadow-primary/20">
                  {importing ? <Loader2 className="animate-spin" /> : `Save ${contentType}`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded-2xl h-12 px-8 bg-secondary text-white font-black shadow-xl shadow-secondary/20">
                <Database className="w-5 h-5" /> Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90vw] md:max-w-[850px] rounded-[2.5rem] p-6 md:p-10 overflow-hidden flex flex-col max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Master Data Importer</DialogTitle>
                <DialogDescription className="font-medium">Multi-semester PDF/Excel support with CGPA support.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4 flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-primary">Excel Spreadsheet</Label>
                    <Input type="file" accept=".xlsx, .xls, .csv" onChange={handleExcelUpload} className="rounded-xl h-12 border-none bg-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-black text-[10px] uppercase tracking-widest text-primary">PDF Transcript</Label>
                    <Input type="file" accept=".pdf" onChange={handlePdfUpload} className="rounded-xl h-12 border-none bg-slate-100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-black text-[10px] uppercase tracking-widest text-primary">Initial Semester</Label>
                  <Select onValueChange={setSelectedSemester} defaultValue={selectedSemester}>
                    <SelectTrigger className="rounded-xl h-12 border-none bg-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={`Semester ${s}`}>Semester {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea 
                  placeholder="Paste raw text here if needed..." 
                  className="min-h-[300px] font-mono text-xs bg-slate-50 border-none rounded-2xl p-6 leading-relaxed"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                />
              </div>
              <DialogFooter className="mt-4 gap-3">
                <Button variant="ghost" onClick={() => setBulkDialogOpen(false)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleCommitBulk} disabled={importing || !bulkText.trim()} className="rounded-xl px-10 bg-secondary text-white font-black h-14 shadow-xl shadow-secondary/20">
                  {importing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Run Master Parser"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          { label: 'Locations', val: locations.length, icon: MapPin, color: 'bg-primary' },
          { label: 'Notices', val: notices.length, icon: Bell, color: 'bg-white text-primary border' },
          { label: 'Results', val: results.length, icon: GraduationCap, color: 'bg-white text-primary border' },
          { label: 'Admin', val: 'Active', icon: ShieldAlert, color: 'bg-secondary' }
        ].map((stat, i) => (
          <Card key={i} className={cn("border-none shadow-md rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden", stat.color)}>
            <CardHeader className="p-4 sm:p-8 space-y-1 text-inherit">
              <CardDescription className={cn("font-black uppercase tracking-widest text-[10px]", stat.color.includes('text-primary') ? 'text-primary/60' : 'text-white/70')}>
                {stat.label}
              </CardDescription>
              <CardTitle className="text-2xl sm:text-4xl font-black">{stat.val}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="results" className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <TabsList className="bg-white border p-1 rounded-2xl h-14 shadow-sm w-full sm:w-auto overflow-x-auto scrollbar-hide">
            <TabsTrigger value="results" className="rounded-xl flex-1 sm:flex-none px-6 font-bold"><GraduationCap className="w-4 h-4 mr-2" /> Results</TabsTrigger>
            <TabsTrigger value="locations" className="rounded-xl flex-1 sm:flex-none px-6 font-bold"><MapPin className="w-4 h-4 mr-2" /> Locations</TabsTrigger>
            <TabsTrigger value="notices" className="rounded-xl flex-1 sm:flex-none px-6 font-bold"><Bell className="w-4 h-4 mr-2" /> Notices</TabsTrigger>
          </TabsList>
        </div>

        {['results', 'locations', 'notices'].map(tab => (
          <TabsContent key={tab} value={tab}>
            <Card className="border-none shadow-xl rounded-[1.5rem] sm:rounded-[2rem] bg-white overflow-hidden">
              <div className="overflow-x-auto scrollbar-hide">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="pl-6 sm:pl-10 h-14 sm:h-16 text-[10px] font-black uppercase tracking-widest">{tab === 'results' ? 'Roll Number' : 'Name/Title'}</TableHead>
                      <TableHead className="h-14 sm:h-16 text-[10px] font-black uppercase tracking-widest">{tab === 'results' ? 'Semester' : 'Category/Type'}</TableHead>
                      <TableHead className="h-14 sm:h-16 text-[10px] font-black uppercase tracking-widest">Detail/Tags</TableHead>
                      <TableHead className="text-right pr-6 sm:pr-10 h-14 sm:h-16 text-[10px] font-black uppercase tracking-widest">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(tab === 'results' ? results : tab === 'locations' ? locations : notices).map((item: any) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="pl-6 sm:pl-10 py-4 sm:py-5 font-black text-secondary text-xs sm:text-sm">
                          {tab === 'results' ? item.rollNumber : item.name || item.title}
                        </TableCell>
                        <TableCell className="font-bold text-[11px] sm:text-sm">
                          {tab === 'results' ? item.semester : item.type || item.category}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {tab === 'results' ? (
                              <Badge variant="outline" className="rounded-lg font-bold border-slate-200 text-[10px] sm:text-xs">
                                CGPA: {(item.cgpa || item.gpa).toFixed(2)}
                              </Badge>
                            ) : (
                              (item.tags || []).slice(0, 3).map((t: string) => (
                                <Badge key={t} variant="outline" className="rounded-lg font-bold border-slate-200 text-[9px] sm:text-[10px] uppercase">
                                  {t}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6 sm:pr-10">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, tab)} className="text-destructive hover:bg-destructive/10 rounded-xl transition-colors h-8 w-8 sm:h-10 sm:w-10">
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
