
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { handleGenerateProjectReport, type ProjectReportFormState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, FileText, Sparkles, Copy, Info } from 'lucide-react';
import type { GenerateProjectReportInput } from '@/ai/flows/generate-project-report-flow';

const initialState: ProjectReportFormState = {
  message: '',
  isError: false,
  report: undefined,
  inputSubmitted: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      <Sparkles className="mr-2 h-4 w-4" />
      Generate Project Report
    </Button>
  );
}

function ProjectReportFormFieldsAndStatus({
  state,
  currentInput,
  onInputChange,
}: {
  state: ProjectReportFormState;
  currentInput: Partial<GenerateProjectReportInput>;
  onInputChange: (field: keyof GenerateProjectReportInput, value: string) => void;
}) {
  const { pending } = useFormStatus();
  const { toast } = useToast();

  const handleCopyReport = () => {
    if (state.report?.reportContent) {
      let fullContent = state.report.reportContent;
      if (state.report.references) {
        fullContent += `\n\n## References\n\n${state.report.references}`;
      }
      navigator.clipboard.writeText(fullContent)
        .then(() => {
          toast({ title: 'Report Copied!', description: 'The generated report has been copied to your clipboard.' });
        })
        .catch(err => {
          console.error('Failed to copy report: ', err);
          toast({ title: 'Copy Failed', description: 'Could not copy report to clipboard.', variant: 'destructive' });
        });
    }
  };

  return (
    <>
      {pending && (
        <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-700 dark:text-blue-300">AatmAI is drafting your project report...</AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-400">
            This may take some time, especially for detailed reports. Please wait.
          </AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="projectTopic" className="text-lg font-semibold">Project Topic</Label>
        <Input
          id="projectTopic"
          name="projectTopic"
          placeholder="e.g., AI-Powered Recommendation System, Sustainable Urban Gardening"
          className="mt-2"
          required
          disabled={pending}
          value={currentInput.projectTopic || ''}
          onChange={(e) => onInputChange('projectTopic', e.target.value)}
        />
        {state.fields?.projectTopic && <p className="text-sm text-destructive mt-1">{state.fields.projectTopic}</p>}
      </div>

      <div>
        <Label htmlFor="techStackDetails" className="text-lg font-semibold">Technologies, Tools, or Methods Used</Label>
        <Textarea
          id="techStackDetails"
          name="techStackDetails"
          rows={4}
          placeholder="e.g., Python, TensorFlow, React, Arduino, Qualitative Research Methods, Figma for UI/UX..."
          className="mt-2"
          required
          disabled={pending}
          value={currentInput.techStackDetails || ''}
          onChange={(e) => onInputChange('techStackDetails', e.target.value)}
        />
        {state.fields?.techStackDetails && <p className="text-sm text-destructive mt-1">{state.fields.techStackDetails}</p>}
      </div>

      <div>
        <Label htmlFor="reportType" className="text-lg font-semibold">Report Type</Label>
        <Select
          name="reportType"
          disabled={pending}
          value={currentInput.reportType || 'simple'}
          onValueChange={(value) => onInputChange('reportType', value as 'simple' | 'detailed')}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">Simple Report (~2-3 pages)</SelectItem>
            <SelectItem value="detailed">Detailed Report (~10-20 pages)</SelectItem>
          </SelectContent>
        </Select>
        {state.fields?.reportType && <p className="text-sm text-destructive mt-1">{state.fields.reportType}</p>}
      </div>

      {!pending && state.message && state.isError && !state.fields && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Generating Report</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      {!pending && state.report?.reportContent && !state.isError && (
        <Card className="mt-8 shadow-lg">
          <CardHeader className="p-6">
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end sm:items-center mb-4">
              <Button variant="outline" size="sm" onClick={handleCopyReport} className="w-full sm:w-auto">
                <Copy className="mr-2 h-4 w-4" />
                Copy Report
              </Button>
            </div>
            <div>
              <CardTitle className="text-2xl text-primary">
                Generated Project Report for "{state.inputSubmitted?.projectTopic}"
              </CardTitle>
              <CardDescription>
                Report Type: {state.inputSubmitted?.reportType === 'detailed' ? 'Detailed' : 'Simple'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-0 sm:px-0 md:px-0 pt-0">
            <pre className="w-full whitespace-pre-wrap font-sans text-base bg-muted p-4 md:p-6 rounded-lg border border-border shadow-inner overflow-x-auto">
              {state.report.reportContent}
            </pre>
            {state.report.references && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-primary mb-2 px-4 md:px-6">References</h3>
                <pre className="w-full whitespace-pre-wrap font-sans text-sm bg-muted p-4 md:p-6 rounded-lg border border-border shadow-inner overflow-x-auto">
                  {state.report.references}
                </pre>
              </div>
            )}
            <Alert variant="default" className="mt-4 mx-0 py-3 px-4 bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <AlertTitle className="font-semibold text-amber-700 dark:text-amber-500">Important Disclaimer</AlertTitle>
              <AlertDescription className="text-amber-600 dark:text-amber-400">
                AatmAI provides a draft project report as a starting point. Always customize, verify information, and adhere to your institution's specific guidelines and formatting requirements. This AI-generated content should be thoroughly reviewed and edited.
              </AlertDescription>
            </Alert>
             <Alert variant="default" className="mt-4 mx-0 py-3 px-4 bg-sky-50 dark:bg-sky-900/30 border-sky-300 dark:border-sky-700">
                <FileText className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                <AlertTitle className="font-semibold text-sky-700 dark:text-sky-500">Pro Tip!</AlertTitle>
                <AlertDescription className="text-sky-600 dark:text-sky-400">
                  Copy this report and save it as a <strong><code>.md</code></strong> (Markdown) file.
                  Open it in a Markdown editor (like VS Code with Markdown preview, Typora, Obsidian) or convert it to DOCX/PDF using online tools or Pandoc for further editing and formatting.
                </AlertDescription>
              </Alert>
          </CardContent>
        </Card>
      )}
    </>
  );
}


export default function ProjectReportGeneratorPage() {
  const [state, formAction] = useActionState(handleGenerateProjectReport, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [currentInput, setCurrentInput] = useState<Partial<GenerateProjectReportInput>>(
    initialState.inputSubmitted || { reportType: 'simple' } // Default reportType
  );

  useEffect(() => {
    if (state.message) {
      if (!state.isError && state.report) {
        toast({
          title: 'Report Generated!',
          description: state.message,
        });
      } else if (state.isError) {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
    // Sync local input state with what was actually submitted if available
    if (state.inputSubmitted) {
      setCurrentInput(state.inputSubmitted);
    }
  }, [state, toast]);

  const handleInputChange = (
    field: keyof GenerateProjectReportInput,
    value: string | 'simple' | 'detailed'
  ) => {
    setCurrentInput(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FileText className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl md:text-4xl">AI Project Report Helper</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Provide details about your project, and AatmAI will help draft a structured report for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-8">
            <ProjectReportFormFieldsAndStatus
              state={state}
              currentInput={currentInput}
              onInputChange={handleInputChange}
            />
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
