
"use client";

import React, { useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleCurateStories, type StoriesFormState } from '@/app/stories/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

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

export default function CuratedStoriesForm() {
  const [state, formAction] = React.useActionState(handleCurateStories, initialState);
  const { toast } = useToast();
  const { pending } = useFormStatus(); // Get pending state for the whole form

  useEffect(() => {
    if (state.message && !pending) { // Only show toast if not pending
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
      }
    }
  }, [state, pending, toast]);

  return (
    <form action={formAction} className="space-y-6">
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
        {state.fields?.userProfile && <p className="text-sm text-destructive mt-1">{state.fields.userProfile}</p>}
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
        {state.fields?.currentChallenges && <p className="text-sm text-destructive mt-1">{state.fields.currentChallenges}</p>}
      </div>
      
      {pending && (
        <Alert className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-700 dark:text-blue-300">Aatme is searching for stories...</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-400">
            Please wait a moment. This can take a few seconds.
          </AlertDescription>
        </Alert>
      )}

      {!pending && state.message && state.isError && !state.fields && (
         <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>
              {state.message} Please try again. If the problem persists, Aatme might be having trouble finding stories.
            </AlertDescription>
          </Alert>
      )}

      <SubmitButton />

      {!pending && state.stories?.stories && state.stories.stories.length > 0 && !state.isError && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-primary">Inspiring Stories For You</h2>
          {state.stories.stories.map((story, index) => (
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
      {!pending && state.stories?.stories && state.stories.stories.length === 0 && !state.isError && (
         <Alert className="mt-6">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>No Stories Found</AlertTitle>
            <AlertDescription>
              We couldn't find specific stories for your profile at this moment. Please try adjusting your input.
            </AlertDescription>
          </Alert>
      )}
    </form>
  );
}
