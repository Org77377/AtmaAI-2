"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { handleGenerateGuidance, type GuidanceFormState } from '@/app/guidance/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const initialState: GuidanceFormState = {
  message: '',
  isError: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Get Guidance
    </Button>
  );
}

export default function PersonalizedGuidanceForm() {
  const [state, formAction] = useActionState(handleGenerateGuidance, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.isError) {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive",
        });
      } else if (state.guidance) {
         toast({
          title: "Success",
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="profile" className="text-lg font-semibold">Your Profile</Label>
        <Textarea
          id="profile"
          name="profile"
          rows={5}
          placeholder="Tell us about yourself: your career, financial situation, and relationship status. The more details you provide, the better the guidance."
          className="mt-2"
          required
        />
        {state.fields?.profile && <p className="text-sm text-destructive mt-1">{state.fields.profile}</p>}
      </div>

      <div>
        <Label htmlFor="mood" className="text-lg font-semibold">Current Mood</Label>
        <Input
          id="mood"
          name="mood"
          placeholder="How are you feeling right now? (e.g., stressed, hopeful, confused)"
          className="mt-2"
          required
        />
        {state.fields?.mood && <p className="text-sm text-destructive mt-1">{state.fields.mood}</p>}
      </div>

      <div>
        <Label htmlFor="issue" className="text-lg font-semibold">Specific Issue</Label>
        <Textarea
          id="issue"
          name="issue"
          rows={5}
          placeholder="What specific career, financial, or relationship issue are you facing? Describe the situation you need guidance on."
          className="mt-2"
          required
        />
        {state.fields?.issue && <p className="text-sm text-destructive mt-1">{state.fields.issue}</p>}
      </div>

      <SubmitButton />

      {state.guidance && !state.isError && (
        <Card className="mt-8 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              <CardTitle className="text-green-700 dark:text-green-300">Your Personalized Guidance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-green-600 dark:text-green-400">Guidance:</h3>
              <p className="text-green-800 dark:text-green-200 whitespace-pre-wrap">{state.guidance.guidance}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-green-600 dark:text-green-400">Reasoning:</h3>
              <p className="text-green-800 dark:text-green-200 whitespace-pre-wrap">{state.guidance.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
      {state.message && state.isError && !state.fields && (
         <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>An Error Occurred</AlertTitle>
            <AlertDescription>
              {state.message}
            </AlertDescription>
          </Alert>
      )}
    </form>
  );
}
