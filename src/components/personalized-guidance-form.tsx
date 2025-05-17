// src/components/personalized-guidance-form.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { handleGenerateGuidance, type GuidanceFormState, type ChatMessage } from '@/app/guidance/actions';
import { generateSpeechAction } from '@/app/actions/generate-speech'; // New import
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Info, Sparkles, Send, User, Volume2, StopCircle, Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const initialState: GuidanceFormState = {
  message: '',
  isError: false,
  updatedConversationHistory: [],
};

// Inner component to use useFormStatus
function FormFieldsAndStatus({
  fields,
  isError,
  message,
  conversationHistoryLength,
  currentIssue,
  setCurrentIssue,
}: {
  fields?: Record<string, string>;
  isError?: boolean;
  message?: string;
  conversationHistoryLength: number;
  currentIssue: string;
  setCurrentIssue: (issue: string) => void;
}) {
  const { pending } = require('react-dom').useFormStatus(); // Corrected import

  return (
    <>
      {conversationHistoryLength === 0 && (
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
            {fields?.profile && <p className="text-sm text-destructive mt-1">{fields.profile}</p>}
          </div>

          <div>
            <Label htmlFor="mood" className="text-lg font-semibold">Your Current Mood</Label>
            <Input
              id="mood"
              name="mood"
              placeholder="How are you feeling right now? (e.g., stressed, hopeful, a bit lost)"
              className="mt-2"
              required={conversationHistoryLength === 0}
              disabled={pending}
            />
            {fields?.mood && <p className="text-sm text-destructive mt-1">{fields.mood}</p>}
          </div>
        </>
      )}

      <div>
        <Label htmlFor="issue" className="text-lg font-semibold">
          {conversationHistoryLength === 0 ? "What's on your mind?" : "Your message to AatmAI:"}
        </Label>
        <Textarea
          id="issue"
          name="issue"
          value={currentIssue}
          onChange={(e) => setCurrentIssue(e.target.value)}
          rows={conversationHistoryLength === 0 ? 5 : 3}
          placeholder="Feel free to share any specific topic, challenge, or feeling you'd like to talk about. AatmAI is here to listen without judgment."
          className="mt-2"
          required
          disabled={pending}
        />
        {fields?.issue && <p className="text-sm text-destructive mt-1">{fields.issue}</p>}
      </div>

      {pending && (
        <Alert className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400 mr-2" />
          <AlertTitle className="text-blue-700 dark:text-blue-300">AatmAI is thinking...</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-400">
            Please wait a moment while AatmAI considers your thoughts.
          </AlertDescription>
        </Alert>
      )}

      {!pending && message && isError && !fields && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>An Error Occurred</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </>
  );
}

function SubmitButton() {
  const { pending } = require('react-dom').useFormStatus(); // Corrected import
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Send to AatmAI
    </Button>
  );
}

