
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TicketPriority } from "@/contexts/TicketContext";

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getVariant = () => {
    switch (priority) {
      case "high":
        return "bg-priority-high text-white hover:bg-priority-high/80";
      case "medium":
        return "bg-priority-medium text-white hover:bg-priority-medium/80";
      case "low":
        return "bg-priority-low text-white hover:bg-priority-low/80";
      default:
        return "";
    }
  };

  return (
    <Badge className={cn(getVariant(), className)}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}
