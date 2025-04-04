
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
import { Loader2, Sparkles } from "lucide-react";
import { getSuggestedActions } from "@/services/geminiService";

const promptSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  type: z.enum(["incident", "problem", "change"] as const),
});

type PromptValues = z.infer<typeof promptSchema>;

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
      // Use our Gemini service instead of the mock function
      const aiResponse = await getSuggestedActions(values.type, values.prompt);
      
      // Parse the AI response to extract title, priority, and actions
      let title = values.prompt.slice(0, 40) + "..."; // Default title
      let priority: "low" | "medium" | "high" = "medium"; // Default priority
      let description = values.prompt;
      
      // Add the AI response as additional context
      description += "\n\n--- AI Analysis ---\n" + aiResponse;
      
      // Extract title if the AI provided one (simplistic parsing)
      const titleMatch = aiResponse.match(/title:?\s*([^\n]+)/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }
      
      // Extract priority if the AI provided one
      if (aiResponse.toLowerCase().includes("priority: high") || 
          aiResponse.toLowerCase().includes("priority level: high")) {
        priority = "high";
      } else if (aiResponse.toLowerCase().includes("priority: low") || 
                aiResponse.toLowerCase().includes("priority level: low")) {
        priority = "low";
      }
      
      setTicketData({
        title,
        description,
        priority,
        assignedTo: "AI Assistant",
      });
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
        <Button variant="default" className="gap-2">
          <Sparkles className="h-4 w-4" /> 
          Create with AI
        </Button>
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
                <Button type="submit" disabled={isLoading} className="gap-2">
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
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
