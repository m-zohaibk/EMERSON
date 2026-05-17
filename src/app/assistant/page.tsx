
"use client"

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithCampusAIAssistant, speakAnswer } from '@/ai/flows/campus-ai-assistant-chat';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Salam! I am your Emerson Connect AI assistant. How can I help you with campus information, locations, or notices today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithCampusAIAssistant({ question: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: response.answer }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I'm having difficulty connecting to the Emerson servers. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (index: number, text: string) => {
    if (isSpeaking === index) {
      audioRef.current?.pause();
      setIsSpeaking(null);
      return;
    }

    try {
      setIsSpeaking(index);
      const { audioUrl } = await speakAnswer(text);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        audioRef.current.onended = () => setIsSpeaking(null);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-[calc(100vh-10rem)] min-h-[600px] animate-in fade-in duration-500 pb-4">
      <audio ref={audioRef} hidden />
      <Card className="flex-1 flex flex-col border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="border-b bg-primary text-white py-5 px-8 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-full shadow-lg">
              <div className="relative w-8 h-8">
                <Image 
                  src="https://i.postimg.cc/zvZGp3m7/image.png" 
                  alt="Emerson AI"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Emerson AI Assistant</CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Active • Supporting Emersonians
              </div>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-white/40 animate-pulse" />
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col bg-slate-50/30 overflow-hidden relative">
          <ScrollArea className="flex-1 h-full w-full">
            <div className="p-6 space-y-6 min-h-full">
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2",
                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                    m.role === 'user' ? "bg-secondary text-white" : "bg-white border text-primary"
                  )}>
                    {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col gap-2 max-w-[80%]">
                    <div className={cn(
                      "px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed font-medium shadow-sm relative group",
                      m.role === 'user' 
                        ? "bg-secondary text-white rounded-tr-none" 
                        : "bg-white text-foreground rounded-tl-none border border-slate-100"
                    )}>
                      {m.content}
                      {m.role === 'assistant' && (
                        <button 
                          onClick={() => handleSpeak(i, m.content)}
                          className="absolute -right-10 top-0 p-2 text-primary hover:bg-accent rounded-full transition-all"
                        >
                          {isSpeaking === i ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-2xl bg-white border flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="bg-white px-5 py-4 rounded-[1.5rem] rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Searching Campus Database...</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} className="h-4" />
            </div>
          </ScrollArea>

          <div className="p-6 border-t bg-white shrink-0">
            <div className="flex gap-3 max-w-3xl mx-auto">
              <Input 
                placeholder="Ask about admissions, results, or department locations..." 
                className="rounded-2xl h-14 bg-slate-50 border-none focus-visible:ring-primary shadow-inner text-base px-6"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              />
              <Button 
                onClick={handleSend} 
                className="rounded-2xl h-14 w-14 p-0 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all"
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-6 h-6" />
              </Button>
            </div>
            <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-tighter">
              Official Emerson Connect AI • Excellence, Innovation, Integrity
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
