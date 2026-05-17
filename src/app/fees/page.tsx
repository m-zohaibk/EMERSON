
"use client"

import { CreditCard, Download, Calendar, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_FEES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function FeesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Fee Vouchers</h1>
        <p className="text-muted-foreground">Manage your university dues and download payment vouchers.</p>
      </div>

      <div className="grid gap-6">
        {MOCK_FEES.map((fee) => (
          <Card key={fee.id} className="border-none shadow-md hover:shadow-lg transition-all rounded-[2rem] bg-white overflow-hidden">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className={cn(
                "p-8 md:w-64 flex flex-col justify-center items-center text-center gap-2",
                fee.status === 'Paid' ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
              )}>
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-2">
                  <CreditCard className="w-8 h-8" />
                </div>
                <div className="text-2xl font-black">{fee.amount}</div>
                <Badge className={cn(
                  "border-none",
                  fee.status === 'Paid' ? "bg-green-200 text-green-800" : "bg-orange-200 text-orange-800"
                )}>
                  {fee.status}
                </Badge>
              </div>
              <CardContent className="flex-1 p-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-xs uppercase font-bold text-muted-foreground mb-1 tracking-widest">Semester</div>
                    <div className="font-bold text-lg">{fee.semester}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase font-bold text-muted-foreground mb-1 tracking-widest">Voucher ID</div>
                    <div className="font-mono font-medium text-lg">{fee.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs uppercase font-bold text-muted-foreground mb-1 tracking-widest">Due Date</div>
                      <div className="font-bold">{fee.dueDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {fee.status === 'Unpaid' ? <Clock className="w-4 h-4 text-orange-500" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    <div>
                      <div className="text-xs uppercase font-bold text-muted-foreground mb-1 tracking-widest">Payment Status</div>
                      <div className="font-bold">{fee.status === 'Paid' ? 'Verified' : 'Pending Payment'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="p-8 border-t md:border-t-0 md:border-l flex flex-col justify-center gap-3">
                <Button className="rounded-xl gap-2 font-bold w-full h-11 shadow-lg shadow-primary/10">
                  <Download className="w-4 h-4" />
                  Voucher
                </Button>
                {fee.status === 'Unpaid' && (
                  <Button variant="outline" className="rounded-xl font-bold w-full h-11 border-primary text-primary hover:bg-primary/5">
                    Pay Online
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-accent/30 p-6 rounded-[2rem] border border-dashed border-primary/20 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-primary shrink-0" />
        <div className="text-sm">
          <p className="font-bold text-primary mb-1 uppercase tracking-wider">Note to Students</p>
          <p className="text-muted-foreground">Fee vouchers can be paid at any designated branch of HBL or via the University Online Payment portal. Please ensure payment before the due date to avoid a late fee fine of 500 PKR.</p>
        </div>
      </div>
    </div>
  );
}

// Fixed import for ResultsPage
import { CheckCircle2 as CheckCircleIcon } from 'lucide-react';
