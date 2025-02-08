
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletConnectorProps {
  account: string | null;
  isConnecting: boolean;
  onConnect: () => void;
}

export const WalletConnector = ({ account, isConnecting, onConnect }: WalletConnectorProps) => {
  return (
    <Button
      onClick={onConnect}
      disabled={isConnecting}
      className="flex items-center gap-2"
      variant={account ? "outline" : "default"}
    >
      <Wallet className="h-4 w-4" />
      {account 
        ? `${account.slice(0, 6)}...${account.slice(-4)}`
        : isConnecting 
          ? "Connecting..."
          : "Connect Wallet"
      }
    </Button>
  );
};
