
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

  const getAnalysisTitle = () => {
    switch (ticket.type) {
      case "incident":
        return "AI Root Cause Analysis";
      case "problem":
        return "AI Solution Suggestions";
      case "change":
        return "AI Implementation Guide";
      default:
        return "AI Analysis";
    }
  };

  const getAnalysisDescription = () => {
    switch (ticket.type) {
      case "incident":
        return "AI-powered root cause analysis and recommendations.";
      case "problem":
        return "AI-generated solution suggestions and fix recommendations.";
      case "change":
        return "Standard operating procedure and implementation steps.";
      default:
        return "AI-powered analysis and recommendations.";
    }
  };

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

  const getButtonText = () => {
    switch (ticket.type) {
      case "incident":
        return "Get Root Cause Analysis";
      case "problem":
        return "Get Solution Suggestions";
      case "change":
        return "Get Implementation Guide";
      default:
        return "Get AI Analysis";
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
          {getButtonText()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getAnalysisTitle()}</DialogTitle>
          <DialogDescription>
            {getAnalysisDescription()}
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
