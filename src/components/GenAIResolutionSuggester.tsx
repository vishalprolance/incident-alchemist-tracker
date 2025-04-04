
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ticket } from "@/contexts/TicketContext";
import { analyzeTicket } from "@/services/geminiService";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface GenAIResolutionSuggesterProps {
  ticket: Ticket;
}

export function GenAIResolutionSuggester({ ticket }: GenAIResolutionSuggesterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleGetAnalysis = async () => {
    setIsLoading(true);
    try {
      const analysis = await analyzeTicket(ticket);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error("Error getting AI analysis:", error);
      toast.error("Failed to generate AI analysis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-full gap-2"
          onClick={() => {
            if (!aiAnalysis) {
              handleGetAnalysis();
            }
          }}
        >
          <Sparkles className="h-4 w-4" />
          AI Resolution Suggestions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Resolution Suggestions</DialogTitle>
          <DialogDescription>
            AI-powered analysis and recommendations for this {ticket.type}.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[200px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm text-muted-foreground">Analyzing ticket...</p>
            </div>
          ) : (
            <div className="whitespace-pre-line bg-muted p-4 rounded-md max-h-[400px] overflow-y-auto w-full">
              {aiAnalysis}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          {!isLoading && (
            <Button
              variant="default"
              className="gap-2"
              onClick={handleGetAnalysis}
            >
              <Sparkles className="h-4 w-4" />
              Regenerate
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
