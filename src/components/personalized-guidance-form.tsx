
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { handleGenerateGuidance, type GuidanceFormState, type ChatMessage } from '@/app/guidance/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Info, Sparkles, Send, User, Volume2, StopCircle } from 'lucide-react';
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

function FormFieldsAndStatus({
  fields,
  isError,
  message,
  conversationHistoryLength,
  currentIssue,
  setCurrentIssue
}: {
  fields?: Record<string, string>;
  isError?: boolean;
  message?: string;
  conversationHistoryLength: number;
  currentIssue: string;
  setCurrentIssue: (issue: string) => void;
}) {
  const { pending } = useFormStatus();

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
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}


export default function PersonalizedGuidanceForm() {
  const [state, formAction] = useActionState(handleGenerateGuidance, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speakingMessageKey, setSpeakingMessageKey] = useState<string | null>(null);


  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [currentIssue, setCurrentIssue] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          window.speechSynthesis.onvoiceschanged = null; 
        }
      };
      loadVoices();
      if (window.speechSynthesis.getVoices().length === 0) { 
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    } else {
      setSpeechSynthesisSupported(false);
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
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel(); 
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
      // formRef.current?.reset(); // Reset profile and mood fields if they were visible - this line caused an issue when these fields are hidden.
      // Instead of resetting the whole form, just ensure the issue field is cleared, which is already done.
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

  const handleSpeak = (text: string, messageKey: string) => {
    if (!speechSynthesisSupported) {
      toast({
        title: "Speech Not Supported",
        description: "Your browser does not support text-to-speech.",
        variant: "destructive",
      });
      return;
    }

    if (speakingMessageKey === messageKey) { 
      window.speechSynthesis.cancel();
      setSpeakingMessageKey(null);
      return;
    }

    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);

    let selectedVoice: SpeechSynthesisVoice | null = null;

    // 1. Prioritize 'en-IN' female voices if available
    const enInFemaleVoices = voices.filter(
      (voice) => voice.lang.toLowerCase() === 'en-in' &&
                  (voice.name.toLowerCase().includes('female') || (voice as any).gender?.toLowerCase() === 'female')
    );
    if (enInFemaleVoices.length > 0) {
      selectedVoice = enInFemaleVoices.find(v => v.localService) || enInFemaleVoices[0];
    }

    // 2. If not, try specific known high-quality female English voices
    if (!selectedVoice) {
      const knownFemaleVoiceNames = [
        "Microsoft Zira Desktop - English (United States)",
        "Samantha", 
        "Google UK English Female",
        "Google US English Female", 
        "Tessa", 
        "Allison", 
        "Susan", // Another common Apple voice
        "Moira", // Apple Ireland
      ];
      const preferredFemaleEnglishVoices = voices.filter(voice =>
        voice.lang.startsWith('en') &&
        knownFemaleVoiceNames.some(name => voice.name.includes(name))
      );
      if (preferredFemaleEnglishVoices.length > 0) {
        selectedVoice = preferredFemaleEnglishVoices.find(v => v.localService) || preferredFemaleEnglishVoices[0];
      }
    }

    // 3. If still not found, try any voice with "female" in its name and is English
    if (!selectedVoice) {
      const genericFemaleEnglishVoices = voices.filter(voice =>
        voice.lang.startsWith('en') &&
        (voice.name.toLowerCase().includes('female') || (voice as any).gender?.toLowerCase() === 'female')
      );
      if (genericFemaleEnglishVoices.length > 0) {
        selectedVoice = genericFemaleEnglishVoices.find(v => v.localService) || genericFemaleEnglishVoices[0];
      }
    }

    // 4. Fallback: Use any English voice if no female voice could be specifically identified
    if (!selectedVoice) {
        const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
        if (englishVoices.length > 0) {
            selectedVoice = englishVoices.find(v => v.localService) || 
                            englishVoices.find(v => v.name.includes("Google")) || // Prefer Google voices
                            englishVoices.find(v => v.name.includes("Microsoft")) || // Then Microsoft
                            englishVoices[0];
        }
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setSpeakingMessageKey(messageKey);
    };
    utterance.onend = () => {
      setSpeakingMessageKey(null);
    };
    utterance.onerror = (event) => {
      console.error("Speech synthesis error event:", event, "Error details:", (event as any).error || "N/A");
      setSpeakingMessageKey(null);
      toast({
        title: "Speech Error",
        description: "Could not play the audio.",
        variant: "destructive",
      });
    };

    window.speechSynthesis.speak(utterance);
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
          <CardHeader>
            <CardTitle className="text-lg text-primary">Our Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {conversationHistory.map((msg, index) => {
                  const messageKey = `msg-${index}`;
                  const isCurrentlySpeaking = speakingMessageKey === messageKey;
                  return (
                    <div
                      key={messageKey}
                      className={cn(
                        "flex flex-col items-start gap-2 p-3 rounded-lg shadow-sm text-sm w-full",
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
                      {msg.role === 'model' && speechSynthesisSupported && (
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSpeak(msg.content, messageKey)}
                              className="h-6 w-6 p-1 self-start mt-1"
                              aria-label={isCurrentlySpeaking ? "Stop speaking AatmAI's message" : "Speak AatmAI's message"}
                          >
                              {isCurrentlySpeaking ? <StopCircle className="h-4 w-4 text-destructive" /> : <Volume2 className="h-4 w-4 text-primary/80 hover:text-primary" />}
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
