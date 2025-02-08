
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';

interface ResultsDisplayProps {
  analysis: string | null;
  aiAnalysis: string | null;
  isLoading: boolean;
  analysisType: string;
}

export const ResultsDisplay = ({ analysis, aiAnalysis, isLoading, analysisType }: ResultsDisplayProps) => {
  if (!analysis && !isLoading) return null;

  const handleDownloadPDF = () => {
    if (!aiAnalysis) return;

    const doc = new jsPDF();
    
    // Set font to Times New Roman for a formal document look
    doc.setFont("times", "normal");
    
    // Add title
    doc.setFontSize(16);
    doc.text("MEMORANDUM OF AGREEMENT", 105, 20, { align: "center" });
    
    // Add content
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(aiAnalysis, 180);
    doc.text(splitText, 15, 40);

    // Add date at the bottom
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date: ${currentDate}`, 15, doc.internal.pageSize.height - 20);
    
    // Save the PDF
    doc.save("memorandum-of-agreement.pdf");
  };

  return (
    <Card className="mt-8 p-6 backdrop-blur-sm bg-white/30 border border-gray-200 shadow-lg animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-dapp-primary">
          Contract Analysis
        </h2>
        {analysisType === 'memorandum' && !isLoading && aiAnalysis && (
          <Button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        )}
      </div>
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
