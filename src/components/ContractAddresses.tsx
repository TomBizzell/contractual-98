
import { Card } from "@/components/ui/card";

interface ContractAddressesProps {
  analyzedAddress: string;
  analyzerAddress: string;
}

export const ContractAddresses = ({ analyzedAddress, analyzerAddress }: ContractAddressesProps) => {
  return (
    <Card className="mt-4 p-4 bg-green-50">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-green-800">Contract Address:</p>
          <p className="text-sm text-green-600">{analyzedAddress}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-green-800">Analyzer Contract:</p>
          <p className="text-sm text-green-600">{analyzerAddress}</p>
        </div>
      </div>
    </Card>
  );
};
