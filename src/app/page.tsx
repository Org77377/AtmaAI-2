import Link from 'next/link';
import { ArrowRight, BarChart3, BookOpen, MessageSquareHeart } from 'lucide-react';
import DailyQuoteCard from '@/components/daily-quote-card';
import MoodTracker from '@/components/mood-tracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-card rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          Welcome to Mitra Guide
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Your compassionate companion for navigating life's challenges. We offer personalized guidance, inspiring stories, and a space to reflect.
        </p>
        <div className="mt-10">
          <DailyQuoteCard />
        </div>
      </section>

      <section>
        <MoodTracker />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquareHeart className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Personalized Guidance</CardTitle>
            </div>
            <CardDescription>
              Receive AI-driven advice tailored to your career, financial, and relationship concerns, with cultural sensitivity for Indian users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Image 
              src="https://placehold.co/600x400.png" 
              alt="Personalized Guidance illustration" 
              width={600} 
              height={400} 
              className="rounded-md mb-4 object-cover w-full h-48"
              data-ai-hint="guidance support" 
            />
            <Button asChild className="w-full">
              <Link href="/guidance">Get Guidance <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Curated Life Stories</CardTitle>
            </div>
            <CardDescription>
              Discover inspiring real-life stories curated by AI to match your profile and challenges, offering motivation and new perspectives.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Image 
              src="https://placehold.co/600x400.png" 
              alt="Curated Stories illustration" 
              width={600} 
              height={400} 
              className="rounded-md mb-4 object-cover w-full h-48"
              data-ai-hint="inspiration stories"
            />
            <Button asChild className="w-full">
              <Link href="/stories">Explore Stories <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
