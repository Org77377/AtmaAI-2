'use client';

import React, { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleGenerateStudentNotes, type NotesGeneratorFormState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, NotebookText, Sparkles, Copy } from 'lucide-react';

const initialState: NotesGeneratorFormState = {
  message: '',
  isError: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate Notes
    </Button>
  );
}

function NotesFormFieldsAndStatus({
  fields,
  isError,
  message,
  notes,
  topicSubmitted,
}: {
  fields?: Record<string, string>;
  isError?: boolean;
  message?: string;
  notes?: string;
  topicSubmitted?: string;
}) {
  const { pending } = useFormStatus();
  const { toast } = useToast();

  const handleCopyNotes = () => {
    if (notes) {
      navigator.clipboard.writeText(notes)
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
          defaultValue={topicSubmitted}
        />
        {fields?.topic && <p className="text-sm text-destructive mt-1">{fields.topic}</p>}
      </div>

      {pending && (
        <Alert className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-700 dark:text-blue-300">AatmAI is generating notes...</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-400">
            Please wait a moment. This can take a few seconds.
          </AlertDescription>
        </Alert>
      )}

      {!pending && message && isError && !fields && (
         <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Generating Notes</AlertTitle>
            <AlertDescription>
              {message} Please try adjusting your topic or try again.
            </AlertDescription>
          </Alert>
      )}

      {!pending && notes && !isError && (
        <Card className="mt-8 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl text-primary">Generated Notes for "{topicSubmitted}"</CardTitle>
                    <CardDescription>Review and use these notes for your study.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyNotes}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Notes
                </Button>
            </CardHeader>
            <CardContent>
                <pre className="whitespace-pre-wrap font-sans text-sm bg-muted p-4 rounded-md overflow-x-auto">
                    {notes}
                </pre>
            </CardContent>
        </Card>
      )}
      {!pending && message && !notes && !isError && (
         <Alert className="mt-6">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Notes Ready</AlertTitle>
            <AlertDescription>
              {message} It seems AatmAI processed the request but no specific notes were returned. Try a different topic.
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

  useEffect(() => {
    if (state.message && !state.isError && state.notes) {
      toast({
        title: "Notes Generated!",
        description: state.message,
      });
      // Do not reset formRef.current?.reset(); here so user can see the topic.
    } else if (state.message && state.isError) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <NotebookText className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl md:text-4xl">AI Notes Generator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Enter a topic, and AatmAI will generate structured study notes for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-6">
            <NotesFormFieldsAndStatus
              fields={state.fields}
              isError={state.isError}
              message={state.message}
              notes={state.notes}
              topicSubmitted={state.topicSubmitted}
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
