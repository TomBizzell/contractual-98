
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface ContractInputProps {
  onSubmit: (address: string, network: string) => void;
  isLoading?: boolean;
}

export const ContractInput = ({ onSubmit, isLoading }: ContractInputProps) => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError("Please enter a contract address");
      return;
    }
    setError("");
    onSubmit(address, "flare"); // Default to flare network
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/30 border border-gray-200 shadow-lg animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="contract-address">Smart Contract Address</Label>
          <Input
            id="contract-address"
            placeholder="Enter contract address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-dapp-highlight"
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg text-white transition-all duration-200 
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-dapp-highlight hover:bg-opacity-90'
            }`}
        >
          {isLoading ? "Analyzing..." : "Analyze Contract"}
        </button>
      </form>
    </Card>
  );
};
