"use client";

import { useState, type FormEvent } from 'react';
import { Smile, Frown, Meh, Annoyed, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const moods = [
  { value: 'joyful', label: 'Joyful', icon: <Smile className="w-6 h-6 text-green-500" /> },
  { value: 'calm', label: 'Calm', icon: <TrendingUp className="w-6 h-6 text-blue-500" /> },
  { value: 'neutral', label: 'Neutral', icon: <Meh className="w-6 h-6 text-gray-500" /> },
  { value: 'anxious', label: 'Anxious', icon: <Annoyed className="w-6 h-6 text-yellow-500" /> },
  { value: 'sad', label: 'Sad', icon: <Frown className="w-6 h-6 text-red-500" /> },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedMood) {
      toast({
        title: "No Mood Selected",
        description: "Please select a mood to log.",
        variant: "destructive",
      });
      return;
    }
    // In a real app, you'd save this mood to a backend or state management
    console.log('Mood logged:', selectedMood);
    toast({
      title: "Mood Logged!",
      description: `You've logged your mood as ${moods.find(m => m.value === selectedMood)?.label || selectedMood}.`,
    });
    setSelectedMood(undefined); // Reset after submission
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl text-center">How are you feeling today?</CardTitle>
        <CardDescription className="text-center">
          Tracking your mood can help you understand yourself better.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup
            value={selectedMood}
            onValueChange={setSelectedMood}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          >
            {moods.map((mood) => (
              <Label
                key={mood.value}
                htmlFor={`mood-${mood.value}`}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200",
                  selectedMood === mood.value ? "bg-primary/10 border-primary ring-2 ring-primary" : "hover:bg-accent hover:border-accent-foreground/50"
                )}
              >
                <RadioGroupItem value={mood.value} id={`mood-${mood.value}`} className="sr-only" />
                {mood.icon}
                <span className="mt-2 text-sm font-medium">{mood.label}</span>
              </Label>
            ))}
          </RadioGroup>
          <Button type="submit" className="w-full">Log Mood</Button>
        </form>
      </CardContent>
    </Card>
  );
}
