'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { handleGenerateRoadmapAction, type RoadmapGeneratorFormState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, GitForkIcon, Sparkles, FileText, BookOpen, Youtube, Link as LinkIcon, Wrench, Clock, Zap, QuoteIcon, CheckCircle } from 'lucide-react';
import type { GenerateRoadmapOutput } from '@/ai/flows/generate-roadmap-flow';
import { Badge } from '@/components/ui/badge';

const initialActionState: RoadmapGeneratorFormState = {
  message: '',
  isError: false,
  roadmap: undefined,
  topicSubmitted: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto mt-4" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Roadmap...
        </>
      ) : (
        <>
          <GitForkIcon className="mr-2 h-4 w-4" />
          Generate Roadmap
        </>
      )}
    </Button>
  );
}

function RoadmapDisplay({ roadmap }: { roadmap: GenerateRoadmapOutput }) {
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return <Youtube className="mr-2 h-4 w-4 text-red-500 flex-shrink-0" />;
      case 'article': return <FileText className="mr-2 h-4 w-4 text-blue-500 flex-shrink-0" />;
      case 'course': return <Zap className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />; // Using Zap for course
      case 'book': return <BookOpen className="mr-2 h-4 w-4 text-orange-500 flex-shrink-0" />;
      case 'documentation': return <FileText className="mr-2 h-4 w-4 text-purple-500 flex-shrink-0" />;
      case 'tool': return <Wrench className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />;
      default: return <LinkIcon className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="mt-10 space-y-8">
      <Card className="border-primary/30 shadow-lg bg-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary text-center">{roadmap.roadmapTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground leading-relaxed whitespace-pre-line">{roadmap.introduction}</p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-primary">Your Learning Steps</h2>
        {roadmap.steps.map((step, index) => (
          <Card key={step.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-accent bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-accent flex items-center">
                <CheckCircle className="mr-3 h-6 w-6 text-accent flex-shrink-0" />
                Step {index + 1}: {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground whitespace-pre-line leading-relaxed">{step.description}</p>
              {step.estimatedDuration && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  Estimated Duration: {step.estimatedDuration}
                </div>
              )}
              {step.keywords && step.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  <span className="text-sm font-medium text-muted-foreground">Keywords:</span>
                  {step.keywords.map(keyword => (
                    <Badge key={keyword} variant="secondary" className="text-xs">{keyword}</Badge>
                  ))}
                </div>
              )}
              <div>
                <h4 className="font-semibold text-md text-foreground mb-2 mt-3">Resources:</h4>
                <ul className="space-y-2 pl-2">
                  {step.resources.map((resource, rIndex) => (
                    <li key={rIndex} className="flex items-start text-sm">
                      {getResourceIcon(resource.type)}
                      <span className="font-medium text-muted-foreground mr-1">{resource.type}:</span> 
                      <span className="text-foreground break-all">{resource.descriptionOrLink}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/30 shadow-lg bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Conclusion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground leading-relaxed whitespace-pre-line">{roadmap.conclusion}</p>
        </CardContent>
      </Card>
      
      {roadmap.motivationalQuote && (
        <Card className="mt-8 bg-gradient-to-r from-primary/10 via-card to-accent/10 border-transparent shadow-xl">
          <CardContent className="p-6 text-center">
            <QuoteIcon className="mx-auto h-8 w-8 text-primary opacity-50 mb-2" />
            <blockquote className="text-xl italic font-medium text-foreground">
              "{roadmap.motivationalQuote.text}"
            </blockquote>
            {roadmap.motivationalQuote.author && (
              <p className="text-sm text-muted-foreground mt-2">- {roadmap.motivationalQuote.author}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export default function RoadmapGeneratorPage() {
  const [state, formAction] = useActionState(handleGenerateRoadmapAction, initialActionState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [currentTopic, setCurrentTopic] = useState<string>(initialActionState.topicSubmitted || '');

  useEffect(() => {
    if (state.message) {
      if (!state.isError && state.roadmap) {
        toast({
          title: `Roadmap Generated!`,
          description: state.message,
        });
        if (state.topicSubmitted !== undefined) {
          setCurrentTopic(state.topicSubmitted);
        }
      } else if (state.isError) {
        toast({
          title: "Error Generating Roadmap",
          description: state.message || "An unexpected error occurred.",
          variant: "destructive",
        });
        if (state.topicSubmitted !== undefined) {
          setCurrentTopic(state.topicSubmitted);
        }
      }
    }
  }, [state, toast]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="shadow-xl bg-card"> {/* Ensure card uses theme background */}
        <CardHeader className="text-center border-b pb-6">
          <div className="flex flex-col items-center justify-center gap-3 mb-2">
            <GitForkIcon className="w-12 h-12 text-primary" />
            <CardTitle className="text-3xl md:text-4xl font-bold text-primary">AI Learning Roadmap Generator</CardTitle>
          </div>
          <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter a course, skill, or topic you want to learn, and AatmAI will generate a personalized, in-depth study roadmap for you, complete with steps and resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <form ref={formRef} action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="topicOrSkill" className="text-xl font-semibold text-foreground">
                What do you want to learn?
              </Label>
              <Textarea
                id="topicOrSkill"
                name="topicOrSkill"
                rows={3}
                className="mt-2 text-base border-border focus:ring-primary focus:border-primary"
                placeholder="e.g., Machine Learning, Web Development with React, Public Speaking, Financial Literacy for Beginners"
                required
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
              />
              {state.fields?.topicOrSkill && <p className="text-sm text-destructive mt-1">{state.fields.topicOrSkill}</p>}
            </div>
            <SubmitButton />
          </form>

          {useFormStatus().pending && !state.roadmap && (
            <Alert className="mt-8 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-700 dark:text-blue-300 font-semibold">AatmAI is crafting your roadmap...</AlertTitle>
              <AlertDescription className="text-blue-600 dark:text-blue-400">
                This might take a few moments, especially for complex topics. Please be patient.
              </AlertDescription>
            </Alert>
          )}

          {!useFormStatus().pending && state.message && state.isError && !state.fields && !state.roadmap && (
            <Alert variant="destructive" className="mt-8">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Error Generating Roadmap</AlertTitle>
              <AlertDescription>
                {state.message || "An unexpected error occurred."} Please try adjusting your topic or try again.
              </AlertDescription>
            </Alert>
          )}

          {!useFormStatus().pending && state.roadmap && !state.isError && (
            <RoadmapDisplay roadmap={state.roadmap} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
