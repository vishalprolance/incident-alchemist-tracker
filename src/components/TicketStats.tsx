
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTickets, TicketType, TicketStatus, TicketPriority } from "@/contexts/TicketContext";

export function TicketStats() {
  const { tickets } = useTickets();
  
  // Count tickets by type
  const ticketsByType = [
    { name: "Incidents", value: tickets.filter(t => t.type === "incident").length },
    { name: "Problems", value: tickets.filter(t => t.type === "problem").length },
    { name: "Changes", value: tickets.filter(t => t.type === "change").length },
  ];
  
  // Count tickets by status
  const ticketsByStatus = [
    { name: "New", value: tickets.filter(t => t.status === "new").length },
    { name: "In Progress", value: tickets.filter(t => t.status === "inProgress").length },
    { name: "On Hold", value: tickets.filter(t => t.status === "onHold").length },
    { name: "Resolved", value: tickets.filter(t => t.status === "resolved").length },
    { name: "Closed", value: tickets.filter(t => t.status === "closed").length },
  ];
  
  // Count tickets by priority
  const ticketsByPriority = [
    { name: "Low", value: tickets.filter(t => t.priority === "low").length },
    { name: "Medium", value: tickets.filter(t => t.priority === "medium").length },
    { name: "High", value: tickets.filter(t => t.priority === "high").length },
  ];
  
  // Chart colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const TYPE_COLORS = ["#FF8042", "#8884D8", "#00C49F"];
  const PRIORITY_COLORS = ["#00C49F", "#FFBB28", "#FF8042"];
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tickets by Type</CardTitle>
          <CardDescription>
            Distribution of tickets by type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {ticketsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tickets by Priority</CardTitle>
          <CardDescription>
            Distribution of tickets by priority level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketsByPriority}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {ticketsByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Tickets by Status</CardTitle>
          <CardDescription>
            Current ticket status breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ticketsByStatus}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {ticketsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
