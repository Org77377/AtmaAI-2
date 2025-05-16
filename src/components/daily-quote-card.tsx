"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { quotes, type Quote } from '@/lib/quotes';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

export default function DailyQuoteCard() {
  const [quote, setQuote] = useState<Quote | null>(null);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  if (!quote) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardContent className="p-6 text-center">
          <p className="text-lg text-muted-foreground">Loading quote...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/20 border-2 animate-fadeIn">
      <CardContent className="p-8 text-center">
        <blockquote className="text-xl italic font-medium text-foreground md:text-2xl">
          "{quote.text}"
        </blockquote>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex flex-col items-center space-y-4">
        <p className="text-sm text-muted-foreground">- {quote.author}</p>
        <Button variant="outline" size="sm" onClick={getRandomQuote} className="mt-2">
          <RefreshCw className="mr-2 h-4 w-4" /> New Quote
        </Button>
      </CardFooter>
    </Card>
  );
}

// Add a simple fadeIn animation to globals.css or tailwind.config.js if needed
// For now, a simple classname 'animate-fadeIn' is used as a placeholder.
// You can define it in globals.css:
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
*/
