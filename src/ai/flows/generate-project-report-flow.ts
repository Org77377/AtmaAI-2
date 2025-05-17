
'use server';
/**
 * @fileOverview AI agent that generates a project report based on user inputs.
 *
 * - generateProjectReport - A function that generates and returns a project report.
 * - GenerateProjectReportInput - The input type.
 * - GenerateProjectReportOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema is now local, not exported
const GenerateProjectReportInputSchema = z.object({
  projectTopic: z
    .string()
    .min(5, 'Project topic must be at least 5 characters.')
    .max(200, 'Project topic must be less than 200 characters.'),
  techStackDetails: z
    .string()
    .min(10, 'Please provide some details about the technologies, tools, or methods used (at least 10 characters).')
    .max(1000, 'Technology details must be less than 1000 characters.'),
  reportType: z.enum(['simple', 'detailed']).default('simple'),
});
export type GenerateProjectReportInput = z.infer<
  typeof GenerateProjectReportInputSchema
>;

// Schema is now local, not exported
const GenerateProjectReportOutputSchema = z.object({
  reportContent: z.string().describe('The main content of the generated project report, structured with headings and paragraphs. Likely in Markdown format.'),
  references: z.string().optional().describe('A list of references or a bibliography section, if applicable. Could be a formatted string or Markdown list.'),
});
export type GenerateProjectReportOutput = z.infer<
  typeof GenerateProjectReportOutputSchema
>;

export async function generateProjectReport(
  input: GenerateProjectReportInput
): Promise<GenerateProjectReportOutput> {
  return generateProjectReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectReportPrompt',
  input: {schema: GenerateProjectReportInputSchema}, // Uses local schema
  output: {schema: GenerateProjectReportOutputSchema}, // Uses local schema
  prompt: `You are an expert academic assistant specializing in creating project reports for students across various fields.
  The user will provide a project topic, details about the technology/tools/methods used, and a desired report type (simple or detailed).

  Project Topic: {{{projectTopic}}}
  Technology/Tools/Methods Used: {{{techStackDetails}}}
  Report Type: {{{reportType}}}

  Instructions for Generating the Project Report:
  1.  **Structure:** Generate a well-structured project report. Common sections include (but are not limited to, adapt as necessary for the topic):
      *   Title Page (mention project title, student's name placeholder like "[Your Name]", course placeholder like "[Course Name]", date placeholder like "[Date]")
      *   Abstract (a brief summary of the project)
      *   Table of Contents (list main sections and sub-sections)
      *   1. Introduction (background, problem statement, objectives, scope)
      *   2. Literature Review (if applicable, discuss existing work related to the topic - can be brief for 'simple' reports)
      *   3. Methodology / Approach (describe the methods, tools, and techniques used)
      *   4. System Design / Implementation / Development (details of how the project was built or conducted)
      *   5. Results and Discussion / Findings (present what was achieved, data, analysis)
      *   6. Conclusion and Future Work (summarize findings, limitations, suggestions for future improvements)
      *   7. References / Bibliography (list any sources cited or used, in a consistent format like APA or IEEE if possible, otherwise a clear list). Ensure references are plausible and relevant to the topic.
  2.  **Content Quality:**
      *   Ensure the content is relevant to the topic and tech details provided.
      *   Use clear, formal, and academic language.
      *   Maintain a logical flow between sections.
  3.  **Length based on Report Type:**
      *   If 'simple': Aim for a concise report, approximately 2-3 pages in standard document format (e.g., 1000-1500 words). Focus on the most critical sections. The literature review might be very brief or integrated into the introduction.
      *   If 'detailed': Aim for a **highly comprehensive and in-depth report, striving for 12,000 words or more if the topic allows for such depth without sacrificing quality.** **Significantly expand on all sections**. Provide extensive details in the Introduction (deeper background, refined problem statement, very clear objectives and scope). The Literature Review must be thorough, discussing multiple relevant existing works, comparing them, and identifying gaps. The Methodology section should detail the research design, data collection methods, tools, and analytical techniques comprehensively. The System Design / Implementation / Development section must offer granular details of the architecture, algorithms, code structure (if applicable), and challenges faced during development. The Results and Discussion / Findings section needs to present detailed results, robust analysis, interpretation of findings in the context of the objectives, and comparison with existing literature. The Conclusion should summarize key findings meticulously, discuss limitations in detail, and propose extensive and specific future work. Focus on providing substantial, high-quality content to achieve the target length naturally.
  4.  **Formatting:**
      *   Use Markdown for formatting (headings, subheadings, lists, bold text for emphasis).
      *   Clearly delineate sections using Markdown headings (e.g., # Section 1, ## Subsection 1.1).
  5.  **References:**
      *   Generate a 'References' or 'Bibliography' section. If specific references aren't inferable, you can suggest common types of references relevant to the topic or provide placeholder examples.
  6.  **Placeholders:** Use placeholders like "[Your Name]", "[Your Institution]", "[Supervisor's Name]", "[Date]" where appropriate, especially on a title page or declaration section, so the student can easily customize it.

  Generate the 'reportContent' as a single Markdown string. Generate the 'references' as a separate Markdown formatted string listing the references.
  The report should be comprehensive and helpful for a student.
  `,
});

const generateProjectReportFlow = ai.defineFlow(
  {
    name: 'generateProjectReportFlow',
    inputSchema: GenerateProjectReportInputSchema, // Uses local schema
    outputSchema: GenerateProjectReportOutputSchema, // Uses local schema
  },
  async input => {
    const response = await prompt(input);
    if (!response.output) {
      console.error("AI prompt 'generateProjectReportPrompt' did not return a valid output.", response);
      throw new Error('AI failed to generate a valid response structure for the project report.');
    }
    return response.output;
  }
);
