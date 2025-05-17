
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleGenerateStudentNotes, type NotesGeneratorFormState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, NotebookText, Sparkles, Copy, HelpCircle, Info } from 'lucide-react';

const initialState: NotesGeneratorFormState = {
  message: '',
  isError: false,
  detailLevel: 'concise',
};

function SubmitButton({ detailLevel }: { detailLevel: 'concise' | 'detailed' }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      {detailLevel === 'concise' ? 'Generate Concise Notes' : 'Generate Detailed Explanation'}
    </Button>
  );
}

function NotesFormFieldsAndStatus({
  state,
  currentTopic,
  setCurrentTopic,
  handleExplainMore,
  currentDetailLevel, 
}: {
  state: NotesGeneratorFormState;
  currentTopic: string;
  setCurrentTopic: (topic: string) => void;
  handleExplainMore: () => void;
  currentDetailLevel: 'concise' | 'detailed';
}) {
  const { pending } = useFormStatus();
  const { toast } = useToast();

  const handleCopyNotes = () => {
    if (state.notes) {
      navigator.clipboard.writeText(state.notes)
        .then(() => {
          toast({ title: 'Notes Copied!', description: 'The generated notes have been copied to your clipboard.' });
        })
        .catch(err => {
          console.error('Failed to copy notes: ', err);
          toast({ title: 'Copy Failed', description: 'Could not copy notes to clipboard.', variant: 'destructive' });
        });
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="topic" className="text-lg font-semibold">Topic for Notes</Label>
        <Textarea
          id="topic"
          name="topic" 
          rows={3}
          placeholder="e.g., Photosynthesis, The French Revolution, Basics of Quantum Computing"
          className="mt-2"
          required
          disabled={pending}
          value={currentTopic}
          onChange={(e) => setCurrentTopic(e.target.value)}
        />
        {state.fields?.topic && <p className="text-sm text-destructive mt-1">{state.fields.topic}</p>}
      </div>
      
      <input type="hidden" name="detailLevel" value={currentDetailLevel} />

      {pending && (
        <Alert className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-700 dark:text-blue-300">AatmAI is generating notes ({currentDetailLevel})...</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-400">
            Please wait a moment. This can take a few seconds.
          </AlertDescription>
        </Alert>
      )}

      {!pending && state.message && state.isError && !state.fields && (
         <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Generating Notes</AlertTitle>
            <AlertDescription>
              {state.message} Please try adjusting your topic or try again.
            </AlertDescription>
          </Alert>
      )}

      {!pending && state.notes && !state.isError && (
        <Card className="mt-8 shadow-lg">
            <CardHeader className="p-6"> {/* Default CardHeader padding */}
              {/* Button container - appears above the title */}
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end sm:items-center mb-4">
                {state.detailLevel === 'concise' && (
                  <Button variant="outline" size="sm" onClick={handleExplainMore} disabled={pending} className="w-full sm:w-auto">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Explain More
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleCopyNotes} disabled={pending} className="w-full sm:w-auto">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Notes
                </Button>
              </div>

              {/* Title and Description */}
              <div>
                <CardTitle className="text-2xl text-primary">
                  {state.detailLevel === 'detailed' ? 'Detailed Explanation' : 'Concise Notes'} for "{state.topicSubmitted}"
                </CardTitle>
                <CardDescription>Review and use these notes for your study.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
                <pre className="whitespace-pre-wrap font-sans text-sm bg-muted p-4 rounded-md overflow-x-auto">
                    {state.notes}
                </pre>
                <Alert variant="default" className="mt-4 bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700">
                  <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="font-semibold text-amber-700 dark:text-amber-500">Important Disclaimer</AlertTitle>
                  <AlertDescription className="text-amber-600 dark:text-amber-400">
                    AatmAI provides helpful summaries and explanations as a study aid. Always consult your primary study materials, textbooks, and instructors for comprehensive understanding and official exam preparation. These notes are a starting point, not a substitute for thorough learning.
                  </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      )}
      {!pending && state.message && !state.notes && !state.isError && (
         <Alert className="mt-6">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Notes Ready</AlertTitle>
            <AlertDescription>
              {state.message} It seems AatmAI processed the request but no specific notes were returned. Try a different topic or adjust your input.
            </AlertDescription>
          </Alert>
      )}
    </>
  );
}

export default function StudentNotesGeneratorPage() {
  const [state, formAction] = useActionState(handleGenerateStudentNotes, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [currentTopic, setCurrentTopic] = useState<string>(state.topicSubmitted || ''); 
  const [currentDetailLevel, setCurrentDetailLevel] = useState<'concise' | 'detailed'>(state.detailLevel || 'concise');

  useEffect(() => {
    // Initialize from state on first load or after action completes
    if (state.topicSubmitted !== undefined && state.topicSubmitted !== currentTopic) {
        setCurrentTopic(state.topicSubmitted);
    }
    if (state.detailLevel && state.detailLevel !== currentDetailLevel) {
        setCurrentDetailLevel(state.detailLevel);
    }
  // Only depend on these specific state fields to avoid unnecessary re-runs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.topicSubmitted, state.detailLevel]); 

  useEffect(() => {
    if (state.message && !state.isError && state.notes) {
      toast({
        title: `Notes Generated! (${state.detailLevel})`,
        description: state.message,
      });
    } else if (state.message && state.isError) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state.message, state.isError, state.notes, state.detailLevel, toast]); 
  
  const handleExplainMore = () => {
    if (currentTopic) {
      setCurrentDetailLevel('detailed'); 
      setTimeout(() => {
        if (formRef.current) {
          // Manually update the hidden input for detailLevel if it exists
          const detailLevelInput = formRef.current.elements.namedItem('detailLevel') as HTMLInputElement | null;
          if (detailLevelInput) {
            detailLevelInput.value = 'detailed';
          }
          formRef.current.requestSubmit();
        }
      }, 0);
    } else {
      toast({
        title: "No Topic",
        description: "Please enter a topic first before asking for more details.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <NotebookText className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl md:text-4xl">AI Notes Generator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Enter a topic, and AatmAI will generate structured study notes for you. Get concise points for quick revision, or ask for a more detailed explanation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-6">
            <NotesFormFieldsAndStatus
              state={state} 
              currentTopic={currentTopic}
              setCurrentTopic={setCurrentTopic}
              handleExplainMore={handleExplainMore}
              currentDetailLevel={currentDetailLevel} 
            />
            <SubmitButton detailLevel={currentDetailLevel} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

