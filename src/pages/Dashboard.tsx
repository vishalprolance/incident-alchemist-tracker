
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, FileWarning, AlertTriangle, Clock, Ticket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTickets, TicketStatus, TicketType } from "@/contexts/TicketContext";
import { TicketCard } from "@/components/TicketCard";

export default function Dashboard() {
  const { tickets } = useTickets();
  const navigate = useNavigate();
  
  const countByStatus = (status: TicketStatus) => {
    return tickets.filter(ticket => ticket.status === status).length;
  };
  
  const countByType = (type: TicketType) => {
    return tickets.filter(ticket => ticket.type === type).length;
  };
  
  const priorityHigh = tickets.filter(ticket => ticket.priority === "high").length;
  
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your IT service management system
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tickets
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
            <p className="text-xs text-muted-foreground">
              {countByStatus("new")} new
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Incidents
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countByType("incident")}</div>
            <p className="text-xs text-muted-foreground">
              {tickets.filter(t => t.type === "incident" && t.status === "inProgress").length} in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Problems
            </CardTitle>
            <FileWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countByType("problem")}</div>
            <p className="text-xs text-muted-foreground">
              {tickets.filter(t => t.type === "problem" && t.status === "inProgress").length} in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Changes
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countByType("change")}</div>
            <p className="text-xs text-muted-foreground">
              {tickets.filter(t => t.type === "change" && t.status === "onHold").length} on hold
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              The latest tickets in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.length > 0 ? (
                recentTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-6">No tickets found</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Status Overview</CardTitle>
            <CardDescription>
              Current ticket status breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">New</span>
                    <span className="text-sm text-muted-foreground">{countByStatus("new")}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-status-new rounded-full" 
                      style={{ width: `${tickets.length > 0 ? (countByStatus("new") / tickets.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">In Progress</span>
                    <span className="text-sm text-muted-foreground">{countByStatus("inProgress")}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-status-inProgress rounded-full" 
                      style={{ width: `${tickets.length > 0 ? (countByStatus("inProgress") / tickets.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">On Hold</span>
                    <span className="text-sm text-muted-foreground">{countByStatus("onHold")}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-status-onHold rounded-full" 
                      style={{ width: `${tickets.length > 0 ? (countByStatus("onHold") / tickets.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Resolved</span>
                    <span className="text-sm text-muted-foreground">{countByStatus("resolved")}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-status-resolved rounded-full" 
                      style={{ width: `${tickets.length > 0 ? (countByStatus("resolved") / tickets.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Closed</span>
                  <span className="text-sm text-muted-foreground">{countByStatus("closed")}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-status-closed rounded-full" 
                    style={{ width: `${tickets.length > 0 ? (countByStatus("closed") / tickets.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">High Priority</span>
                  <span className="text-sm text-muted-foreground">{priorityHigh}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-priority-high rounded-full" 
                    style={{ width: `${tickets.length > 0 ? (priorityHigh / tickets.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center md:justify-end">
        <Button onClick={() => navigate("/new-ticket")}>
          Create New Ticket
        </Button>
      </div>
    </div>
  );
}
