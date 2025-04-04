
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden px-4 pt-6 sm:px-6 sm:pt-8">
          <div className="mx-auto max-w-6xl pb-12">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
