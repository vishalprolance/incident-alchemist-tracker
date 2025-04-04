
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function Layout() {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {!isMobile && <AppSidebar />}
        {isMobile && <AppSidebar />}
        <main className="flex-1 overflow-x-hidden px-4 pt-6 sm:px-6 sm:pt-8">
          <div className="mx-auto max-w-6xl pb-12">
            {isMobile && (
              <div className="mb-4 text-xl md:hidden font-bold">
                Incident Alchemist
              </div>
            )}
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
