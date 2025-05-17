'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Sparkles, Send, User, MessageSquare, Award, BookOpen, Brain } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { handleInterviewTurnAction, type InterviewPrepFormState } from './actions';
import type { InterviewPrepInput, InterviewPrepOutput } from '@/ai/flows/interview-prep-flow';

type InterviewMessage = {
  role: 'interviewer' | 'user';
  content: string;
};

const interviewDomains = [
  { value: 'Software Engineering - Frontend', label: 'Software Engineering - Frontend' },
  { value: 'Software Engineering - Backend', label: 'Software Engineering - Backend' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Product Management', label: 'Product Management' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'General Behavioral Interview', label: 'General Behavioral Interview' },
];

export default function InterviewPrepPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [interviewHistory, setInterviewHistory] = useState<InterviewMessage[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [interviewStage, setInterviewStage] = useState<'initial' | 'selectingDomain' | 'interviewing' | 'finished'>('initial');
  const [finalFeedback, setFinalFeedback] = useState<Partial<InterviewPrepOutput> | null>(null);
  const [questionsAskedCount, setQuestionsAskedCount] = useState<number>(0);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (interviewStage === 'initial') {
      setInterviewStage('selectingDomain');
    }
  }, [interviewStage]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [interviewHistory]);

  const startInterview = async () => {
    if (!selectedDomain) {
      toast({ title: 'Select Domain', description: 'Please select an interview domain to start.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setInterviewHistory([]);
    setFinalFeedback(null);
    setCurrentAnswer('');
    setQuestionsAskedCount(0);
    setInterviewStage('interviewing');

    const input: InterviewPrepInput = {
      domain: selectedDomain,
      interviewHistory: [],
      currentAnswer: '',
      questionsAsked: 0,
    };

    const result = await handleInterviewTurnAction(input);
    handleActionResult(result);
    setIsLoading(false);
  };

  const submitAnswer = async () => {
    if (currentAnswer.trim() === '') {
      toast({ title: 'Empty Answer', description: 'Please provide an answer.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);

    const currentHistoryWithMessage: InterviewMessage[] = [...interviewHistory, {role: 'user', content: currentAnswer}];
    // Update UI immediately with user's answer for better UX
    setInterviewHistory(currentHistoryWithMessage);


    const input: InterviewPrepInput = {
      domain: selectedDomain,
      // Send history *before* AI's next question for context
      interviewHistory: interviewHistory, // History up to AI's last question
      currentAnswer: currentAnswer,
      questionsAsked: questionsAskedCount,
    };
    
    setCurrentAnswer(''); // Clear input field after grabbing the answer
    const result = await handleInterviewTurnAction(input);
    handleActionResult(result, currentHistoryWithMessage); // Pass the optimistic history
    setIsLoading(false);
  };

  const handleActionResult = (result: InterviewPrepFormState, optimisticHistory?: InterviewMessage[]) => {
    if (result.isError || !result.interviewData) {
      toast({ title: 'Error', description: result.message || 'An unknown error occurred.', variant: 'destructive' });
      if (optimisticHistory) setInterviewHistory(optimisticHistory.slice(0, -1)); // Revert optimistic user message on error
      return;
    }

    const { aiResponse, isInterviewOver, feedbackSummary, areasForImprovement, interviewScore, questionsAsked } = result.interviewData;
    
    // If we used optimistic history, the user's message is already there.
    // We just need to add the AI's response.
    // If not (like in startInterview), we build from scratch or from result.updatedHistory
    
    let newHistory: InterviewMessage[];
    if (optimisticHistory) {
      // User message is already in optimisticHistory. Add AI response.
      newHistory = [...optimisticHistory, { role: 'interviewer', content: aiResponse }];
    } else if (result.updatedHistory) {
        // This case is for the initial call or if we didn't use optimistic updates
        newHistory = result.updatedHistory;
    } else {
        // Fallback, should ideally not happen if action returns updatedHistory
        newHistory = [...interviewHistory, {role: 'interviewer', content: aiResponse}];
    }
    
    setInterviewHistory(newHistory);
    setQuestionsAskedCount(questionsAsked);

    if (isInterviewOver) {
      setInterviewStage('finished');
      setFinalFeedback({ feedbackSummary, areasForImprovement, interviewScore });
      toast({ title: 'Interview Finished!', description: 'Check your feedback below.' });
    }
  };
  
  const resetInterview = () => {
    setInterviewStage('selectingDomain');
    setSelectedDomain('');
    setInterviewHistory([]);
    setCurrentAnswer('');
    setFinalFeedback(null);
    setQuestionsAskedCount(0);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Brain className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl md:text-4xl">AI Interview Prep</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Practice your interview skills with AatmAI. Select a domain and get ready!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {interviewStage === 'selectingDomain' && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="interviewDomain" className="text-lg font-semibold">Select Interview Domain</Label>
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger id="interviewDomain" className="w-full mt-2">
                    <SelectValue placeholder="Choose a domain..." />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewDomains.map(domain => (
                      <SelectItem key={domain.value} value={domain.value}>{domain.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={startInterview} className="w-full" disabled={!selectedDomain || isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Start Mock Interview
              </Button>
            </div>
          )}

          {(interviewStage === 'interviewing' || interviewStage === 'finished') && (
            <div className="space-y-6">
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">Interview for: {selectedDomain}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[350px] w-full pr-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                      {interviewHistory.map((msg, index) => (
                        <div
                          key={`msg-${index}`}
                          className={cn(
                            "flex p-3 rounded-lg shadow-sm text-sm w-full break-words",
                            msg.role === 'user' ? "bg-primary/10 justify-end" : "bg-secondary justify-start"
                          )}
                        >
                          <div className={cn("flex items-start gap-2 max-w-[85%]", msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                            {msg.role === 'interviewer' && <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />}
                             <p className={cn("whitespace-pre-wrap", msg.role === 'user' ? "text-right" : "text-left")}>
                                {msg.content}
                              </p>
                            {msg.role === 'user' && <User className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />}
                          </div>
                        </div>
                      ))}
                       {isLoading && interviewStage === 'interviewing' && interviewHistory.length > 0 && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary max-w-[85%]">
                                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 animate-pulse" />
                                <p className="text-sm italic text-muted-foreground">AatmAI is typing...</p>
                            </div>
                        </div>
                        )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {interviewStage === 'interviewing' && (
                <div className="space-y-4">
                  <Label htmlFor="userAnswer" className="text-lg font-semibold">Your Answer:</Label>
                  <Textarea
                    id="userAnswer"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    rows={4}
                    placeholder="Type your answer here..."
                    disabled={isLoading}
                  />
                  <Button onClick={submitAnswer} className="w-full" disabled={isLoading || currentAnswer.trim() === ''}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Submit Answer
                  </Button>
                </div>
              )}

              {interviewStage === 'finished' && finalFeedback && (
                <Card className="mt-6 border-primary shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-primary" />
                        <CardTitle className="text-xl text-primary">Interview Feedback & Score</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {finalFeedback.feedbackSummary && (
                        <div>
                            <h4 className="font-semibold text-md mb-1">Summary:</h4>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{finalFeedback.feedbackSummary}</p>
                        </div>
                    )}
                    {finalFeedback.areasForImprovement && finalFeedback.areasForImprovement.length > 0 && (
                         <div>
                            <h4 className="font-semibold text-md mb-1">Areas for Improvement:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                                {finalFeedback.areasForImprovement.map((area, i) => <li key={i}>{area}</li>)}
                            </ul>
                        </div>
                    )}
                    {finalFeedback.interviewScore !== undefined && (
                        <div>
                            <h4 className="font-semibold text-md mb-1">Overall Score:</h4>
                            <p className="text-2xl font-bold text-primary">{finalFeedback.interviewScore} / 100</p>
                        </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={resetInterview} className="w-full" variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" /> Start New Mock Interview
                    </Button>
                  </CardFooter>
                </Card>
              )}
               {interviewStage !== 'selectingDomain' && !isLoading && (
                 <Button onClick={resetInterview} variant="ghost" className="w-full text-sm text-muted-foreground hover:text-primary">
                    End Interview & Select New Domain
                </Button>
               )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
