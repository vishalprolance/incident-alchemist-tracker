
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Sparkles } from "lucide-react";
import { Ticket, TicketType } from "@/contexts/TicketContext";
import { getSuggestedActions } from "@/services/geminiService";

interface AIAnalysisButtonProps {
  description: string;
  ticketType: TicketType;
}

export function AIAnalysisButton({ description, ticketType }: AIAnalysisButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  
  const handleAnalyze = async () => {
    if (!description || description.length < 10) {
      return;
    }
    
    setIsLoading(true);
    try {
      const suggestions = await getSuggestedActions(ticketType, description);
      setAiSuggestions(suggestions);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        type="button" 
        onClick={handleAnalyze}
        disabled={isLoading || !description || description.length < 10}
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        AI Suggestions
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>AI Suggested Actions</DialogTitle>
            <DialogDescription>
              Here are AI-generated suggestions for your {ticketType}
            </DialogDescription>
          </DialogHeader>
          
          <div className="whitespace-pre-line bg-muted p-4 rounded-md max-h-[400px] overflow-y-auto">
            {aiSuggestions}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
