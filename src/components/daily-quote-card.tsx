
"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { quotes as allQuotes, type Quote } from '@/lib/quotes'; // Correctly import Quote type
import { Button } from '@/components/ui/button';
import { Zap, Share2, BookmarkCheck, BookmarkPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DailyQuoteCard() {
  const [quote, setQuote] = useState<Quote | null>(null); // Use Quote type
  const [savedQuotes, setSavedQuotes] = useState<string[]>([]);
  const { toast } = useToast();

  const getRandomQuote = useCallback(() => {
    if (allQuotes.length === 0) {
      setQuote({ id: 'system-no-quote', text: "No quotes available at the moment.", author: "System" });
      return;
    }
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    setQuote(allQuotes[randomIndex]);
  }, []);

  useEffect(() => {
    getRandomQuote();
    const storedSavedQuotes = localStorage.getItem('aatmAI-saved-quotes');
    if (storedSavedQuotes) {
      try {
        const parsedQuotes = JSON.parse(storedSavedQuotes);
        if (Array.isArray(parsedQuotes)) {
          setSavedQuotes(parsedQuotes);
        } else {
          setSavedQuotes([]);
          localStorage.removeItem('aatmAI-saved-quotes'); // Clean up non-array data
        }
      } catch (error) {
        console.error("Failed to parse saved quotes from localStorage:", error);
        setSavedQuotes([]);
        localStorage.removeItem('aatmAI-saved-quotes'); 
      }
    }
  }, [getRandomQuote]);

  const handleShare = async () => {
    if (!quote) return;
    const shareData = {
      title: 'AatmAI - Daily Quote',
      text: `"${quote.text}" - ${quote.author}`,
      url: window.location.href,
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({ title: "Quote Shared!", description: "The quote has been shared." });
      } else {
        await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
        toast({ title: "Quote Copied!", description: "The quote has been copied to your clipboard." });
      }
    } catch (err) {
      console.error("Share failed:", err);
      try {
        await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
        toast({ title: "Quote Copied!", description: "Sharing failed, quote copied to clipboard." });
      } catch (copyErr) {
        toast({ title: "Failed to Share or Copy", description: "Could not share or copy the quote.", variant: "destructive" });
      }
    }
  };

  const handleSaveQuote = () => {
    if (!quote || !quote.id) return; // Ensure quote and quote.id exist
    let updatedSavedQuotes = [...savedQuotes];
    if (savedQuotes.includes(quote.id)) {
      updatedSavedQuotes = updatedSavedQuotes.filter(id => id !== quote.id);
      toast({ title: "Quote Unsaved", description: "Removed from your saved quotes." });
    } else {
      updatedSavedQuotes.push(quote.id);
      toast({ title: "Quote Saved!", description: "Added to your saved quotes." });
    }
    setSavedQuotes(updatedSavedQuotes);
    localStorage.setItem('aatmAI-saved-quotes', JSON.stringify(updatedSavedQuotes));
  };

  const isQuoteSaved = quote && quote.id && savedQuotes.includes(quote.id);

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
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-primary/30 border-2 bg-card">
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
        <div className="mt-4 flex space-x-3">
          <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share quote">
            <Share2 className="h-5 w-5" />
          </Button>
          {quote.id && ( // Conditionally render save button if quote.id exists
            <Button variant="outline" size="icon" onClick={handleSaveQuote} aria-label={isQuoteSaved ? "Unsave quote" : "Save quote"}>
              {isQuoteSaved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <BookmarkPlus className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
