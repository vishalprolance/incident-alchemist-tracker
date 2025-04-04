
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Lightbulb } from "lucide-react";
import { useTickets, Ticket } from "@/contexts/TicketContext";

// Mock AI resolution generation function
const generateResolution = async (ticket: Ticket) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate different responses based on ticket type and priority
  if (ticket.type === "incident") {
    if (ticket.priority === "high") {
      return `# Urgent Resolution Plan for ${ticket.title}

## Root Cause Analysis
The issue appears to be caused by a critical system failure in the primary network infrastructure.

## Recommended Steps
1. **Immediate Action**: Reroute traffic to backup systems
2. **Investigation**: Check network switches and router configurations
3. **Resolution**: Reset affected hardware and verify connectivity
4. **Prevention**: Implement automated monitoring for early detection

## Additional Resources
- Network team should be engaged immediately
- Reference incident #IR-2023-089 for similar resolution path
- Consider a full system diagnostic after resolution`;
    } else {
      return `# Resolution Plan for ${ticket.title}

## Diagnosis
Based on the symptoms described, this appears to be a localized connectivity issue.

## Recommended Actions
1. Verify network settings on affected devices
2. Check for recent changes to network configuration
3. Reset local networking equipment
4. Test connectivity with different devices

## Follow-up
- Document the solution for future reference
- Consider user training if the issue was related to configuration`;
    }
  } else if (ticket.type === "problem") {
    return `# Problem Analysis for ${ticket.title}

## Root Cause Investigation
This recurring issue suggests an underlying system architecture problem rather than an isolated incident.

## Key Findings
- Pattern suggests intermittent resource contention
- Similar issues reported across multiple environments
- Timing correlates with peak usage periods

## Long-term Solution Recommendations
1. Increase system capacity to handle peak loads
2. Implement load balancing across redundant systems
3. Optimize database queries identified as bottlenecks
4. Consider architectural changes to improve scalability

## Implementation Plan
- Phase 1: Immediate optimizations (1-2 weeks)
- Phase 2: Infrastructure upgrades (2-4 weeks)
- Phase 3: Architecture improvements (1-3 months)`;
  } else {
    return "AI resolution suggestions are only available for incidents and problems.";
  }
};

interface GenAIResolutionSuggesterProps {
  ticket: Ticket;
}

export function GenAIResolutionSuggester({ ticket }: GenAIResolutionSuggesterProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resolution, setResolution] = useState<string | null>(null);
  const { updateTicket } = useTickets();
  
  const handleGenerateResolution = async () => {
    setIsLoading(true);
    try {
      const generatedResolution = await generateResolution(ticket);
      setResolution(generatedResolution);
    } catch (error) {
      toast.error("Failed to generate resolution", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApplyResolution = () => {
    if (resolution) {
      updateTicket(ticket.id, {
        description: ticket.description + "\n\n--- AI SUGGESTED RESOLUTION ---\n" + resolution,
      });
      
      toast.success("Resolution applied to ticket", {
        description: "The AI-generated resolution has been added to the ticket description.",
      });
      
      setOpen(false);
    }
  };
  
  // Only show for incidents and problems
  if (ticket.type === "change") {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mr-2">
          <Lightbulb className="h-4 w-4 mr-2" />
          AI Resolution
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Resolution Suggestions</DialogTitle>
          <DialogDescription>
            Generate AI-powered resolution suggestions for this {ticket.type}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!resolution ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-muted-foreground mb-4">
                Our AI will analyze this {ticket.type} and suggest possible resolutions based on
                similar cases and best practices.
              </p>
              <Button onClick={handleGenerateResolution} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Generating..." : "Generate Resolution Suggestions"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                className="font-mono min-h-[300px] whitespace-pre-line"
                value={resolution}
                readOnly
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setResolution(null)}>
                  Regenerate
                </Button>
                <Button type="button" onClick={handleApplyResolution}>
                  Apply to Ticket
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
