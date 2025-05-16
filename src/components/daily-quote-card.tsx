
"use client";

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { quotes as allQuotes, type Quote } from '@/lib/quotes';
import { Button } from '@/components/ui/button';
import { Zap, Share2, BookmarkCheck, BookmarkPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DailyQuoteCard() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [savedQuotes, setSavedQuotes] = useState<string[]>([]);
  const { toast } = useToast();

  const getRandomQuote = useCallback(() => {
    // Ensure quotes array is not empty to prevent errors
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
          // If stored data is not an array, clear it or set to empty
          setSavedQuotes([]);
          localStorage.removeItem('aatmAI-saved-quotes'); 
        }
      } catch (error) {
        console.error("Failed to parse saved quotes from localStorage:", error);
        setSavedQuotes([]);
        localStorage.removeItem('aatmAI-saved-quotes'); // Clear potentially corrupt data
      }
    }
  }, [getRandomQuote]);

  const handleShare = async () => {
    if (!quote) return;
    const shareData = {
      title: 'AatmAI - Daily Quote',
      text: `"${quote.text}" - ${quote.author}`,
      url: window.location.href, // Or a more specific URL if applicable
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) { // Check if navigator.canShare is available
        await navigator.share(shareData);
        toast({ title: "Quote Shared!", description: "The quote has been shared." });
      } else if (navigator.clipboard) { // Fallback to clipboard if share is not fully supported
        await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
        toast({ title: "Quote Copied!", description: "The quote has been copied to your clipboard." });
      } else {
        toast({ title: "Failed to Share", description: "Sharing not supported on this browser.", variant: "destructive" });
      }
    } catch (err) {
      console.error("Share failed:", err);
      // Attempt clipboard copy as a last resort if share() promise rejects
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
          toast({ title: "Quote Copied!", description: "Sharing failed, quote copied to clipboard." });
        } else {
          toast({ title: "Failed to Share or Copy", description: "Could not share or copy the quote.", variant: "destructive" });
        }
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
          {/* Conditionally render save button only if the quote has a non-system ID or if you want to allow saving system messages */}
          {quote.id && ( 
            <Button variant="outline" size="icon" onClick={handleSaveQuote} aria-label={isQuoteSaved ? "Unsave quote" : "Save quote"}>
              {isQuoteSaved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <BookmarkPlus className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
