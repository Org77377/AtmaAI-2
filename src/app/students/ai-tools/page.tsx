
// src/app/students/ai-tools/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Presentation,
  ImageIcon,
  GitFork,
  FileText,
  Search,
  Code,
  Video,
  Sparkles,
  GraduationCap,
  Cpu,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

const aiToolsData = [
  {
    name: 'AI Presentation Maker',
    description: 'Generate engaging presentations from text prompts or documents. Helps with structure, design, and content.',
    icon: <Presentation className="w-10 h-10 text-purple-500" />,
    color: "purple",
    href: '#' // Replace with actual link
  },
  {
    name: 'AI Image Generator',
    description: 'Create unique images from text descriptions for projects, presentations, or visual aids.',
    icon: <ImageIcon className="w-10 h-10 text-pink-500" />,
    color: "pink",
    href: '#' // Replace with actual link
  },
  {
    name: 'AI Roadmap & Mindmap Creator',
    description: 'Visualize complex ideas, plan projects, and create study roadmaps with AI assistance.',
    icon: <GitFork className="w-10 h-10 text-orange-500" />,
    color: "orange",
    href: '#' // Replace with actual link
  },
  {
    name: 'AI Writing Assistant',
    description: 'Improve grammar, clarity, and style in essays, reports, and emails. Helps with paraphrasing and summarization.',
    icon: <FileText className="w-10 h-10 text-blue-500" />,
    color: "blue",
    href: '#' // Replace with actual link
  },
  {
    name: 'AI Research Assistant',
    description: 'Find relevant papers, extract key information, and get answers from research documents quickly.',
    icon: <Search className="w-10 h-10 text-green-500" />,
    color: "green",
    href: '#' // Replace with actual link
  },
  {
    name: 'AI Coding Assistant',
    description: 'Get help with code generation, debugging, and understanding programming concepts.',
    icon: <Code className="w-10 h-10 text-gray-500" />,
    color: "gray",
    href: '#' // Replace with actual link
  },
  {
    name: 'AI Video Editor/Creator',
    description: 'Automate video editing tasks, generate videos from text or articles, or create short video summaries.',
    icon: <Video className="w-10 h-10 text-red-500" />,
    color: "red",
    href: '#' // Replace with actual link
  },
  {
    name: 'AI Study Aid & Flashcard Generator',
    description: 'Create flashcards, quizzes, and personalized study materials from your notes or textbooks.',
    icon: <Sparkles className="w-10 h-10 text-yellow-500" />,
    color: "yellow",
    href: '#' // Replace with actual link
  },
  {
    name: 'AI Learning Path Generator',
    description: 'Get personalized learning paths for new skills or subjects, with resource recommendations.',
    icon: <GraduationCap className="w-10 h-10 text-teal-500" />,
    color: "teal",
    href: '#' // Replace with actual link
  },
];

export default function UsefulAIToolsPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Card className="shadow-xl overflow-hidden bg-card">
        <CardHeader className="bg-primary/10 p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary rounded-full">
              <Cpu className="w-12 h-12 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl md:text-4xl text-primary">Useful AI Tools for Students</CardTitle>
            <CardDescription className="text-lg text-foreground max-w-2xl">
              Discover AI-powered tools that can supercharge your studies, projects, and creativity.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiToolsData.map((tool) => (
              <Card
                key={tool.name}
                className={`shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between border-l-4 border-${tool.color}-500`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {/* Make the icon a clickable link */}
                    <Link href={tool.href} target="_blank" rel="noopener noreferrer" passHref
                          className={`p-2 rounded-full bg-${tool.color}-100 dark:bg-${tool.color}-900/30 hover:bg-${tool.color}-200 dark:hover:bg-${tool.color}-800/50 transition-colors`}
                          aria-label={`Visit ${tool.name}`}>
                        {tool.icon}
                    </Link>
                    <CardTitle className={`text-xl text-${tool.color}-600 dark:text-${tool.color}-400`}>{tool.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm">{tool.description}</p>
                </CardContent>
                 <CardFooter>
                  <Button asChild variant="link" className={`p-0 text-${tool.color}-600 hover:text-${tool.color}-700`}>
                    <Link href={tool.href} target="_blank" rel="noopener noreferrer">
                      Visit Tool <ExternalLink className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-8 text-center">
            Note: Links will open in a new tab. Explore these tools and see how they can help you learn and create more effectively! Always review the terms and privacy policies of external tools.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
