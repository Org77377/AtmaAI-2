
// src/app/students/resume-tips/page.tsx
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Contact, Edit3, FileText, LayoutGrid, Lightbulb, ListChecks, Sparkles, Star, Target, UserCheck, Zap, AlertTriangle } from 'lucide-react'; // Added AlertTriangle

const resumeTipsData = [
  {
    category: 'Essential Sections',
    icon: <FileText className="w-6 h-6 text-blue-500" />,
    tips: [
      { title: 'Contact Information', details: 'Include your full name, phone number, professional email address, and LinkedIn profile URL. Ensure it\'s up-to-date and easy to find.', example: 'Omkar R G | +91-9876543210 | omkar.rg@email.com | linkedin.com/in/omkarrg' },
      { title: 'Professional Summary or Objective', details: 'Write a concise 2-3 sentence summary highlighting your key skills, experience level, and career goals. Tailor it to the job you\'re applying for.', example: 'Objective: Aspiring software engineer with a strong foundation in Python and web development, seeking an entry-level position to contribute to innovative projects. Summary (for experienced): Results-oriented Product Manager with 5+ years of experience in SaaS...' },
      { title: 'Work Experience (Reverse Chronological)', details: 'List your jobs starting with the most recent. Include company name, job title, dates of employment, and 3-5 bullet points describing your responsibilities and achievements. Use action verbs and quantify achievements whenever possible.', example: 'Software Developer Intern | Tech Solutions Inc. | May 2023 - Aug 2023 | - Developed 3 new features for the client portal using React, resulting in a 15% increase in user engagement. - Collaborated with a team of 5 to debug and resolve over 50 software issues.' },
      { title: 'Education', details: 'List your degrees in reverse chronological order. Include university name, degree, major, graduation date (or expected date), and GPA (if impressive). Mention relevant coursework or academic honors.', example: 'B.Tech in Computer Science | XYZ University | Expected May 2025 | CGPA: 8.5/10' },
      { title: 'Skills', details: 'Create a dedicated section for technical skills (programming languages, software, tools) and soft skills (communication, teamwork, problem-solving). Tailor this to the job description.', example: 'Technical Skills: Python, Java, React, Node.js, SQL, Git. Soft Skills: Team Collaboration, Agile Methodologies, Critical Thinking.' },
    ],
  },
  {
    category: 'Content & Wording',
    icon: <Edit3 className="w-6 h-6 text-green-500" />,
    tips: [
      { title: 'Use Action Verbs', details: 'Start bullet points with strong action verbs like "Developed," "Managed," "Led," "Implemented," "Analyzed," "Created." This makes your accomplishments sound more impactful.' },
      { title: 'Quantify Achievements', details: 'Whenever possible, use numbers and data to demonstrate your impact. For example, "Increased sales by 20%" or "Reduced project costs by 15%."' },
      { title: 'Tailor to Each Job', details: 'Customize your resume for each job application. Highlight the skills and experiences that are most relevant to the specific job description. Use keywords from the job posting.' },
      { title: 'Proofread Meticulously', details: 'Typos and grammatical errors can create a negative impression. Proofread multiple times, and consider asking someone else to review it for you. Use spell-check and grammar tools.' },
    ],
  },
  {
    category: 'Formatting & Presentation',
    icon: <LayoutGrid className="w-6 h-6 text-purple-500" />,
    tips: [
      { title: 'Choose a Clean Format', details: 'Opt for a professional and easy-to-read resume format. Common formats include Chronological (focuses on work history), Functional (focuses on skills), and Combination (balances both). For most students and recent graduates, a chronological or combination format is suitable.' },
      { title: 'Consistent Formatting', details: 'Use consistent font styles, sizes, bullet points, and spacing throughout your resume. This makes it look organized and professional.' },
      { title: 'Length: One Page is Ideal', details: 'For students and those with less than 10 years of experience, aim for a one-page resume. Be concise and prioritize the most relevant information.' },
      { title: 'Use White Space Effectively', details: 'Don\'t cram too much information. Adequate white space makes your resume easier to scan and read.' },
      { title: 'Save as PDF', details: 'Always save and submit your resume as a PDF to preserve formatting across different devices and operating systems.' },
    ],
  },
  {
    category: 'Optional But Impactful Sections',
    icon: <Star className="w-6 h-6 text-yellow-500" />,
    tips: [
      { title: 'Projects', details: 'Include significant academic, personal, or open-source projects. Describe the project, your role, technologies used, and any notable outcomes.' },
      { title: 'Certifications & Courses', details: 'List relevant certifications, online courses, or workshops that enhance your qualifications.' },
      { title: 'Awards & Honors', details: 'Include any academic awards, scholarships, or recognitions you\'ve received.' },
      { title: 'Volunteer Experience & Extracurriculars', details: 'These can demonstrate soft skills, leadership, and initiative, especially if related to the job or your field.' },
    ],
  },
  {
    category: 'General Advice',
    icon: <Lightbulb className="w-6 h-6 text-red-500" />, // Changed icon color class
    tips: [
      { title: 'Be Honest', details: 'Never falsify information on your resume. Integrity is crucial.' },
      { title: 'Focus on Relevance', details: 'Prioritize information that is directly relevant to the jobs you are applying for.' },
      { title: 'Get Feedback', details: 'Ask career counselors, mentors, professors, or peers to review your resume and provide constructive criticism.' },
      { title: 'Keywords are Key', details: 'Many companies use Applicant Tracking Systems (ATS) to scan resumes for keywords. Identify keywords from job descriptions and incorporate them naturally into your resume.' },
    ],
  },
];

