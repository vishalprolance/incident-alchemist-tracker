
import { useTickets, Ticket } from "@/contexts/TicketContext";
import { GenAIResolutionSuggester } from "./GenAIResolutionSuggester";

interface TicketDetailsSidebarProps {
  ticket: Ticket;
}

export function TicketDetailsSidebar({ ticket }: TicketDetailsSidebarProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Actions</h3>
        <div className="mt-4 flex flex-col space-y-2">
          <GenAIResolutionSuggester ticket={ticket} />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium">Ticket Information</h3>
        <dl className="mt-4 grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Type</dt>
            <dd className="mt-1 text-sm">{ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Created</dt>
            <dd className="mt-1 text-sm">{new Date(ticket.createdAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
            <dd className="mt-1 text-sm">{new Date(ticket.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
