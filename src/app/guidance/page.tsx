
import PersonalizedGuidanceForm from '@/components/personalized-guidance-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareHeart } from 'lucide-react';

export default function GuidancePage() { // Route still /guidance, but user sees "Friendly Chat"
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <MessageSquareHeart className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl md:text-4xl">Friendly Chat with AatmAI</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Share your thoughts or concerns, and let AatmAI offer a supportive ear and a fresh perspective to help you navigate challenges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PersonalizedGuidanceForm />
        </CardContent>
      </Card>
    </div>
  );
}
