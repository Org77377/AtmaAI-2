
"use client";

import Link from 'next/link';
import { ArrowRight, BookOpen, MessageSquareHeart, Loader2, Wind, Sparkles, Quote, ShieldCheck, Lightbulb, Users, Info } from 'lucide-react';
import DailyQuoteCard from '@/components/daily-quote-card';
import MoodTracker from '@/components/mood-tracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect, type FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const animatedCatchphrases = [
  "Your space to reflect.",
  "Guidance for your journey.",
  "A compassionate listener.",
  "Find clarity and peace.",
  "Insights for your well-being."
];

export default function HomePage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState<string>("");
  const [isLoadingName, setIsLoadingName] = useState<boolean>(true);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>("Hi");
  const router = useRouter();
  const [currentCatchphraseIndex, setCurrentCatchphraseIndex] = useState(0);
  const nameInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const storedName = localStorage.getItem('userNameAatmAI');
    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName(null); 
    }
    setIsLoadingName(false);

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  useEffect(() => {
    if (userName === null && !isLoadingName) {
        // Focus the input field when the name input form is shown
        nameInputRef.current?.focus();
        const intervalId = setInterval(() => {
            setCurrentCatchphraseIndex((prevIndex) =>
            (prevIndex + 1) % animatedCatchphrases.length
            );
        }, 3000);
        return () => clearInterval(intervalId);
    }
  }, [userName, isLoadingName]);


  const handleNameSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = nameInput.trim();
    if (trimmedName) {
      localStorage.setItem('userNameAatmAI', trimmedName);
      // Clear chat history from previous user if any
      localStorage.removeItem('aatmai-chat-history'); 
      setUserName(trimmedName);
      setNameInput("");
      setIsAppLoading(true);
      setTimeout(() => {
        setIsAppLoading(false);
        router.refresh(); 
      }, 3000);
    }
  };
  
  if (isLoadingName) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!userName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
        <Card className="w-full max-w-md p-6 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome to AatmAI!</CardTitle>
            <CardDescription>your AI therapist</CardDescription>
             <div className="mt-4 text-center h-10 flex items-center justify-center">
              <p 
                key={currentCatchphraseIndex} 
                className="text-primary animate-fadeIn text-xl font-medium"
              >
                {animatedCatchphrases[currentCatchphraseIndex]}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-lg font-semibold">Your Name</Label>
                <Input
                  id="name"
                  ref={nameInputRef}
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your name to begin"
                  required
                  className="mt-2 text-base"
                />
              </div>
              <Button type="submit" className="w-full text-lg py-3">
                Continue
              </Button>
            </form>
             <Alert variant="default" className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-sm">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="font-semibold text-blue-700 dark:text-blue-300">Your Privacy Matters</AlertTitle>
                <AlertDescription className="text-blue-600 dark:text-blue-400">
                    AatmAI is completely anonymous. We ask for your name only to personalize your experience (like greetings) and help AatmAI remember our current conversation if you chat.
                    This information is stored **only on your device** and is cleared if you reset your name. No personal data or conversation history is stored on our servers.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAppLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
        <Wind className="h-16 w-16 text-primary mb-6 animate-pulse" />
        <p className="text-2xl font-semibold text-foreground mb-2">Connecting to AatmAI...</p>
        <p className="text-lg italic text-muted-foreground">"'This time will pass.' - Shri Krishna"</p>
      </div>
    );
  }

  const appFeatures = [
    { icon: <MessageSquareHeart className="w-6 h-6 text-primary" />, text: "Offer a friendly ear and a space to share your thoughts." },
    { icon: <Lightbulb className="w-6 h-6 text-primary" />, text: "Provide AI-driven insights for career, financial, and relationship concerns." },
    { icon: <BookOpen className="w-6 h-6 text-primary" />, text: "Share inspiring real-life stories tailored to your situation." },
    { icon: <Quote className="w-6 h-6 text-primary" />, text: "Help you reflect and find motivation with daily quotes." },
    { icon: <ShieldCheck className="w-6 h-6 text-primary" />, text: "Respect your privacy: Your interactions are anonymous and no personal data is stored server-side." },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-card rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          {greeting}, {userName}!
        </h1>
        <div className="mt-2">
          <p className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Welcome to AatmAI
          </p>
          <p className="mt-1 text-md text-muted-foreground">your AI therapist</p>
        </div>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Your compassionate companion for navigating life's challenges. We offer friendly advice, inspiring stories, and a space to reflect.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95">
            <Link href="/guidance">
              <MessageSquareHeart className="mr-2 h-5 w-5" />
              Chat Now with AatmAI
            </Link>
          </Button>
        </div>
        <div className="mt-10">
          <DailyQuoteCard />
        </div>
      </section>

      <section>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2 justify-center">
              <Sparkles className="w-8 h-8 text-accent" />
              <CardTitle className="text-2xl text-center">What AatmAI Can Do For You</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {appFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 p-3 bg-background rounded-lg border transition-all duration-200 ease-in-out hover:shadow-md hover:scale-[1.02] hover:border-primary/50"
                >
                  <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                  <p className="text-foreground">{feature.text}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <MoodTracker />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquareHeart className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">Friendly Chat</CardTitle>
            </div>
            <CardDescription>
              Receive AI-driven advice tailored to your career, financial, and relationship concerns, with cultural sensitivity for Indian users.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button asChild className="w-full mt-4">
              <Link href="/guidance">Let's Chat <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
          <CardContent className="pt-6">
            <Button asChild className="w-full mt-4">
              <Link href="/stories">Explore Stories <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </section>

       <section className="text-center py-8">
        <Button asChild variant="link" size="lg">
          <Link href="/about">
            <Users className="mr-2 h-5 w-5" />
            Learn More About AatmAI's Story
          </Link>
        </Button>
      </section>
    </div>
  );
}

