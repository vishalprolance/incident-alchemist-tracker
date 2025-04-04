
import { 
  BarChart, 
  FileWarning, 
  AlertTriangle, 
  Settings, 
  PlusCircle,
  Clock 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const mainMenuItems = [
    {
      title: "Dashboard",
      icon: BarChart,
      path: "/"
    },
    {
      title: "Incidents",
      icon: AlertTriangle,
      path: "/incidents"
    },
    {
      title: "Problems",
      icon: FileWarning,
      path: "/problems"
    },
    {
      title: "Changes",
      icon: Clock,
      path: "/changes"
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings"
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <div className="flex items-center px-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold">Incident Alchemist</h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.path)}
                    className={location.pathname === item.path ? "bg-sidebar-accent" : ""}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button 
          className="w-full justify-start" 
          onClick={() => navigate("/new-ticket")}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Ticket
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
