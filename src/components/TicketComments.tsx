
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";
import { useTickets } from "@/contexts/TicketContext";

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
}

interface TicketCommentsProps {
  ticketId: string;
}

export function TicketComments({ ticketId }: TicketCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { getTicket, updateTicket } = useTickets();
  
  // Load comments when component mounts
  useEffect(() => {
    const ticket = getTicket(ticketId);
    if (ticket && ticket.comments) {
      setComments(ticket.comments);
    }
  }, [ticketId, getTicket]);
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      content: newComment,
      author: "Current User", // In a real app, get from auth context
      timestamp: new Date(),
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    
    // Save comments to ticket
    updateTicket(ticketId, { comments: updatedComments });
    
    // Clear the text area
    setNewComment("");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="bg-muted p-3 rounded-md">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(comment.timestamp), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-6">No comments yet</p>
          )}
        </div>
        
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 min-h-[80px]"
          />
          <Button 
            onClick={handleAddComment} 
            disabled={!newComment.trim()}
            className="h-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
