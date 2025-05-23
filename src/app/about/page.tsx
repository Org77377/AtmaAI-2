
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Mail, MapPin, Brain } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/10 p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary rounded-full">
              <Users className="w-12 h-12 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl md:text-4xl text-primary">About AatmAI</CardTitle>
            <CardDescription className="text-lg text-foreground">
              The story behind your compassionate companion.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <p className="text-lg text-foreground leading-relaxed">
            AatmAI was born from the experiences of two enthusiasts who, like many, faced their own share of life's challenges. We realized the profound need for a supportive, non-judgmental space where individuals could find understanding and a fresh perspective.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start p-4 border rounded-lg bg-card">
              <MapPin className="w-8 h-8 text-accent mb-2" />
              <h3 className="text-xl font-semibold text-primary mb-1">Our Roots</h3>
              <p className="text-muted-foreground">
                We hail from <span className="font-semibold">Vijayapura</span>, a vibrant city in Karnataka, India. Our journey started here, fueled by local inspiration and global aspirations.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start p-4 border rounded-lg bg-card">
              <Brain className="w-8 h-8 text-accent mb-2" />
              <h3 className="text-xl font-semibold text-primary mb-1">Our Passion</h3>
              <p className="text-muted-foreground">
                As recent graduates, we are immensely curious about the potential of Artificial Intelligence and Technology to create meaningful solutions that can positively impact lives.
              </p>
            </div>
          </div>
          <p className="text-lg text-foreground leading-relaxed">
            Our goal with AatmAI is to leverage AI to offer a friendly, empathetic companion that provides emotional support and helps users navigate career, financial, and relationship issues with greater clarity and resilience. We believe everyone deserves a space to be heard and understood.
          </p>
          <div className="text-center pt-4">
            <Button asChild size="lg">
              <Link href="mailto:omkarrg@hotmail.com">
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              We'd love to hear from you!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
