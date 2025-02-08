
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const EmbedSection = () => {
  const { toast } = useToast();

  const copyEmbedCode = () => {
    const embedCode = `<iframe src="${window.location.origin}/embed" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied!",
      description: "Embed code has been copied to your clipboard.",
    });
  };

  return (
    <Card className="mt-8 p-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold text-dapp-primary">
          Embed this analyzer in your website
        </h2>
        <p className="text-dapp-accent">
          Copy the code below to embed the contract analyzer in your website:
        </p>
        <div className="flex items-center gap-4">
          <code className="flex-1 p-4 bg-gray-100 rounded-lg overflow-x-auto">
            &lt;iframe src="{window.location.origin}/embed" width="100%" height="600" frameborder="0"&gt;&lt;/iframe&gt;
          </code>
          <Button variant="outline" size="icon" onClick={copyEmbedCode}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
