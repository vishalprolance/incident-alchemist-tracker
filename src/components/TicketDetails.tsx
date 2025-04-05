
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Clock,
  MessageSquare
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
import { Textarea } from "@/components/ui/textarea";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { useTickets, TicketStatus } from "@/contexts/TicketContext";
import { toast } from "sonner";
import { GenAIResolutionSuggester } from "./GenAIResolutionSuggester";
import { TicketComments } from "./TicketComments";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    if (newStatus === "closed" || newStatus === "resolved") {
      // Show resolution dialog instead of directly changing status
      toast.info("Please add resolution details before closing", {
        description: "Use the 'Add resolution details' button below"
      });
      return;
    }
    
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
          <Button variant="outline" size="sm" onClick={() => navigate(`/${ticket.type}s`)}>
            View All {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}s
          </Button>
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
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
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
              
              {(ticket.type === "change" || ticket.impactedSystems) && (
                <div>
                  <Label className="text-muted-foreground text-sm">Impacted Systems</Label>
                  <p className="mt-1 p-2 bg-muted rounded-md">
                    {ticket.impactedSystems || "No systems listed - Add impacted systems when updating the ticket"}
                  </p>
                </div>
              )}
              
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
              
              {ticket.resolution && (
                <div>
                  <Label className="text-muted-foreground text-sm">Resolution</Label>
                  <p className="mt-1 p-3 bg-muted rounded-md">{ticket.resolution}</p>
                </div>
              )}
              
              <ResolutionDialog ticket={ticket} />
            </CardContent>
          </Card>
          
          <TicketComments ticketId={ticket.id} />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <GenAIResolutionSuggester ticket={ticket} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface ResolutionDialogProps {
  ticket: any;
}

function ResolutionDialog({ ticket }: ResolutionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [resolution, setResolution] = useState(ticket.resolution || "");
  const [rootCause, setRootCause] = useState(ticket.rootCause || "");
  const [impactedSystems, setImpactedSystems] = useState(ticket.impactedSystems || "");
  const [tvtApproval, setTvtApproval] = useState(ticket.tvtApproval || false);
  const [bvtApproval, setBvtApproval] = useState(ticket.bvtApproval || false);
  const [implementationTime, setImplementationTime] = useState<string>(ticket.implementationTime || "");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { updateTicket } = useTickets();
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!resolution.trim()) {
      newErrors.resolution = "Resolution details are required";
    }
    
    if (ticket.type === "incident" && !rootCause.trim()) {
      newErrors.rootCause = "Root cause analysis is required";
    }
    
    if (ticket.type === "change") {
      if (!impactedSystems.trim()) {
        newErrors.impactedSystems = "Impacted systems are required";
      }
      
      if (!tvtApproval) {
        newErrors.tvtApproval = "TVT approval is required";
      }
      
      if (!bvtApproval) {
        newErrors.bvtApproval = "BVT approval is required";
      }
      
      if (!implementationTime) {
        newErrors.implementationTime = "Implementation time is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    const updates: any = { 
      status: "resolved", 
      resolution 
    };
    
    if (ticket.type === "incident" || ticket.type === "problem") {
      updates.rootCause = rootCause;
    }
    
    if (ticket.type === "change") {
      updates.impactedSystems = impactedSystems;
      updates.tvtApproval = tvtApproval;
      updates.bvtApproval = bvtApproval;
      updates.implementationTime = implementationTime;
    }
    
    updateTicket(ticket.id, updates);
    setIsOpen(false);
    
    toast.success("Ticket updated successfully!", {
      description: "Resolution details have been added and status updated.",
    });
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default" className="w-full mt-2">
          Add resolution details
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden">
        <ScrollArea className="max-h-[calc(90vh-12rem)]">
          <AlertDialogHeader>
            <AlertDialogTitle>Add Resolution Details</AlertDialogTitle>
            <AlertDialogDescription>
              This will update the status to resolved and add your resolution details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-2">
            {(ticket.type === "incident" || ticket.type === "problem") && (
              <div className="space-y-2">
                <Label htmlFor="rootCause">Root Cause</Label>
                <Textarea
                  id="rootCause"
                  placeholder="What was the root cause of this issue?"
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className={`min-h-[80px] ${errors.rootCause ? 'border-red-500' : ''}`}
                />
                {errors.rootCause && (
                  <p className="text-sm text-red-500">{errors.rootCause}</p>
                )}
              </div>
            )}
            
            {ticket.type === "change" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="impactedSystems">Impacted Systems</Label>
                  <Textarea
                    id="impactedSystems"
                    placeholder="List all systems impacted by this change"
                    value={impactedSystems}
                    onChange={(e) => setImpactedSystems(e.target.value)}
                    className={`min-h-[80px] ${errors.impactedSystems ? 'border-red-500' : ''}`}
                  />
                  {errors.impactedSystems && (
                    <p className="text-sm text-red-500">{errors.impactedSystems}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="implementationTime">Implementation Time</Label>
                  <input
                    type="datetime-local"
                    id="implementationTime"
                    value={implementationTime}
                    onChange={(e) => setImplementationTime(e.target.value)}
                    className={`w-full rounded-md border p-2 ${errors.implementationTime ? 'border-red-500' : 'border-input'}`}
                  />
                  {errors.implementationTime && (
                    <p className="text-sm text-red-500">{errors.implementationTime}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="tvtApproval"
                      checked={tvtApproval}
                      onChange={(e) => setTvtApproval(e.target.checked)}
                      className={`h-4 w-4 ${errors.tvtApproval ? 'border-red-500' : ''}`}
                    />
                    <Label htmlFor="tvtApproval">TVT Approval Received</Label>
                  </div>
                  {errors.tvtApproval && (
                    <p className="text-sm text-red-500">{errors.tvtApproval}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="bvtApproval"
                      checked={bvtApproval}
                      onChange={(e) => setBvtApproval(e.target.checked)}
                      className={`h-4 w-4 ${errors.bvtApproval ? 'border-red-500' : ''}`}
                    />
                    <Label htmlFor="bvtApproval">BVT Approval Received</Label>
                  </div>
                  {errors.bvtApproval && (
                    <p className="text-sm text-red-500">{errors.bvtApproval}</p>
                  )}
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution Details</Label>
              <Textarea
                id="resolution"
                placeholder="Describe how this issue was resolved"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className={`min-h-[120px] ${errors.resolution ? 'border-red-500' : ''}`}
              />
              {errors.resolution && (
                <p className="text-sm text-red-500">{errors.resolution}</p>
              )}
            </div>
          </div>
        </ScrollArea>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Save Resolution</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