const commonMistakesData = [
  {
    category: 'Common Resume Mistakes to Avoid',
    icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
    tips: [
      { title: 'Typos and Grammatical Errors', details: 'Even small errors can make you look unprofessional. Proofread carefully and use tools.' },
      { title: 'Generic, Non-Tailored Resume', details: 'Sending the same resume for every job application is ineffective. Customize it for each role.' },
      { title: 'Focusing on Duties, Not Achievements', details: 'Instead of just listing tasks, highlight what you accomplished and the impact you made. Use quantifiable results.' },
      { title: 'Unprofessional Email Address', details: 'Use a mature and professional email address (e.g., firstname.lastname@email.com).' },
      { title: 'Inconsistent Formatting', details: 'Mismatched fonts, spacing, or bullet styles look sloppy. Maintain consistency throughout.' },
      { title: 'Too Long or Too Short', details: 'Aim for one page if you have less than 10 years of experience. Avoid unnecessary fluff, but also provide enough detail for relevant experiences.' },
      { title: 'Including Irrelevant Information', details: 'Hobbies or personal details that aren\'t relevant to the job can clutter your resume.' },
      { title: 'Using Passive Language', details: 'Start bullet points with strong action verbs to sound more proactive and accomplished.' },
      { title: 'Incorrect Contact Information', details: 'Double-check your phone number and email address for accuracy.' },
      { title: 'Lying or Exaggerating', details: 'Honesty is crucial. Background checks can reveal discrepancies.' },
    ],
  },
];

const resumeFormats = [
  { name: 'Chronological Resume', description: 'Lists your work experience in reverse chronological order (most recent first). Best for showcasing a strong, consistent work history and career progression.', icon: <ListChecks className="w-5 h-5 text-indigo-500" /> },
  { name: 'Functional Resume', description: 'Focuses on your skills and abilities rather than chronological work history. Can be useful for career changers or those with employment gaps, but some recruiters prefer chronological.', icon: <Zap className="w-5 h-5 text-pink-500" /> },
  { name: 'Combination Resume', description: 'Combines elements of both chronological and functional formats. Typically starts with a skills summary followed by a reverse chronological work history. Offers flexibility.', icon: <Sparkles className="w-5 h-5 text-teal-500" /> },
];

export default function ResumeBuildingTipsPage() {
  const allResumeSections = [...resumeTipsData, ...commonMistakesData]; // Combine all sections

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10 p-6 md:p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <UserCheck className="w-12 h-12 text-primary" />
            <CardTitle className="text-3xl md:text-4xl text-primary">Craft Your Standout Resume</CardTitle>
            <CardDescription className="text-lg text-foreground max-w-2xl">
              Your resume is your first impression. Follow these tips to create a compelling resume that highlights your strengths and helps you land your dream job.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
              <Target className="w-7 h-7 text-primary" /> Key Resume Guidance
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {allResumeSections.map((categoryData, index) => ( // Use combined array
                <AccordionItem value={`category-${index}`} key={index} className="border-b border-border last:border-b-0">
                  <AccordionTrigger className="text-lg hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      {categoryData.icon}
                      <span className="font-semibold">{categoryData.category}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-3">
                    {categoryData.tips.map((tip, tipIndex) => (
                      <Card key={tipIndex} className="bg-card p-4 shadow-sm border">
                        <h4 className="font-semibold text-md text-primary mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{tip.details}</p>
                        {tip.example && (
                          <p className="text-xs text-foreground/80 italic bg-muted p-2 rounded-md">
                            <span className="font-semibold">Example:</span> {tip.example}
                          </p>
                        )}
                      </Card>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
              <Contact className="w-7 h-7 text-primary" /> Common Resume Formats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumeFormats.map((format, index) => (
                <Card key={index} className="bg-card p-4 shadow-sm border flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    {format.icon}
                    <h4 className="font-semibold text-md text-primary">{format.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground flex-grow">{format.description}</p>
                </Card>
              ))}
            </div>
             <Alert variant="default" className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-sm">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="font-semibold text-blue-700 dark:text-blue-300">Pro Tip</AlertTitle>
                <AlertDescription className="text-blue-600 dark:text-blue-400">
                    The best format depends on your experience level and career goals. For most students, a reverse-chronological or combination resume works well. Always tailor your resume to the specific job you're applying for!
                </AlertDescription>
            </Alert>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