export default function PersonalizedGuidanceForm() {
  const [state, formAction] = useActionState(handleGenerateGuidance, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [currentIssue, setCurrentIssue] = useState('');

  // State for PlayHT audio
  const [audioStates, setAudioStates] = useState<Record<string, { isLoading: boolean; audioUrl?: string; isPlaying: boolean }>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeAudioMessageKey, setActiveAudioMessageKey] = useState<string | null>(null);


  useEffect(() => {
    // Initialize audio element
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.onended = () => {
        if (activeAudioMessageKey) {
          setAudioStates(prev => ({
            ...prev,
            [activeAudioMessageKey]: { ...prev[activeAudioMessageKey], isPlaying: false }
          }));
          setActiveAudioMessageKey(null);
        }
      };
      audioRef.current.onerror = () => {
        toast({ title: "Audio Error", description: "Could not play audio.", variant: "destructive" });
        if (activeAudioMessageKey) {
           setAudioStates(prev => ({
            ...prev,
            [activeAudioMessageKey]: { ...prev[activeAudioMessageKey], isPlaying: false, isLoading: false }
          }));
          setActiveAudioMessageKey(null);
        }
      };
    }

    const storedHistory = localStorage.getItem('aatmAI-chat-history');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
            setConversationHistory(parsedHistory);
        } else {
            localStorage.removeItem('aatmAI-chat-history');
        }
      } catch (e) {
        console.error("Failed to parse chat history from localStorage", e);
        localStorage.removeItem('aatmAI-chat-history');
      }
    }
    
    return () => { // Cleanup
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = ''; // Release audio resource
        }
    };
  }, []);

  useEffect(() => {
    if (state.message && !state.isError && state.guidance) {
       toast({
        title: "AatmAI Responded!",
      });
      if(state.updatedConversationHistory){
        setConversationHistory(state.updatedConversationHistory);
        localStorage.setItem('aatmAI-chat-history', JSON.stringify(state.updatedConversationHistory));
      }
      setCurrentIssue('');
    } else if (state.message && state.isError) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [conversationHistory]);

  const handlePlayHTSpeech = async (text: string, messageKey: string) => {
    if (audioRef.current) {
        audioRef.current.pause(); // Stop any currently playing audio
    }

    // If this message's audio is already playing, stop it.
    if (activeAudioMessageKey === messageKey && audioStates[messageKey]?.isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setAudioStates(prev => ({ ...prev, [messageKey]: { ...prev[messageKey], isPlaying: false } }));
      setActiveAudioMessageKey(null);
      return;
    }
    
    // If audio for this message is loaded and paused, play it
    if (audioStates[messageKey]?.audioUrl && !audioStates[messageKey]?.isPlaying) {
        if (audioRef.current) {
            audioRef.current.src = audioStates[messageKey].audioUrl!;
            audioRef.current.play().catch(e => console.error("Error playing audio:", e));
            setAudioStates(prev => ({ ...prev, [messageKey]: { ...prev[messageKey], isPlaying: true } }));
            setActiveAudioMessageKey(messageKey);
        }
        return;
    }

    // If audio not loaded yet, fetch it
    setAudioStates(prev => ({ ...prev, [messageKey]: { isLoading: true, isPlaying: false } }));
    setActiveAudioMessageKey(messageKey); // Tentatively set, might reset on error

    const result = await generateSpeechAction({ text });

    if (result.error || !result.audioUrl) {
      toast({
        title: "Speech Generation Failed",
        description: result.error || "Could not generate audio.",
        variant: "destructive",
      });
      setAudioStates(prev => ({ ...prev, [messageKey]: { isLoading: false, isPlaying: false } }));
      if(activeAudioMessageKey === messageKey) setActiveAudioMessageKey(null);
      return;
    }

    setAudioStates(prev => ({
      ...prev,
      [messageKey]: { isLoading: false, audioUrl: result.audioUrl, isPlaying: true }
    }));
    
    if (audioRef.current) {
      audioRef.current.src = result.audioUrl;
      audioRef.current.play().catch(e => {
        console.error("Error playing generated audio:", e);
        toast({ title: "Audio Error", description: "Could not play generated audio.", variant: "destructive" });
        setAudioStates(prev => ({ ...prev, [messageKey]: { ...prev[messageKey], isPlaying: false } }));
        if(activeAudioMessageKey === messageKey) setActiveAudioMessageKey(null);
      });
    }
  };
  
  const handleStopSpeech = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset to beginning
    }
    if (activeAudioMessageKey) {
         setAudioStates(prev => ({
            ...prev,
            [activeAudioMessageKey]: { ...prev[activeAudioMessageKey], isPlaying: false }
          }));
        setActiveAudioMessageKey(null);
    }
  };


  return (
    <div className="space-y-6">
      {conversationHistory.length === 0 && (
        <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="font-semibold text-blue-700 dark:text-blue-300">Chat with AatmAI</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-400">
            AatmAI is here to listen. I may be an AI, but I'll try my best to offer thoughtful and supportive responses based on common human experiences and our conversation. Your privacy is respected; no personal data or conversation history is stored on our servers beyond your current session on this device.
          </AlertDescription>
        </Alert>
      )}

      {conversationHistory.length > 0 && (
        <Card className="bg-background/50 border shadow-md">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg text-primary">Our Conversation</CardTitle>
            {activeAudioMessageKey && audioStates[activeAudioMessageKey]?.isPlaying && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleStopSpeech}
                    className="h-8 w-8 p-1 text-destructive hover:bg-destructive/10"
                    aria-label="Stop all speech"
                >
                    <StopCircle className="h-5 w-5" />
                </Button>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {conversationHistory.map((msg, index) => {
                  const messageKey = `msg-${index}`;
                  const currentAudioState = audioStates[messageKey] || { isLoading: false, isPlaying: false };
                  
                  return (
                    <div
                      key={messageKey}
                      className={cn(
                        "flex flex-col p-3 rounded-lg shadow-sm text-sm w-full", 
                        msg.role === 'user' ? "bg-primary/10" : "bg-muted/60" 
                      )}
                    >
                      <div className="flex items-center gap-2 w-full break-words"> 
                          {msg.role === 'model' && <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />}
                          <p className={cn(
                              "whitespace-pre-wrap flex-1",
                              msg.role === 'user' ? "text-foreground" : "text-foreground"
                            )}
                          >
                            {msg.content}
                          </p>
                          {msg.role === 'user' && <User className="h-5 w-5 text-primary flex-shrink-0" />}
                      </div>
                      {msg.role === 'model' && (
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePlayHTSpeech(msg.content, messageKey)}
                              className="h-6 w-6 p-1 self-start mt-1"
                              aria-label={currentAudioState.isPlaying ? "Pause speech" : (currentAudioState.audioUrl ? "Play speech" : "Generate and play speech")}
                              disabled={currentAudioState.isLoading}
                          >
                              {currentAudioState.isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : currentAudioState.isPlaying ? (
                                <StopCircle className="h-4 w-4 text-destructive" />
                              ) : (
                                <Volume2 className="h-4 w-4 text-primary/80 hover:text-primary" />
                              )}
                          </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="conversationHistory" value={JSON.stringify(conversationHistory)} />
        <FormFieldsAndStatus
          fields={state.fields}
          isError={state.isError}
          message={state.message}
          conversationHistoryLength={conversationHistory.length}
          currentIssue={currentIssue}
          setCurrentIssue={setCurrentIssue}
        />
        <SubmitButton />
      </form>
    </div>
  );
}
