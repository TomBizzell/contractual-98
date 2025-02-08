
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultsDisplayProps {
  analysis: string | null;
  isLoading: boolean;
}

export const ResultsDisplay = ({ analysis, isLoading }: ResultsDisplayProps) => {
  if (!analysis && !isLoading) return null;

  return (
    <Card className="mt-8 p-6 backdrop-blur-sm bg-white/30 border border-gray-200 shadow-lg animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4 text-dapp-primary">
        Contract Analysis
      </h2>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          </div>
        ) : (
          <div className="prose max-w-none">
            <p className="text-dapp-primary whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
