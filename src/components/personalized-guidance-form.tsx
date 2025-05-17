
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { handleGenerateGuidance, type GuidanceFormState, type ChatMessage } from '@/app/guidance/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Info, Sparkles, Send, User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const initialState: GuidanceFormState = {
  message: '',
  isError: false,
  updatedConversationHistory: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Send to AatmAI
    </Button>
  );
}

export default function PersonalizedGuidanceForm() {
  const [state, formAction] = React.useActionState(handleGenerateGuidance, initialState); 
  const { toast } = useToast();
  const { pending } = useFormStatus();
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [currentIssue, setCurrentIssue] = useState('');

  useEffect(() => {
    const storedHistory = localStorage.getItem('aatmai-chat-history');
    if (storedHistory) {
      try {
        setConversationHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to parse chat history from localStorage", e);
        localStorage.removeItem('aatmai-chat-history'); // Clear corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if (state.message && !pending) {
      if (state.isError) {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      } else if (state.guidance) {
         toast({
          title: "AatmAI Responded!",
          // description: state.message, // Message might be too generic
        });
        if(state.updatedConversationHistory){
          setConversationHistory(state.updatedConversationHistory);
          localStorage.setItem('aatmai-chat-history', JSON.stringify(state.updatedConversationHistory));
        }
        setCurrentIssue(''); // Clear the input field after successful submission
      }
    }
  }, [state, pending, toast]);
  
  useEffect(() => {
    // Scroll to bottom when conversation history changes
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [conversationHistory]);

   const handleSubmitDecorator = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('conversationHistory', JSON.stringify(conversationHistory)); // Add current history
    formAction(formData);
  };


  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-md bg-accent/10 text-accent-foreground/80 text-sm">
        <Info className="inline-block h-4 w-4 mr-2 align-middle" />
        AatmAI is here to listen. I may be an AI, but I'll try my best to offer thoughtful and supportive responses based on common human experiences and our conversation. Your privacy is respected; no personal data is stored on servers.
      </div>

      {conversationHistory.length > 0 && (
        <Card className="bg-background/50">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Our Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {conversationHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg",
                      msg.role === 'user' ? "bg-primary/10 justify-end" : "bg-muted/50"
                    )}
                  >
                    {msg.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />}
                    <p className={cn(
                        "text-sm whitespace-pre-wrap",
                        msg.role === 'user' ? "text-right text-foreground" : "text-foreground"
                      )}
                    >
                      {msg.content}
                    </p>
                    {msg.role === 'user' && <User className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <form ref={formRef} action={formAction} onSubmit={handleSubmitDecorator} className="space-y-6">
        {/* Hidden input to carry conversation history string for the action */}
        <input type="hidden" name="conversationHistory" value={JSON.stringify(conversationHistory)} />

        {/* Conditionally render profile and mood if it's the start of a new session */}
        {conversationHistory.length === 0 && (
          <>
            <div>
              <Label htmlFor="profile" className="text-lg font-semibold">About You (Optional)</Label>
              <Textarea
                id="profile"
                name="profile"
                rows={3}
                placeholder="A brief note about yourself can help AatmAI understand you better (e.g., student, working professional, facing a specific life phase)."
                className="mt-2"
                disabled={pending}
              />
              {state.fields?.profile && <p className="text-sm text-destructive mt-1">{state.fields.profile}</p>}
            </div>

            <div>
              <Label htmlFor="mood" className="text-lg font-semibold">Your Current Mood</Label>
              <Input
                id="mood"
                name="mood"
                placeholder="How are you feeling right now? (e.g., stressed, hopeful, a bit lost)"
                className="mt-2"
                required
                disabled={pending}
              />
              {state.fields?.mood && <p className="text-sm text-destructive mt-1">{state.fields.mood}</p>}
            </div>
          </>
        )}


        <div>
          <Label htmlFor="issue" className="text-lg font-semibold">
            {conversationHistory.length === 0 ? "What's on your mind?" : "Your message to AatmAI:"}
          </Label>
          <Textarea
            id="issue"
            name="issue"
            rows={conversationHistory.length === 0 ? 5 : 3}
            value={currentIssue}
            onChange={(e) => setCurrentIssue(e.target.value)}
            placeholder="Feel free to share any specific topic, challenge, or feeling you'd like to talk about. AatmAI is here to listen without judgment."
            className="mt-2"
            required
            disabled={pending}
          />
          {state.fields?.issue && <p className="text-sm text-destructive mt-1">{state.fields.issue}</p>}
        </div>

        {pending && (
          <Alert className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-700 dark:text-blue-300">AatmAI is thinking...</AlertTitle>
            <AlertDescription className="text-blue-600 dark:text-blue-400">
              Please wait a moment while AatmAI considers your thoughts.
            </AlertDescription>
          </Alert>
        )}

        {!pending && state.message && state.isError && !state.fields && (
           <Alert variant="destructive" className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>An Error Occurred</AlertTitle>
              <AlertDescription>
                {state.message} Please try again.
              </AlertDescription>
            </Alert>
        )}

        <SubmitButton />
      </form>
    </div>
  );
}

