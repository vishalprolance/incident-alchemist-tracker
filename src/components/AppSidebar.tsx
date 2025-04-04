
import { 
  BarChart, 
  FileWarning, 
  AlertTriangle, 
  Settings, 
  PlusCircle,
  Clock,
  Menu
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
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

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

  // Renamed from SidebarContent to SidebarContentItems to avoid naming conflict
  const SidebarContentItems = () => (
    <>
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
    </>
  );

  // For mobile view, we'll use a Sheet component that slides in from the left
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 z-50 p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0 bg-sidebar text-sidebar-foreground">
            <SidebarContentItems />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // For desktop view, return the regular sidebar
  return (
    <Sidebar>
      <SidebarContentItems />
    </Sidebar>
  );
}
