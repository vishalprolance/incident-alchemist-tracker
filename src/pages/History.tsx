
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTickets, Ticket, TicketType } from "@/contexts/TicketContext";
import { TicketCard } from "@/components/TicketCard";

export default function History() {
  const { tickets } = useTickets();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get closed and resolved tickets
  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "closed" || ticket.status === "resolved"
  );
  
  // Filter by type
  const getTicketsByType = (type: TicketType) => {
    return closedTickets.filter((ticket) => 
      ticket.type === type && 
      (searchTerm === "" || 
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };
  
  const incidents = getTicketsByType("incident");
  const problems = getTicketsByType("problem");
  const changes = getTicketsByType("change");
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Ticket History</h2>
        <p className="text-muted-foreground">
          View and search closed and resolved tickets
        </p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tickets by ID or description..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({closedTickets.length})</TabsTrigger>
          <TabsTrigger value="incidents">Incidents ({incidents.length})</TabsTrigger>
          <TabsTrigger value="problems">Problems ({problems.length})</TabsTrigger>
          <TabsTrigger value="changes">Changes ({changes.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-4">
          {closedTickets.length > 0 ? (
            closedTickets
              .filter(ticket => 
                searchTerm === "" || 
                ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          ) : (
            <p className="text-center py-12 text-muted-foreground">No closed tickets to display</p>
          )}
        </TabsContent>
        
        <TabsContent value="incidents" className="space-y-4 mt-4">
          {incidents.length > 0 ? (
            incidents.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          ) : (
            <p className="text-center py-12 text-muted-foreground">No closed incidents to display</p>
          )}
        </TabsContent>
        
        <TabsContent value="problems" className="space-y-4 mt-4">
          {problems.length > 0 ? (
            problems.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          ) : (
            <p className="text-center py-12 text-muted-foreground">No closed problems to display</p>
          )}
        </TabsContent>
        
        <TabsContent value="changes" className="space-y-4 mt-4">
          {changes.length > 0 ? (
            changes.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          ) : (
            <p className="text-center py-12 text-muted-foreground">No closed changes to display</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
