"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChatMessage } from './chat-message';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export function OpsAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', parts: [{ text: userMessage }] }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: data.reply }] }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Optional: Add error toast here
      setMessages((prev) => [
        ...prev,
        { role: 'model', parts: [{ text: "**Error:** Sorry, I encountered a problem while processing your request. Please try again." }] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] shadow-sm overflow-hidden">
      <CardHeader className="border-b bg-slate-50/50 pb-4">
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🤖</span> Ops Assistant
        </CardTitle>
        <CardDescription>
          Ask anything about your restaurant operations (e.g., "What sold best today?", "Are any tables waiting long?")
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div 
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/30"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="text-4xl">👋</div>
              <p>Hi! I'm your AI assistant. How can I help you today?</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-md">
                <Button variant="outline" size="sm" onClick={() => setInputValue("What sold best today?")} className="text-xs">
                  What sold best today?
                </Button>
                <Button variant="outline" size="sm" onClick={() => setInputValue("Are any tables waiting long?")} className="text-xs">
                  Are any tables waiting long?
                </Button>
                <Button variant="outline" size="sm" onClick={() => setInputValue("What's our revenue for today?")} className="text-xs">
                  What's our revenue for today?
                </Button>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.parts[0].text} />
            ))
          )}
          {isLoading && (
            <div className="flex w-full items-start gap-4 p-4 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200">
                <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-tl-sm rounded-2xl px-5 py-3 text-sm">
                <span className="flex space-x-1">
                  <span className="animate-bounce delay-75">.</span>
                  <span className="animate-bounce delay-150">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type your question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 shadow-none focus-visible:ring-amber-500"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim() || isLoading}
              className="bg-amber-500 hover:bg-amber-600 text-white shrink-0 shadow-none"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
