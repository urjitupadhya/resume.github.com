import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 mt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button disabled className="opacity-50">Edit</Button>
          <Button variant="outline" disabled className="opacity-50">Export HTML</Button>
          <Button variant="outline" disabled className="opacity-50">Export PDF</Button>
        </div>
      </div>

      {/* Resume Content */}
      <Card>
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-12 w-64 bg-muted rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-48 bg-muted rounded animate-pulse mx-auto mb-6"></div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Sections */}
          {[1, 2, 3].map((section) => (
            <div key={section} className="mb-8">
              <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="h-5 w-48 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="h-3 w-full bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-3/4 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
