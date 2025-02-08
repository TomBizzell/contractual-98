
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';

interface ResultsDisplayProps {
  analysis: string | null;
  aiAnalysis: string | null;
  isLoading: boolean;
}

export const ResultsDisplay = ({ analysis, aiAnalysis, isLoading }: ResultsDisplayProps) => {
  if (!analysis && !isLoading) return null;

  return (
    <Card className="mt-8 p-6 backdrop-blur-sm bg-white/30 border border-gray-200 shadow-lg animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4 text-dapp-primary">
        Contract Analysis
      </h2>
      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
          <TabsTrigger value="source">Source Code</TabsTrigger>
        </TabsList>
        <TabsContent value="ai">
          <ScrollArea className="h-[400px] rounded-md border p-4">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
            ) : (
              <div className="prose max-w-none">
                <ReactMarkdown>{aiAnalysis || ''}</ReactMarkdown>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="source">
          <ScrollArea className="h-[400px] rounded-md border p-4">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
            ) : (
              <div className="prose max-w-none">
                <pre className="text-sm text-dapp-primary whitespace-pre-wrap">{analysis}</pre>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
