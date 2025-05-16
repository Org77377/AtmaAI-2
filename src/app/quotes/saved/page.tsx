
"use client";

import { useEffect, useState } from 'react';
import { allQuotes, type QuoteWithId } from '@/lib/quotes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, BookmarkX, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SavedQuotesPage() {
  const [displayedQuotes, setDisplayedQuotes] = useState<QuoteWithId[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedSavedQuotes = localStorage.getItem('aatme-saved-quotes');
      if (storedSavedQuotes) {
        const ids: string[] = JSON.parse(storedSavedQuotes);
        if (Array.isArray(ids)) {
          const savedQuoteObjects = ids
            .map(id => allQuotes.find(q => q.id === id))
            .filter((q): q is QuoteWithId => q !== undefined);
          setDisplayedQuotes(savedQuoteObjects);
        } else {
          setDisplayedQuotes([]);
          localStorage.removeItem('aatme-saved-quotes'); // Clean up bad data
        }
      } else {
        setDisplayedQuotes([]); // No saved quotes
      }
    } catch (error) {
      console.error("Failed to load saved quotes:", error);
      setDisplayedQuotes([]); // On error, show no quotes
      localStorage.removeItem('aatme-saved-quotes'); // Clean up potentially corrupt data
      toast({
        title: "Error Loading Saved Quotes",
        description: "There was an issue retrieving your saved quotes. Any corrupt data has been cleared.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  const handleRemoveQuote = (quoteId: string) => {
    const updatedDisplayedQuotes = displayedQuotes.filter(q => q.id !== quoteId);
    setDisplayedQuotes(updatedDisplayedQuotes);

    const storedSavedQuotes = localStorage.getItem('aatme-saved-quotes');
    if (storedSavedQuotes) {
      try {
        const ids: string[] = JSON.parse(storedSavedQuotes);
        if (Array.isArray(ids)) {
          const updatedIds = ids.filter(id => id !== quoteId);
          localStorage.setItem('aatme-saved-quotes', JSON.stringify(updatedIds));
          toast({ title: "Quote Removed", description: "Removed from your saved quotes." });
        }
      } catch (error) {
        console.error("Failed to update saved quotes in localStorage:", error);
        toast({ title: "Error", description: "Could not update saved quotes.", variant: "destructive"});
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading your saved quotes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl text-primary">Your Saved Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          {displayedQuotes.length === 0 ? (
            <div className="text-center py-10">
              <BookmarkX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-2">No quotes saved yet.</p>
              <p className="text-sm text-muted-foreground mb-6">Why not save some inspiring thoughts?</p>
              <Button asChild>
                <Link href="/">Discover Quotes</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedQuotes.map(quote => (
                <Card key={quote.id} className="bg-card border p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
                  <blockquote className="text-lg italic font-medium text-foreground md:text-xl mb-2">
                    "{quote.text}"
                  </blockquote>
                  <p className="text-sm text-muted-foreground mb-3">- {quote.author}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveQuote(quote.id)}
                    aria-label={`Remove quote: ${quote.text.substring(0, 20)}...`}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
