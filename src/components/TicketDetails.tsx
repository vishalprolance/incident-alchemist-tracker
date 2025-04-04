
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Clock
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { useTickets, TicketStatus } from "@/contexts/TicketContext";
import { toast } from "sonner";

export function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTicket, updateTicket, deleteTicket } = useTickets();
  
  const ticket = getTicket(id || "");
  
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold">Ticket not found</h2>
        <p className="text-muted-foreground mb-4">The ticket you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }
  
  const handleStatusChange = (newStatus: TicketStatus) => {
    updateTicket(ticket.id, { status: newStatus });
    toast.success("Status updated successfully!", {
      description: `Ticket status changed to ${newStatus}.`,
    });
  };
  
  const handleDelete = () => {
    deleteTicket(ticket.id);
    toast.success("Ticket deleted successfully!", {
      description: "The ticket has been permanently removed.",
    });
    navigate(`/${ticket.type}s`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this ticket
                  and remove it from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <span className="font-medium">{ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}</span>
                  <span>•</span>
                  <span>ID: {ticket.id}</span>
                </div>
                <CardTitle className="text-2xl">{ticket.title}</CardTitle>
              </div>
              <div className="flex gap-2">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-muted-foreground text-sm">Description</Label>
              <p className="mt-1">{ticket.description}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">Assigned To</Label>
                <p className="mt-1 font-medium">{ticket.assignedTo}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Created</Label>
                <p className="mt-1 font-medium">
                  {format(new Date(ticket.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Last Updated</Label>
                <p className="mt-1 font-medium">
                  {format(new Date(ticket.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-muted-foreground text-sm">Update Status</Label>
              <div className="mt-2 flex items-center gap-4">
                <Select
                  value={ticket.status}
                  onValueChange={(value) => handleStatusChange(value as TicketStatus)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="onHold">On Hold</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Activity log will be shown here in future updates</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
