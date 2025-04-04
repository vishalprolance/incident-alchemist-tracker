
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TicketCard } from "@/components/TicketCard";
import { useTickets, Ticket, TicketType, TicketStatus, TicketPriority } from "@/contexts/TicketContext";

interface TicketListProps {
  type: TicketType;
}

export default function TicketList({ type }: TicketListProps) {
  const { tickets } = useTickets();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all");
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  
  // Format the type for display (capitalize first letter and pluralize)
  const formatTypeTitle = (type: TicketType) => {
    return type.charAt(0).toUpperCase() + type.slice(1) + "s";
  };
  
  // Apply filters
  useEffect(() => {
    let filtered = tickets.filter(ticket => ticket.type === type);
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    
    // Sort by updated date (newest first)
    filtered = [...filtered].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    setFilteredTickets(filtered);
  }, [tickets, type, searchTerm, statusFilter, priorityFilter]);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{formatTypeTitle(type)}</h2>
        <p className="text-muted-foreground">
          Manage and track all {type} tickets
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${formatTypeTitle(type).toLowerCase()}...`}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as TicketStatus | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="onHold">On Hold</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={priorityFilter}
            onValueChange={(value) => setPriorityFilter(value as TicketPriority | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => navigate(`/new-ticket?type=${type}`)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No {formatTypeTitle(type).toLowerCase()} found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all" 
                ? "Try adjusting your filters"
                : `There are currently no ${type} tickets in the system`}
            </p>
            <Button onClick={() => navigate(`/new-ticket?type=${type}`)}>
              Create New {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
