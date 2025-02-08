
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalysisOptionsProps {
  analysisType: string;
  jurisdiction: string;
  onAnalysisTypeChange: (value: string) => void;
  onJurisdictionChange: (value: string) => void;
}

export const AnalysisOptions = ({
  analysisType,
  jurisdiction,
  onAnalysisTypeChange,
  onJurisdictionChange,
}: AnalysisOptionsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="analysis-type">Analysis Type</Label>
        <Select value={analysisType} onValueChange={onAnalysisTypeChange}>
          <SelectTrigger id="analysis-type">
            <SelectValue placeholder="Select analysis type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Analysis</SelectItem>
            <SelectItem value="memorandum">Memorandum of Agreement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {analysisType === 'memorandum' && (
        <div className="space-y-2">
          <Label htmlFor="jurisdiction">Jurisdiction</Label>
          <Select value={jurisdiction} onValueChange={onJurisdictionChange}>
            <SelectTrigger id="jurisdiction">
              <SelectValue placeholder="Select jurisdiction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="eu">European Union</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
