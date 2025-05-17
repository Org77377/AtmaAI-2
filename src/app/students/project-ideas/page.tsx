
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { handleGenerateProjectIdeas, type ProjectIdeasFormState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Lightbulb, Sparkles, Info, FileText } from 'lucide-react';
import type { GenerateProjectIdeasInput } from '@/ai/flows/generate-project-ideas-flow';

const initialState: ProjectIdeasFormState = {
  message: '',
  isError: false,
  ideas: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate Project Ideas
    </Button>
  );
}

function ProjectIdeasFormFieldsAndStatus({
  state,
  currentInput,
  onInputChange,
}: {
  state: ProjectIdeasFormState;
  currentInput: Partial<GenerateProjectIdeasInput>;
  onInputChange: (field: keyof GenerateProjectIdeasInput, value: string) => void;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending && (
        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-700 dark:text-blue-300">AatmAI is brainstorming ideas for you...</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-400">
            This may take a few moments. Please wait.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fieldOfStudy" className="text-lg font-semibold">Field of Study</Label>
          <Input
            id="fieldOfStudy"
            name="fieldOfStudy"
            placeholder="e.g., Computer Science, Arts, Biology, Engineering"
            className="mt-2"
            required
            disabled={pending}
            value={currentInput.fieldOfStudy || ''}
            onChange={(e) => onInputChange('fieldOfStudy', e.target.value)}
          />
          {state.fields?.fieldOfStudy && <p className="text-sm text-destructive mt-1">{state.fields.fieldOfStudy}</p>}
        </div>

        <div>
            <Label htmlFor="projectType" className="text-lg font-semibold">Project Type (Optional)</Label>
            <Select
                name="projectType"
                disabled={pending}
                value={currentInput.projectType || 'any'}
                onValueChange={(value) => onInputChange('projectType', value)}
            >
                <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="any">Any Type</SelectItem>
                    <SelectItem value="software_app">Software Application</SelectItem>
                    <SelectItem value="hardware_device">Hardware Device</SelectItem>
                    <SelectItem value="research_paper">Research Paper</SelectItem>
                    <SelectItem value="social_impact_initiative">Social Impact Initiative</SelectItem>
                    <SelectItem value="artistic_creation">Artistic Creation</SelectItem>
                    <SelectItem value="business_plan">Business Plan</SelectItem>
                </SelectContent>
            </Select>
             {state.fields?.projectType && <p className="text-sm text-destructive mt-1">{state.fields.projectType}</p>}
        </div>
      </div>
      
      <div>
        <Label htmlFor="interests" className="text-lg font-semibold">Your Interests</Label>
        <Textarea
          id="interests"
          name="interests"
          rows={3}
          placeholder="e.g., Artificial intelligence, renewable energy, mobile app development, creative writing, graphic design"
          className="mt-2"
          required
          disabled={pending}
          value={currentInput.interests || ''}
          onChange={(e) => onInputChange('interests', e.target.value)}
        />
        {state.fields?.interests && <p className="text-sm text-destructive mt-1">{state.fields.interests}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <Label htmlFor="difficultyLevel" className="text-lg font-semibold">Difficulty Level (Optional)</Label>
            <Select
                name="difficultyLevel"
                disabled={pending}
                value={currentInput.difficultyLevel || 'any'}
                onValueChange={(value) => onInputChange('difficultyLevel', value)}
            >
                <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="any">Any Difficulty</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
            </Select>
            {state.fields?.difficultyLevel && <p className="text-sm text-destructive mt-1">{state.fields.difficultyLevel}</p>}
        </div>
        <div>
          <Label htmlFor="additionalContext" className="text-lg font-semibold">Additional Context (Optional)</Label>
          <Input
            id="additionalContext"
            name="additionalContext"
            placeholder="e.g., Specific tech, 2-week duration"
            className="mt-2"
            disabled={pending}
            value={currentInput.additionalContext || ''}
            onChange={(e) => onInputChange('additionalContext', e.target.value)}
          />
          {state.fields?.additionalContext && <p className="text-sm text-destructive mt-1">{state.fields.additionalContext}</p>}
        </div>
      </div>


      {!pending && state.message && state.isError && !state.fields && (
         <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Generating Ideas</AlertTitle>
            <AlertDescription>
              {state.message} Please try adjusting your inputs or try again.
            </AlertDescription>
          </Alert>
      )}
    </>
  );
}

export default function ProjectIdeasGeneratorPage() {
  const [state, formAction] = useActionState(handleGenerateProjectIdeas, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [currentInput, setCurrentInput] = useState<Partial<GenerateProjectIdeasInput>>(
    initialState.inputSubmitted || {}
  );

  useEffect(() => {
    if (state.message && !state.isError && state.ideas && state.ideas.length > 0) {
      toast({
        title: 'Project Ideas Generated!',
        description: state.message,
      });
    } else if (state.message && !state.isError && (!state.ideas || state.ideas.length === 0)) {
      toast({ // Toast for no ideas found but no error
        title: 'No Specific Ideas Found',
        description: state.message || "AatmAI couldn't find specific project ideas for your criteria. Try broadening your search.",
      });
    } else if (state.message && state.isError) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
    if (state.inputSubmitted) {
      setCurrentInput(state.inputSubmitted);
    }
  }, [state, toast]);

  const handleInputChange = (field: keyof GenerateProjectIdeasInput, value: string) => {
    setCurrentInput(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Lightbulb className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl md:text-4xl">Project Idea Generator</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Tell AatmAI about your field of study and interests, and get innovative project ideas to kickstart your next academic endeavor!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-8">
            <ProjectIdeasFormFieldsAndStatus
              state={state}
              currentInput={currentInput}
              onInputChange={handleInputChange}
            />
            <SubmitButton />
          </form>

          {!state.isError && state.ideas && state.ideas.length > 0 && (
            <div className="mt-12 space-y-6">
              <h2 className="text-2xl font-semibold text-center text-primary">Here are some project ideas for you:</h2>
              {state.ideas.map((idea, index) => (
                <Card key={index} className="bg-card border shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-accent" />
                      <CardTitle className="text-xl text-primary">{idea.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-foreground whitespace-pre-line">{idea.description}</p>
                    {idea.suitability && (
                         <p className="text-sm text-muted-foreground italic">Suitability: {idea.suitability}</p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium">Keywords:</span>
                        {idea.keywords.map((keyword, kwIndex) => (
                            <span key={kwIndex} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                                {keyword}
                            </span>
                        ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {!state.isError && state.ideas && state.ideas.length === 0 && state.message && !state.fields && (
            <Alert className="mt-8">
                <Info className="h-4 w-4" />
                <AlertTitle>No Specific Ideas Found</AlertTitle>
                <AlertDescription>
                {state.message || "AatmAI couldn't find specific project ideas for your criteria. Try broadening your search or rephrasing your interests."}
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    