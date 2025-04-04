
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Ticket } from "@/contexts/TicketContext";
import { useNavigate } from "react-router-dom";

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/ticket/${ticket.id}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{ticket.title}</CardTitle>
          <div className="flex gap-2">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {ticket.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between text-xs text-muted-foreground">
        <div>ID: {ticket.id}</div>
        <div>Assigned: {ticket.assignedTo}</div>
        <div>Updated: {format(new Date(ticket.updatedAt), "MMM d, yyyy")}</div>
      </CardFooter>
    </Card>
  );
}
