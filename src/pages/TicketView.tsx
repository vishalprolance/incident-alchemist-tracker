
import { TicketDetails } from "@/components/TicketDetails";
import { useParams } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";
import { useEffect } from "react";
import { toast } from "sonner";

export default function TicketView() {
  const { id } = useParams<{ id: string }>();
  const { getTicket } = useTickets();
  const ticket = getTicket(id || "");
  
  useEffect(() => {
    if (ticket) {
      // Show different AI suggestion toasts based on ticket type
      const aiMessage = (() => {
        if (ticket.type === "incident") {
          return "AI Root Cause Analysis is available for this incident";
        } else if (ticket.type === "problem") {
          return "AI Fix Suggestions are available for this problem";
        } else if (ticket.type === "change") {
          return "AI Implementation Steps are available for this change";
        }
        return "";
      })();
      
      if (aiMessage) {
        toast.info(aiMessage, {
          description: "Check the AI Analysis panel for suggestions",
          duration: 5000,
        });
      }
    }
  }, [ticket]);
  
  return (
    <div className="container mx-auto py-6">
      <TicketDetails />
    </div>
  );
}
