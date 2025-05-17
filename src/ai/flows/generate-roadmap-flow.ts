'use server';
/**
 * @fileOverview AI agent that generates a detailed learning roadmap for a given topic or skill.
 *
 * - generateRoadmap - A function that generates and returns a learning roadmap.
 * - GenerateRoadmapInput - The input type for the generateRoadmap function.
 * - GenerateRoadmapOutput - The return type for the generateRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoadmapInputSchema = z.object({
  topicOrSkill: z
    .string()
    .min(3, 'Please provide a topic or skill with at least 3 characters.')
    .max(200, 'Topic/skill is too long. Please keep it under 200 characters.'),
});
export type GenerateRoadmapInput = z.infer<typeof GenerateRoadmapInputSchema>;

const ResourceSchema = z.object({
  type: z.enum(['Video', 'Article', 'Course', 'Book', 'Documentation', 'Tool', 'Other'])
           .describe('The type of the learning resource.'),
  descriptionOrLink: z.string().describe('A brief description of the resource or a direct link if applicable.'),
});

const RoadmapStepSchema = z.object({
  id: z.string().describe('A unique identifier for the step, e.g., "step-1".'),
  title: z.string().describe('A clear, concise title for this step of the roadmap.'),
  description: z.string().describe('A detailed explanation of what to learn or do in this step.'),
  estimatedDuration: z.string().describe('An estimated time to complete this step (e.g., "1-2 weeks", "10-15 hours").'),
  resources: z.array(ResourceSchema).min(1).describe('A list of learning resources for this step.'),
  keywords: z.array(z.string()).optional().describe('Relevant keywords or sub-topics covered in this step.'),
});

const GenerateRoadmapOutputSchema = z.object({
  roadmapTitle: z.string().describe('A suitable title for the generated roadmap (e.g., "Your Roadmap to Mastering [Topic/Skill]").'),
  introduction: z.string().describe('A brief introduction to the topic/skill and an overview of the roadmap.'),
  steps: z.array(RoadmapStepSchema).min(3).describe('An array of detailed steps to learn the topic/skill. Should include at least 3 steps.'),
  conclusion: z.string().describe('A concluding paragraph with encouragement and potential next steps after completing the roadmap.'),
  motivationalQuote: z.object({
    text: z.string(),
    author: z.string().optional(),
  }).describe('A relevant motivational quote to inspire the learner.'),
});
export type GenerateRoadmapOutput = z.infer<typeof GenerateRoadmapOutputSchema>;

export async function generateRoadmap(
  input: GenerateRoadmapInput
): Promise<GenerateRoadmapOutput> {
  return generateRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoadmapPrompt',
  input: {schema: GenerateRoadmapInputSchema},
  output: {schema: GenerateRoadmapOutputSchema},
  prompt: `You are an expert academic advisor and curriculum designer. Your task is to generate a comprehensive, in-depth, and actionable learning roadmap for a student who wants to learn the following topic or skill:

Topic/Skill: {{{topicOrSkill}}}

Please structure the roadmap as follows:

1.  **Roadmap Title:** Create an engaging title for the roadmap (e.g., "Your Comprehensive Guide to Mastering {{topicOrSkill}}").
2.  **Introduction:** Write a brief (2-3 sentences) introduction to the topic/skill, explaining its importance or relevance, and what the student can expect from this roadmap.
3.  **Steps (Minimum 3-5 detailed steps):**
    *   Break down the learning process into logical, sequential steps. Each step should be substantial.
    *   For each step:
        *   **id:** A unique ID like "step-1", "step-2", etc.
        *   **title:** A clear, bold, and descriptive title for the step.
        *   **description:** A detailed explanation of the concepts to learn, skills to acquire, or tasks to perform in this step. This should be the core of the roadmap.
        *   **estimatedDuration:** Provide a realistic estimated time it might take to complete this step (e.g., "1 week (10-15 hours)", "3-4 days intensive study").
        *   **resources (provide at least 2-3 diverse resources per step):** List specific learning resources. For each resource, specify its 'type' (Video, Article, Course, Book, Documentation, Tool, Other) and a 'descriptionOrLink' (e.g., "Official Python Documentation on Loops", "Crash Course on YouTube: Intro to Calculus", "Book: 'Clean Code' by Robert C. Martin", "Tool: Figma for UI/UX"). Prioritize free and widely accessible high-quality resources where possible.
        *   **keywords (optional):** List a few key terms or sub-topics covered in this step.
4.  **Conclusion:** Write a concluding paragraph (2-3 sentences) summarizing the journey and offering encouragement or suggesting how to apply the newly acquired knowledge/skill.
5.  **Motivational Quote:** Provide one relevant motivational quote (with author, if known) to inspire the student.

General Instructions:
- The roadmap should be **in-depth and practical**. Assume the student is dedicated.
- Ensure the information is accurate and up-to-date.
- The language should be encouraging and clear.
- If the topic is broad (e.g., "Programming"), try to suggest a foundational path or ask for more specifics in your introduction if necessary (though for this task, generate a general path).
- If the topic is very niche, provide as much detail as possible.
- The overall roadmap should guide a student from beginner/intermediate to a proficient level for the given topic/skill.
`,
});

const generateRoadmapFlow = ai.defineFlow(
  {
    name: 'generateRoadmapFlow',
    inputSchema: GenerateRoadmapInputSchema,
    outputSchema: GenerateRoadmapOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    if (!response.output) {
      console.error("AI prompt 'generateRoadmapPrompt' did not return a valid output.", response);
      throw new Error('AI failed to generate a valid response structure for the roadmap.');
    }
    return response.output;
  }
);
