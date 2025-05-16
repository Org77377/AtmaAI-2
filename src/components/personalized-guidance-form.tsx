
"use client";

import React, { useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Removed CardDescription, CardFooter
import { handleGenerateGuidance, type GuidanceFormState } from '@/app/guidance/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Info, Sparkles } from 'lucide-react'; // Removed CheckCircle

const initialState: GuidanceFormState = {
  message: '',
  isError: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Chat with AatmAI
    </Button>
  );
}

export default function PersonalizedGuidanceForm() {
  const [state, formAction] = React.useActionState(handleGenerateGuidance, initialState); 
  const { toast } = useToast();
  const { pending } = useFormStatus();

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
          description: state.message,
        });
      }
    }
  }, [state, pending, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="p-4 border rounded-md bg-accent/10 text-accent-foreground/80 text-sm">
        <Info className="inline-block h-4 w-4 mr-2" />
        AatmAI is here to listen. I may be an AI, but I'll try my best to offer thoughtful and supportive responses based on common human experiences. Your privacy is respected; no personal data is stored.
      </div>
      <div>
        <Label htmlFor="profile" className="text-lg font-semibold">About You (Optional, helps personalize our chat)</Label>
        <Textarea
          id="profile"
          name="profile"
          rows={4}
          placeholder="You can share a bit about yourself: perhaps your general situation, interests, or anything you feel is relevant. The more context, the better I can understand."
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

      <div>
        <Label htmlFor="issue" className="text-lg font-semibold">What's on your mind?</Label>
        <Textarea
          id="issue"
          name="issue"
          rows={5}
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
              {state.message} Please try again. If the problem persists, AatmAI might be taking a short break.
            </AlertDescription>
          </Alert>
      )}

      <SubmitButton />

      {!pending && state.guidance && !state.isError && (
        <Card className="mt-8 bg-primary/5 dark:bg-primary/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <CardTitle className="text-primary">AatmAI's Thoughts For You</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-primary/90">Response:</h3>
              <p className="text-foreground whitespace-pre-wrap">{state.guidance.guidance}</p>
            </div>
            {state.guidance.reasoning && (
                 <div>
                    <h3 className="font-semibold text-lg text-primary/90">A Little More Insight:</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap text-sm">{state.guidance.reasoning}</p>
                </div>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}
