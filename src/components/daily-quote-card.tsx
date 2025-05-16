
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { quotes, type Quote } from '@/lib/quotes';
import { Zap } from 'lucide-react';
// Button import and RefreshCw icon import are removed as the button is no longer used.

export default function DailyQuoteCard() {
  const [quote, setQuote] = useState<Quote | null>(null);

  // This function is still used by useEffect to set the initial quote
  const getRandomQuote = () => {
    // Ensure quotes array is not empty to prevent errors
    if (quotes.length === 0) {
        setQuote({ text: "No quotes available at the moment.", author: "System" });
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  if (!quote) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-6 text-center">
          <p className="text-lg text-muted-foreground">Loading a thought for you...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-primary/30 border-2 animate-fadeIn bg-card">
      <CardHeader className="pt-6 pb-2 flex flex-row items-center justify-center space-x-2">
        <Zap className="w-6 h-6 text-accent" />
        <h3 className="text-xl font-semibold text-primary">A Moment of Reflection</h3>
      </CardHeader>
      <CardContent className="p-6 pt-2 text-center">
        <blockquote className="text-xl italic font-medium text-foreground md:text-2xl">
          "{quote.text}"
        </blockquote>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-col items-center">
        <p className="text-sm text-muted-foreground mt-2">- {quote.author}</p>
        {/* "Another Thought" button has been removed from here */}
      </CardFooter>
    </Card>
  );
}
