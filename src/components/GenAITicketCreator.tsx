
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTickets, TicketType } from "@/contexts/TicketContext";
import { Loader2 } from "lucide-react";

const promptSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  type: z.enum(["incident", "problem", "change"] as const),
});

type PromptValues = z.infer<typeof promptSchema>;

// Mock AI response function - in a real application, this would call an AI API
const generateTicketFromAI = async (prompt: string, type: TicketType) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock response based on type
  const commonFields = {
    assignedTo: "AI Assistant",
  };
  
  if (type === "incident") {
    return {
      title: `Incident: ${prompt.slice(0, 40)}...`,
      description: `This incident was generated from the prompt: "${prompt}"\n\nRecommended steps:\n1. Identify affected systems\n2. Check logs for errors\n3. Restart services if needed\n4. Verify system functionality`,
      priority: "medium",
      ...commonFields,
    };
  } else if (type === "problem") {
    return {
      title: `Problem: ${prompt.slice(0, 40)}...`,
      description: `This problem was generated from the prompt: "${prompt}"\n\nRoot cause analysis:\n- Possible system configuration issues\n- Network connectivity problems\n- Application performance bottlenecks\n\nRecommended investigation steps:\n1. Review system logs\n2. Check for recent changes\n3. Monitor resource usage`,
      priority: "low",
      ...commonFields,
    };
  } else {
    return {
      title: `Change: ${prompt.slice(0, 40)}...`,
      description: `This change request was generated from the prompt: "${prompt}"\n\nProposed changes:\n- Update system configuration\n- Deploy new version\n- Modify user permissions\n\nImplementation plan:\n1. Create backup\n2. Apply changes\n3. Test functionality\n4. Document changes`,
      priority: "low",
      ...commonFields,
    };
  }
};

export function GenAITicketCreator() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketData, setTicketData] = useState<any | null>(null);
  const { addTicket } = useTickets();
  const navigate = useNavigate();
  
  const form = useForm<PromptValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: "",
      type: "incident",
    },
  });
  
  const onSubmit = async (values: PromptValues) => {
    setIsLoading(true);
    try {
      const generatedTicket = await generateTicketFromAI(values.prompt, values.type);
      setTicketData(generatedTicket);
    } catch (error) {
      toast.error("Failed to generate ticket", {
        description: "Please try again with a different prompt",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateTicket = () => {
    if (ticketData) {
      addTicket({
        ...ticketData,
        type: form.getValues().type,
        status: "new",
      });
      
      toast.success("AI-generated ticket created!", {
        description: "Your ticket has been added to the system.",
      });
      
      setOpen(false);
      setTicketData(null);
      form.reset();
      
      // Navigate to the appropriate page based on ticket type
      navigate(`/${form.getValues().type}s`);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create with AI</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Ticket with AI</DialogTitle>
          <DialogDescription>
            Describe the issue or request, and our AI will generate a ticket for you.
          </DialogDescription>
        </DialogHeader>
        
        {!ticketData ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ticket type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="incident">Incident</SelectItem>
                        <SelectItem value="problem">Problem</SelectItem>
                        <SelectItem value="change">Change</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of ticket you want to create.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe the issue or request</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., Network outage in Building A, users can't connect to the internet"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible for better results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Generating..." : "Generate Ticket"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Title</h4>
              <p className="mt-1 p-2 border rounded-md">{ticketData.title}</p>
            </div>
            
            <div>
              <h4 className="font-medium">Description</h4>
              <div className="mt-1 p-2 border rounded-md whitespace-pre-line">
                {ticketData.description}
              </div>
            </div>
            
            <div className="flex gap-4">
              <div>
                <h4 className="font-medium">Priority</h4>
                <p className="mt-1">{ticketData.priority}</p>
              </div>
              <div>
                <h4 className="font-medium">Assigned To</h4>
                <p className="mt-1">{ticketData.assignedTo}</p>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTicketData(null)}>
                Regenerate
              </Button>
              <Button type="button" onClick={handleCreateTicket}>
                Create Ticket
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
