
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
import { Loader2, AlertTriangle, NotebookText, Sparkles, Copy, HelpCircle, Info, FileText } from 'lucide-react';

const initialState: NotesGeneratorFormState = {
  message: '',
  isError: false,
  detailLevel: 'concise',
  topicSubmitted: '', // Initialize topicSubmitted
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto mt-4" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate Notes
    </Button>
  );
}

function NotesFormFieldsAndStatus({
  state,
  currentTopic,
  setCurrentTopic,
  currentDetailLevel,
}: {
  state: NotesGeneratorFormState;
  currentTopic: string;
  setCurrentTopic: (topic: string) => void;
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
            <CardHeader className="p-6">
               <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end sm:items-center mb-4">
                <Button variant="outline" size="sm" onClick={handleCopyNotes} disabled={pending || !state.notes} className="w-full sm:w-auto">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Notes
                </Button>
              </div>
              <div>
                <CardTitle className="text-2xl text-primary">
                  {state.detailLevel === 'detailed' ? 'Detailed Explanation' : 'Concise Notes'} for "{state.topicSubmitted}"
                </CardTitle>
                <CardDescription>Review and use these notes for your study.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-0 sm:px-0 md:px-0 pt-0">
                <pre className="w-full whitespace-pre-wrap font-sans text-base bg-muted p-6 rounded-lg border border-border shadow-inner overflow-x-auto">
                    {state.notes}
                </pre>
                <Alert variant="default" className="mt-4 py-3 px-4 bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700">
                  <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="font-semibold text-amber-700 dark:text-amber-500">Important Disclaimer</AlertTitle>
                  <AlertDescription className="text-amber-600 dark:text-amber-400">
                    AatmAI provides helpful summaries and explanations as a study aid. Always consult your primary study materials, textbooks, and instructors for comprehensive understanding and official exam preparation. These notes are a starting point, not a substitute for thorough learning.
                  </AlertDescription>
                </Alert>
                <Alert variant="default" className="mt-4 py-3 px-4 bg-sky-50 dark:bg-sky-900/30 border-sky-300 dark:border-sky-700">
                  <FileText className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  <AlertTitle className="font-semibold text-sky-700 dark:text-sky-500">Pro Tip!</AlertTitle>
                  <AlertDescription className="text-sky-600 dark:text-sky-400">
                    Copy these notes and save them as a <strong><code>.md</code></strong> (Markdown) file on your computer.
                    For the best viewing experience with formatting preserved (like headings and lists), open the <code>.md</code> file in a code editor like VS Code or any Markdown viewer.
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
  
  const [currentTopic, setCurrentTopic] = useState<string>(initialState.topicSubmitted || '');
  const [currentDetailLevel, setCurrentDetailLevel] = useState<'concise' | 'detailed'>(initialState.detailLevel || 'concise');

  useEffect(() => {
    // This effect reacts to the completion of a server action by inspecting `state`.
    if (state.message) { // A message indicates the action has completed
      if (!state.isError && state.notes) {
        toast({
          title: `Notes Generated! (${state.detailLevel})`,
          description: state.message,
        });
        // Sync local state to reflect what was actually processed and returned by the server
        if (state.topicSubmitted !== undefined) {
            setCurrentTopic(state.topicSubmitted);
        }
        if (state.detailLevel) {
            setCurrentDetailLevel(state.detailLevel);
        }
      } else if (state.isError) {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
        // Sync local state even on error, to reflect what the server action attempted
        if (state.topicSubmitted !== undefined) {
            setCurrentTopic(state.topicSubmitted);
        }
        if (state.detailLevel) {
            setCurrentDetailLevel(state.detailLevel);
        }
      }
    }
  }, [state, toast]); // Depend only on `state` (from useActionState) and `toast`


  const handleExplainMore = () => {
    if (currentTopic) {
      setCurrentDetailLevel('detailed'); // Set intent for next submission
      // Using setTimeout to allow React to process state update and re-render
      // the hidden input field before the form is submitted.
      setTimeout(() => {
        if (formRef.current) {
          // The form's hidden input for 'detailLevel' should now have 'detailed'
          // due to the state update and re-render.
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
          <form
            ref={formRef}
            action={formAction} 
            className="space-y-6"
          >
            <NotesFormFieldsAndStatus
              state={state}
              currentTopic={currentTopic}
              setCurrentTopic={setCurrentTopic}
              currentDetailLevel={currentDetailLevel}
            />
            
            {!useFormStatus().pending && state.notes && currentDetailLevel === 'concise' && (
                 <Button
                    type="button" 
                    variant="outline"
                    size="sm"
                    onClick={handleExplainMore}
                    className="w-full sm:w-auto mt-4"
                >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Explain More
                </Button>
            )}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
