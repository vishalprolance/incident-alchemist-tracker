
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TicketForm } from "@/components/TicketForm";
import { TicketType } from "@/contexts/TicketContext";

export default function NewTicket() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ticketType, setTicketType] = useState<TicketType>("incident");
  
  useEffect(() => {
    // Check if a default type was provided in URL params
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type") as TicketType | null;
    
    if (typeParam && ["incident", "problem", "change"].includes(typeParam)) {
      setTicketType(typeParam);
    }
  }, [location]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Ticket</h2>
          <p className="text-muted-foreground">
            Fill in the details to create a new {ticketType}
          </p>
        </div>
      </div>
      
      <div className="mx-auto max-w-2xl">
        <TicketForm defaultType={ticketType} />
      </div>
    </div>
  );
}
