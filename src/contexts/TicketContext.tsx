import React, { createContext, useContext, useState, useEffect } from "react";

export type TicketPriority = "low" | "medium" | "high";
export type TicketStatus = "new" | "inProgress" | "onHold" | "resolved" | "closed";
export type TicketType = "incident" | "problem" | "change";

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  resolution?: string;
  rootCause?: string;
  impactedSystems?: string;
  comments?: Comment[];
}

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => void;
  updateTicket: (id: string, ticket: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  getTicket: (id: string) => Ticket | undefined;
  getTicketsByType: (type: TicketType) => Ticket[];
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Sample data
const sampleTickets: Ticket[] = [
  {
    id: "1",
    title: "Network outage in Building A",
    description: "Users in Building A cannot connect to the internet",
    type: "incident",
    status: "inProgress",
    priority: "high",
    assignedTo: "John Doe",
    createdAt: new Date("2025-04-01T10:00:00"),
    updatedAt: new Date("2025-04-01T10:30:00"),
    comments: [
      {
        id: "c1",
        content: "Initial investigation shows the main router in Building A is not responding.",
        author: "John Doe",
        timestamp: new Date("2025-04-01T10:15:00")
      }
    ]
  },
  {
    id: "2",
    title: "Email server performance degradation",
    description: "Email delivery is delayed by approximately 15 minutes",
    type: "problem",
    status: "new",
    priority: "medium",
    assignedTo: "Jane Smith",
    createdAt: new Date("2025-04-02T09:00:00"),
    updatedAt: new Date("2025-04-02T09:00:00"),
    comments: []
  },
  {
    id: "3",
    title: "Software update for accounting department",
    description: "Deploy version 4.2 of accounting software to all workstations",
    type: "change",
    status: "onHold",
    priority: "low",
    assignedTo: "Robert Johnson",
    createdAt: new Date("2025-04-03T14:00:00"),
    updatedAt: new Date("2025-04-03T15:30:00"),
    impactedSystems: "Accounting software, Financial reporting system",
    comments: [
      {
        id: "c2",
        content: "Change advisory board review scheduled for tomorrow.",
        author: "Robert Johnson",
        timestamp: new Date("2025-04-03T15:00:00")
      }
    ]
  },
  {
    id: "4",
    title: "Printer malfunction on 3rd floor",
    description: "The main printer on the 3rd floor is showing error code E502",
    type: "incident",
    status: "resolved",
    priority: "medium",
    assignedTo: "John Doe",
    createdAt: new Date("2025-04-01T11:00:00"),
    updatedAt: new Date("2025-04-01T13:30:00"),
  },
  {
    id: "5",
    title: "CRM system intermittent availability",
    description: "Users report random disconnections from the CRM system",
    type: "problem",
    status: "inProgress",
    priority: "high",
    assignedTo: "Jane Smith",
    createdAt: new Date("2025-04-02T10:15:00"),
    updatedAt: new Date("2025-04-02T11:45:00"),
  },
  {
    id: "6",
    title: "Upgrade database servers to latest version",
    description: "Schedule maintenance window to upgrade all database servers to v12.4",
    type: "change",
    status: "new",
    priority: "high",
    assignedTo: "Robert Johnson",
    createdAt: new Date("2025-04-03T09:30:00"),
    updatedAt: new Date("2025-04-03T09:30:00"),
  },
];

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const savedTickets = localStorage.getItem("tickets");
    return savedTickets ? JSON.parse(savedTickets) : sampleTickets;
  });

  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (newTicket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => {
    const ticket: Ticket = {
      ...newTicket,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTickets([...tickets, ticket]);
  };

  const updateTicket = (id: string, updatedTicket: Partial<Ticket>) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === id
          ? { ...ticket, ...updatedTicket, updatedAt: new Date() }
          : ticket
      )
    );
  };

  const deleteTicket = (id: string) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
  };

  const getTicket = (id: string) => {
    return tickets.find((ticket) => ticket.id === id);
  };

  const getTicketsByType = (type: TicketType) => {
    return tickets.filter((ticket) => ticket.type === type);
  };

  return (
    <TicketContext.Provider
      value={{ tickets, addTicket, updateTicket, deleteTicket, getTicket, getTicketsByType }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
};
