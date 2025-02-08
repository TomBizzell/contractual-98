
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from 'jspdf';

interface EmbedResultsDisplayProps {
  aiAnalysis: string | null;
  isLoading: boolean;
  analysisType: string;
}

export const EmbedResultsDisplay = ({ 
  aiAnalysis, 
  isLoading, 
  analysisType 
}: EmbedResultsDisplayProps) => {
  if (!aiAnalysis && !isLoading) return null;

  const handleDownloadPDF = () => {
    if (!aiAnalysis) return;

    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(16);
    doc.text("MEMORANDUM OF AGREEMENT", 105, 20, { align: "center" });
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(aiAnalysis, 180);
    doc.text(splitText, 15, 40);
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date: ${currentDate}`, 15, doc.internal.pageSize.height - 20);
    doc.save("memorandum-of-agreement.pdf");
  };

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dapp-highlight"></div>
        </div>
      ) : aiAnalysis ? (
        <Button
          onClick={handleDownloadPDF}
          className="w-full flex items-center justify-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Memorandum
        </Button>
      ) : null}
    </div>
  );
};
