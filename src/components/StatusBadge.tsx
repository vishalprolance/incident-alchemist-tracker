
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/contexts/TicketContext";

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "new":
        return "bg-status-new text-white hover:bg-status-new/80";
      case "inProgress":
        return "bg-status-inProgress text-white hover:bg-status-inProgress/80";
      case "onHold":
        return "bg-status-onHold text-white hover:bg-status-onHold/80";
      case "resolved":
        return "bg-status-resolved text-white hover:bg-status-resolved/80";
      case "closed":
        return "bg-status-closed text-white hover:bg-status-closed/80";
      default:
        return "";
    }
  };

  const formatStatus = (status: TicketStatus) => {
    switch (status) {
      case "inProgress":
        return "In Progress";
      case "onHold":
        return "On Hold";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Badge className={cn(getVariant(), className)}>
      {formatStatus(status)}
    </Badge>
  );
}
