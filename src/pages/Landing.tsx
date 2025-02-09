
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Shield, Code, FileText, ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="container max-w-6xl mx-auto pt-20 px-4">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold text-dapp-primary animate-fade-in">
            Smart Memorandum Generator
          </h1>
          <p className="text-xl text-dapp-accent max-w-2xl mx-auto animate-fade-in">
            Transform smart contracts into professional legal memorandums with our powerful, embeddable widget
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/tool">
              <Button className="bg-dapp-highlight hover:bg-dapp-highlight/90">
                Try Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 py-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 text-dapp-highlight mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Verification</h3>
            <p className="text-dapp-accent">
              Leverages Flare for secure verification of smart contract source code
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Code className="h-12 w-12 text-dapp-highlight mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Contract Analysis</h3>
            <p className="text-dapp-accent">
              Advanced analysis of smart contracts with integration to multiple networks
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <FileText className="h-12 w-12 text-dapp-highlight mb-4" />
            <h3 className="text-xl font-semibold mb-2">Legal Documentation</h3>
            <p className="text-dapp-accent">
              Generate professional legal memorandums based on jurisdiction requirements
            </p>
          </Card>
        </div>

        {/* Description Section */}
        <div className="py-16 text-center">
          <h2 className="text-3xl font-bold text-dapp-primary mb-8">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto text-lg text-dapp-accent">
            <p className="mb-4">
              Our platform uses Avalanche to save generations to additional smart contracts and Flare to validate the etherscan source code queries for the targeted smart contracts.
            </p>
            <p>
              Simply input your smart contract address, select your jurisdiction, and let our system generate a comprehensive legal memorandum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
