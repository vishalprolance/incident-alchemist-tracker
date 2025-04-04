
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TicketProvider } from "@/contexts/TicketContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Incidents from "@/pages/Incidents";
import Problems from "@/pages/Problems";
import Changes from "@/pages/Changes";
import NewTicket from "@/pages/NewTicket";
import TicketView from "@/pages/TicketView";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TicketProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="incidents" element={<Incidents />} />
                <Route path="problems" element={<Problems />} />
                <Route path="changes" element={<Changes />} />
                <Route path="new-ticket" element={<NewTicket />} />
                <Route path="ticket/:id" element={<TicketView />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TicketProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
