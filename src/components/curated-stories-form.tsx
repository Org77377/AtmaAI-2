
"use client";

import React, { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { handleCurateStories, type StoriesFormState } from '@/app/stories/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Sparkles } from 'lucide-react';

const initialState: StoriesFormState = {
  message: '',
  isError: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Find Inspiring Stories
    </Button>
  );
}

function StoryFormFieldsAndStatus({ 
    fields, 
    isError, 
    message, 
    stories 
}: { 
    fields?: Record<string, string>; 
    isError?: boolean; 
    message?: string; 
    stories?: StoriesFormState['stories'];
}) {
  const { pending } = useFormStatus();

  return (
    <>
      <div>
        <Label htmlFor="userProfile" className="text-lg font-semibold">Your Profile</Label>
        <Textarea
          id="userProfile"
          name="userProfile"
          rows={5}
          placeholder="Describe your demographics, interests, and background. The more AI knows about you, the more relevant the stories will be."
          className="mt-2"
          required
          disabled={pending}
        />
        {fields?.userProfile && <p className="text-sm text-destructive mt-1">{fields.userProfile}</p>}
      </div>

      <div>
        <Label htmlFor="currentChallenges" className="text-lg font-semibold">Current Challenges</Label>
        <Textarea
          id="currentChallenges"
          name="currentChallenges"
          rows={5}
          placeholder="What challenges are you currently facing in your life, career, or relationships? Be specific for better story matches."
          className="mt-2"
          required
          disabled={pending}
        />
        {fields?.currentChallenges && <p className="text-sm text-destructive mt-1">{fields.currentChallenges}</p>}
      </div>
      
      {pending && (
        <Alert className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-700 dark:text-blue-300">AatmAI is searching for stories...</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-400">
            Please wait a moment. This can take a few seconds.
          </AlertDescription>
        </Alert>
      )}

      {!pending && message && isError && !fields && (
         <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>
              {message} Please try again. If the problem persists, AatmAI might be having trouble finding stories.
            </AlertDescription>
          </Alert>
      )}

      {!pending && stories?.stories && stories.stories.length > 0 && !isError && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-primary">Inspiring Stories For You</h2>
          {stories.stories.map((story, index) => (
            <Card key={index} className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
              <CardHeader>
                 <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-blue-700 dark:text-blue-300">Story #{index + 1}</CardTitle>
                 </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap">{story}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {!pending && stories?.stories && stories.stories.length === 0 && !isError && (
         <Alert className="mt-6">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>No Stories Found</AlertTitle>
            <AlertDescription>
              We couldn't find specific stories for your profile at this moment. Please try adjusting your input.
            </AlertDescription>
          </Alert>
      )}
    </>
  );
}

export default function CuratedStoriesForm() {
  const [state, formAction] = useFormState(handleCurateStories, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // This effect runs when 'state' changes, which happens after formAction completes
    if (state.message) { 
      if (state.isError) {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      } else if (state.stories) {
        toast({
          title: "Success",
          description: state.message,
        });
        if (!state.stories.stories || state.stories.stories.length === 0) {
          // If successful but no stories, don't reset form, so user can adjust
        } else {
          formRef.current?.reset(); // Reset form if stories are found
        }
      }
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <StoryFormFieldsAndStatus 
        fields={state.fields}
        isError={state.isError}
        message={state.message}
        stories={state.stories}
      />
      <SubmitButton />
    </form>
  );
}
