
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NotebookText, Lightbulb, FileText, Users, ScrollText, Briefcase, Bell, GraduationCap, ArrowRight, Brain, Cpu } from 'lucide-react';
import Link from 'next/link';

const studentFeatures = [
  {
    title: "Student AI for Notes",
    description: "Summarize, organize, and get insights from your study notes.",
    icon: <NotebookText className="w-10 h-10 text-blue-500" />,
    color: "blue",
    href: "/students/notes-generator"
  },
  {
    title: "Project Idea Generation",
    description: "Brainstorm innovative project ideas for your assignments and capstones.",
    icon: <Lightbulb className="w-10 h-10 text-yellow-500" />,
    color: "yellow",
    href: "/students/project-ideas"
  },
  {
    title: "Project Report Help",
    description: "Get assistance in structuring and writing your project reports.",
    icon: <FileText className="w-10 h-10 text-green-500" />,
    color: "green",
    href: "/students/project-report"
  },
  {
    title: "Interview Prep",
    description: "Practice common interview questions and get tips for success with an AI interviewer.",
    icon: <Brain className="w-10 h-10 text-purple-500" />,
    color: "purple",
    href: "/students/interview-prep"
  },
  {
    title: "Resume Building Tips",
    description: "Learn how to craft a compelling resume that stands out.",
    icon: <ScrollText className="w-10 h-10 text-red-500" />,
    color: "red",
    href: "/students/resume-tips"
  },
  {
    title: "Useful AI Tools",
    description: "Discover AI-powered tools that can help with research, writing, and learning.",
    icon: <Cpu className="w-10 h-10 text-cyan-500" />,
    color: "cyan",
    href: "/students/ai-tools" // Updated link
  },
  {
    title: "Job Search for Freshers",
    description: "Find resources and strategies for your first job hunt (Feature Coming Soon).",
    icon: <Briefcase className="w-10 h-10 text-indigo-500" />,
    color: "indigo",
    href: "#" // Placeholder for future link
  },
  {
    title: "Exam Notifications & Prep",
    description: "Stay updated on exam schedules and get preparation guidance (Feature Coming Soon).",
    icon: <Bell className="w-10 h-10 text-pink-500" />,
    color: "pink",
    href: "#" // Placeholder for future link
  },
];

export default function StudentSuccessHubPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Card className="shadow-xl overflow-hidden bg-card">
        <CardHeader className="bg-primary/10 p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary rounded-full">
              <GraduationCap className="w-12 h-12 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl md:text-4xl text-primary">Student Success Hub</CardTitle>
            <p className="text-lg text-muted-foreground">
              AatmAI is here to help you ace your student life! Explore tools and resources tailored for you.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentFeatures.map((feature) => (
              <Card
                key={feature.title}
                className={`shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between border-l-4 border-${feature.color}-500`}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {feature.icon}
                    <CardTitle className={`text-xl text-${feature.color}-600 dark:text-${feature.color}-400`}>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button
                    asChild
                    variant="ghost"
                    className={`w-full justify-start text-${feature.color}-500 hover:text-${feature.color}-600 hover:bg-${feature.color}-500/10`}
                    disabled={feature.href === "#" && feature.title !== "Useful AI Tools"} // Enable button for Useful AI Tools
                  >
                    <Link href={feature.href || "#"}>
                      {(feature.href === "#" && feature.title !== "Useful AI Tools") ? "Coming Soon" : "Explore"}
                      {(feature.href !== "#" || feature.title === "Useful AI Tools" && feature.href !== "#") && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
