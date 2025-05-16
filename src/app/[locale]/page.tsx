
"use client"; // This page remains a client component for localStorage and animations

import Link from 'next/link';
import { ArrowRight, BookOpen, MessageSquareHeart, Loader2, Wind, Sparkles, Quote, ShieldCheck, Lightbulb, Users } from 'lucide-react';
import DailyQuoteCard from '@/components/daily-quote-card';
import MoodTracker from '@/components/mood-tracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import type { Locale } from '@/lib/i18n-config'; // Assuming you have this type

// A simple way to pass dictionary, in a real app use context or a dedicated hook
// For this demo, we'll assume the dictionary is fetched and passed or available globally
// This is NOT how you'd typically get dictionary in a client component that's part of a server-rendered route
// but for simplicity of transformation for now:
interface HomePageProps {
  dictionary: {
    homePage: {
      welcome_to_aatmAI: string;
      greeting_morning: string;
      greeting_afternoon: string;
      greeting_evening: string;
      hero_subtitle: string;
      chat_now_button: string;
      what_aatmAI_can_do: string;
      feature_1: string;
      feature_2: string;
      feature_3: string;
      feature_4: string;
      feature_5: string;
      mood_tracker_title: string;
      mood_tracker_description: string;
      friendly_chat_card_title: string;
      friendly_chat_card_description: string;
      friendly_chat_card_button: string;
      curated_stories_card_title: string;
      curated_stories_card_description: string;
      curated_stories_card_button: string;
      learn_more_about_aatmAI: string;
      daily_quote_title: string;
    },
     header?: { // Optional, in case DailyQuoteCard needs it for its title via props
      tagline?: string;
    }
  };
}


const animatedCatchphrases = [
  "Your space to reflect.",
  "Guidance for your journey.",
  "A compassionate listener.",
  "Find clarity and peace.",
  "Insights for your well-being."
];

// This is a placeholder. In a real app, you'd fetch the dictionary via props or context.
// For the sake of this example, we'll mock it.
// You should replace this with proper dictionary fetching logic.
async function getDictionary(locale: Locale) {
  if (locale === 'hi') {
    return (await import('@/dictionaries/hi.json')).default;
  } else if (locale === 'kn') {
    return (await import('@/dictionaries/kn.json')).default;
  }
  return (await import('@/dictionaries/en.json')).default;
}


export default function HomePage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState<string>("");
  const [isLoadingName, setIsLoadingName] = useState<boolean>(true);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>(""); // Initialize empty
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale || 'en';

  const [dict, setDict] = useState<HomePageProps['dictionary'] | null>(null);

  useEffect(() => {
    async function loadDict() {
      const dictionaryContent = await getDictionary(locale);
      setDict(dictionaryContent as HomePageProps['dictionary']);
    }
    loadDict();
  }, [locale]);


  const [currentCatchphraseIndex, setCurrentCatchphraseIndex] = useState(0);

  useEffect(() => {
    if (!dict) return; // Wait for dictionary to load

    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName(null);
    }
    setIsLoadingName(false);

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(dict.homePage.greeting_morning);
    } else if (hour < 18) {
      setGreeting(dict.homePage.greeting_afternoon);
    } else {
      setGreeting(dict.homePage.greeting_evening);
    }
  }, [dict]); // Add dict to dependency array

  useEffect(() => {
    if (!userName && !isLoadingName) {
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
      localStorage.setItem('userName', trimmedName);
      setUserName(trimmedName);
      setNameInput("");
      setIsAppLoading(true);
      setTimeout(() => {
        setIsAppLoading(false);
        // router.refresh() might not re-trigger dictionary loading if locale hasn't changed
        // Forcing a reload to the current locale path to ensure page re-renders with name
        router.push(`/${locale}`); 
      }, 3000);
    }
  };
  
  if (isLoadingName || !dict) {
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
            <CardTitle className="text-3xl">Welcome to AatmAI!</CardTitle> {/* This can be from dict too */}
            <CardDescription>{dict.header?.tagline || "your AI therapist"}</CardDescription>
            <div className="mt-4 text-center h-10 flex items-center justify-center">
              <p 
                key={currentCatchphraseIndex} 
                className="text-primary animate-fadeIn text-xl font-medium"
              >
                {animatedCatchphrases[currentCatchphraseIndex]}
              </p>
            </div>
            <CardDescription className="mt-4">Please enter your name to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg font-semibold">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="mt-2 text-base"
                />
              </div>
              <Button type="submit" className="w-full text-lg py-3">
                Continue
              </Button>
            </form>
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
    { icon: <MessageSquareHeart className="w-6 h-6 text-primary" />, text: dict.homePage.feature_1 },
    { icon: <Lightbulb className="w-6 h-6 text-primary" />, text: dict.homePage.feature_2 },
    { icon: <BookOpen className="w-6 h-6 text-primary" />, text: dict.homePage.feature_3 },
    { icon: <Quote className="w-6 h-6 text-primary" />, text: dict.homePage.feature_4 },
    { icon: <ShieldCheck className="w-6 h-6 text-primary" />, text: dict.homePage.feature_5 },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-card rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          {greeting}, {userName}!
        </h1>
        <div className="mt-2">
          <p className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
           {dict.homePage.welcome_to_aatmAI}
          </p>
          <p className="mt-1 text-md text-muted-foreground">{dict.header?.tagline || "your AI therapist"}</p>
        </div>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          {dict.homePage.hero_subtitle}
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95">
            {/* Link to non-localized page for now */}
            <Link href="/guidance"> 
              <MessageSquareHeart className="mr-2 h-5 w-5" />
              {dict.homePage.chat_now_button}
            </Link>
          </Button>
        </div>
        <div className="mt-10">
          <DailyQuoteCard dictionary={{daily_quote_title: dict.homePage.daily_quote_title}} />
        </div>
      </section>

      <section>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2 justify-center">
              <Sparkles className="w-8 h-8 text-accent" />
              <CardTitle className="text-2xl text-center">{dict.homePage.what_aatmAI_can_do}</CardTitle>
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
        <MoodTracker dictionary={{mood_tracker_title: dict.homePage.mood_tracker_title, mood_tracker_description: dict.homePage.mood_tracker_description}} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <MessageSquareHeart className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">{dict.homePage.friendly_chat_card_title}</CardTitle>
            </div>
            <CardDescription>
              {dict.homePage.friendly_chat_card_description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button asChild className="w-full mt-4">
              {/* Link to non-localized page for now */}
              <Link href="/guidance">{dict.homePage.friendly_chat_card_button} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <CardTitle className="text-2xl">{dict.homePage.curated_stories_card_title}</CardTitle>
            </div>
            <CardDescription>
             {dict.homePage.curated_stories_card_description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Button asChild className="w-full mt-4">
              {/* Link to non-localized page for now */}
              <Link href="/stories">{dict.homePage.curated_stories_card_button} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </section>

       <section className="text-center py-8">
        <Button asChild variant="link" size="lg">
          {/* Link to non-localized page for now */}
          <Link href="/about">
            <Users className="mr-2 h-5 w-5" />
            {dict.homePage.learn_more_about_aatmAI}
          </Link>
        </Button>
      </section>
    </div>
  );
}
