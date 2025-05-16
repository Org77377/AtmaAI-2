import PersonalizedGuidanceForm from '@/components/personalized-guidance-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquareHeart } from 'lucide-react';

export default function GuidancePage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <MessageSquareHeart className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl md:text-4xl">Personalized Guidance</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Share your concerns, and let Mitra Guide offer tailored advice to help you navigate career, financial, or relationship challenges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PersonalizedGuidanceForm />
        </CardContent>
      </Card>
    </div>
  );
}
