
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
import { handleGenerateProjectIdeas, handleGenerateProjectGuidance, type ProjectIdeasFormState, type ProjectGuidanceRequestState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Lightbulb, Sparkles, Info, FileText, HelpCircle, Wand2 } from 'lucide-react';
import type { GenerateProjectIdeasInput, GenerateProjectIdeasOutput } from '@/ai/flows/generate-project-ideas-flow';
import type { GenerateProjectGuidanceOutput } from '@/ai/flows/generate-project-guidance-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

type IdeaType = NonNullable<GenerateProjectIdeasOutput['ideas']>[0];

const initialState: ProjectIdeasFormState = {
  message: '',
  isError: false,
  ideas: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Project Ideas
        </>
      )}
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
          <AlertTitle className="text-blue-700 dark:text-blue-300">AatmAI is brainstorming ideas...</AlertTitle>
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

  const [selectedIdeaForGuidance, setSelectedIdeaForGuidance] = useState<IdeaType | null>(null);
  const [isGuidanceLoading, setIsGuidanceLoading] = useState(false);
  const [guidanceResult, setGuidanceResult] = useState<GenerateProjectGuidanceOutput | null>(null);
  const [guidanceError, setGuidanceError] = useState<string | null>(null);
  const [isGuidanceDialogOpen, setIsGuidanceDialogOpen] = useState(false);

  useEffect(() => {
    if (state.message && !state.isError && state.ideas && state.ideas.length > 0) {
      toast({
        title: 'Project Ideas Generated!',
        description: state.message,
      });
    } else if (state.message && !state.isError && (!state.ideas || state.ideas.length === 0)) {
      toast({ 
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

  const fetchProjectGuidance = async (idea: IdeaType) => {
    setSelectedIdeaForGuidance(idea);
    setIsGuidanceLoading(true);
    setGuidanceResult(null);
    setGuidanceError(null);
    setIsGuidanceDialogOpen(true);

    try {
        const result = await handleGenerateProjectGuidance({
        projectTitle: idea.title,
        projectDescription: idea.description,
        });

        if (result.isError || !result.guidance) {
        setGuidanceError(result.message || 'Failed to load guidance.');
        } else {
        setGuidanceResult(result.guidance);
        }
    } catch (error) {
        console.error("Error fetching project guidance:", error);
        setGuidanceError("An unexpected error occurred while fetching guidance.");
    } finally {
        setIsGuidanceLoading(false);
    }
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
                  <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-medium">Keywords:</span>
                        {idea.keywords.map((keyword, kwIndex) => (
                            <span key={kwIndex} className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">
                                {keyword}
                            </span>
                        ))}
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fetchProjectGuidance(idea)}
                        disabled={isGuidanceLoading && selectedIdeaForGuidance?.title === idea.title}
                        className="w-full sm:w-auto"
                    >
                        {isGuidanceLoading && selectedIdeaForGuidance?.title === idea.title ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Wand2 className="mr-2 h-4 w-4" />
                        )}
                        Get Guidance
                    </Button>
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

      {selectedIdeaForGuidance && (
        <Dialog open={isGuidanceDialogOpen} onOpenChange={setIsGuidanceDialogOpen}>
            <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
                <DialogTitle>Guidance for: {selectedIdeaForGuidance.title}</DialogTitle>
                <DialogDescription>
                Here are some suggestions to help you get started with "{selectedIdeaForGuidance.title}".
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-1 pr-2"> {/* Added padding-right for scrollbar */}
                {isGuidanceLoading && (
                <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">AatmAI is preparing your guidance...</p>
                </div>
                )}
                {guidanceError && !isGuidanceLoading && (
                <Alert variant="destructive" className="my-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error Loading Guidance</AlertTitle>
                    <AlertDescription>{guidanceError}</AlertDescription>
                </Alert>
                )}
                {guidanceResult && !isGuidanceLoading && !guidanceError && (
                <div className="space-y-6 py-4 text-sm">
                    <div>
                    <h4 className="font-semibold text-md text-primary mb-2">Suggested Tech Stack:</h4>
                    {guidanceResult.suggestedTechStack.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1 text-foreground">
                        {guidanceResult.suggestedTechStack.map((tech, idx) => <li key={idx}>{tech}</li>)}
                        </ul>
                    ) : <p className="text-muted-foreground">No specific tech stack suggestions were generated for this idea.</p>}
                    </div>
                    <div>
                    <h4 className="font-semibold text-md text-primary mb-2">High-Level Steps:</h4>
                    {guidanceResult.highLevelSteps.length > 0 ? (
                    <ol className="list-decimal pl-5 space-y-1 text-foreground">
                        {guidanceResult.highLevelSteps.map((step, idx) => <li key={idx}>{step}</li>)}
                    </ol>
                    ) : <p className="text-muted-foreground">No specific implementation steps were generated.</p>}
                    </div>
                    {guidanceResult.keyConsiderations && guidanceResult.keyConsiderations.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-md text-primary mb-2">Key Considerations:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-foreground">
                        {guidanceResult.keyConsiderations.map((consideration, idx) => <li key={idx}>{consideration}</li>)}
                        </ul>
                    </div>
                    )}
                </div>
                )}
            </ScrollArea>
            <DialogFooter className="sm:justify-start mt-2"> {/* Added margin-top */}
                <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Close
                </Button>
                </DialogClose>
            </DialogFooter>
            </DialogContent>
        </Dialog>
        )}
    </div>
  );
}
