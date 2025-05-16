import CuratedStoriesForm from '@/components/curated-stories-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function StoriesPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookOpen className="w-10 h-10 text-primary" />
            <CardTitle className="text-3xl md:text-4xl">Curated Life Stories</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Discover real-life stories of resilience and triumph, specially selected to inspire and motivate you based on your experiences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CuratedStoriesForm />
        </CardContent>
      </Card>
    </div>
  );
}
