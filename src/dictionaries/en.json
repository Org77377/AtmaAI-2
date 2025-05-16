"use client";

import { useState, type FormEvent } from 'react';
import { Smile, Frown, Meh, Annoyed, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const moodOptions = [
  { value: 'joyful', label: 'Joyful', icon: <Smile className="w-6 h-6 text-green-500" /> },
  { value: 'calm', label: 'Calm', icon: <TrendingUp className="w-6 h-6 text-blue-500" /> },
  { value: 'neutral', label: 'Neutral', icon: <Meh className="w-6 h-6 text-gray-500" /> },
  { value: 'anxious', label: 'Anxious', icon: <Annoyed className="w-6 h-6 text-yellow-500" /> },
  { value: 'sad', label: 'Sad', icon: <Frown className="w-6 h-6 text-red-500" /> },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | undefined>(undefined);
  const [submittedMood, setSubmittedMood] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedMood) {
      toast({
        title: "No Mood Selected",
        description: "Please select a mood to share.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmittedMood(selectedMood); 
    toast({
      title: "Mood Shared!",
      description: `Thanks for sharing that you're feeling ${moodOptions.find(m => m.value === selectedMood)?.label || selectedMood}.`,
    });
    // Keep selectedMood to show pulse, then clear it and submittedMood
    setTimeout(() => {
        setSubmittedMood(undefined);
        setSelectedMood(undefined); 
    }, 1500); 
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl text-center">How are you feeling today?</CardTitle>
        <CardDescription className="text-center">
          Sharing your mood can help you understand yourself better.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup
            value={selectedMood}
            onValueChange={setSelectedMood}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          >
            {moodOptions.map((mood) => (
              <Label
                key={mood.value}
                htmlFor={`mood-${mood.value}`}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out",
                  selectedMood === mood.value 
                    ? "bg-primary/20 border-primary ring-2 ring-primary scale-105" 
                    : "hover:bg-accent hover:border-accent-foreground/50",
                  submittedMood === mood.value && "animate-pulse border-2 border-green-500 bg-green-500/20" 
                )}
              >
                <RadioGroupItem value={mood.value} id={`mood-${mood.value}`} className="sr-only" />
                {mood.icon}
                <span className="mt-2 text-sm font-medium">{mood.label}</span>
              </Label>
            ))}
          </RadioGroup>
          <Button type="submit" className="w-full">Share how you're feeling</Button>
        </form>
      </CardContent>
    </Card>
  );
}